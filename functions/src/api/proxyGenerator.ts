import Moralis from 'moralis';
import {operations as evmOperations} from 'moralis/common-evm-utils';
import express from 'express';
import axios from 'axios';
import {errorHandler} from '../middlewares/errorHandler';
// eslint-disable-next-line max-len
import {EndpointDescriptor, convertOperationToDescriptor} from '@moralisweb3/api-utils';

// eslint-disable-next-line new-cap
const proxyRouter = express.Router();

export interface ProxyOptions {
  apiKey: string;
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
      // eslint-disable-next-line max-len
      proxyRouter.route(urlPattern)[descriptor.method](async (req, res, next) => {
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
          return res.send(response.data);
        } catch (error) {
          return errorHandler(error as Error, req, res, next);
        }
      });
    }
    return proxyRouter;
  }
}
