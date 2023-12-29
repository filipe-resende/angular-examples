import { BusTripConstants } from '../../../core/constants/bus-trip.const';
import { EventDirection } from '../../../core/constants/event-directions';
import { EventType, EventTypeLabels } from '../../../core/constants/event-type';
import { Middlewares } from '../../../core/constants/middleware.const';
import { SaloboDeviceGroups } from '../../../core/constants/salobo-device-groups.enum';
import { Thing } from '../../models/thing';

export const isBusIntegrationEvent = (eventType: string): boolean => {
  return eventType === BusTripConstants.EventType;
};

export const isSecurityCenterEvent = (middleware: string): boolean => {
  return (
    middleware != null &&
    (middleware === Middlewares.SecurityCenter ||
      middleware === Middlewares.SecurityCenter.split(' ').join(''))
  );
};

export const isExitingEvent = (eventDirection: string): boolean => {
  return eventDirection === EventDirection.Exit;
};

export const isEntranceEvent = (eventDirection: string): boolean => {
  return eventDirection === EventDirection.Entrance;
};

export const isAuthorizedEntrance = (thing: Thing): boolean => {
  return (
    thing.eventType === EventType.AccessGranted &&
    isEntranceEvent(thing.eventDirection)
  );
};

export const isDeniedEntrance = (thing: Thing): boolean => {
  return (
    thing.eventType === EventType.AccessDenied &&
    isEntranceEvent(thing.eventDirection)
  );
};

export const isAuthorizedExit = (thing: Thing): boolean => {
  return (
    thing.eventType === EventType.AccessGranted &&
    isExitingEvent(thing.eventDirection)
  );
};

export const isDeniedExit = (thing: Thing): boolean => {
  return (
    thing.eventType === EventType.AccessDenied &&
    isExitingEvent(thing.eventDirection)
  );
};

export const getSecurityCenterTypeAccess = (thing: any): string => {
  if (thing != null) {
    if (isDeniedEntrance(thing)) {
      return EventTypeLabels.DeniedEntrance;
    }

    if (isDeniedExit(thing)) {
      return EventTypeLabels.DeniedExit;
    }

    if (isAuthorizedEntrance(thing)) {
      return EventTypeLabels.AuthorizedEntrance;
    }

    if (isAuthorizedExit(thing)) {
      return EventTypeLabels.AuthorizedExit;
    }
  }
  return null;
};

export const getTypeAccess = (thing: any): string => {
  if (thing != null) {
    if (
      isSecurityCenterEvent(thing.middleware) ||
      isSecurityCenterEvent(thing.deviceType)
    ) {
      return getSecurityCenterTypeAccess(thing);
    }

    if (isBusIntegrationEvent(thing.eventType)) {
      if (isExitingEvent(thing.eventDirection)) {
        return EventTypeLabels.BusExit;
      }

      if (!isExitingEvent(thing.eventDirection)) {
        return EventTypeLabels.BusEntrance;
      }
    }
  }
  return null;
};

export const getSpotGroupName = (deviceGroupName: string): string => {
  if (deviceGroupName === SaloboDeviceGroups.Fixed) return 'SLB I+II';
  if (deviceGroupName === SaloboDeviceGroups.SLBIII) return 'SLB III';
  return null;
};

export const isBusMiddleware = (middleware: string): boolean => {
  return (
    middleware === Middlewares.BusEventAdapter ||
    middleware.split(' ')[0] === 'Ônibus'
  );
};

export const isFacialMiddleware = (middleware: string): boolean => {
  return middleware === Middlewares.FacialRecognitionAdapter;
};

export const refactoryDeviceName = (deviceType: string): string => {
  switch (deviceType) {
    case Middlewares.FacialRecognitionAdapter:
      return 'Reconhec. Facial';
    case Middlewares.PortableBadgeReader:
      return 'Portable Badge';
    default:
      return deviceType;
  }
};

export const isSpotMiddleware = (middleware: string): boolean => {
  return (
    middleware === Middlewares.Spot ||
    middleware === Middlewares.SpotIntegrator ||
    middleware.split(' ')[0] === Middlewares.Spot
  );
};

export const isSmartBadgeOrMaxTrackMiddleware = (
  middleware: string
): boolean => {
  return (
    middleware === Middlewares.SmartBadge || middleware === Middlewares.MaxTrack
  );
};

export const isPortableBadgeMiddleware = (middleware: string): boolean => {
  return (
    middleware === Middlewares.PortableBadgeReader ||
    middleware === Middlewares.PortableBadgeReaderIot ||
    middleware === Middlewares.PortableBadgeReaderAlutel
  );
};
