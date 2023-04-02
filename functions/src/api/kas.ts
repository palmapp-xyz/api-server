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

export type KasFtItem = {
  kind: 'ft'
  contractAddress: string
  updatedAt: number
  balance: string
  lastTransfer: {
    transactionHash: string
    transferFrom: string
    transferTo: string
  },
  extras: {
    name: string
    symbol: string
    decimals: number
    totalSupply: string
    formattedValue: string
  }
}


export type KasFtItemsFetchResult = {
  cursor: string
  items: KasFtItem[],
}
