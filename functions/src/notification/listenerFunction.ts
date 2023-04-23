import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import {firestore} from '../index';
import {DeviceToken, getMembersUserTokens} from './sendbird';
import {QueryDocumentSnapshot} from 'firebase-admin/firestore';
import {Listing} from './listing';

export function initNotifiers() {
  const onListingCreated = functions.firestore
      .document('listings/{listingId}')
      .onCreate(async (snapshot: QueryDocumentSnapshot) => {
        const listingId = snapshot.id;
        const listing = snapshot.data() as Listing;
        const {channelUrl, order} = listing;
        if (!channelUrl) return;

        const deviceTokens: Record<string, DeviceToken> = await getMembersUserTokens(
            {}, channelUrl, [order.order.maker, order.order.taker]);


        // sending notification to all userTokens in batches of 500
        const payload: admin.messaging.MessagingPayload = {
          notification: {
            title: 'Listing created',
            body: `New listing created by ${listing.order.order.maker} with id ${listingId}. Checkout now!`,
            sound: 'default',
          },
          data: {
            listing: JSON.stringify(listing),
          },
        };

        // store the notification in firestore, with empty read users list
        const initialReadStatus = Object.fromEntries(Object.keys(deviceTokens).map((userId) => [userId, false]));
        // store the notification in firestore, with empty read users list
        const added = await firestore.collection('notifications').add({...payload, readStatus: initialReadStatus});
        payload.data = {...payload.data, notificationId: added.id};

        const options = {
          priority: 'high',
          timeToLive: 60 * 60 * 24,
        };
        // sending notification in batches of 500
        const batch = 500;
        let chunks;
        if (Object.keys(deviceTokens).length > batch) {
          chunks = Math.ceil(Object.keys(deviceTokens).length / batch);
        } else {
          chunks = 1;
        }
        for (let i = 0; i < chunks; i++) {
          const chunk = Object.values(deviceTokens).slice(i * batch, (i + 1) * batch);
          // eslint-disable-next-line no-await-in-loop
          const result: admin.messaging.MessagingDevicesResponse = await admin.messaging().sendToDevice(
              chunk.flatMap((deviceToken: DeviceToken) => deviceToken.apns.concat(deviceToken.fcm)),
              payload,
              options
          );
          functions.logger.log(`onListingCreated notifications: ${result}`);
        }
      });

  const onListingUpdated = functions.firestore
      .document('listings/{listingId}')
      .onUpdate(async (change: functions.Change<QueryDocumentSnapshot>) => {
        const before = change.before.data() as Listing;
        const after = change.after.data() as Listing;
        const {status: beforeStatus, order: beforeOrder} = before;
        const {channelUrl, status: afterStatus, order: afterOrder} = after;
        if (!channelUrl) return;

        const deviceTokens: Record<string, DeviceToken> = await getMembersUserTokens(
            {}, channelUrl, [afterOrder.order.maker, afterOrder.order.taker]);

        const listingId = change.after.id;
        let message = `Listing with id ${listingId} updated, checkout now!`;

        // using switch case to check listing field updated and add message accordingly
        if (beforeStatus !== afterStatus) {
          message = `Listing with id ${listingId} status updated to ${afterStatus}`;
        } else if (beforeOrder.erc20TokenAmount !== afterOrder.erc20TokenAmount) {
          message = `Listing with id ${listingId} price updated to ${afterOrder.erc20TokenAmount} ETH`;
        }

        // sending notification to all userTokens in batches of 500
        const payload: admin.messaging.MessagingPayload = {
          notification: {
            title: 'Listing updated',
            body: message,
            sound: 'default',
          },
          data: {
            before: JSON.stringify(before),
            after: JSON.stringify(after),
          },
        };

        const initialReadStatus = Object.fromEntries(Object.keys(deviceTokens).map((userId) => [userId, false]));
        // store the notification in firestore, with empty read users list
        const added = await firestore.collection('notifications').add({...payload, readStatus: initialReadStatus});
        payload.data = {...payload.data, notificationId: added.id};

        const options = {
          priority: 'high',
          timeToLive: 60 * 60 * 24,
        };
        // sending notification in batches of 500
        const batch = 500;
        let chunks;
        if (Object.keys(deviceTokens).length > batch) {
          chunks = Math.ceil(Object.keys(deviceTokens).length / batch);
        } else {
          chunks = 1;
        }
        for (let i = 0; i < chunks; i++) {
          const chunk = Object.values(deviceTokens).slice(i * batch, (i + 1) * batch);
          // eslint-disable-next-line no-await-in-loop
          const result: admin.messaging.MessagingDevicesResponse = await admin.messaging().sendToDevice(
              chunk.flatMap((deviceToken: DeviceToken) => deviceToken.apns.concat(deviceToken.fcm)),
              payload,
              options
          );
          functions.logger.log(`onListingUpdated notifications: ${result}`);
        }
      });

  return {
    onListingCreated,
    onListingUpdated,
  };
}

