import request from 'supertest';
import { app } from '../../src/index';
import * as amplitude from '@amplitude/analytics-node';

jest.mock('@amplitude/analytics-node');

describe('Analytics Router', () => {
  describe('POST /analytics/logEvent', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should return 200 and a success message when event is logged', async () => {
      const mockLogEvent = {
        profileId: '0x123...',
        eventType: 'TOKEN_TRANSFER',
        eventData: { token: '0x123...', amount: 100 },
      };
      const mockAmplitudeLogEvent = {
        user_id: mockLogEvent.profileId,
        event_type: mockLogEvent.eventType,
        time: expect.any(Number),
        event_properties: { data: mockLogEvent.eventData },
      }
      //   const mockLogEventController = jest.fn().mockResolvedValueOnce({ message: 'Event logged successfully' });

      //   analyticsRouter.post('/logEvent', mockLogEventController);

      const response = await request(app)
        .post('/analytics/logEvent')
        .send(mockLogEvent);

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ message: 'Event logged in Amplitude' });
      expect(amplitude.logEvent).toHaveBeenCalledWith(mockAmplitudeLogEvent);
    });

    it('should return 400 when profileId is missing', async () => {
      const mockLogEvent = {
        eventType: 'TOKEN_TRANSFER',
        eventData: { token: '0x123...', amount: 100 },
      };

      const response = await request(app)
        .post('/analytics/logEvent')
        .send(mockLogEvent);

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ message: 'profileId, eventType, eventData are required' });
    });

    it('should return 400 when eventType is missing', async () => {
      const mockLogEvent = {
        profileId: '0x123...',
        eventData: { token: '0x123...', amount: 100 },
      };

      const response = await request(app)
        .post('/analytics/logEvent')
        .send(mockLogEvent);

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ message: 'profileId, eventType, eventData are required' });
    });

    it('should return 400 when eventData is missing', async () => {
      const mockLogEvent = {
        profileId: '0x123...',
        eventType: 'TOKEN_TRANSFER',
      };

      const response = await request(app)
        .post('/analytics/logEvent')
        .send(mockLogEvent);

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ message: 'profileId, eventType, eventData are required' });
    });
  });

});