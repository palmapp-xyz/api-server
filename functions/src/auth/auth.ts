export type AuthChallengeInfo = {
  id: string
  message: string
  profileId: string
}

export type AuthChallengeResult = {
  id: string
  domain: string
  chainId: string
  address: string
  statement?: string
  uri: string
  expirationTime?: string
  notBefore?: string
  version: string,
  nonce: string,
  profileId: string
}

export type Profile = {
  profileId: string
  address: string
  verified: boolean
}
