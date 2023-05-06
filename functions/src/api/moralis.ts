// https://docs.moralis.io/web3-data-api/evm/nft-image-previews#what-formats-are-supported
export type MediaPreview = {
  height: number;
  width: number;
  url: string;
};

// https://docs.moralis.io/web3-data-api/evm/nft-image-previews#im-using-the-query-parameter-but-im-not-receiving-any-previews-why
export enum MediaPreviewStatus {
  success = "success",
  processing = "processing",
  unsupported_media = "unsupported_media",
  invalid_url = "invalid_url",
  host_unavailable = "host_unavailable",
  temporarily_unavailable = "temporarily_unavailable",
}

export type NftItem = {
  token_address: string;
  token_id: string;
  amount: string;
  owner_of: string;
  token_hash: string;
  block_number_minted: string;
  block_number: string;
  contract_type: string;
  name: string;
  symbol: string;
  token_uri: string;
  metadata?: string;
  last_token_uri_sync: string;
  last_metadata_sync: string;
  minter_address: string;
  chainId?: number;
  possible_spam?: boolean | null;
  media?: {
    mimetype: string;
    parent_hash: string;
    status: MediaPreviewStatus;
    updatedAt: string;
    media_collection?: {
      low: MediaPreview;
      medium: MediaPreview;
      high: MediaPreview;
    };
    original_media_url: string;
  } | null;
};

export enum Status {
  SYNCED = "SYNCED",
  SYNCING = "SYNCING",
}

export enum NftType {
  ERC721 = "ERC721",
  ERC1155 = "ERC1155",
}

export type NftCollectionItem = {
  token_address: string;
  contract_type: NftType;
  name: string;
  symbol: string | null;
  chainId?: number;
  possible_spam?: boolean | null;
};

export type Item = {
  chainId?: number;
};

export type ItemsFetchResult<T extends Item> = {
  result: T[];
  chainId?: number;
};

export type NftItemsFetchResult = ItemsFetchResult<NftItem> & {
  total: number | null;
  page: number;
  page_size: number;
  cursor: string | null;
  status: "SYNCED";
};

export type NftCollectionItemsFetchResult =
  ItemsFetchResult<NftCollectionItem> & {
    total: number | null;
    page: number;
    page_size: number;
    cursor: string | null;
    status: "SYNCED";
  };

export type FtItem = {
  token_address: string;
  name: string;
  symbol: string;
  logo: string | null;
  thumbnail: string | null;
  decimals: 18;
  balance: string;
  possible_spam?: boolean;
  chainId?: number;
};

export type FtItemsFetchResult = ItemsFetchResult<FtItem>;
