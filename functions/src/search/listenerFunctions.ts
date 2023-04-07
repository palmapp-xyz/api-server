
import {addDocuments, deleteDocuments, updateDocuments} from './controller';
import * as functions from 'firebase-functions';
import config from '../config';
import * as admin from 'firebase-admin';

export function initListeners() {
  // firebase function to trigger upon document create in firestore

  const onProfileCreate = functions.firestore
      .document('profiles/{profileId}')
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      .onCreate(async (snap, context) => {
        const data: admin.firestore.DocumentData = snap.data();
        const docId = snap.id;
        const doc = {
          id: docId,
          ...data,
        };
        await addDocuments(config.ELASTIC_APP_SEARCH_PROFILE_ENGINE_NAME, [doc]);
      });
  // firebase function to trigger upone document update in firestore
  const onProfileUpdate = functions.firestore
      .document('profiles/{profileId}')
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      .onUpdate(async (change, context) => {
        const data: admin.firestore.DocumentData = change.after.data();
        const docId = change.after.id;
        const doc = {
          id: docId,
          ...data,
        };
        await updateDocuments(config.ELASTIC_APP_SEARCH_PROFILE_ENGINE_NAME, [doc]);
      });

  // firebase function to trigger upone document delete in firestore
  const onProfileDelete = functions.firestore
      .document('profiles/{profileId}')
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      .onDelete(async (snap, context) => {
        const docId = snap.id;
        await deleteDocuments(config.ELASTIC_APP_SEARCH_PROFILE_ENGINE_NAME, [docId]);
      });

  // firebase function to trigger upon channel document create in firestore
  const onChannelCreate = functions.firestore
      .document('channels/{channelId}')
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      .onCreate(async (snap, context) => {
        const data = snap.data();
        const docId = snap.id;
        const doc = {
          id: docId,
          ...data,
        };
        await addDocuments(config.ELASTIC_APP_SEARCH_CHANNEL_ENGINE_NAME, [doc]);
      });

  // firebase function to trigger upon channel document update in firestore
  const onChannelUpdate = functions.firestore
      .document('channels/{channelId}')
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      .onUpdate(async (change, context) => {
        const data = change.after.data();
        const docId = change.after.id;
        const doc = {
          id: docId,
          ...data,
        };
        await updateDocuments(config.ELASTIC_APP_SEARCH_CHANNEL_ENGINE_NAME, [doc]);
      });

  // firebase function to trigger upon channel document delete in firestore
  const onChannelDelete = functions.firestore
      .document('channels/{channelId}')
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      .onDelete(async (snap, context) => {
        const docId = snap.id;
        await deleteDocuments(config.ELASTIC_APP_SEARCH_CHANNEL_ENGINE_NAME, [docId]);
      });
  return {
    onProfileCreate,
    onProfileUpdate,
    onProfileDelete,
    onChannelCreate,
    onChannelUpdate,
    onChannelDelete,
  };
}
