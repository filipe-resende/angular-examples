import {
  isBusIntegrationEvent,
  isExitingEvent
} from './location-events-helpers';

describe('isBusIntegrationEvent', () => {
  it('should return true when event is of type bus trip tracker integration event', () => {
    const eventType = 'BusTripTrackerEvent';
    const result = isBusIntegrationEvent(eventType);
    expect(result).toBe(true);
  });

  it('should return false when event is not of type bus trip tracker integration event', () => {
    const eventType = '';
    const result = isBusIntegrationEvent(eventType);
    expect(result).toBe(false);
  });
});

describe('isExitingEvent', () => {
  it('should return true when event direction is exiting', () => {
    const eventDirection = 'S';
    const result = isExitingEvent(eventDirection);
    expect(result).toBe(true);
  });

  it('should return false when event direction is not exiting', () => {
    const eventDirection = 'E';
    const result = isExitingEvent(eventDirection);
    expect(result).toBe(false);
  });
});
