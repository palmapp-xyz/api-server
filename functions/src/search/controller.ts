import AppSearchClient from '@elastic/app-search-node';
import {Request, Response, NextFunction} from 'express';
import config from '../config';

const apiKey = config.ELASTIC_APP_SEARCH_KEY;
const profileEngineName = config.ELASTIC_APP_SEARCH_PROFILE_ENGINE_NAME;
const channelEngineName = config.ELASTIC_APP_SEARCH_CHANNEL_ENGINE_NAME;
const baseUrlFn = () => config.ELASTIC_APP_SEARCH_ENDPOINT;
const client = new AppSearchClient(undefined, apiKey, baseUrlFn);

export async function suggestProfilesByHandle(req: Request, res: Response, next: NextFunction) {
  const {query} = req.query;
  const options = {
    size: 5,
    types: {
      documents: {
        fields: ['handle'],
      },
    },
  };

  client
      .querySuggestion(profileEngineName, query, options)
      .then((response) => {
        res.status(200).json({response});
      })
      .catch((error) => {
        next(error);
      });
}

export async function fetchProfile(req: Request, res: Response, next: NextFunction) {
  const {handle} = req.query;
  const searchFields = {handle: {}};
  // eslint-disable-next-line etc/no-commented-out-code
  // const resultFields = {address: {raw: {}}, bio: {raw: {}}, attributes: {raw: {}}, handle: {raw: {}}, lensprofile: {raw: {}}, coverpicture: {raw: {}}, dispatcher: {raw: {}}, followmodule: {raw: {}}, follownftaddress: {raw: {}}, id: {raw: {}}, isdefault: {raw: {}}, isfollowedbyme: {raw: {}}, isfollowing: {raw: {}}, metadata: {raw: {}}, name: {raw: {}}, onchainidentity: {raw: {}}, ownedby: {raw: {}}, picture: {raw: {}}, stats: {raw: {}}};
  const options = {search_fields: searchFields};

  client
      .search(profileEngineName, handle, options)
      .then((response) => {
        res.status(200).json({response});
      })
      .catch((error) => {
        next(error);
      });
}
export async function suggestChannelsByName(req: Request, res: Response, next: NextFunction) {
  const {query} = req.query;
  const options = {
    size: 5,
    types: {
      documents: {
        fields: ['name'],
      },
    },
  };

  client
      .querySuggestion(channelEngineName, query, options)
      .then((response) => {
        res.status(200).json({response});
      })
      .catch((error) => {
        next(error);
      });
}

export async function fetchChannel(req: Request, res: Response, next: NextFunction) {
  const {name} = req.query;
  const searchFields = {handle: {}};
  // eslint-disable-next-line etc/no-commented-out-code
  // const resultFields = {channeltype: {raw: {}}, gatingtoken: {raw: {}}, url: {raw: {}}};
  const options = {search_fields: searchFields};

  client
      .search(channelEngineName, name, options)
      .then((response) => {
        res.status(200).json({response});
      })
      .catch((error) => {
        next(error);
      });
}

