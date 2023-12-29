import { Injectable } from '@angular/core';
import { Dispatch } from '@ngxs-labs/dispatch-decorator';
import { Select, Store } from '@ngxs/store';
import { Observable, Subscription } from 'rxjs';
import { Polygon } from '@turf/turf';
import { TranslateService } from '@ngx-translate/core';
import { Geofence } from '../../shared/models/geofence';
import {
  GeofencesState,
  GeofencesStateModel,
  Marker,
  RadiusGeofence
} from './geofences.state';
import { GeofenceRepository } from '../../core/repositories/geofence.repository';
import {
  UpdateGeofencesState,
  ClearGeofencesStore,
  UpdateGeofenceDrawedMarkers,
  ClearDrawedGeofence,
  UpdateGeofenceRadius,
  UpdateIsRadiusGeofenceCreation,
  UpdateGeofencesCategories
} from './geofences.actions';
import { Site } from '../../shared/models/site';
import GeofenceCategory from '../../shared/models/geofence-category';
import { PerimetersService } from '../perimeters/perimeters.service';
import { Perimeter } from '../../shared/models/perimeter';
import {
  isPointWithinPolygons,
  mapPerimeterToPolygon
} from '../../shared/utils/geojson';
import { NotificationService } from '../../components/presentational/notification';

@Injectable({
  providedIn: 'root'
})
export class GeofencesService {
  private geofencesSubscription: Subscription = new Subscription();

  private geofencesCategoriesSubscription: Subscription = new Subscription();

  @Select(GeofencesState.geofences)
  public geofences$: Observable<Geofence[]>;

  @Select(GeofencesState.geofenceRadius)
  public geofenceRadius$: Observable<RadiusGeofence>;

  @Select(GeofencesState.geofencesCategories)
  public geofencesCategories$: Observable<GeofenceCategory[]>;

  @Select(GeofencesState.geofenceDrawedMarkers)
  public geofenceDrawedMarkers$: Observable<Marker[]>;

  @Select(GeofencesState.getIsRadiusGeofenceCreation)
  public isRadiusGeofenceCreation$: Observable<boolean>;

  @Select(GeofencesState.allowedCategories)
  public allowedCategories$: Observable<string[]>;

  private creationPolygon: any;

  private insertPointOutsidePerimeterMessage: string;

  private radiusGeofence: google.maps.Circle;

  constructor(
    private store: Store,
    private geofenceRepository: GeofenceRepository,
    private perimetersService: PerimetersService,
    private notificationService: NotificationService,
    translateService: TranslateService
  ) {
    translateService
      .get('NOTIFICATION.GEOFENCES.INSERT_POINT_OUTSIDE_PERIMETER')
      .subscribe(insertPointOutsidePerimeterMessage => {
        this.insertPointOutsidePerimeterMessage =
          insertPointOutsidePerimeterMessage;
      });
  }

  public getStore(): GeofencesStateModel {
    return this.store.snapshot().geofences as GeofencesStateModel;
  }

  @Dispatch()
  public updateGeofencesState(
    geofencesStateModel: Partial<GeofencesStateModel>
  ): UpdateGeofencesState {
    return new UpdateGeofencesState(geofencesStateModel);
  }

  @Dispatch()
  public updateGeofenceRadius(
    geofenceRadius: RadiusGeofence
  ): UpdateGeofenceRadius {
    return new UpdateGeofenceRadius(geofenceRadius);
  }

  @Dispatch()
  public updateIsRadiusGeofenceCreation(
    isRadiusGeofenceCreation: boolean
  ): UpdateIsRadiusGeofenceCreation {
    return new UpdateIsRadiusGeofenceCreation(isRadiusGeofenceCreation);
  }

  @Dispatch()
  public updateGeofenceDrawedMarkers(
    markers: Marker[]
  ): UpdateGeofenceDrawedMarkers {
    return new UpdateGeofenceDrawedMarkers(markers);
  }

  @Dispatch()
  public clearGeofencesStore(): ClearGeofencesStore {
    this.geofencesSubscription.unsubscribe();
    this.geofencesCategoriesSubscription.unsubscribe();

    return new ClearGeofencesStore();
  }

  @Dispatch()
  public clearDrawedGeofence(): ClearDrawedGeofence {
    const { geofenceDrawedMarkers: markers } = this.getStore();

    if (this.radiusGeofence) {
      this.radiusGeofence.setMap(null);
    }

    if (markers) {
      markers.forEach(marker => marker.googleMapsMarkerRef.setMap(null));
      if (this.creationPolygon) this.creationPolygon.setMap(null);
    }

    return new ClearDrawedGeofence();
  }

  @Dispatch()
  public updateGeofencesCategories(): UpdateGeofencesCategories {
    return new UpdateGeofencesCategories();
  }

  /**
   * Atualiza o STATE de geofences com as geofences que estão contidas dentro do raio do site informado
   * @param site site usado de filtro para buscar as geofences
   */
  public syncGeofencesBySite(site: Site): Promise<void> {
    return new Promise((resolve, reject) => {
      if (site) {
        const onSuccessCallback = (geofencesResponse: Geofence[]) => {
          this.updateGeofencesState({ geofences: geofencesResponse });
          resolve();
        };

        const onErrorCallback = error => {
          this.updateGeofencesState({ geofences: [] });

          this.geofencesSubscription.unsubscribe();
          reject(error);
        };

        this.geofencesSubscription.unsubscribe();

        this.geofencesSubscription = this.geofenceRepository
          .listAllGeofenceBySiteName(site.name)
          .subscribe(onSuccessCallback, onErrorCallback);
      } else {
        this.updateGeofencesState({ geofences: [] });
        reject(new Error('site é obrigatório'));
      }
    });
  }

  private checkDrawedMarkersDuplicated(lat: number, lng: number): boolean {
    const { geofenceDrawedMarkers } = this.getStore();

    if (geofenceDrawedMarkers && geofenceDrawedMarkers.length) {
      const marker = geofenceDrawedMarkers.find(
        mark => mark.lat === lat && mark.lng === lng
      );
      return marker !== undefined;
    }

    return false;
  }

  public setNewPolylineMarker(event, map): void {
    if (google) {
      const { isRadiusGeofenceCreation } = this.getStore();
      const myLatLng = event.latLng;

      const lat = parseFloat(myLatLng.lat());
      const lng = parseFloat(myLatLng.lng());

      if (isRadiusGeofenceCreation) {
        const { geofenceRadius } = this.getStore();

        const radius = geofenceRadius ? geofenceRadius.radius : 1000;

        this.setRadiusFence({
          latitude: lat,
          longitude: lng,
          radius,
          map
        });
      } else {
        const { geofenceDrawedMarkers } = this.getStore();

        if (!this.checkDrawedMarkersDuplicated(lat, lng)) {
          this.addMarker(
            {
              lat,
              lng,
              googleMapsMarkerRef: map,
              labelIndex: geofenceDrawedMarkers.length
            },
            geofenceDrawedMarkers
          );
        }
      }
    }
  }

  public setRadiusFence({
    latitude,
    longitude,
    radius,
    map
  }: RadiusGeofence): void {
    const { perimeters: perimeter } = this.perimetersService.getStore();

    if (
      this.isMarkerInPerimeter({
        position: [longitude, latitude],
        perimeters: perimeter
      })
    ) {
      if (this.radiusGeofence) {
        this.radiusGeofence.setMap(null);
      }

      this.radiusGeofence = new google.maps.Circle({
        strokeColor: '#E9AB13',
        strokeOpacity: 1.0,
        strokeWeight: 3,
        fillOpacity: 0.3,
        fillColor: '#E9AB13',
        clickable: false,
        map,
        center: { lat: latitude, lng: longitude },
        radius
      });

      this.updateGeofenceRadius({
        latitude,
        longitude,
        radius,
        map
      });
    } else {
      this.notificationService.warning(
        this.insertPointOutsidePerimeterMessage,
        true,
        1000
      );
    }
  }

  public addMarker(
    { lat, lng, googleMapsMarkerRef, labelIndex }: Marker,
    markers: Marker[]
  ): void {
    if (google && markers.length < 40) {
      const { perimeters: perimeter } = this.perimetersService.getStore();

      if (
        this.isMarkerInPerimeter({
          position: [lng, lat],
          perimeters: perimeter
        })
      ) {
        const markersUpdated = markers.map(marker => {
          if (marker.labelIndex < labelIndex) {
            return marker;
          }

          marker.googleMapsMarkerRef.setMap(null);

          const index = marker.labelIndex + 1;
          const label = (index + 1).toString();

          const { googleMapsMarkerRef: markerRef } = marker;
          markerRef.setLabel(this.getDefaultMarkerLabel(label));

          marker.googleMapsMarkerRef.setMap(googleMapsMarkerRef);

          return {
            ...marker,
            labelIndex: index,
            label,
            googleMapsMarkerRef: markerRef
          };
        });

        const label = (labelIndex + 1).toString();

        const marker = {
          lat,
          lng,
          label,
          labelIndex,
          googleMapsMarkerRef: new google.maps.Marker({
            position: { lat, lng },
            icon: '/assets/icons/map_circle_blue.png',
            label: this.getDefaultMarkerLabel(label),
            map: googleMapsMarkerRef
          })
        };

        const newMarkers = [
          ...markersUpdated.slice(0, labelIndex),
          marker,
          ...markersUpdated.slice(labelIndex)
        ];

        this.updateGeofenceDrawedMarkers(newMarkers);

        this.createPolygonAndAddListeners(newMarkers, googleMapsMarkerRef);
      } else {
        this.notificationService.warning(
          this.insertPointOutsidePerimeterMessage,
          true,
          1000
        );
      }
    }
  }

  private isMarkerInPerimeter({
    position,
    perimeters
  }: {
    position: number[];
    perimeters: Perimeter[];
  }): boolean {
    const polygons = perimeters.map<Polygon>(mapPerimeterToPolygon);

    return isPointWithinPolygons(
      { coordinates: position, type: 'Point' },
      polygons
    );
  }

  public removeMarker(googleMapsMarker: any, map: any): void {
    const { geofenceDrawedMarkers: markers } = this.getStore();

    const { position: markerPosition } = googleMapsMarker;

    googleMapsMarker.setMap(null);

    const markerLat = markerPosition.lat();
    const markerLng = markerPosition.lng();

    const markerIndex = markers.findIndex(
      marker => marker.lat === markerLat && marker.lng === markerLng
    );

    if (markerIndex >= 0) {
      const markersToKeep = markers.filter(
        marker => marker.labelIndex < markerIndex
      );
      let markersToBeReallocated = markers.filter(
        marker => marker.labelIndex > markerIndex
      );

      markersToBeReallocated = markersToBeReallocated.map(marker => {
        const literalFromIndex = marker.labelIndex.toString();
        const markerRef = marker.googleMapsMarkerRef;
        markerRef.setLabel(this.getDefaultMarkerLabel(literalFromIndex));

        return {
          ...marker,
          labelIndex: marker.labelIndex - 1,
          label: literalFromIndex,
          googleMapsMarkerRef: markerRef
        };
      });

      markersToBeReallocated.forEach(marker => {
        marker.googleMapsMarkerRef.setMap(null);
        marker.googleMapsMarkerRef.setMap(map);
        google.maps.event.addListener(
          marker.googleMapsMarkerRef,
          'click',
          () => {
            this.removeMarker(marker.googleMapsMarkerRef, map);
          }
        );
      });

      const drawedPerimeterPolygonMarkersUpdated = [
        ...markersToKeep,
        ...markersToBeReallocated
      ];

      this.createPolygonAndAddListeners(
        drawedPerimeterPolygonMarkersUpdated,
        map
      );

      this.updateGeofenceDrawedMarkers([
        ...drawedPerimeterPolygonMarkersUpdated
      ]);
    }
  }

  private createPolygonAndAddListeners(
    updatedMarkersArray: Marker[],
    map: any
  ) {
    if (this.creationPolygon) {
      this.creationPolygon.setMap(null);
    }

    this.creationPolygon = new google.maps.Polygon({
      paths: updatedMarkersArray.map(marker => ({
        lat: marker.lat,
        lng: marker.lng
      })),
      editable: true,
      strokeColor: '#57a4ff',
      strokeOpacity: 1.0,
      strokeWeight: 3,
      fillOpacity: 0.3,
      fillColor: '#57a4ff',
      clickable: false
    });

    this.creationPolygon.getPaths().forEach(path => {
      google.maps.event.addListener(path, 'insert_at', index => {
        const { lat, lng } = this.creationPolygon.getPath().getArray()[index];

        const { geofenceDrawedMarkers: markers } = this.getStore();

        this.addMarker(
          {
            lat: lat(),
            lng: lng(),
            googleMapsMarkerRef: map,
            labelIndex: index
          },
          markers
        );
      });

      google.maps.event.addListener(path, 'set_at', index => {
        const { geofenceDrawedMarkers: markers } = this.getStore();

        const markerMovedFromState = markers.find(
          marker => marker.labelIndex === index
        );

        const markerMovedFromMaps = this.creationPolygon.getPath().getArray()[
          index
        ];
        const { lat, lng } = markerMovedFromMaps;

        this.removeMarker(markerMovedFromState.googleMapsMarkerRef, map);

        const { geofenceDrawedMarkers: newMarkers } = this.getStore();

        this.addMarker(
          {
            lat: lat(),
            lng: lng(),
            googleMapsMarkerRef: map,
            labelIndex: index
          },
          newMarkers
        );
      });
    });

    this.creationPolygon.setMap(map);
  }

  private getDefaultMarkerLabel(label) {
    return {
      text: label,
      color: '#fff',
      fontSize: '10px',
      fontWeight: 'bold'
    };
  }
}
