import {Client} from '@elastic/enterprise-search';
import {Request, Response, NextFunction} from 'express';
import config from '../config';
import {lowercaseTheKeys} from './utils';
import {GetSchemaResponse} from '@elastic/enterprise-search/lib/api/app/types';

const apiKey = config.ELASTIC_APP_SEARCH_KEY;
const profileEngineName = config.ELASTIC_APP_SEARCH_PROFILE_ENGINE_NAME;
const channelEngineName = config.ELASTIC_APP_SEARCH_CHANNEL_ENGINE_NAME;
const baseUrl = config.ELASTIC_APP_SEARCH_BASE_URL;
const client = new Client({
  url: baseUrl,
  auth: {
    token: apiKey,
  },
});

export async function suggestProfilesByHandle(req: Request, res: Response, next: NextFunction) {
  const {query, searchFields, size} = req.body;
  const options = {
    query,
    size,
    types: {
      documents: {
        fields: searchFields,
      },
    },
  };
  // eslint-disable-next-line no-console
  console.log('options', JSON.stringify(options, null, 2));
  client
      .app
      .querySuggestion({
        engine_name: profileEngineName,
        body: {
          ...options,
        }})
      .then((response) => {
        res.status(200).json({response});
      })
      .catch((error) => {
        next(error);
      });
}

export async function fetchProfile(req: Request, res: Response, next: NextFunction) {
  const {query, searchFields, offset, size} = req.body;
  const search_fields = {}; // search only in the given fields
  searchFields.forEach((field: string) => {
    // @ts-ignore
    search_fields[field] = {};
  });
  const options = {
    page: {
      current: offset,
      size,
    },
    search_fields,
    query,

  };

  client
      .app
      .search({
        engine_name: profileEngineName,
        body: {
          ...options,
        }})
      .then((response) => {
        res.status(200).json({response});
      })
      .catch((error) => {
        next(error);
      });
}
export async function suggestChannelsByName(req: Request, res: Response, next: NextFunction) {
  const {query, searchFields, size} = req.body;
  const options = {
    query,
    size,
    types: {
      documents: {
        fields: searchFields,
      },
    },
  };

  client
      .app
      .querySuggestion({
        engine_name: channelEngineName,
        body: {
          ...options,
        }})
      .then((response) => {
        res.status(200).json({response});
      })
      .catch((error) => {
        next(error);
      });
}

export async function fetchChannel(req: Request, res: Response, next: NextFunction) {
  const {query, searchFields, offset, size} = req.body;
  const search_fields = {}; // search only in the given fields
  searchFields.forEach((field: string) => {
    // @ts-ignore
    search_fields[field] = {};
  });
  const options = {
    page: {
      current: offset,
      size,
    },
    search_fields,
    query,

  };

  client
      .app
      .search({
        engine_name: channelEngineName,
        body: {
          ...options,
        }})
      .then((response) => {
        res.status(200).json({response});
      })
      .catch((error) => {
        next(error);
      });
}

// writing a function to post data to elastic search engine
export async function addDocuments(engineName: string, docs: [{ [p: string]: any; id: string }]) {
  // eslint-disable-next-line no-console
  console.log('indexing @ engineName', engineName);
  const docsV2 = docs.map((doc) => lowercaseTheKeys(doc));
  client
      .app
      .indexDocuments({
        engine_name: engineName,
        documents: docsV2})
      .then((response) => {
        // eslint-disable-next-line no-console
        console.log('document indexed successfully', response);
      })
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.log('error while indexing document', error);
      });
}
export async function updateDocuments(engineName: string, docs: [{ [p: string]: any; id: string }]) {
  // eslint-disable-next-line no-console
  console.log('updating @ engineName', engineName);
  const docsV2 = docs.map((doc) => lowercaseTheKeys(doc));
  client
      .app
      .putDocuments({
        engine_name: engineName,
        documents: docsV2})
      .then((response) => {
        // eslint-disable-next-line no-console
        console.log('documents updated successfully', response);
      })
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.log('error while updating documents', error);
      });
}
export async function deleteDocuments(engineName: string, docIds: [string]) {
  // eslint-disable-next-line no-console
  console.log('deleting @ engineName', engineName);
  client
      .app
      .deleteDocuments({
        engine_name: engineName,
        documentIds: docIds})
      .then((response) => {
        // eslint-disable-next-line no-console
        console.log('documents deleted successfully', response);
      })
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.log('error while deleting documents', error);
      });
}

// middleware to validate searchFields are valid fields in the engine schema
export async function validateProfileSearchFields(req: Request, res: Response, next: NextFunction) {
  const {searchFields} = req.body;
  const engineSchema: GetSchemaResponse = await client.app.getSchema({engine_name: config.ELASTIC_APP_SEARCH_PROFILE_ENGINE_NAME});
  const engineSchemaFields = Object.keys(engineSchema);
  const invalidFields = searchFields.filter((field: string) => !engineSchemaFields.includes(field));
  if (invalidFields.length) {
    res.status(400).json({message: `Invalid search fields: ${invalidFields.join(', ')}`});
  } else {
    next();
  }
}
export async function validateChannelSearchFields(req: Request, res: Response, next: NextFunction) {
  const {searchFields} = req.body;
  const engineSchema: GetSchemaResponse = await client.app.getSchema({engine_name: config.ELASTIC_APP_SEARCH_CHANNEL_ENGINE_NAME});
  const engineSchemaFields = Object.keys(engineSchema);
  const invalidFields = searchFields.filter((field: string) => !engineSchemaFields.includes(field));
  if (invalidFields.length) {
    res.status(400).json({message: `Invalid search fields: ${invalidFields.join(', ')}`});
  } else {
    next();
  }
}
