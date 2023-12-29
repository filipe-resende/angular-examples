import { RelationType } from '../shared/enums/relationType.enums';
import { DeviceItem } from './devices-interfaces';

export interface AssociatedDevice {
  associationDate: string;
  device: DeviceItem;
  disassociationDate: string;
  ide: number;
}

export interface SourceInfos {
  type: string;
  value: string;
}

export interface CompanyInfo {
  companyName: string;
  relationType: string;
}

export interface ThingItem {
  associatedDevices?: AssociatedDevice[];
  companyInfo?: CompanyInfo;
  id?: string;
  name: string;
  description?: string;
  type: number;
  sourceInfos: SourceInfos[];
  status?: boolean;
  updatedAt?: string;
  createdAt?: string;
  updatedBy?: string;
  relationName?: string;
  relationType?: RelationType;
  origin?: string;
}

export interface ThingWithSourceInfos {
  name: string;
  id: string;
  cpf?: string;
  passport?: string;
  email?: string;
  iam?: string;
  status?: boolean;
}

export interface Things {
  count: number;
  skip: number;
  things: ThingItem[];
  totalCount: number;
}

export interface ThingToBeCreated {
  name: string;
  description?: string;
  type: number;
  sourceInfos: SourceInfos[];
  companyInfo: CompanyInfo;
}

export interface ThingsListResponse {
  name?: string;
  things: ThingItem[];
  totalCount: number;
  skip?: number;
  count?: number;
}

export interface ThingResumeSourceInfos {
  cpf?: string;
  passport?: string;
  mdm?: string;
  iam?: string;
}

export interface AssociatedThing {
  id: string;
  name: string;
  description: string;
  type: number;
  sourceInfos?: SourceInfos[];
}
