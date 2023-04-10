import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import {firestore} from '../index';

export function initListener() {
  // firebase function to trigger upon document create in firestore
  const sendNotification = functions.firestore
      .document('notifications/{notificationId}')
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
      .onCreate(async (snap, context) => {
        const messageId = snap.id;
        const messageData = snap.data();
        const {userIds} = messageData;
        if (userIds.length === 0) {
        // deleting the notification document from the collection and returning
          await admin.firestore().collection('notifications').doc(messageId).delete();
          return;
        }
        const userTokens: any[] = [];
        for (const userId of userIds) {
        // Get the user's device token
          const userRef = firestore.collection('profiles').doc(userId);
          // eslint-disable-next-line no-await-in-loop
          const userDoc = await userRef.get();
          const userToken = userDoc.data()?.deviceToken;
          userTokens.push(userToken);
        }
        if (userTokens.length === 0) {
        // deleting the notification document from the collection and returning
          await admin.firestore().collection('notifications').doc(messageId).delete();
          return;
        }

        // Create the message payload
        const payload = {
          notification: {
            title: 'Notification',
            body: messageData.message,
            sound: 'default',
          },
        };
        const options = {
          priority: 'high',
          timeToLive: 60 * 60 * 24,
        };
        await admin.messaging().sendToDevice(userTokens, payload, options);
        // deleting the notification document from the collection
        await admin.firestore().collection('notifications').doc(messageId).delete();
      } );
  return [
    sendNotification,
  ];
}
