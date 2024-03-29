import axios, { AxiosRequestConfig } from "axios";
import express from "express";
import { NextFunction, Request, Response } from "express-serve-static-core";
import Moralis from "moralis";
import { operations as evmOperations } from "moralis/common-evm-utils";

import {
  convertOperationToDescriptor,
  EndpointDescriptor,
} from "@moralisweb3/api-utils";

import config from "../config";
import { errorHandler } from "../middlewares/errorHandler";
import { getTokenMetadata } from "../utils/ipfs";
import {
  KasFtItem,
  KasNftItem,
  KasItemsFetchResult,
  KasNftCollectionItem,
} from "./kas";
import {
  FtItem,
  FtItemsFetchResult,
  Item,
  ItemsFetchResult,
  NftCollectionItem,
  NftCollectionItemsFetchResult,
  NftItem,
  NftItemsFetchResult,
  NftType,
} from "./moralis";
import { getUserNftCollectionNftItems, getTokenPrice } from "../moralis";

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
  constructor(api: "evm", options: ProxyOptions) {
    this.options = options;
    this.api = api;
  }

  // eslint-disable-next-line require-jsdoc
  public getRouter() {
    let descriptors: EndpointDescriptor[];
    let baseUrl: string;
    switch (this.api) {
      case "evm":
        descriptors = evmOperations.map(convertOperationToDescriptor);
        baseUrl = Moralis.EvmApi.baseUrl;
        break;
      default:
        throw new Error("invalid api");
    }

    for (const descriptor of descriptors) {
      // eslint-disable-next-line max-len
      const urlPattern = descriptor.urlPattern
        .replace(/\{/g, ":")
        .replace(/\}/g, "");

      if (this.api === "evm") {
        // eslint-disable-next-line max-len, complexity
        proxyRouter
          .route(urlPattern)
          [descriptor.method](async (req, res, next) => {
            const query = req.query as { [key: string]: string };
            const { chain } = query;

            if (
              urlPattern === "/:address/nft" ||
              urlPattern === "/:address/erc20" ||
              urlPattern === "/:address/nft/collections"
            ) {
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
                return { ...result, [key]: req.body[key] };
              }
              return result;
            }, {});

            const params = Object.keys(req.body).reduce((result, key) => {
              // eslint-disable-next-line max-len
              if (
                !req.body[key] ||
                key in body ||
                descriptor.urlPatternParamNames?.includes(key)
              ) {
                return result;
              }
              return { ...result, [key]: req.body[key] };
            }, {});

            try {
              const response = await axios.request({
                method: descriptor.method,
                params: { ...params, ...req.query },
                url: `${baseUrl}${url}`,
                data: descriptor.name === "uploadFolder" ? req.body : body,
                headers: {
                  "Content-Type": "application/json",
                  "x-api-key": this.options.apiKey,
                },
              });
              return res.send(
                await this.formatResults(
                  req.params["address"],
                  urlPattern,
                  Number(chain || "0x1"),
                  Boolean(req.query["preload"]),
                  response.data
                )
              );
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
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response<unknown, Record<string, unknown>, number> | void> {
    const params = req.params as { [key: string]: string };
    const query = req.query as { [key: string]: string };
    const { address } = params;
    const { limit, cursor, chain, token_addresses, preload } = query;

    const queryType = urlPattern === "/:address/erc20" ? "ft" : "nft";

    // use KAS for klaytn network
    if (Number(chain) !== 1001 && Number(chain) !== 8217) {
      return errorHandler(
        new Error(`Invalid chain id ${chain}`),
        req,
        res,
        next
      );
    }
    const url =
      urlPattern === "/:address/nft/collections"
        ? `account/${address}/contract`
        : `account/${address}/token`;
    const reqParams = {
      kind: queryType,
      size: limit,
      cursor,
    };
    if (token_addresses) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      reqParams["ca-filters"] = token_addresses;
    }
    const request: AxiosRequestConfig = {
      method: req.method,
      params: reqParams,
      url: `${config.KAS_ENDPOINT}${url}`,
      headers: {
        "Content-Type": "application/json",
        "x-chain-id": Number(chain),
      },
      auth: {
        username: this.options.api_key_id,
        password: this.options.api_secret,
      },
    };

    try {
      const response = await axios.request(request);
      if (!Array.isArray((response.data as { [key: string]: string }).items)) {
        throw new Error(`invalid response from KAS endpoint ${request.url}`);
      }
      return res.send(
        urlPattern === "/:address/nft/collections"
          ? await this.formatNftCollectionResults(
            address,
            response.data,
            Number(chain),
            Boolean(preload)
          )
          : queryType === "ft"
            ? await this.formatFtResults(Number(chain), response.data)
            : await this.formatNftResults(address, Number(chain), response.data)
      );
    } catch (error) {
      return errorHandler(error as Error, req, res, next);
    }
  }

  async formatResults(
    address: string,
    urlPattern: string,
    chain: number,
    preload: boolean,
    data: unknown
  ): Promise<ItemsFetchResult<Item> | unknown> {
    if (
      urlPattern !== "/:address/erc20" &&
      urlPattern !== "/:address/nft" &&
      urlPattern !== "/:address/nft/collections"
    ) {
      return data;
    }

    const queryType = urlPattern === "/:address/erc20" ? "ft" : "nft";
    return urlPattern === "/:address/nft/collections"
      ? await this.formatNftCollectionResults(
        address,
        data as NftCollectionItemsFetchResult,
        Number(chain),
        preload
      )
      : queryType === "ft"
        ? this.formatFtResults(chain, data as FtItem[])
        : this.formatNftResults(address, chain, data as NftItemsFetchResult);
  }

  async formatNftCollectionResults(
    userAddress: string,
    data:
    | KasItemsFetchResult<KasNftCollectionItem>
    | NftCollectionItemsFetchResult,
    chain: number,
    preload?: boolean
  ): Promise<NftCollectionItemsFetchResult> {
    if (chain !== 1001 && chain !== 8217) {
      const result = data as NftCollectionItemsFetchResult;
      let preloads: (NftItemsFetchResult | null)[];
      if (preload) {
        const promises = result.result.map((item: NftCollectionItem) =>
          getUserNftCollectionNftItems(userAddress, item.token_address, chain)
        );
        preloads = await Promise.all(promises);
      }

      result.chainId = chain;
      result.result = result.result.map(
        (item: NftCollectionItem, i: number) => {
          item.chainId = chain;
          if (preload) {
            item.preload = preloads[i];
          }
          return item;
        }
      );
      return result;
    }

    data = data as KasItemsFetchResult<KasNftCollectionItem>;
    const ret: NftCollectionItemsFetchResult = {
      total: null,
      page: 0,
      page_size: 0,
      cursor: "",
      result: [],
      status: "SYNCED",
      chainId: chain,
    };
    if (!data.cursor) {
      ret.cursor = null;
    } else {
      ret.cursor = data.cursor;
    }

    let preloads: (NftItemsFetchResult | null)[];
    if (preload) {
      const promises = data.items.map((item: KasNftCollectionItem) => {
        return getUserNftCollectionNftItems(
          userAddress,
          item.contractAddress,
          chain
        );
      });
      preloads = await Promise.all(promises);
    }

    ret.result = data.items.map((item: KasNftCollectionItem, i: number) => {
      return {
        token_address: item.contractAddress,
        contract_type: NftType.ERC721,
        name: item.extras?.name ?? "",
        symbol: item.extras?.symbol ?? "",
        item: preload ? preloads[i] : undefined,
        chainId: chain,
      } as unknown as NftCollectionItem;
    });
    return ret;
  }

  async formatNftResults(
    userAddress: string,
    chain: number,
    data: KasItemsFetchResult<KasNftItem> | NftItemsFetchResult
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

    data = data as KasItemsFetchResult<KasNftItem>;
    const ret: NftItemsFetchResult = {
      total: null,
      page: 0,
      page_size: 0,
      cursor: "",
      result: [],
      status: "SYNCED",
      chainId: chain,
    };
    if (!data.cursor) {
      ret.cursor = null;
    } else {
      ret.cursor = data.cursor;
    }
    let metadatas = data.items.map((item: KasNftItem) => {
      if (!item.extras.tokenUri) {
        return null;
      }
      return getTokenMetadata(item.extras.tokenUri.replace(/\s+/g, ""));
    });
    metadatas = await Promise.all(metadatas);
    ret.result = data.items.map((item: KasNftItem, i) => {
      const metadata = metadatas[i] as unknown as { [key: string]: string };
      return {
        token_address: item.contractAddress,
        token_id: item.extras.tokenId,
        amount: Number(item.balance),
        owner_of: userAddress,
        token_hash: "",
        block_number_minted: "",
        block_number: "",
        contract_type: NftType.ERC721,
        metadata: JSON.stringify(metadata),
        name: metadata?.name || "",
        symbol: metadata?.symbol || "",
        token_uri: item.extras.tokenUri.replace(/\s+/g, ""),
        last_token_uri_sync: "",
        last_metadata_sync: "",
        minter_address: "",
        chainId: chain,
      } as unknown as NftItem;
    });
    return ret;
  }

  async formatFtResults(
    chain: number,
    data: KasItemsFetchResult<KasFtItem> | FtItem[]
  ): Promise<FtItemsFetchResult> {
    if (chain !== 1001 && chain !== 8217) {
      const promises = (data as FtItem[]).map((item: FtItem) => {
        return getTokenPrice(item.token_address, chain);
      });
      const prices = await Promise.all(promises);

      const result: FtItemsFetchResult = {
        result: (data as FtItem[]).map((item: FtItem, i: number) => {
          item.chainId = chain;
          item.price = prices[i];
          return item;
        }),
        chainId: chain,
      };
      return result;
    }

    data = data as KasItemsFetchResult<KasFtItem>;
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
