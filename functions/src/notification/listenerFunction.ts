import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import {firestore} from '../index';
import {fetchChannelMembers} from './sendbird';

export function initNotifiers() {
  // firebase function to trigger upon listing create in firestore
  const onNewListing = functions.firestore
      .document('listings/{listingId}')
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
      .onCreate(async (snap, context) => {
        const listingId = snap.id;
        const listingData = snap.data();
        const {channelUrl} = listingData;
        // A recursive function to get batch of users and send notifications to them
        const getAndSendNotifications = async (lastKey?: string) => {
          // Get a batch of usersIds from fetchChannelMembers function
          const {members, nextCursor} = await fetchChannelMembers(channelUrl, lastKey || undefined);
          // fetch the device tokens of the users from firestore based on the userIds fetched
          const userIds = members.map((member: {[p: string]: any}) => member.user_id);
          if (userIds.length === 0) {
            // eslint-disable-next-line no-console
            console.log('No users found');
            // doing nothing
          } else {
            const userTokens: any[] = [];
            // get the device tokens of the users from firestore based on the userIds fetched
            for (const userId of userIds) {
              // Get the user's device token
              const userRef = firestore.collection('profiles').doc(userId);
              // eslint-disable-next-line no-await-in-loop
              const userDoc = await userRef.get();
              const userToken = userDoc.data()?.deviceToken;
              // skip if the user does not have a device token or is maker of the listing
              if ( !userToken || userDoc.data()?.address === listingData.order.order.maker) {
                continue;
              }
              userTokens.push(userToken);
            }
            if (userTokens.length === 0) {
              // eslint-disable-next-line no-console
              console.log('No users tokens found');
              // doing nothing
              return;
            }

            // Create the message payload
            const payload = {
              notification: {
                title: 'Notification',
                body: `New listing created by ${listingData.order.order.maker} with id ${listingId} checkout now!`,
                sound: 'default',
              },
            };
            const options = {
              priority: 'high',
              timeToLive: 60 * 60 * 24,
            };
            await admin.messaging().sendToDevice(userTokens, payload, options);

            // if there are more users to fetch, call the function again
            if (nextCursor) {
              await getAndSendNotifications(nextCursor);
            }
          }
        };
        // call the recursive function
        await getAndSendNotifications();
      });

  // firebase function to trigger upon listing updated in firestore
  const onUpdatedListing = functions.firestore
      .document('listings/{listingId}')
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
      .onUpdate(async (change, context) => {
        // Get which fields changed
        const before = change.before.data();
        const after = change.after.data();
        const changedFields = Object.keys(before).filter((key) => before[key] !== after[key]);
        if (changedFields.includes('order')) {
          // check if child fields of order.order are changed
          const orderOrderChangedFields = Object.keys(before.order.order).filter((key) => before.order.order[key] !== after.order.order[key]);
          delete changedFields[changedFields.indexOf('order')];
          changedFields.push(...orderOrderChangedFields);
        }
        // if the changed fields are not the ones we are interested in, do nothing. interested fields are status and nested fields of order object in listing i.e: order.order.erc20TokenAmount
        if (!changedFields.includes('status') && !changedFields.includes('erc20TokenAmount')) {
          // eslint-disable-next-line no-console
          console.log('No changes in status or erc20TokenAmount instead changed fields are', changedFields);
          // eslint-disable-next-line no-console
          console.log('Doing nothing');
          return;
        }
        const listingId = change.after.id;
        const listingData = change.after.data();
        const {channelUrl} = listingData;
        // A recursive function to get batch of users and send notifications to them
        // eslint-disable-next-line complexity
        const getAndSendNotifications = async (lastKey?: string) => {
          // Get a batch of usersIds from fetchChannelMembers function
          const {members, nextCursor} = await fetchChannelMembers(channelUrl, lastKey || undefined);
          // fetch the device tokens of the users from firestore based on the userIds fetched
          const userIds = members.map((member:{[p: string]: any}) => member.user_id);
          if (userIds.length === 0) {
            // eslint-disable-next-line no-console
            console.log('No users found');
            // doing nothing
          } else {
            const userTokens: any[] = [];
            // get the device tokens of the users from firestore based on the userIds fetched
            for (const userId of userIds) {
              // Get the user's device token
              const userRef = firestore.collection('profiles').doc(userId);
              // eslint-disable-next-line no-await-in-loop
              const userDoc = await userRef.get();
              const userToken = userDoc.data()?.deviceToken;
              // skip if the user does not have a device token or is maker of the listing
              if ( !userToken || userDoc.data()?.address === listingData.order.order.maker) {
                continue;
              }
              userTokens.push(userToken);
            }
            if (userTokens.length === 0) {
              // eslint-disable-next-line no-console
              console.log('No users tokens found');
              // doing nothing
              return;
            }
            let message = `Listing with id ${listingId} updated, checkout now!`;

            // using switch case to check listing field updated and add message accordingly
            switch (changedFields[0]) { // assuming only one field will be updated at a time
              case 'status':
                message = `Listing with id ${listingId} status updated to ${listingData.status}`;
                if (listingData.status === 'sold') {
                  // Create the message payload
                  message = `Listing with id ${listingId} sold to ${listingData.order.order.taker}`;
                }
                break;
              case 'erc20TokenAmount':
                message = `Listing with id ${listingId} price updated to ${listingData.order.order.erc20TokenAmount}`;
                break;
              default:
                break;
            }
            // Create the message payload
            const payload = {
              notification: {
                title: 'Notification',
                body: message,
                sound: 'default',
              },
            };
            const options = {
              priority: 'high',
              timeToLive: 60 * 60 * 24,
            };
            await admin.messaging().sendToDevice(userTokens, payload, options);

            // if there are more users to fetch, call the function again
            if (nextCursor) {
              await getAndSendNotifications(nextCursor);
            }
          }
        };
        // call the recursive function
        await getAndSendNotifications();
      });
  return {
    onNewListing,
    onUpdatedListing,
  };
}

