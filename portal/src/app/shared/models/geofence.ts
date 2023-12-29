import { Coordinates } from './coordinates';

export class Geofence {
  public id?: string;

  public name: string;

  public siteName: string;

  public description: string;

  public color: string;

  public categoryId: string;

  public categoryName: string;

  public coordinates: Coordinates[];

  public parentAreaId?: string;

  public createdBy: string;

  public isEditMode: boolean;

  public active: boolean;
}
