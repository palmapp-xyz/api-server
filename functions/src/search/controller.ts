import {Client} from '@elastic/elasticsearch';
import {Request, Response, NextFunction} from 'express';
import config from '../config';

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
  const {query, searchFields, page, pageSize} = req.body;
  const from: number = (page - 1) * pageSize;
  client
      .search({
        index: config.ELASTIC_SEARCH_PROFILE_INDEX_NAME,
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
        res.status(200).json({response}); // TODO: need to remove noise from response
      })
      .catch((error) => {
        next(error);
      });
}

export async function searchChannels(req: Request, res: Response, next: NextFunction) {
  const {query, searchFields, page, pageSize} = req.body;
  const from: number = (page - 1) * pageSize;
  client
      .search({
        index: config.ELASTIC_SEARCH_CHANNEL_INDEX_NAME,
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
        res.status(200).json({response});
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
