export interface AssociatedDevices {
  id: number;
  name: string;
  device: {
    id: string;
    name: string;
    description: string;
    applicationId: string;
  };
}
