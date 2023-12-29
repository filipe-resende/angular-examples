export interface DeviceLoadHistoryRequest {
  loadType: number;
  applicationId: string;
  groupName: string;
  sapPlant: string;
  calledCode: string;
  uploadFirstDate: Date;
  uploadEndDate: Date;
  invoiceProvider: string;
  invoiceVale: string;
  moveDate: Date;
  managerGroup: string;
}
