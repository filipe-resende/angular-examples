import { SourceInfo } from './sourceInfo';

interface LocationEventSourceApplicationInfo {
  middleware: string;
}

interface LocationEventDeviceInfo {
  sourceIdentificator: string;
  sourceIdentificatorType: string;
}

interface LocationEventGeographic {
  type: string;
  coordinates: number[];
}

interface LocationEventPosition {
  geographic: LocationEventGeographic;
}

interface LocationEventOperationalInfo {
  messageType: string;
  messageDetail: string;
  batteryState: string;
}

interface LocationEventSubmissionLocation {
  correlationId: string;
}

interface LocationEventThingInfo {
  name: string;
  sourceInfos: Array<SourceInfo>;
  type: string;
}

export interface LocationEventParsed {
  sourceApplicationId: string;
  sourceApplicationInfo: LocationEventSourceApplicationInfo;
  deviceInfo: LocationEventDeviceInfo;
  eventDateTime: string;
  position: LocationEventPosition;
  operationalInfo: LocationEventOperationalInfo;
  properties: any;
  submissionLocation: LocationEventSubmissionLocation;
  thingInfo?: LocationEventThingInfo;
  companyInfo?: {
    name: string;
    sourceInfos: Array<SourceInfo>;
  };
}
