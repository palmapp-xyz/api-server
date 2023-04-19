export type ListingState = 'active' | 'completed' | 'cancelled'

export type Listing = {
  nftContract: string
  tokenId: string
  order: PostOrderResponsePayload
  status: ListingState
  channelUrl?: string
}

export interface PostOrderResponsePayload {
  erc20Token: string;
  erc20TokenAmount: string;
  nftToken: string;
  nftTokenId: string;
  nftTokenAmount: string;
  nftType: string;
  sellOrBuyNft: 'buy' | 'sell';
  chainId: string;
  order: SignedNftOrderV4Serialized;
  metadata: Record<string, string> | null;
}

export declare type SignedNftOrderV4Serialized = SignedERC721OrderStructSerialized | SignedERC1155OrderStructSerialized;

export interface SignedERC721OrderStructSerialized extends ERC721OrderStructSerialized {
  signature: SignatureStructSerialized;
}
export interface SignedERC1155OrderStructSerialized extends ERC1155OrderStructSerialized {
  signature: SignatureStructSerialized;
}

export declare type ERC721OrderStructSerialized = {
  direction: number;
  maker: string;
  taker: string;
  expiry: string;
  nonce: string;
  erc20Token: string;
  erc20TokenAmount: string;
  fees: FeeStructSerialized[];
  erc721Token: string;
  erc721TokenId: string;
  erc721TokenProperties: PropertyStructSerialized[];
};

export declare type ERC1155OrderStructSerialized = {
  direction: number;
  maker: string;
  taker: string;
  expiry: string;
  nonce: string;
  erc20Token: string;
  erc20TokenAmount: string;
  fees: FeeStructSerialized[];
  erc1155Token: string;
  erc1155TokenId: string;
  erc1155TokenProperties: PropertyStructSerialized[];
  erc1155TokenAmount: string;
};

export declare type FeeStructSerialized = {
  recipient: string;
  amount: string;
  feeData: string;
};

export declare type PropertyStructSerialized = {
  propertyValidator: string;
  propertyData: string | Array<number>;
};

export declare type SignatureStructSerialized = {
  signatureType: number;
  v: number;
  r: string;
  s: string;
};
