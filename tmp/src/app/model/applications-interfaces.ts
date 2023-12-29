export interface ApplicationItem {
  id?: string;
  name: string;
  description: string;
  createdAt?: string;
  updatedAt?: string;
  status?: boolean;
  allowDeviceAssociation: boolean;
  allowInclusionDeviceGroup: boolean;
  showInDeviceTypesList: boolean;
}
export interface ApplicationRequest {
  name: string;
  description: string;
  status?: boolean;
  allowDeviceAssociation: boolean;
  allowInclusionDeviceGroup: boolean;
  showInDeviceTypesList: boolean;
}
export interface Applications {
  skip: number;
  count: number;
  applications: ApplicationItem[];
  totalCount: number;
}

export interface ApplicationToBeCreated {
  name: string;
  description: string;
}

// TODO: substituir Applications pela interface abaixo
export interface ApplicationsListResponse {
  applications: ApplicationItem[];
  totalCount: number;
  skip?: number;
  count?: number;
}

export interface ApplicationDevicesAssociationSummary{
  totalCount: number;
  associatedDevicesCount: number;
  disassociatedDevicesCount: number;
}
