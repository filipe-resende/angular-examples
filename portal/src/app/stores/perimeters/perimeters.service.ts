import { Injectable } from '@angular/core';
import { Dispatch } from '@ngxs-labs/dispatch-decorator';
import { Store, Select } from '@ngxs/store';
import { Subscription, Observable } from 'rxjs';
import * as _ from 'lodash';
import {
  PerimetersStateModel,
  PerimetersState,
  PerimetersPageModel,
  PerimeterPolygonCreationMarkerModel
} from './perimeters.state';
import {
  ClearPerimetersStore,
  UpdatePerimetersState,
  UpdatePerimetersPageModel,
  UpdatePerimeterClickability
} from './perimeters.actions';
import { Site } from '../../shared/models/site';
import { PerimetersRepository } from '../../core/repositories/perimeters.repository';
import { Perimeter } from '../../shared/models/perimeter';
import { OfficialPerimeter } from '../../shared/models/officialPerimeter';
import { GeometryTypes } from '../../shared/enums/perimetersTypes';
import { getLiteralFromIndex } from '../../shared/utils/string';
import {
  isWicketPolygonAInteresectingWicketPolygonB,
  mapGoogleMapsPolygonToWicketPolygon
} from '../../shared/utils/map';
import { SelectedSiteModel } from '../sites/sites.state';
import { cloneArray } from '../../shared/utils/clone';

@Injectable({
  providedIn: 'root'
})
export class PerimetersService {
  // #region [SERVICE]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private creationPolygon: any;

  private perimetersSubscription: Subscription = new Subscription();

  private officialPerimetersSubscription: Subscription = new Subscription();

  @Select(PerimetersState.perimeters)
  public perimeters$: Observable<Perimeter[]>;

  @Select(PerimetersState.perimetersPageModel)
  public perimetersPageModel$: Observable<PerimetersPageModel>;

  @Select(PerimetersState.perimetersForMap)
  public perimetersForMap$: Observable<Perimeter[]>;

  @Select(PerimetersState.perimetersFromApi)
  public perimetersFromApi$: Observable<OfficialPerimeter[]>;

  @Select(PerimetersState.newPerimeterPolygonValidated)
  public newPerimeterPolygonValidated$: Observable<boolean>;

  @Select(PerimetersState.isFetchingPerimetersInPerimeterPageModel)
  public isFetchingPerimetersInPerimeterPageModel$: Observable<boolean>;

  @Select(PerimetersState.isClickable)
  public isClickable$: Observable<boolean>;

  constructor(
    private store: Store,
    private perimetersRepository: PerimetersRepository
  ) {}

  public getStore(): PerimetersStateModel {
    return this.store.snapshot().perimeters as PerimetersStateModel;
  }

  @Dispatch()
  public clearPerimetersStore(): ClearPerimetersStore {
    return new ClearPerimetersStore();
  }

  @Dispatch()
  public updatePerimetersPageModel(
    partialPerimetersStateModel: Partial<PerimetersPageModel>
  ): UpdatePerimetersPageModel {
    return new UpdatePerimetersPageModel(partialPerimetersStateModel);
  }

  @Dispatch()
  public updatePerimetersState(
    partialPerimetersStateModel: Partial<PerimetersStateModel>
  ): UpdatePerimetersState {
    return new UpdatePerimetersState(partialPerimetersStateModel);
  }

  @Dispatch()
  public updatePerimeterClickability(
    isClickable: boolean
  ): UpdatePerimeterClickability {
    return new UpdatePerimeterClickability(isClickable);
  }

  // #endregion

  // #region [SYNCRONIZATION]

  /**
   * Sincroniza o STATE de perímetros com os perímetros da Vale filtrados por algum determinado Site
   * Caso deseje ver todos perímetros do Brasil, filtre pelo site Brasil
   * @param site site para filtro
   */
  public syncPerimetersBySite(site: Site): Promise<void> {
    return new Promise((resolve, reject) => {
      const onSuccessCallback = (perimetersResponse: Perimeter[]) => {
        const perimeters = _.isArray(perimetersResponse)
          ? perimetersResponse
          : [];

        this.updatePerimetersState({
          perimeters
        });

        this.perimetersSubscription.unsubscribe();
        resolve();
      };

      this.perimetersSubscription.unsubscribe();

      this.perimetersSubscription = this.perimetersRepository
        .getValePerimetersBySite(site?.name)
        .subscribe(onSuccessCallback, error =>
          this.onPerimetersSyncErrorCallback(error, reject)
        );
    });
  }

  /**
   * Atualiza o STATE de perimetros, para visualizar na pagina de perimetros, com todos perimetros relativos
   * ao site informado. É salvo tanto o geojson em seu formato original, quanto no formato para que o googlemaps
   * possa renderiza-lo
   * @param site site para obter os perimetros
   */
  public syncPerimetersPageModelBySite(site: Site): Promise<void> {
    return new Promise((resolve, reject) => {
      const onSuccessCallback = (perimetersResponse: OfficialPerimeter[]) => {
        const perimeters = _.isArray(perimetersResponse)
          ? perimetersResponse
          : [];

        this.updatePerimetersPageModel({
          perimetersFromApi: perimeters,
          perimetersForMap: perimeters.map((perimeter: OfficialPerimeter) => {
            const coordinates =
              this.mapOfficialGeoJsonFormatToGoogleMapsFormat(perimeter);

            return {
              perimeterName: perimeter.name,
              perimeterId: perimeter.id,
              coordinates
            };
          })
        });

        this.officialPerimetersSubscription.unsubscribe();
        this.updatePerimetersPageModel({ isFetchingPerimeters: false });
        resolve();
      };

      this.officialPerimetersSubscription.unsubscribe();

      this.updatePerimetersPageModel({ isFetchingPerimeters: true });
      this.officialPerimetersSubscription = this.perimetersRepository
        .getOfficialValePerimetersBySite(site.id)
        .subscribe(onSuccessCallback, error => {
          this.updatePerimetersPageModel({ isFetchingPerimeters: false });
          this.onOfficialPerimetersSyncErrorCallback(error, reject);
        });
    });
  }

  private mapOfficialGeoJsonFormatToGoogleMapsFormat(
    perimeter: OfficialPerimeter
  ) {
    switch (perimeter.geojson.geometry.type) {
      case GeometryTypes.Polygon:
        return perimeter.geojson.geometry.coordinates.map(
          (polygon: number[][]) =>
            polygon.map(point => ({ lat: point[1], lng: point[0] }))
        );

      case GeometryTypes.MultiPolygon: {
        const coordinates = [];
        perimeter.geojson.geometry.coordinates.forEach((first, index) => {
          first.foreach(second => {
            coordinates[index] = second.map(point => {
              const [lng, lat] = point;

              return { lat, lng };
            });
          });
        });
        return coordinates;
      }
      default:
        return perimeter.geojson.geometry.coordinates.map(() => []);
    }
  }

  private onPerimetersSyncErrorCallback(
    error: Error,
    reject: (errorParam: any) => void
  ) {
    this.updatePerimetersState({
      perimeters: []
    });

    this.perimetersSubscription.unsubscribe();
    reject(error);
  }

  private onOfficialPerimetersSyncErrorCallback(
    error,
    reject: (errorParam: any) => void
  ) {
    this.updatePerimetersPageModel({
      perimetersForMap: [],
      perimetersFromApi: []
    });

    this.officialPerimetersSubscription.unsubscribe();
    reject(error);
  }

  // #endregion

  public get draw(): {
    addMarker: (
      lat: number,
      lng: number,
      map: any,
      forceIndex?: number
    ) => void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    removeMarker: (googleMapsMarker: any, map: any) => void;
    isPolygonValid: () => boolean;
    create: (
      perimeterName: string,
      selectedSiteModel: SelectedSiteModel
    ) => Promise<void>;
    clear: () => void;
  } {
    return {
      addMarker: this.addMarker.bind(this),
      removeMarker: this.removeMarker.bind(this),
      clear: this.clear.bind(this),
      create: this.create.bind(this),
      isPolygonValid: this.isPolygonValid.bind(this)
    };
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private addMarker(lat: number, lng: number, map: any, forceIndex?: number) {
    if (google) {
      let {
        perimetersPageModel: { drawedPerimeterPolygonMarkers }
      } = this.getStore();

      if (forceIndex != null && forceIndex >= 0) {
        const markersToKeep = drawedPerimeterPolygonMarkers.filter(
          marker => marker.labelIndex < forceIndex
        );
        let markersToBeReallocated = drawedPerimeterPolygonMarkers.filter(
          marker => marker.labelIndex >= forceIndex
        );

        markersToBeReallocated = markersToBeReallocated.map(marker => {
          const newIndex = marker.labelIndex + 1;
          const markerRef = marker.googleMapsMarkerRef;
          const label = getLiteralFromIndex(newIndex);
          markerRef.setLabel(this.getDefaultMarkerLabel(label));

          return {
            ...marker,
            labelIndex: newIndex,
            label: getLiteralFromIndex(newIndex),
            googleMapsMarkerRef: markerRef
          };
        });

        markersToBeReallocated.forEach(marker =>
          marker.googleMapsMarkerRef.setMap(null)
        );

        const literalFromIndex = getLiteralFromIndex(forceIndex);
        const markersToBeAllocated = [
          {
            lat,
            lng,
            label: literalFromIndex,
            labelIndex: forceIndex, // index converte em label. 0 -> A, 1 -> B
            googleMapsMarkerRef: new google.maps.Marker({
              position: { lat, lng },
              icon: '/assets/icons/map_circle_blue.png',
              label: this.getDefaultMarkerLabel(literalFromIndex),
              map
            })
          },
          ...markersToBeReallocated
        ];

        markersToBeAllocated.forEach(marker => {
          marker.googleMapsMarkerRef.setMap(null);
          marker.googleMapsMarkerRef.setMap(map);
          google.maps.event.addListener(
            marker.googleMapsMarkerRef,
            'click',
            () => {
              this.draw.removeMarker(marker.googleMapsMarkerRef, map);
            }
          );
        });

        drawedPerimeterPolygonMarkers = [
          ...markersToKeep,
          ...markersToBeAllocated
        ];
      } else {
        const lastLabelIndex =
          drawedPerimeterPolygonMarkers.length > 0
            ? drawedPerimeterPolygonMarkers[
                drawedPerimeterPolygonMarkers.length - 1
              ].labelIndex
            : -1;
        const nextLabelIndex = lastLabelIndex + 1;
        const nextLabel = getLiteralFromIndex(nextLabelIndex);

        const googleMapsMarker = new google.maps.Marker({
          position: { lat, lng },
          icon: '/assets/icons/map_circle_blue.png',
          label: this.getDefaultMarkerLabel(nextLabel),
          map
        });

        googleMapsMarker.setMap(map);

        google.maps.event.addListener(googleMapsMarker, 'click', () => {
          this.draw.removeMarker(googleMapsMarker, map);
        });

        drawedPerimeterPolygonMarkers.push({
          lat,
          lng,
          label: nextLabel,
          labelIndex: nextLabelIndex,
          googleMapsMarkerRef: googleMapsMarker
        });
      }

      this.createPolygonAndAddListeners(drawedPerimeterPolygonMarkers, map);

      this.updatePerimetersPageModel({
        drawedPerimeterPolygonMarkers,
        drawedPerimeterPolygonValidated: false
      });
    }
  }

  private clear() {
    this.updatePerimetersPageModel({ drawedPerimeterPolygonValidated: false });

    const {
      perimetersPageModel: { drawedPerimeterPolygonMarkers }
    } = this.getStore();

    drawedPerimeterPolygonMarkers.forEach(({ googleMapsMarkerRef }) => {
      googleMapsMarkerRef.setMap(null);
    });

    this.updatePerimetersPageModel({
      drawedPerimeterPolygonMarkers: []
    });

    if (this.creationPolygon) this.creationPolygon.setMap(null);

    this.creationPolygon = null;
  }

  private createPolygonAndAddListeners(
    updatedMarkersArray: PerimeterPolygonCreationMarkerModel[],
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    map: any
  ) {
    if (this.creationPolygon) this.creationPolygon.setMap(null);

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

        this.draw.addMarker(lat(), lng(), map, index);
      });

      google.maps.event.addListener(path, 'set_at', index => {
        const {
          perimetersPageModel: { drawedPerimeterPolygonMarkers }
        } = this.getStore();
        const markerMovedFromState = drawedPerimeterPolygonMarkers.find(
          marker => marker.labelIndex === index
        );

        const markerMovedFromMaps = this.creationPolygon.getPath().getArray()[
          index
        ];
        const { lat, lng } = markerMovedFromMaps;

        this.draw.removeMarker(markerMovedFromState.googleMapsMarkerRef, map);
        this.draw.addMarker(lat(), lng(), map, index);
      });
    });

    this.creationPolygon.setMap(map);
  }

  private create(
    perimeterName: string,
    { country, state, site }: SelectedSiteModel
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      const siteIdList = [country.id, state.id, site.id];

      const onSuccessCallback = () => {
        resolve();
      };

      const onErrorCallback = error => {
        reject(error);
      };

      this.perimetersRepository
        .postOfficialPerimeter(
          perimeterName,
          this.getDrawedPolygonAsGeojson(site.name),
          siteIdList
        )
        .subscribe(onSuccessCallback, error => onErrorCallback(error));
    });
  }

  private getDrawedPolygonAsGeojson(siteName: string) {
    const {
      perimetersPageModel: { drawedPerimeterPolygonMarkers }
    } = this.getStore();

    const coordinates = drawedPerimeterPolygonMarkers.map(({ lat, lng }) => [
      lng,
      lat,
      0
    ]);
    coordinates.push(coordinates[0]);

    return {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [coordinates]
      },
      properties: { name: siteName }
    };
  }

  private getDefaultMarkerLabel(label) {
    return {
      text: label,
      color: '#fff',
      fontSize: '10px',
      fontWeight: 'bold'
    };
  }

  private isPolygonValid() {
    const {
      perimetersPageModel: { drawedPerimeterPolygonMarkers, perimetersForMap }
    } = this.getStore();

    this.updatePerimetersPageModel({ drawedPerimeterPolygonValidated: true });

    try {
      if (this.creationPolygon && drawedPerimeterPolygonMarkers.length > 2) {
        let isValid = true;
        perimetersForMap.forEach(perimeter => {
          perimeter.coordinates.forEach(polygonOfMultiPolygon => {
            const officialPerimetersArea = new google.maps.Polygon({
              paths: [polygonOfMultiPolygon]
            });

            const [wicketPolygonA, wicketPolygonB] =
              mapGoogleMapsPolygonToWicketPolygon(
                this.creationPolygon,
                officialPerimetersArea
              );

            const isIntersecting: boolean =
              isWicketPolygonAInteresectingWicketPolygonB(
                wicketPolygonA,
                wicketPolygonB
              );

            if (isIntersecting) isValid = false;
          });
        });

        return isValid;
      }
      return false;
    } catch (e) {
      return false;
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private removeMarker(googleMapsMarker: any, map: any) {
    const { position: markerPosition } = googleMapsMarker;
    const {
      perimetersPageModel: { drawedPerimeterPolygonMarkers }
    } = this.getStore();

    googleMapsMarker.setMap(null);

    const markerLat = markerPosition.lat();
    const markerLng = markerPosition.lng();

    const markerIndex = drawedPerimeterPolygonMarkers.findIndex(
      marker => marker.lat === markerLat && marker.lng === markerLng
    );

    if (markerIndex >= 0) {
      const markersToKeep = drawedPerimeterPolygonMarkers.filter(
        marker => marker.labelIndex < markerIndex
      );
      let markersToBeReallocated = drawedPerimeterPolygonMarkers.filter(
        marker => marker.labelIndex > markerIndex
      );

      markersToBeReallocated = markersToBeReallocated.map(marker => {
        const literalFromIndex = getLiteralFromIndex(marker.labelIndex - 1);
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
            this.draw.removeMarker(marker.googleMapsMarkerRef, map);
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

      this.updatePerimetersPageModel({
        drawedPerimeterPolygonMarkers: drawedPerimeterPolygonMarkersUpdated,
        drawedPerimeterPolygonValidated: false
      });
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public enablePerimeterEdition(perimeter: Perimeter, map: any): void {
    const {
      perimetersPageModel: { perimetersForMap }
    } = this.getStore();
    const perimetersForMapWithoutPolygonThatIsBeingEdited =
      perimetersForMap.filter(
        perimeterForMap => perimeterForMap.perimeterId !== perimeter.perimeterId
      );
    this.updatePerimetersPageModel({
      editingPerimeter: perimeter,
      perimetersForMapBackupForEdition: perimetersForMap,
      perimetersForMap: perimetersForMapWithoutPolygonThatIsBeingEdited
    });

    perimeter.coordinates.forEach(polygon => {
      const polygonCloned = cloneArray(polygon);
      delete polygonCloned[polygonCloned.length - 1];

      polygonCloned.forEach(coordinate => {
        this.draw.addMarker(coordinate.lat, coordinate.lng, map);
      });
    });
  }

  public discartEdittedPerimeter(): void {
    const {
      perimetersPageModel: { perimetersForMapBackupForEdition }
    } = this.getStore();
    this.updatePerimetersPageModel({
      editingPerimeter: null,
      perimetersForMap: perimetersForMapBackupForEdition,
      perimetersForMapBackupForEdition: []
    });
  }

  public edit(
    updatedPerimeterName: string,
    { country, state, site }: SelectedSiteModel
  ): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const siteIdList = [country.id, state.id, site.id];
      const {
        perimetersPageModel: { editingPerimeter }
      } = this.getStore();

      if (!editingPerimeter) reject(new Error("you're no editing a perimeter"));

      const onSuccessCallback = () => {
        resolve();
      };

      const onErrorCallback = error => {
        reject(error);
      };

      this.perimetersRepository
        .putOfficialPerimeter(
          editingPerimeter.perimeterId,
          updatedPerimeterName,
          this.getDrawedPolygonAsGeojson(site.name),
          siteIdList
        )
        .subscribe(onSuccessCallback, error => onErrorCallback(error));
    });
  }

  public deletePerimeter(perimeterId: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const onSuccessCallback = () => {
        const {
          perimetersPageModel: { perimetersForMap }
        } = this.getStore();

        const index = perimetersForMap.findIndex(
          perimeter => perimeter.perimeterId === perimeterId
        );
        perimetersForMap.splice(index, 1);

        this.updatePerimetersPageModel({ perimetersForMap });

        resolve();
      };

      const onErrorCallback = error => {
        reject(error);
      };

      this.perimetersRepository
        .deleteOfficialPerimeter(perimeterId)
        .subscribe(onSuccessCallback, onErrorCallback);
    });
  }
}
