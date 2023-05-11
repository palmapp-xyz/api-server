import { NextFunction, Request, Response } from "express";

import { Client } from "@elastic/elasticsearch";

import config from "../config";
import {
  removeNoiseFromSearchResponse,
  removeNoiseFromSuggestionResponse,
} from "./utils";
import { lensClient } from "..";
import {
  ExploreProfilesRequest,
  PaginatedResult,
  ProfileFragment,
  ProfileSortCriteria,
} from "@lens-protocol/client";
import { SearchProfilesQueryVariables } from "@lens-protocol/client/dist/declarations/src/search/graphql/search.generated";

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

export async function searchProfiles(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { query, searchFields, page, pageSize } = req.body;
  const from: number = (page - 1) * pageSize;
  client
    .search({
      index: [config.ELASTIC_SEARCH_PROFILE_INDEX],
      query: {
        multi_match: {
          query,
          fields: searchFields,
          type: "phrase_prefix",
          operator: "or",
          analyzer: "standard",
        },
      },
      from,
      size: pageSize,
    })
    .then((response) => {
      const result = removeNoiseFromSearchResponse(response);
      res.status(200).json({ result }); // response
    })
    .catch((error) => {
      next(error);
    });
}

export async function searchChannels(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { query, searchFields, page, pageSize } = req.body;
  const from: number = (page - 1) * pageSize;
  client
    .search({
      index: [config.ELASTIC_SEARCH_CHANNEL_INDEX],
      query: {
        multi_match: {
          query,
          fields: searchFields,
          type: "phrase_prefix",
          operator: "or",
          analyzer: "standard",
        },
      },
      from,
      size: pageSize,
    })
    .then((response) => {
      const result = removeNoiseFromSearchResponse(response);
      res.status(200).json({ result }); // response
    })
    .catch((error) => {
      next(error);
    });
}
// searching all the data from elastic search engine at once of profiles and channels
export async function searchAll(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { query, searchFields, page, pageSize } = req.body;
  const from: number = (page - 1) * pageSize;
  client
    .search({
      index: [
        config.ELASTIC_SEARCH_PROFILE_INDEX,
        config.ELASTIC_SEARCH_CHANNEL_INDEX,
      ],
      query: {
        multi_match: {
          query,
          fields: searchFields,
          type: "phrase_prefix",
          operator: "or",
          analyzer: "standard",
        },
      },
      from,
      size: pageSize,
    })
    .then((response) => {
      const result = removeNoiseFromSearchResponse(response);
      res.status(200).json({ result }); // response
    })
    .catch((error) => {
      next(error);
    });
}

// searching all the data from elastic search engine at once of profiles and channels
export async function suggestAll(
  req: Request,
  res: Response,
  next: NextFunction
) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { query, field, page, pageSize } = req.body;
  const from: number = (page - 1) * pageSize;
  client
    .search({
      index: [
        config.ELASTIC_SEARCH_PROFILE_INDEX,
        config.ELASTIC_SEARCH_CHANNEL_INDEX,
      ],
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
      res.status(200).json({ result });
    })
    .catch((error) => {
      next(error);
    });
}

export async function exploreLensProfiles(
  req: Request,
  res: Response,
  next: NextFunction
) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { query, limit, cursor, profileId } = req.body;

  try {
    const request: ExploreProfilesRequest = {
      cursor,
      limit,
      sortCriteria: ProfileSortCriteria.MostFollowers,
    };
    const results: PaginatedResult<ProfileFragment> =
      await lensClient.explore.profiles(request, profileId);

    res
      .status(200)
      .json({ items: results.items, cursor: results.pageInfo.next });
  } catch (error) {
    next(error);
  }
}

export async function suggestLensProfiles(
  req: Request,
  res: Response,
  next: NextFunction
) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { query, limit, cursor, profileId } = req.body;

  try {
    const request: SearchProfilesQueryVariables = {
      limit,
      cursor,
      query,
      observerId: profileId,
    };
    const results: PaginatedResult<ProfileFragment> =
      await lensClient.search.profiles(request);

    res
      .status(200)
      .json({ items: results.items, cursor: results.pageInfo.next });
  } catch (error) {
    next(error);
  }
}

export async function suggestProfiles(
  req: Request,
  res: Response,
  next: NextFunction
) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { query, field, page, pageSize, cursor, profileId } = req.body;
  const from: number = (page - 1) * pageSize;
  client
    .search({
      index: [config.ELASTIC_SEARCH_PROFILE_INDEX],
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
      res.status(200).json({ result });
    })
    .catch((error) => {
      next(error);
    });
}
export async function suggestChannels(
  req: Request,
  res: Response,
  next: NextFunction
) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { query, field, page, pageSize } = req.body;
  const from: number = (page - 1) * pageSize;
  client
    .search({
      index: [config.ELASTIC_SEARCH_CHANNEL_INDEX],
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
      res.status(200).json({ result });
    })
    .catch((error) => {
      next(error);
    });
}

// writing a function to post data to elastic search engine
export async function addDocument(
  indexName: string,
  doc: { [p: string]: any },
  docId: string
) {
  // eslint-disable-next-line no-console
  console.log("indexing @ index-name", indexName);
  client
    .index({
      index: indexName,
      id: docId,
      document: doc,
    })
    .then((response) => {
      // eslint-disable-next-line no-console
      console.log("document indexed successfully", response);
    })
    .catch((error) => {
      // eslint-disable-next-line no-console
      console.log("error while indexing document", error);
    });
}
export async function updateDocument(
  indexName: string,
  doc: { [p: string]: any },
  docId: string
) {
  // eslint-disable-next-line no-console
  console.log("updating @ engineName", indexName);
  // update the document
  client
    .update({
      index: indexName,
      id: docId,
      doc: {
        ...doc,
      },
    })
    .then((response) => {
      // eslint-disable-next-line no-console
      console.log(`document id:${docId} updated successfully`, response);
    })
    .catch((error) => {
      // eslint-disable-next-line no-console
      console.log("error while updating document", error);
    });
}
export async function deleteDocument(indexName: string, docId: string) {
  // eslint-disable-next-line no-console
  console.log("deleting @ engineName", indexName);
  client
    .delete({
      index: indexName,
      id: docId,
    })
    .then((response) => {
      // eslint-disable-next-line no-console
      console.log(`document id:${docId} deleted successfully`, response);
    })
    .catch((error) => {
      // eslint-disable-next-line no-console
      console.log("error while deleting documents", error);
    });
}
