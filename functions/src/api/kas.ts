export type KasNftItem = {
  kind: 'nft'
  contractAddress: string
  updatedAt: number
  balance: string
  lastTransfer: {
    transactionHash: string
    transferFrom: string
    transferTo: string
  },
  extras: {
    tokenId: string
    tokenUri: string
  }
}

export type KasNftItemsFetchResult = {
  cursor: string
  items: KasNftItem[],
}
