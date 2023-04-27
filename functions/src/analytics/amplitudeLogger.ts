import * as functions from 'firebase-functions';
import {init, logEvent} from '@amplitude/analytics-node';
import config from '../config';
// Initialize Amplitude SDK
init(config.AMPLITUDE_API_KEY);


// Listen for /profiles events
const profileLogs = functions.firestore
    .document('profiles/{profileId}')
    .onWrite((change, context) => {
    // Get the document ID
      const {profileId} = context.params;
      // Get the timestamp
      const timestamp = Date.now();
      // Get the data
      const dataAfter = change.after.data();

      const dataBefore = change.before.data();

      // check write event type onCreate OR onUpdate
      const eventType = dataBefore ? 'PROFILE_UPDATED' : 'PROFILE_CREATED';

      if (eventType === 'PROFILE_UPDATED') {
        // ignore if event is onDelete
        if (!dataAfter) return;

        // ignore if bio or profileImage is not changed
        if (dataBefore?.bio === dataAfter?.bio && dataBefore?.profileImage === dataAfter?.profileImage) return;
      }

      // Log the event in Amplitude
      logEvent({
        user_id: profileId,
        event_type: eventType,
        time: timestamp,
        event_properties: {data: dataAfter},
      });
    });

// Listen for /channel events
const channelLogs = functions.firestore
    .document('channels/{channelId}')
    .onWrite((change, context) => {
      // Get the document ID
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const {channelId} = context.params;
      // Get the timestamp
      const timestamp = Date.now();
      // Get the data
      const dataAfter = change.after.data();

      const dataBefore = change.before.data();

      // check write event type onCreate OR onUpdate
      const eventType = dataBefore ? 'CHANNEL_UPDATED' : 'CHANNEL_CREATED';

      if (eventType === 'CHANNEL_UPDATED') {
        // ignore if event is onDelete
        if (!dataAfter) return;

        // ignore if token gatting is not changed
        if (dataBefore?.tokenGatting === dataAfter?.tokenGatting) return;
      }

      // Log the event in Amplitude
      logEvent({
        user_id: dataAfter?.profileId, // assuming we have profileId of channel creator in channel document
        event_type: eventType,
        time: timestamp,
        event_properties: {data: dataAfter},
      });
    });

// Listen for /channel events
const listingLogs = functions.firestore
    .document('listings/{listingId}')
    .onWrite((change, context) => {
      // Get the document ID
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const {listingId} = context.params;
      // Get the timestamp
      const timestamp = Date.now();
      // Get the data
      const dataAfter = change.after.data();

      const dataBefore = change.before.data();

      // check write event type onCreate OR onUpdate
      const eventType = dataBefore ? 'LISTING_UPDATED' : 'LISTING_CREATED';

      if (eventType === 'LISTING_UPDATED') {
        // ignore if event is onDelete
        if (!dataAfter) return;

        // ignore if status is not changed
        if (dataBefore?.status === dataAfter?.status) return;
      }

      // Log the event in Amplitude
      logEvent({
        user_id: dataAfter?.profileId, // assuming profileId is present in listing
        event_type: eventType,
        time: timestamp,
        event_properties: {data: dataAfter},
      });
    });

export default {profileLogs, channelLogs, listingLogs};
