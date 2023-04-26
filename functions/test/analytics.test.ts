import functionsTest from 'firebase-functions-test';
import * as amplitude from '@amplitude/analytics-node';
import loggers from '../src/analytics/amplitudeLogger';
import { firebaseConfig } from 'firebase-functions/v1';
const {profileLogs, channelLogs, listingLogs} = loggers;

const testEnv = functionsTest({
    projectId: 'test-project',
    databaseURL: 'http://localhost:8020',
    storageBucket: 'test-project.appspot.com',
});

jest.mock('@amplitude/analytics-node');

describe('Firestore triggers', () => {
  afterEach(() => {
    testEnv.cleanup();
    jest.clearAllMocks();
  });

  // Test cases for profileLogs
  describe('profileLogs', () => {
    it('should trigger PROFILE_CREATED event', async () => {
      const beforeSnapshot = testEnv.firestore.makeDocumentSnapshot({}, 'profiles/1');
      const afterSnapshot = testEnv.firestore.makeDocumentSnapshot(
        { bio: 'New bio', coverPicture: 'new-cover.jpg' },
        'profiles/1'
      );
      const change = testEnv.makeChange(beforeSnapshot, afterSnapshot);
      const wrappedFunction = testEnv.wrap(profileLogs);
      await wrappedFunction(change, { params: { profileId: '1' } });

      expect(amplitude.logEvent).toHaveBeenCalledWith({
        user_id: '1',
        event_type: 'PROFILE_CREATED',
        time: expect.any(Number),
        event_properties: { data: { bio: 'New bio', coverPicture: 'new-cover.jpg' } },
      });
    });

    it('should trigger PROFILE_UPDATED event', async () => {
      const beforeSnapshot = testEnv.firestore.makeDocumentSnapshot(
        { bio: 'Old bio1', coverPicture: 'old-cover.jpg' },
        'profiles/1'
      );
      const afterSnapshot = testEnv.firestore.makeDocumentSnapshot(
        { bio: 'New bio2', coverPicture: 'new-cover.jpg' },
        'profiles/1'
      );
      const change = testEnv.makeChange(beforeSnapshot, afterSnapshot);
      const wrappedFunction = testEnv.wrap(profileLogs);
      await wrappedFunction(change, { params: { profileId: '1' } });

      expect(amplitude.logEvent).toHaveBeenCalledWith({
        user_id: '1',
        event_type: 'PROFILE_UPDATED',
        time: expect.any(Number),
        event_properties: { data: { bio: 'New bio2', coverPicture: 'new-cover.jpg' } },
      });
    });

    it('should not trigger any event if the bio and coverPicture are not changed', async () => {
      const beforeSnapshot = testEnv.firestore.makeDocumentSnapshot(
        { bio: 'Old bio3', coverPicture: 'old-cover.jpg' },
        'profiles/1'
      );
      const afterSnapshot = testEnv.firestore.makeDocumentSnapshot(
        { bio: 'Old bio3', coverPicture: 'old-cover.jpg' },
        'profiles/1'
      );
      const change = testEnv.makeChange(beforeSnapshot, afterSnapshot);
      const wrappedFunction = testEnv.wrap(profileLogs);
      await wrappedFunction(change, { params: { profileId: '1' } });

      expect(amplitude.logEvent).not.toHaveBeenCalled();
    });
  });

  // test cases for channelLogs
  describe('channelLogs', () => {
    const channelId = 'testChannelId';
  
    const beforeData = {
      tokenGatting: 'token1',
    };
  
    const afterData = {
      tokenGatting: 'token2',
    };
  
    it('should call amplitude.logEvent with CHANNEL_CREATED on document creation', async () => {
      const wrapped = testEnv.wrap(channelLogs);

      const beforeSnapshot = testEnv.firestore.makeDocumentSnapshot({}, `channels/${channelId}`);
        const afterSnapshot = testEnv.firestore.makeDocumentSnapshot(afterData, `channels/${channelId}`);
  
      const change = testEnv.makeChange(beforeSnapshot, afterSnapshot);
      const context = {params: {channelId}};
  
      await wrapped(change, context);
  
      expect(amplitude.logEvent).toHaveBeenCalledWith({
        user_id: channelId,
        event_type: 'CHANNEL_CREATED',
        time: expect.any(Number),
        event_properties: {data: afterData},
      });
    });
  
    it('should call amplitude.logEvent with CHANNEL_UPDATED on document update when tokenGatting changes', async () => {
      const wrapped = testEnv.wrap(channelLogs);

      const beforeSnapshot = testEnv.firestore.makeDocumentSnapshot(beforeData, `channels/${channelId}`);
      const afterSnapshot = testEnv.firestore.makeDocumentSnapshot(afterData, `channels/${channelId}`);
  
      const change = testEnv.makeChange(beforeSnapshot, afterSnapshot);
      const context = {params: {channelId}};
  
      await wrapped(change, context);
  
      expect(amplitude.logEvent).toHaveBeenCalledWith({
        user_id: channelId,
        event_type: 'CHANNEL_UPDATED',
        time: expect.any(Number),
        event_properties: {data: afterData},
      });
    });
  
    it('should not call amplitude.logEvent on document update when tokenGatting does not change', async () => {
      const wrapped = testEnv.wrap(channelLogs);

      const beforeSnapshot = testEnv.firestore.makeDocumentSnapshot(beforeData, `channels/${channelId}`);
      const afterSnapshot = testEnv.firestore.makeDocumentSnapshot(beforeData, `channels/${channelId}`);
  
      const change = testEnv.makeChange(beforeSnapshot, afterSnapshot);
      const context = {params: {channelId}};
  
      await wrapped(change, context);
  
      expect(amplitude.logEvent).not.toHaveBeenCalled();
    });
  
    it('should not call amplitude.logEvent on document deletion', async () => {
      const wrapped = testEnv.wrap(channelLogs);

      const beforeSnapshot = testEnv.firestore.makeDocumentSnapshot(beforeData, `channels/${channelId}`);
      const afterSnapshot = testEnv.firestore.makeDocumentSnapshot({}, `channels/${channelId}`);
  
      const change = testEnv.makeChange(beforeSnapshot, afterSnapshot);
      const context = {params: {channelId}};
  
      await wrapped(change, context);
  
      expect(amplitude.logEvent).not.toHaveBeenCalled();
    });
  });

  // test cases for listingLogs
  describe('listingLogs', () => {
    const listingId = 'testListingId';
  
    const afterData = {
      someProperty: 'newValue',
    };
    const beforeData = {
        someProperty: 'oldValue',
    };
  
    const context = {
      params: {
        listingId,
      },
    };
  
    it('should call amplitude.logEvent with LISTING_CREATED on document creation', async () => {
      const wrapped = testEnv.wrap(listingLogs);

      const beforeSnapshot = testEnv.firestore.makeDocumentSnapshot({}, `listings/${listingId}`);
      const afterSnapshot = testEnv.firestore.makeDocumentSnapshot(afterData, `listings/${listingId}`);
  
      const change = testEnv.makeChange(beforeSnapshot, afterSnapshot);
  
      await wrapped(change, context);
  
      expect(amplitude.logEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          user_id: listingId,
          event_type: 'LISTING_CREATED',
          time: expect.any(Number),
          event_properties: { data: afterData },
        })
      );
    });
  
    it('should not call amplitude.logEvent on document update', async () => {
      const wrapped = testEnv.wrap(listingLogs);
  
      const beforeSnapshot = testEnv.firestore.makeDocumentSnapshot(beforeData, `listings/${listingId}`);
      const afterSnapshot = testEnv.firestore.makeDocumentSnapshot(afterData, `listings/${listingId}`);

      const change = testEnv.makeChange(afterSnapshot, beforeSnapshot);
  
      await wrapped(change, context);
  
      expect(amplitude.logEvent).not.toHaveBeenCalled();
    });
  
    it('should not call amplitude.logEvent on document deletion', async () => {
      const wrapped = testEnv.wrap(listingLogs);
  
      const beforeSnapshot = testEnv.firestore.makeDocumentSnapshot(beforeData, `listings/${listingId}`);
      const afterSnapshot = testEnv.firestore.makeDocumentSnapshot({}, `listings/${listingId}`);

      const change = testEnv.makeChange(beforeSnapshot, afterSnapshot);
  
      await wrapped(change, context);
  
      expect(amplitude.logEvent).not.toHaveBeenCalled();
    });
  });
  
  
});
