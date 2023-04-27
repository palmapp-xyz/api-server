import request from 'supertest';
import { analyticsRouter } from '../../src/analytics/router';
import amplitude from '@amplitude/analytics-node';

describe('Analytics Router', () => {
  describe('POST /analytics/logEvent', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    jest.mock('@amplitude/analytics-node');

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

      const response = await request(analyticsRouter)
        .post('/logEvent')
        .send(mockLogEvent);

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ message: 'Event logged successfully' });
      expect(amplitude.logEvent).toHaveBeenCalledWith(mockAmplitudeLogEvent);
    });

    it('should return 400 when profileId is missing', async () => {
      const mockLogEvent = {
        eventType: 'TOKEN_TRANSFER',
        eventData: { token: '0x123...', amount: 100 },
      };

      const response = await request(analyticsRouter)
        .post('/logEvent')
        .send(mockLogEvent);

      expect(response.status).toBe(400);
    });

    it('should return 400 when eventType is missing', async () => {
      const mockLogEvent = {
        profileId: '0x123...',
        eventData: { token: '0x123...', amount: 100 },
      };

      const response = await request(analyticsRouter)
        .post('/logEvent')
        .send(mockLogEvent);

      expect(response.status).toBe(400);
    });

    it('should return 400 when eventData is missing', async () => {
      const mockLogEvent = {
        profileId: '0x123...',
        eventType: 'TOKEN_TRANSFER',
      };

      const response = await request(analyticsRouter)
        .post('/logEvent')
        .send(mockLogEvent);

      expect(response.status).toBe(400);
    });

    it('should return 500 when logEventController throws an error', async () => {
      const mockLogEvent = {
        profileId: '0x123...',
        eventType: 'TOKEN_TRANSFER',
        eventData: { token: '0x123...', amount: 100 },
      };
      const mockError = new Error('Something went wrong');
      const mockLogEventController = jest.fn().mockRejectedValueOnce(mockError);

      analyticsRouter.post('/logEvent', mockLogEventController);

      const response = await request(analyticsRouter)
        .post('/logEvent')
        .send(mockLogEvent);

      expect(response.status).toBe(500);
      expect(mockLogEventController).toHaveBeenCalledWith(mockLogEvent);
    });
  });
});