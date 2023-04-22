import axios from 'axios';
import * as functions from 'firebase-functions';

import {firestore} from '../index';
import config from '../config';

const LIMIT = 100; // fetch 100 members at a time

export async function fetchChannelMembers(
    channelUrl: string,
    nextCursor?: string | null
): Promise<{members: {user_id: string}[], nextCursor?: string | null }> {
  const headers = {
    'Content-Type': 'application/json',
    'Api-Token': config.SENDBIRD_API_TOKEN,
  };

  let url = `${config.SENDBIRD_API_URL}/group_channels/${encodeURIComponent(channelUrl)}/members?limit=${LIMIT}`;
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
    tokens: Record<string, DeviceToken>,
    channelUrl: string,
    excludeAddresses: string[],
    lastKey?: string | null
): Promise<Record<string, DeviceToken>> => {
  // Get a batch of usersIds from fetchChannelMembers function
  const {members, nextCursor} = await fetchChannelMembers(channelUrl, lastKey || undefined);
  // fetch the device tokens of the users from firestore based on the userIds fetched
  const userIds = members.map((member) => member.user_id);
  if (userIds.length === 0) {
    functions.logger.log(`getMembersUserTokens: channelUrl ${channelUrl}: total: ${tokens.length}`);
    return tokens;
  }

  const fetched: Record<string, DeviceToken> = {};
  const promises = userIds.map((userId: string) => {
    // Get the user's device token
    const userRef = firestore.collection('profiles').doc(userId);
    // eslint-disable-next-line no-await-in-loop
    return userRef.get().then((userDoc) => {
      if (!userDoc.exists) {
        return;
      }
      if (excludeAddresses?.includes(userDoc.data()?.address)) {
        return;
      }
      if (userDoc.data()?.deviceTokens) {
        fetched[userId] = userDoc.data()?.deviceTokens as DeviceToken;
      }
    });
  });
  await Promise.all(promises);

  // const fetched = (await Promise.all(promises)).filter((x) => !!x) as DeviceToken[];
  return getMembersUserTokens(Object.assign(tokens, fetched), channelUrl, excludeAddresses, nextCursor);
};
