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

        // ignore if bio or coverPicture is not changed
        if (dataBefore?.bio === dataAfter?.bio && dataBefore?.coverPicture === dataAfter?.coverPicture) return;
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
        user_id: channelId,
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
      const {listingId} = context.params;
      // Get the timestamp
      const timestamp = Date.now();
      // Get the data
      const dataAfter = change.after.data();

      const dataBefore = change.before.data();

      // check write event type onCreate OR onUpdate
      const eventType = dataBefore ? 'LISTING_UPDATED' : 'LISTING_CREATED';

      // TODO: need fields to check incase of update, skipping LISTING_UPDATED for now
      // ignore if event is not onCreate
      if (eventType === 'LISTING_UPDATED') return;

      // Log the event in Amplitude
      logEvent({
        user_id: listingId,
        event_type: eventType,
        time: timestamp,
        event_properties: {data: dataAfter},
      });
    });

export default {profileLogs, channelLogs, listingLogs};
