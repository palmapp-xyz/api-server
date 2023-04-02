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
  chainId?: number
  possible_spam?: boolean | null
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
  chainId: string
}

export type Item = {
  chainId?: number
}

// eslint-disable-next-line etc/no-t
export type ItemsFetchResult<T extends Item> = {
  result: T[]
  chainId?: number
}

export type NftItemsFetchResult = ItemsFetchResult<NftItem> & {
  total: number | null
  page: number
  page_size: number
  cursor: string | null
  status: 'SYNCED'
}

export type FtItem = {
  token_address: string
  name:string
  symbol:string
  logo: string | null
  thumbnail: string | null
  decimals: 18,
  balance: string
  possible_spam?: boolean
  chainId?: number
}

export type FtItemsFetchResult = ItemsFetchResult<FtItem>
