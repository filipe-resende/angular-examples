import { Coordinates } from './coordinates';

export interface PanicAlert {
  id: string;
  eventLocation: Coordinates;
  sourceApplicationName?: string;
  deviceSourceInfoId: string;
  deviceSourceInfoType: string;
  sourceApplicationId: string;
  eventDateTime?: Date;
  counter?: number;
  reason?: 'Other' | 'Real' | 'Falsy';
  thing?: {
    name: string;
    iamId?: string;
    document?: string;
    passport?: string;
    company?: string;
  };
  areaName?: string;
}
