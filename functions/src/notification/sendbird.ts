import config from '../config';
import axios from 'axios';

const SEND_API_KEY = config.SENDBIRD_API_TOKEN;
const BASE_URL = config.SENDBIRD_API_URL;
const LIMIT = 100; // fetch 100 members at a time
export async function fetchChannelMembers(channelUrl: string, nextCursor?: string) {
  const headers = {
    'Content-Type': 'application/json',
    'Api-Token': SEND_API_KEY,
  };

  let url = `${BASE_URL}/group_channels/${encodeURIComponent(channelUrl)}/members?limit=${LIMIT}`;
  if (nextCursor) {
    url += `&next=${nextCursor}`;
  }
  const response = await axios.get(url, {headers});
  if (response.status !== 200) {
    throw new Error(`Failed to fetch channel members: ${response.status}`);
  }
  return {members: response.data.members, nextCursor: response.data.next};
}
