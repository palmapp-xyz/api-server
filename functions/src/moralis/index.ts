import axios from "axios";
import { utils } from "ethers";
import Moralis from "moralis";
import * as functions from "firebase-functions";
import {
  NftItem,
  NftItemsFetchResult,
  NftType,
  TokenPrice,
} from "../api/moralis";
import config from "../config";
import { getTokenMetadata } from "../utils/ipfs";
import { KasItemsFetchResult, KasNftItem } from "../api/kas";

export async function getTokenPrice(
  tokenAddress: string,
  chainId: number
): Promise<TokenPrice | null> {
  try {
    const url = `${
      Moralis.EvmApi.baseUrl
    }/erc20/${tokenAddress}/price?chain=${utils.hexValue(
      chainId
    )}&include=percent_change`;

    const response = await axios.request({
      method: "get",
      url,
      headers: {
        "Content-Type": "application/json",
        "x-api-key": config.MORALIS_API_KEY,
      },
    });
    return response.data;
  } catch (e) {
    if (process.env.NODE_ENV === "development") {
      // eslint-disable-next-line no-console
      console.error("getTokenPrice failed: ", tokenAddress, chainId, e);
    } else {
      functions.logger.error(
        `getTokenPrice failed: tokenAddress: ${tokenAddress} chainId ${chainId}`,
        e
      );
    }
    return null;
  }
}

export async function getUserNftCollectionNftItems(
  userAddress: string,
  tokenAddress: string,
  chainId: number
): Promise<NftItemsFetchResult | null> {
  if (chainId === 1001 || chainId === 8217) {
    return await getUserKasNftCollectionNftItems(
      userAddress,
      tokenAddress,
      chainId
    );
  }

  try {
    const url = `${
      Moralis.EvmApi.baseUrl
    }/${userAddress}/nft?chain=${utils.hexValue(
      chainId
    )}&media_items=true&limit=10&token_addresses=${tokenAddress}`;

    const response = await axios.request({
      method: "get",
      url,
      headers: {
        "Content-Type": "application/json",
        "x-api-key": config.MORALIS_API_KEY,
      },
    });
    return response.data as NftItemsFetchResult;
  } catch (e) {
    if (process.env.NODE_ENV === "development") {
      // eslint-disable-next-line no-console
      console.error(
        "getUserNftCollectionNftItems failed: ",
        userAddress,
        tokenAddress,
        chainId,
        e
      );
    } else {
      functions.logger.error(
        `getUserNftCollectionNftItems failed: userAddress ${userAddress} tokenAddress: ${tokenAddress} chainId ${chainId}`,
        e
      );
    }
    return null;
  }
}

export async function getUserKasNftCollectionNftItems(
  userAddress: string,
  tokenAddress: string,
  chainId: number
): Promise<NftItemsFetchResult | null> {
  try {
    const reqParams = {
      kind: "nft",
      size: 10,
      "ca-filters": tokenAddress,
    };
    const request = {
      method: "get",
      url: `${config.KAS_ENDPOINT}account/${userAddress}/contract`,
      reqParams,
      headers: {
        "Content-Type": "application/json",
        "x-chain-id": chainId,
      },
      auth: {
        username: config.KAS_API_ACCESS_KEY_ID,
        password: config.KAS_API_SECRET_ACCESS_KEY,
      },
    };

    const response = await axios.request(request);
    const data = response.data as KasItemsFetchResult<KasNftItem>;
    const ret: NftItemsFetchResult = {
      total: null,
      page: 0,
      page_size: 0,
      cursor: "",
      result: [],
      status: "SYNCED",
      chainId,
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
        token_uri: item.extras.tokenUri
          ? item.extras.tokenUri.replace(/\s+/g, "")
          : "",
        last_token_uri_sync: "",
        last_metadata_sync: "",
        minter_address: "",
        chainId,
      } as unknown as NftItem;
    });
    return ret;
  } catch (e) {
    if (process.env.NODE_ENV === "development") {
      // eslint-disable-next-line no-console
      console.error(
        "getUserKasNftCollectionNftItems failed: ",
        tokenAddress,
        chainId,
        e
      );
    } else {
      functions.logger.error(
        `getUserKasNftCollectionNftItems failed: tokenAddress: ${tokenAddress} chainId ${chainId}`,
        getUserKasNftCollectionNftItems
      );
    }
    return null;
  }
}
