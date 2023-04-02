import Moralis from 'moralis';
import {operations as evmOperations} from 'moralis/common-evm-utils';
import express from 'express';
import axios, {AxiosRequestConfig} from 'axios';
import {errorHandler} from '../middlewares/errorHandler';
// eslint-disable-next-line max-len
import {EndpointDescriptor, convertOperationToDescriptor} from '@moralisweb3/api-utils';
import config from '../config';
import {FtItem, FtItemsFetchResult, Item, ItemsFetchResult, NftItem, NftItemsFetchResult, NftType} from './moralis';
import {KasFtItem, KasFtItemsFetchResult, KasNftItem, KasNftItemsFetchResult} from './kas';
import {Request, ParamsDictionary, Response, NextFunction} from 'express-serve-static-core';
import {ParsedQs} from 'qs';
import {getTokenMetadata} from '../utils/ipfs';

// eslint-disable-next-line new-cap
const proxyRouter = express.Router();

export interface ProxyOptions {
  apiKey: string;
  // kas api
  api_key_id: string;
  api_secret: string;
}

// eslint-disable-next-line require-jsdoc
export class ProxyGenerator {
  private options: ProxyOptions;
  private api: string;

  // eslint-disable-next-line require-jsdoc
  constructor(api: 'evm', options: ProxyOptions) {
    this.options = options;
    this.api = api;
  }

  // eslint-disable-next-line require-jsdoc
  public getRouter() {
    let descriptors: EndpointDescriptor[];
    let baseUrl: string;
    switch (this.api) {
      case 'evm':
        descriptors = evmOperations.map(convertOperationToDescriptor);
        baseUrl = Moralis.EvmApi.baseUrl;
        break;
      default:
        throw new Error('invalid api');
    }

    for (const descriptor of descriptors) {
      // eslint-disable-next-line max-len
      const urlPattern = descriptor.urlPattern.replace(/\{/g, ':').replace(/\}/g, '');

      if (this.api === 'evm') {
        // eslint-disable-next-line max-len, complexity
        proxyRouter.route(urlPattern)[descriptor.method](async (req, res, next) => {
          const query = req.query as {[key: string]: string};
          const {chain} = query;

          if (urlPattern === '/:address/nft' || urlPattern === '/:address/erc20') {
            if (Number(chain) === 1001 || Number(chain) === 8217) {
              return this.handleKasRequests(urlPattern, req, res, next);
            }
          }

          let url = descriptor.urlPattern;
          for (const param in req.params) {
            if (Object.prototype.hasOwnProperty.call(req.params, param)) {
              url = url.replace(`{${param}}`, req.params[param]);
            }
          }
          const body = Object.keys(req.body).reduce((result, key) => {
            if (descriptor.bodyParamNames.includes(key)) {
              return {...result, [key]: req.body[key]};
            }
            return result;
          }, {});

          const params = Object.keys(req.body).reduce((result, key) => {
            // eslint-disable-next-line max-len
            if (!req.body[key] || key in body || descriptor.urlPatternParamNames.includes(key)) {
              return result;
            }
            return {...result, [key]: req.body[key]};
          }, {});

          try {
            const response = await axios.request({
              method: descriptor.method,
              params: {...params, ...req.query},
              url: `${baseUrl}${url}`,
              data: body,
              headers: {
                'Content-Type': 'application/json',
                'x-api-key': this.options.apiKey,
              },
            });
            return res.send(await this.formatResults(urlPattern, Number(chain || '0x1'), response.data));
          } catch (error) {
            return errorHandler(error as Error, req, res, next);
          }
        });
      }
    }
    return proxyRouter;
  }

  async handleKasRequests(
      urlPattern: string,
      req: Request<ParamsDictionary, unknown, unknown, ParsedQs, Record<string, unknown>>,
      res: Response<unknown, Record<string, unknown>, number>,
      next: NextFunction
  ): Promise<Response<unknown, Record<string, unknown>, number> | void> {
    const params = req.params as {[key: string]: string};
    const query = req.query as {[key: string]: string};
    const {address} = params;
    const {limit, cursor, chain} = query;

    const queryType = urlPattern === '/:address/erc20' ? 'ft' : 'nft';

    // use KAS for klaytn network
    if (Number(chain) !== 1001 && Number(chain) !== 8217) {
      return errorHandler(new Error(`Invalid chain id ${chain}`), req, res, next);
    }
    const url = `account/${address}/token`;
    const request: AxiosRequestConfig = {
      method: req.method,
      params: {kind: queryType, size: limit, cursor},
      url: `${config.KAS_ENDPOINT}${url}`,
      headers: {
        'Content-Type': 'application/json',
        'x-chain-id': Number(chain),
      },
      auth: {
        username: this.options.api_key_id,
        password: this.options.api_secret,
      },
    };

    try {
      const response = await axios.request(request);
      if (!Array.isArray((response.data as {[key: string]: string}).items)) {
        throw new Error(`invalid response from KAS endpoint ${request.url}`);
      }
      return res.send(
        queryType === 'ft' ?
          await this.formatFtResults(Number(chain), response.data) :
          await this.formatNftResults(Number(chain), response.data)
      );
    } catch (error) {
      return errorHandler(error as Error, req, res, next);
    }
  }

  async formatResults(
      urlPattern: string,
      chain: number,
      data: unknown
  ): Promise<ItemsFetchResult<Item> | unknown> {
    if (urlPattern !== '/:address/erc20' && urlPattern !== '/:address/nft') {
      return data;
    }

    const queryType = urlPattern === '/:address/erc20' ? 'ft' : 'nft';
    return queryType === 'ft' ?
          this.formatFtResults(chain, data as FtItem[]) :
          this.formatNftResults(chain, data as NftItemsFetchResult);
  }

  async formatNftResults(
      chain: number,
      data: KasNftItemsFetchResult | NftItemsFetchResult
  ): Promise<NftItemsFetchResult> {
    if (chain !== 1001 && chain !== 8217) {
      const result = data as NftItemsFetchResult;
      result.chainId = chain;
      result.result = result.result.map((item: NftItem) => {
        item.chainId = chain;
        return item;
      });
      return result;
    }

    data = data as KasNftItemsFetchResult;
    const ret: NftItemsFetchResult = {
      total: null,
      page: 0,
      page_size: 0,
      cursor: '',
      result: [],
      status: 'SYNCED',
      chainId: chain,
    };
    if (!data.cursor) {
      ret.cursor = null;
    } else {
      ret.cursor = data.cursor;
    }
    let metadatas = data.items.map((item: KasNftItem) => {
      return getTokenMetadata(item.extras.tokenUri);
    });
    metadatas = await Promise.all(metadatas);
    ret.result = data.items.map((item: KasNftItem, i) => {
      const metadata = metadatas[i] as unknown as {[key: string]: string};
      return {
        token_address: item.contractAddress,
        token_id: item.extras.tokenId,
        amount: Number(item.balance),
        owner_of: item.lastTransfer.transferTo,
        token_hash: '',
        block_number_minted: '',
        block_number: '',
        contract_type: NftType.ERC721,
        metadata: JSON.stringify(metadata),
        name: metadata?.name || '',
        symbol: metadata?.symbol || '',
        token_uri: item.extras.tokenUri,
        last_token_uri_sync: '',
        last_metadata_sync: '',
        minter_address: '',
        chainId: chain,
      } as unknown as NftItem;
    });
    return ret;
  }

  async formatFtResults(
      chain: number,
      data: KasFtItemsFetchResult | FtItem[]
  ): Promise<FtItemsFetchResult> {
    if (chain !== 1001 && chain !== 8217) {
      const result: FtItemsFetchResult = {
        chainId: chain,
        result: [],
      };
      result.result = (data as FtItem[]).map((item: FtItem) => {
        item.chainId = chain;
        return item;
      });
      return result;
    }

    data = data as KasFtItemsFetchResult;
    const ret: FtItemsFetchResult = {
      result: [],
      chainId: chain,
    };
    ret.result = data.items.map((item: KasFtItem) => {
      return {
        token_address: item.contractAddress,
        name: item.extras.name,
        symbol: item.extras.symbol,
        logo: null,
        thumbnail: null,
        decimals: item.extras.decimals,
        balance: item.balance,
        chainId: chain,
      } as unknown as FtItem;
    });
    return ret;
  }
}
