import {Client} from '@elastic/elasticsearch';
import {Request, Response, NextFunction} from 'express';
import config from '../config';
import {
  removeNoiseFromSearchResponse,
  removeNoiseFromSuggestionResponse,
  NetworkType} from './utils';

const cloudId = config.ELASTIC_SEARCH_CLOUD_ID;
const elasticUsername = config.ELASTIC_SEARCH_USERNAME;
const elasticPassword = config.ELASTIC_SEARCH_PASSWORD;

const client = new Client({
  cloud: {
    id: cloudId,
  },
  auth: {
    username: elasticUsername,
    password: elasticPassword,
  },
});

export async function searchProfiles(req: Request, res: Response, next: NextFunction) {
  const {query, searchFields, page, pageSize, chainId} = req.body;
  const from: number = (page - 1) * pageSize;
  // chainId should enum of NetworkType
  if (!NetworkType[chainId]) throw new Error('Invalid network type');
  const indexName = NetworkType[chainId] === NetworkType.Mainnet ? config.ELASTIC_SEARCH_PROFILE_INDEX_NAME_MAINNET : config.ELASTIC_SEARCH_PROFILE_INDEX_NAME_TESTNET;
  client
      .search({
        index: [indexName],
        query: {
          multi_match: {
            query,
            fields: searchFields,
            type: 'phrase_prefix',
            operator: 'or',
            analyzer: 'standard',
          },
        },
        from,
        size: pageSize,
      })
      .then((response) => {
        const result = removeNoiseFromSearchResponse(response);
        res.status(200).json({result}); // response
      })
      .catch((error) => {
        next(error);
      });
}

export async function searchChannels(req: Request, res: Response, next: NextFunction) {
  const {query, searchFields, page, pageSize, chainId} = req.body;
  const from: number = (page - 1) * pageSize;
  // chainId should enum of NetworkType
  if (!NetworkType[chainId]) throw new Error('Invalid network type');
  const indexName = NetworkType[chainId] === NetworkType.Mainnet ? config.ELASTIC_SEARCH_CHANNEL_INDEX_NAME_MAINNET : config.ELASTIC_SEARCH_CHANNEL_INDEX_NAME_TESTNET;
  client
      .search({
        index: [indexName],
        query: {
          multi_match: {
            query,
            fields: searchFields,
            type: 'phrase_prefix',
            operator: 'or',
            analyzer: 'standard',
          },
        },
        from,
        size: pageSize,
      })
      .then((response) => {
        const result = removeNoiseFromSearchResponse(response);
        res.status(200).json({result}); // response
      })
      .catch((error) => {
        next(error);
      });
}
// searching all the data from elastic search engine at once of profiles and channels
export async function searchAll(req: Request, res: Response, next: NextFunction) {
  const {query, searchFields, page, pageSize, chainId} = req.body;
  const from: number = (page - 1) * pageSize;
  // chainId should enum of NetworkType
  if (!NetworkType[chainId]) throw new Error('Invalid network type');
  const indexNames = NetworkType[chainId] === NetworkType.Mainnet ? [config.ELASTIC_SEARCH_PROFILE_INDEX_NAME_MAINNET, config.ELASTIC_SEARCH_CHANNEL_INDEX_NAME_MAINNET] : [config.ELASTIC_SEARCH_PROFILE_INDEX_NAME_TESTNET, config.ELASTIC_SEARCH_CHANNEL_INDEX_NAME_TESTNET];
  client
      .search({
        index: indexNames,
        query: {
          multi_match: {
            query,
            fields: searchFields,
            type: 'phrase_prefix',
            operator: 'or',
            analyzer: 'standard',
          },
        },
        from,
        size: pageSize,
      })
      .then((response) => {
        const result = removeNoiseFromSearchResponse(response);
        res.status(200).json({result}); // response
      })
      .catch((error) => {
        next(error);
      });
}

// searching all the data from elastic search engine at once of profiles and channels
export async function suggestAll(req: Request, res: Response, next: NextFunction) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const {query, field, page, pageSize, chainId} = req.body;
  const from: number = (page - 1) * pageSize;
  // chainId should enum of NetworkType
  if (!NetworkType[chainId]) throw new Error('Invalid network type');
  const indexNames = NetworkType[chainId] === NetworkType.Mainnet ? [config.ELASTIC_SEARCH_PROFILE_INDEX_NAME_MAINNET, config.ELASTIC_SEARCH_CHANNEL_INDEX_NAME_MAINNET] : [config.ELASTIC_SEARCH_PROFILE_INDEX_NAME_TESTNET, config.ELASTIC_SEARCH_CHANNEL_INDEX_NAME_TESTNET];
  client
      .search({
        index: indexNames,
        suggest: {
          suggest_all: {
            prefix: query,
            completion: {
              field: `${field}.suggest`,
            },

          },
        },
        from,
        size: pageSize,
      })
      .then((response) => {
        const result = removeNoiseFromSuggestionResponse(response);
        res.status(200).json({result});
      })
      .catch((error) => {
        next(error);
      });
}

export async function suggestProfiles(req: Request, res: Response, next: NextFunction) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const {query, field, page, pageSize, chainId} = req.body;
  const from: number = (page - 1) * pageSize;
  // chainId should enum of NetworkType
  if (!NetworkType[chainId]) throw new Error('Invalid network type');
  const indexName = NetworkType[chainId] === NetworkType.Mainnet ? config.ELASTIC_SEARCH_PROFILE_INDEX_NAME_MAINNET : config.ELASTIC_SEARCH_PROFILE_INDEX_NAME_TESTNET;
  client
      .search({
        index: [indexName],
        suggest: {
          suggest_all: {
            prefix: query,
            completion: {
              field: `${field}.suggest`,
            },

          },
        },
        from,
        size: pageSize,
      })
      .then((response) => {
        const result = removeNoiseFromSuggestionResponse(response);
        res.status(200).json({result});
      })
      .catch((error) => {
        next(error);
      });
}
export async function suggestChannels(req: Request, res: Response, next: NextFunction) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const {query, field, page, pageSize, chainId} = req.body;
  const from: number = (page - 1) * pageSize;
  // chainId should enum of NetworkType
  if (!NetworkType[chainId]) throw new Error('Invalid network type');
  const indexName = NetworkType[chainId] === NetworkType.Mainnet ? config.ELASTIC_SEARCH_CHANNEL_INDEX_NAME_MAINNET : config.ELASTIC_SEARCH_CHANNEL_INDEX_NAME_TESTNET;
  client
      .search({
        index: [indexName],
        suggest: {
          suggest_all: {
            prefix: query,
            completion: {
              field: `${field}.suggest`,
            },

          },
        },
        from,
        size: pageSize,
      })
      .then((response) => {
        const result = removeNoiseFromSuggestionResponse(response);
        res.status(200).json({result});
      })
      .catch((error) => {
        next(error);
      });
}

// writing a function to post data to elastic search engine
export async function addDocument(indexName: string, doc: { [p: string]: any}, docId: string) {
  // eslint-disable-next-line no-console
  console.log('indexing @ index-name', indexName);
  client
      .index({
        index: indexName,
        id: docId,
        document: doc})
      .then((response) => {
        // eslint-disable-next-line no-console
        console.log('document indexed successfully', response);
      })
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.log('error while indexing document', error);
      });
}
export async function updateDocument(indexName: string, doc: { [p: string]: any; }, docId: string) {
  // eslint-disable-next-line no-console
  console.log('updating @ engineName', indexName);
  // update the document
  client
      .update({
        index: indexName,
        id: docId,
        doc: {
          ...doc,
        }})
      .then((response) => {
        // eslint-disable-next-line no-console
        console.log(`document id:${docId} updated successfully`, response);
      })
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.log('error while updating document', error);
      } );
}
export async function deleteDocument(indexName: string, docId: string) {
  // eslint-disable-next-line no-console
  console.log('deleting @ engineName', indexName);
  client
      .delete({
        index: indexName,
        id: docId})
      .then((response) => {
        // eslint-disable-next-line no-console
        console.log(`document id:${docId} deleted successfully`, response);
      })
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.log('error while deleting documents', error);
      });
}
