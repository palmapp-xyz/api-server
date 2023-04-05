import {Client} from '@elastic/enterprise-search';
import {Request, Response, NextFunction} from 'express';
import config from '../config';

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
  const {handle} = req.params;
  const options = {
    size: 5,
    types: {
      documents: {
        fields: ['handle'],
      },
    },
  };

  client
      .app
      .querySuggestion({
        engine_name: profileEngineName,
        body: {
          query: handle as string,
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
  const {handle} = req.params;
  const searchFields = {handle: {}};
  // eslint-disable-next-line etc/no-commented-out-code
  // const resultFields = {address: {raw: {}}, bio: {raw: {}}, attributes: {raw: {}}, handle: {raw: {}}, lensprofile: {raw: {}}, coverpicture: {raw: {}}, dispatcher: {raw: {}}, followmodule: {raw: {}}, follownftaddress: {raw: {}}, id: {raw: {}}, isdefault: {raw: {}}, isfollowedbyme: {raw: {}}, isfollowing: {raw: {}}, metadata: {raw: {}}, name: {raw: {}}, onchainidentity: {raw: {}}, ownedby: {raw: {}}, picture: {raw: {}}, stats: {raw: {}}};
  const options = {search_fields: searchFields};

  client
      .app
      .search({
        engine_name: profileEngineName,
        body: {
          query: handle as string,
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
  const {name} = req.params;
  const options = {
    size: 5,
    types: {
      documents: {
        fields: ['name'],
      },
    },
  };

  client
      .app
      .querySuggestion({
        engine_name: channelEngineName,
        body: {
          query: name as string,
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
  const {name} = req.params;
  const searchFields = {handle: {}};
  // eslint-disable-next-line etc/no-commented-out-code
  // const resultFields = {channeltype: {raw: {}}, gatingtoken: {raw: {}}, url: {raw: {}}};
  const options = {search_fields: searchFields};

  client
      .app
      .search({
        engine_name: channelEngineName,
        body: {
          query: name as string,
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
  client
      .app
      .indexDocuments({
        engine_name: engineName,
        documents: docs})
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
  client
      .app
      .putDocuments({
        engine_name: engineName,
        documents: docs})
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

