export interface ActiveNotTransmittingDevices {
  managementId: string;
  sapPlantId: string;
  deviceManagerId: string;
  label: string;
  activeCount: number;
  notTransmittingCount: number;
  notTransmittingPercentage: string;
}
