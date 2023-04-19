import config from '../config';
import axios from 'axios';

const LIMIT = 100; // fetch 100 members at a time
export async function fetchChannelMembers(chainId: number, channelUrl: string, nextCursor?: string) {
  const headers = {
    'Content-Type': 'application/json',
    'Api-Token': chainId === 5 ? config.SENDBIRD_API_TOKEN_TESTNET : config.SENDBIRD_API_TOKEN_MAINNET,
  };

  const baseUrl = chainId === 5 ? config.SENDBIRD_API_URL_TESTNET : config.SENDBIRD_API_URL_MAINNET;
  let url = `${baseUrl}/group_channels/${encodeURIComponent(channelUrl)}/members?limit=${LIMIT}`;
  if (nextCursor) {
    url += `&next=${nextCursor}`;
  }
  const response = await axios.get(url, {headers});
  if (response.status !== 200) {
    throw new Error(`Failed to fetch channel members: ${response.status}`);
  }
  return {members: response.data.members, nextCursor: response.data.next};
}
