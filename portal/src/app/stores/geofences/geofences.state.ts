import { Action, State, StateContext, Selector, Store } from '@ngxs/store';
import { Injectable } from '@angular/core';
import { catchError, map, tap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import * as _ from 'lodash';
import { Geofence } from '../../shared/models/geofence';
import {
  UpdateGeofencesState,
  ClearGeofencesStore,
  UpdateGeofenceDrawedMarkers,
  ClearDrawedGeofence,
  UpdateGeofenceRadius,
  UpdateIsRadiusGeofenceCreation,
  UpdateGeofencesCategories,
  UpdateAllowedCategories
} from './geofences.actions';
import GeofenceCategory from '../../shared/models/geofence-category';
import { GeofenceRepository } from '../../core/repositories/geofence.repository';
import { RadiusCategoryName } from '../../core/constants/geofences.const';

export interface Marker {
  lat: number;
  lng: number;
  label?: string;
  labelIndex?: number; // index converte em label. 0 -> A, 1 -> B
  googleMapsMarkerRef?: any;
}

export interface RadiusGeofence {
  latitude: number;
  longitude: number;
  radius: number;
  map: google.maps.Map;
}

export class GeofencesStateModel {
  public geofences: Geofence[];

  public geofencesCategories: GeofenceCategory[];

  public geofenceDrawedMarkers: Marker[];

  public geofence: Geofence;

  public isRadiusGeofenceCreation: boolean;

  public geofenceRadius: RadiusGeofence;

  public allowedCategories: string[];
}

const INITIAL_STATE: GeofencesStateModel = {
  geofences: [],
  geofencesCategories: [],
  geofenceDrawedMarkers: [],
  geofence: undefined,
  isRadiusGeofenceCreation: false,
  geofenceRadius: undefined,
  allowedCategories: []
};

@Injectable({ providedIn: 'root' })
@State<GeofencesStateModel>({
  name: 'geofences',
  defaults: INITIAL_STATE
})
export class GeofencesState {
  @Selector()
  public static geofences(state: GeofencesStateModel): Geofence[] {
    return state.geofences;
  }

  @Selector()
  public static geofenceRadius(state: GeofencesStateModel): RadiusGeofence {
    return state.geofenceRadius;
  }

  @Selector()
  public static geofencesCategories(
    state: GeofencesStateModel
  ): GeofenceCategory[] {
    return state.geofencesCategories;
  }

  @Selector()
  public static geofenceDrawedMarkers(state: GeofencesStateModel): Marker[] {
    return state.geofenceDrawedMarkers;
  }

  @Selector()
  public static getIsRadiusGeofenceCreation({
    isRadiusGeofenceCreation
  }: GeofencesStateModel): boolean {
    return isRadiusGeofenceCreation;
  }

  @Selector()
  public static allowedCategories({
    allowedCategories
  }: GeofencesStateModel): string[] {
    return allowedCategories;
  }

  constructor(private geofencesRepository: GeofenceRepository) {}

  @Action(UpdateGeofencesState)
  public updateGeofencesState(
    { patchState }: StateContext<GeofencesStateModel>,
    { partialGeofencesStateModel }: UpdateGeofencesState
  ): void {
    patchState(partialGeofencesStateModel);
  }

  @Action(ClearGeofencesStore)
  public clearGeofencesStore({
    setState
  }: StateContext<GeofencesStateModel>): void {
    setState(INITIAL_STATE);
  }

  @Action(UpdateGeofenceRadius)
  public updateGeofenceRadius(
    { patchState }: StateContext<GeofencesStateModel>,
    { geofenceRadius }: UpdateGeofenceRadius
  ): void {
    patchState({ geofenceRadius });
  }

  @Action(UpdateIsRadiusGeofenceCreation)
  public updateIsRadiusGeofenceCreation(
    { patchState }: StateContext<GeofencesStateModel>,
    { isRadiusGeofenceCreation }: UpdateIsRadiusGeofenceCreation
  ): void {
    patchState({ isRadiusGeofenceCreation });
  }

  @Action(ClearDrawedGeofence)
  public clearDrawedGeofence({
    patchState
  }: StateContext<GeofencesStateModel>): void {
    const { geofenceDrawedMarkers } = INITIAL_STATE;

    patchState({ geofenceDrawedMarkers });
  }

  @Action(UpdateGeofenceDrawedMarkers)
  public updateGeofenceDrawedMarkersState(
    { patchState }: StateContext<GeofencesStateModel>,
    { markers }: UpdateGeofenceDrawedMarkers
  ): void {
    patchState({ geofenceDrawedMarkers: markers });
  }

  @Action(UpdateGeofencesCategories)
  public updateGeofencesCategories({
    patchState,
    dispatch
  }: StateContext<GeofencesStateModel>): Observable<
    GeofenceCategory[] | UpdateAllowedCategories
  > {
    return this.geofencesRepository.listGeofenceCategories().pipe(
      map(categories => _.chain(categories).orderBy('name').value()),
      tap(geofencesCategories => {
        patchState({ geofencesCategories });

        const radiusCategory = geofencesCategories.find(({ name }) =>
          name.toUpperCase().includes(RadiusCategoryName)
        );
        dispatch(
          new UpdateAllowedCategories(radiusCategory ? radiusCategory.id : null)
        );
      }),
      catchError(() => of(new UpdateAllowedCategories(null)))
    );
  }

  @Action(UpdateAllowedCategories)
  public updateAllowedCategories(
    { patchState }: StateContext<GeofencesStateModel>,
    { allowedCategories }: UpdateAllowedCategories
  ): void {
    patchState({ allowedCategories });
  }
}
