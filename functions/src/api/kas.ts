export type KasItemsFetchResult<T> = {
  cursor: string;
  items: T[];
};

export type KasNftItem = {
  kind: "nft";
  contractAddress: string;
  updatedAt: number;
  balance: string;
  lastTransfer: {
    transactionHash: string;
    transferFrom: string;
    transferTo: string;
  };
  extras: {
    tokenId: string;
    tokenUri: string;
  };
};

export type KasFtItem = {
  kind: "ft";
  contractAddress: string;
  updatedAt: number;
  balance: string;
  lastTransfer: {
    transactionHash: string;
    transferFrom: string;
    transferTo: string;
  };
  extras: {
    name: string;
    symbol: string;
    decimals: number;
    totalSupply: string;
    formattedValue: string;
  };
};

export type KasNftCollectionItem = {
  kind: "nft";
  contractAddress: string;
  updatedAt: number;
  totalBalance: string;
  extras: {
    name: string;
    symbol: string;
    totalSupply: string;
  };
};

export type KasNftCollectionNftItem = {
  tokenId: string;
  owner: string;
  previousOwner: string;
  tokenUri: string;
  transactionHash: string;
  createdAt: number;
  updatedAt: number;
  metadata?: string | null;
};
