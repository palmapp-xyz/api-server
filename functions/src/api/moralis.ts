export type NftItem = {
  token_address: string
  token_id: string
  amount: string
  owner_of: string
  token_hash: string
  block_number_minted: string
  block_number: string
  contract_type: string
  name: string
  symbol: string
  token_uri: string
  metadata?: string
  last_token_uri_sync: string
  last_metadata_sync: string
  minter_address: string
}

export enum Status {
  SYNCED = 'SYNCED',
  SYNCING = 'SYNCING',
}

export enum NftType {
  ERC721 = 'ERC721',
  ERC1155 = 'ERC1155',
}

export type NftCollection = {
  token_address: string
  contract_type: NftType
  name: string
  symbol: string | null
}

export type NftItemsFetchResult = {
  total: number | null
  page: number
  page_size: number
  cursor: string | null
  result: NftItem[],
  status: 'SYNCED'
}
