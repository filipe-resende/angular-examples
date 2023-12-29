export interface DeviceLoadHistory {
  id: string;
  loadType: number;
  applicationId: string;
  groupName: string;
  sapPlant: string;
  calledCode: string;
  uploadDate: Date;
  numberOfLoadedDevices: number;
  numberOfDevicesWithError: number;
  chargeStatus: boolean;
  uploadFileName: string;
  emailUserUploadedFile: string;
  invoiceProvider: string;
  invoiceVale: string;
  moveDate: Date;
  managerGroup: string;
  managementId: string;
}
