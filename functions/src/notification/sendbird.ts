import axios from 'axios';
import * as functions from 'firebase-functions';

import {firestore} from '../index';
import config from '../config';

const LIMIT = 100; // fetch 100 members at a time
export async function fetchChannelMembers(
    chainId: number,
    channelUrl: string,
    nextCursor?: string | null
): Promise<{members: {user_id: string}[], nextCursor?: string | null }> {
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

export type DeviceToken = {
  apns: string[]
  fcm: string[]
}

// A recursive function to get batch of users and send notifications to them
export const getMembersUserTokens = async (
    tokens: DeviceToken[],
    channelUrl: string,
    chainId: number,
    excludeAddresses: string[],
    lastKey?: string | null
): Promise<DeviceToken[]> => {
  // Get a batch of usersIds from fetchChannelMembers function
  const {members, nextCursor} = await fetchChannelMembers(chainId, channelUrl, lastKey || undefined);
  // fetch the device tokens of the users from firestore based on the userIds fetched
  const userIds = members.map((member) => member.user_id);
  if (userIds.length === 0) {
    functions.logger.log(`getMembersUserTokens: channelUrl ${channelUrl} chainId ${chainId}: total: ${tokens.length}`);
    return tokens;
  }

  const promises = userIds.map((userId: string) => {
    // Get the user's device token
    const userRef = firestore.collection('profiles').doc(userId);
    // eslint-disable-next-line no-await-in-loop
    return userRef.get().then((userDoc) => {
      if (!userDoc.exists) {
        return null;
      }
      if (excludeAddresses?.includes(userDoc.data()?.address)) {
        return null;
      }
      return userDoc.data()?.deviceTokens as DeviceToken ?? null;
    });
  });

  const fetched = (await Promise.all(promises)).filter((x) => !!x) as DeviceToken[];
  return getMembersUserTokens(tokens.concat(fetched), channelUrl, chainId, excludeAddresses, nextCursor);
};
