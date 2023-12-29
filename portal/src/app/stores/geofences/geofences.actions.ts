import { Geofence } from '../../shared/models/geofence';
import { GeofencesStateModel, Marker, RadiusGeofence } from './geofences.state';

export class UpdateGeofencesState {
  public static readonly type = '[GEOFENCES] UpdateGeofencesState';

  constructor(
    public partialGeofencesStateModel: Partial<GeofencesStateModel>,
  ) {}
}
export class UpdateGeofenceDrawedMarkers {
  public static readonly type = '[GEOFENCES] UpdateGeofenceDrawedMarkersState';

  constructor(public markers: Marker[]) {}
}

export class ClearGeofencesStore {
  public static readonly type = '[GEOFENCES] ClearGeofencesStore';
}

export class ClearDrawedGeofence {
  public static readonly type = '[GEOFENCES] ClearDrawedGeofence';
}

export class UpdateGeofence {
  public static readonly type = '[GEOFENCES] UpdateGeofence';

  constructor(public geofence: Geofence) {}
}

export class UpdateGeofenceRadius {
  public static readonly type = '[GEOFENCES] UpdateGeofenceRadius';

  constructor(public geofenceRadius: RadiusGeofence) {}
}

export class UpdateIsRadiusGeofenceCreation {
  public static readonly type = '[GEOFENCES] UpdateIsRadiusGeofenceCreation';

  constructor(public isRadiusGeofenceCreation: boolean) {}
}
export class UpdateGeofencesCategories {
  public static readonly type = '[GEOFENCES] UpdateGeofencesCategories';
}

export class UpdateAllowedCategories {
  public static readonly type = '[GEOFENCES] UpdateAllowedCategories';

  constructor(public allowedCategories: string[]) {}
}
