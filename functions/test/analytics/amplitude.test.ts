import functionsTest from 'firebase-functions-test';
import * as amplitude from '@amplitude/analytics-node';
import loggers from '../../src/analytics/amplitudeLogger';
const {profileLogs, channelLogs, listingLogs} = loggers;

const testEnv = functionsTest({
    projectId: 'test-project',
    databaseURL: 'http://localhost:8020',
    storageBucket: 'test-project.appspot.com',
});

jest.mock('@amplitude/analytics-node');
jest.mock('express');

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
        { bio: 'New bio', profileImage: 'new-cover.jpg' },
        'profiles/1'
      );
      const change = testEnv.makeChange(beforeSnapshot, afterSnapshot);
      const wrappedFunction = testEnv.wrap(profileLogs);
      await wrappedFunction(change, { params: { profileId: '1' } });

      expect(amplitude.logEvent).toHaveBeenCalledWith({
        user_id: '1',
        event_type: 'PROFILE_CREATED',
        time: expect.any(Number),
        event_properties: { data: { bio: 'New bio', profileImage: 'new-cover.jpg' } },
      });
    });

    it('should trigger PROFILE_UPDATED event', async () => {
      const beforeSnapshot = testEnv.firestore.makeDocumentSnapshot(
        { bio: 'Old bio1', profileImage: 'old-cover.jpg' },
        'profiles/1'
      );
      const afterSnapshot = testEnv.firestore.makeDocumentSnapshot(
        { bio: 'New bio2', profileImage: 'new-cover.jpg' },
        'profiles/1'
      );
      const change = testEnv.makeChange(beforeSnapshot, afterSnapshot);
      const wrappedFunction = testEnv.wrap(profileLogs);
      await wrappedFunction(change, { params: { profileId: '1' } });

      expect(amplitude.logEvent).toHaveBeenCalledWith({
        user_id: '1',
        event_type: 'PROFILE_UPDATED',
        time: expect.any(Number),
        event_properties: { data: { bio: 'New bio2', profileImage: 'new-cover.jpg' } },
      });
    });

    it('should not trigger any event if the bio and profileImage are not changed', async () => {
      const beforeSnapshot = testEnv.firestore.makeDocumentSnapshot(
        { bio: 'Old bio3', profileImage: 'old-cover.jpg' },
        'profiles/1'
      );
      const afterSnapshot = testEnv.firestore.makeDocumentSnapshot(
        { bio: 'Old bio3', profileImage: 'old-cover.jpg' },
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
      profileId: 'testProfileId',
    };
  
    const afterData = {
      tokenGatting: 'token2',
      profileId: 'testProfileId',
    };
  
    it('should call amplitude.logEvent with CHANNEL_CREATED on document creation', async () => {
      const wrapped = testEnv.wrap(channelLogs);

      const beforeSnapshot = testEnv.firestore.makeDocumentSnapshot({}, `channels/${channelId}`);
        const afterSnapshot = testEnv.firestore.makeDocumentSnapshot(afterData, `channels/${channelId}`);
  
      const change = testEnv.makeChange(beforeSnapshot, afterSnapshot);
      const context = {params: {channelId}};
  
      await wrapped(change, context);
  
      expect(amplitude.logEvent).toHaveBeenCalledWith({
        user_id: afterData.profileId,
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
        user_id: afterData.profileId,
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
      profileId: 'testProfileId',
      status: 'filled',
    };
    const beforeData = {
        someProperty: 'oldValue',
        profileId: 'testProfileId',
        status: 'open',
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
          user_id: afterData.profileId,
          event_type: 'LISTING_CREATED',
          time: expect.any(Number),
          event_properties: { data: afterData },
        })
      );
    });
  
    it('should call amplitude.logEvent on document status update', async () => {
      const wrapped = testEnv.wrap(listingLogs);
  
      const beforeSnapshot = testEnv.firestore.makeDocumentSnapshot(beforeData, `listings/${listingId}`);
      const afterSnapshot = testEnv.firestore.makeDocumentSnapshot(afterData, `listings/${listingId}`);

      const change = testEnv.makeChange(beforeSnapshot, afterSnapshot);
  
      await wrapped(change, context);
  
      expect(amplitude.logEvent).toHaveBeenCalledWith(
        expect.objectContaining({
            user_id: afterData.profileId,
            event_type: 'LISTING_UPDATED',
            time: expect.any(Number),
            event_properties: { data: afterData },
          })
      );
    });
  
    it('should not call amplitude.logEvent on document when status remained unchanged', async () => {
      const wrapped = testEnv.wrap(listingLogs);
  
      const beforeSnapshot = testEnv.firestore.makeDocumentSnapshot(beforeData, `listings/${listingId}`);
      afterData.status = 'open';
      const afterSnapshot = testEnv.firestore.makeDocumentSnapshot(afterData, `listings/${listingId}`);

      const change = testEnv.makeChange(beforeSnapshot, afterSnapshot);
  
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
