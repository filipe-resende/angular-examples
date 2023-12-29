import { Management } from './management-name-interfaces';

export interface DeviceGroup {
  id: string;
  name: string;
  managerEmail: string;
}

export interface DeviceItem {
  id?: string;
  applicationId: string;
  name: string;
  description: string;
  sourceInfos: [
    {
      type: string;
      value: string;
    },
  ];
  createdAt?: string;
  updatedAt?: string;
  status?: boolean;
  deviceStatusId: number;
  sapPlantId?: string;
  invoice?: string;
  invoiceProvider?: string;
  groupId: string;
  group: DeviceGroup;
  moveDate?: Date;
  calledCode: string;
  management: Management;
}

export interface DeviceAssociationThing {
  id: string;
  associationDate?: Date;
  disassociationDate?: Date;
  thing: {
    id: string;
    name: string;
    description: string;
    type: number;
    sourceInfos?: [
      {
        type: string;
        value: string;
      },
    ];
  };
}

export interface DeviceLastLocation {
  sourceApplicationId: string;
  externalId?: string;
}

export interface DeviceAssociation {
  device: DeviceItem;
  associatedThings?: DeviceAssociationThing[];
}

export interface Devices {
  skip: number;
  count: number;
  devices: DeviceAssociation[];
}

export interface DeviceTypeList {
  type: string;
  value: string;
}

export interface DeviceToBeCreated {
  applicationId: string;
  name: string;
  description: string;
  sourceInfos: [
    {
      type: string;
      value: string;
    },
  ];
}

export interface DeviceHistory {
  applicationNameHistory: string;
  nameHistory: string;
  identifier: string;
  createdAt: string;
  updatedAt: string;
  coordinates: [
    {
      latitudeHistory: string;
      longitudeHistory: string;
    },
  ];
}
