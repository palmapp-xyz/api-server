
import {addDocument, deleteDocument} from './controller';
import * as functions from 'firebase-functions';
import config from '../config';
import * as admin from 'firebase-admin';
import {NetworkType} from './utils';

export function initListeners() {
  if (!NetworkType[config.INDEXERS_NETWORK]) throw new Error('Invalid network type'); // networkType should enum of NetworkType

  // firebase function to trigger upon document create in firestore
  const onProfileCreate = functions.firestore
      .document('profiles/{profileId}')
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      .onCreate(async (snap, context) => {
        const data: admin.firestore.DocumentData = snap.data();
        const docId = snap.id;
        const doc = {
          ...data,
        };
        const indexName = config.INDEXERS_NETWORK === 'Mainnet' ? config.ELASTIC_SEARCH_PROFILE_INDEX_NAME_MAINNET : config.ELASTIC_SEARCH_PROFILE_INDEX_NAME_TESTNET;
        await addDocument(indexName, doc, docId);
      });
  // firebase function to trigger upone document update in firestore
  const onProfileUpdate = functions.firestore
      .document('profiles/{profileId}')
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      .onUpdate(async (change, context) => {
        const data: admin.firestore.DocumentData = change.after.data();
        const docId = change.after.id;
        const doc = {
          ...data,
        };
        const indexName = config.INDEXERS_NETWORK === 'Mainnet' ? config.ELASTIC_SEARCH_PROFILE_INDEX_NAME_MAINNET : config.ELASTIC_SEARCH_PROFILE_INDEX_NAME_TESTNET;
        await addDocument(indexName, doc, docId);
      });

  // firebase function to trigger upone document delete in firestore
  const onProfileDelete = functions.firestore
      .document('profiles/{profileId}')
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      .onDelete(async (snap, context) => {
        const docId = snap.id;
        const indexName = config.INDEXERS_NETWORK === 'Mainnet' ? config.ELASTIC_SEARCH_PROFILE_INDEX_NAME_MAINNET : config.ELASTIC_SEARCH_PROFILE_INDEX_NAME_TESTNET;
        await deleteDocument(indexName, docId);
      });

  // firebase function to trigger upon channel document create in firestore
  const onChannelCreate = functions.firestore
      .document('channels/{channelId}')
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      .onCreate(async (snap, context) => {
        const data = snap.data();
        const docId = snap.id;
        const doc = {
          ...data,
        };
        const indexName = config.INDEXERS_NETWORK === 'Mainnet' ? config.ELASTIC_SEARCH_CHANNEL_INDEX_NAME_MAINNET : config.ELASTIC_SEARCH_CHANNEL_INDEX_NAME_TESTNET;
        await addDocument(indexName, doc, docId);
      });

  // firebase function to trigger upon channel document update in firestore
  const onChannelUpdate = functions.firestore
      .document('channels/{channelId}')
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      .onUpdate(async (change, context) => {
        const data = change.after.data();
        const docId = change.after.id;
        const doc = {
          ...data,
        };
        const indexName = config.INDEXERS_NETWORK === 'Mainnet' ? config.ELASTIC_SEARCH_CHANNEL_INDEX_NAME_MAINNET : config.ELASTIC_SEARCH_CHANNEL_INDEX_NAME_TESTNET;
        await addDocument(indexName, doc, docId);
      });

  // firebase function to trigger upon channel document delete in firestore
  const onChannelDelete = functions.firestore
      .document('channels/{channelId}')
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      .onDelete(async (snap, context) => {
        const docId = snap.id;
        const indexName = config.INDEXERS_NETWORK === 'Mainnet' ? config.ELASTIC_SEARCH_CHANNEL_INDEX_NAME_MAINNET : config.ELASTIC_SEARCH_CHANNEL_INDEX_NAME_TESTNET;
        await deleteDocument(indexName, docId);
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
