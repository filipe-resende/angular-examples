import { DeviceLoadHistory } from './device-load-history-interface';

export interface DeviceLoadHistoryResponse {
  skip: number;
  count: number;
  totalCount: number;
  devicesLoadHistory: DeviceLoadHistory[];
}
