import { StatusLoadEnum } from '../enums/statusLoad.enums';

export interface MovementHistoryListResponse {
  moveDate: Date;
  calledCode: string;
  statusLoad: StatusLoadEnum;
}
