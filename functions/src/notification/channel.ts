import {NftType} from '../api/moralis';

export declare enum ChannelType {
  BASE = 'base',
  GROUP = 'group',
  OPEN = 'open',
}

export type Channel = {
  url: string
  channelType: ChannelType
  gatingToken?: string
  gatingTokenType?: NftType
  gatingTokenChain?: string
}

