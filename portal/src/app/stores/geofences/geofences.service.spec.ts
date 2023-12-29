/* eslint-disable import/no-extraneous-dependencies */
import { NgxsModule } from '@ngxs/store';
import { TestBed } from '@angular/core/testing';
import { NgxsDispatchPluginModule } from '@ngxs-labs/dispatch-decorator';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Observable } from 'rxjs';
import { GeofencesState, GeofencesStateModel, Marker } from './geofences.state';
import { GeofencesService } from './geofences.service';
import { GeofenceRepository } from '../../core/repositories/geofence.repository';
import { Geofence } from '../../shared/models/geofence';
import { DEFAULT_SITE_MOCK } from '../../../../tests/mocks/site';
import GeofenceCategory from '../../shared/models/geofence-category';

const FULL_STATE_MOCK: GeofencesStateModel = {
  geofences: [
    {
      categoryId: '1',
      id: '1',
      name: 'name',
      color: 'color',
      coordinates: [{ lat: 1, lng: 0 }],
      description: 'description'
    }
  ],
  geofencesCategories: [
    { id: '1', name: 'name', status: true, typeEntitie: 'type' }
  ],
  geofenceDrawedMarkers: [
    {
      googleMapsMarkerRef: null,
      labelIndex: 0,
      lat: 30,
      lng: 30,
      label: 'A'
    },
    {
      googleMapsMarkerRef: null,
      labelIndex: 1,
      lat: 31,
      lng: 31,
      label: 'B'
    }
  ]
};

const INITIAL_STATE_MOCK: GeofencesStateModel = {
  geofences: [],
  geofencesCategories: [],
  geofenceDrawedMarkers: []
};

const GEOFENCES_MOCK: Geofence[] = [
  {
    categoryId: '1',
    coordinates: [{ lat: 0, lng: 0 }],
    color: 'color',
    name: 'Geofence name',
    id: '5',
    description: 'Description'
  }
];

const CATEGORIES_MOCK: GeofenceCategory[] = [
  {
    id: '1',
    name: 'Cerca Mock',
    status: true,
    typeEntitie: 'fence'
  }
];

const MARKERS_MOCK: Marker[] = [
  {
    googleMapsMarkerRef: null,
    labelIndex: 0,
    lat: 30,
    lng: 30,
    label: 'A'
  },
  {
    googleMapsMarkerRef: null,
    labelIndex: 1,
    lat: 31,
    lng: 31,
    label: 'B'
  }
];

describe('Service: GEOFENCES', () => {
  let geofencesService: GeofencesService;
  let geofenceRepository: GeofenceRepository;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        NgxsModule.forRoot([GeofencesState]),
        NgxsDispatchPluginModule.forRoot()
      ],
      providers: [GeofencesService, GeofenceRepository]
    });

    geofencesService = TestBed.inject(GeofencesService);
    geofenceRepository = TestBed.inject(GeofenceRepository);
  });

  xit('should be able to update geofences store', () => {
    geofencesService.updateGeofencesState(FULL_STATE_MOCK);

    const stateFull = geofencesService.getStore();
    expect(stateFull).toEqual(FULL_STATE_MOCK);
  });

  xit('should be able to clear geofences store', () => {
    geofencesService.updateGeofencesState(FULL_STATE_MOCK);

    const stateFull = geofencesService.getStore();
    expect(stateFull).toEqual(FULL_STATE_MOCK);

    geofencesService.clearGeofencesStore();

    const stateCleared = geofencesService.getStore();
    expect(stateCleared).toEqual(INITIAL_STATE_MOCK);
  });

  xit('should be able to update geofence drawed markers', () => {
    const {
      geofenceDrawedMarkers: markersInitial
    } = geofencesService.getStore();

    expect(markersInitial).toEqual([]);

    geofencesService.updateGeofenceDrawedMarkers(MARKERS_MOCK);

    const {
      geofenceDrawedMarkers: markersUpdated
    } = geofencesService.getStore();

    expect(markersUpdated).toEqual(MARKERS_MOCK);
  });

  test.skip('should be able to clear geofence drawed markers', () => {
    const {
      geofenceDrawedMarkers: markersInitial
    } = geofencesService.getStore();

    expect(markersInitial).toEqual([]);

    geofencesService.updateGeofenceDrawedMarkers(MARKERS_MOCK);

    const {
      geofenceDrawedMarkers: markersUpdated
    } = geofencesService.getStore();

    expect(markersUpdated).toEqual(MARKERS_MOCK);

    geofencesService.clearDrawedGeofence();

    const {
      geofenceDrawedMarkers: markersCleared
    } = geofencesService.getStore();

    expect(markersCleared).toEqual([]);
  });

  xit('should be able to sync geofences by site', async done => {
    const listAllGeofencesByCoodMock = jest
      .spyOn(geofenceRepository, 'listAllGeofencesByCood')
      .mockReturnValue(
        new Observable(observer => {
          observer.next(GEOFENCES_MOCK);
          observer.complete();
        })
      );

    await geofencesService.syncGeofencesBySite(DEFAULT_SITE_MOCK);

    const { geofences } = geofencesService.getStore();

    expect(geofences).toEqual(GEOFENCES_MOCK);
    expect(listAllGeofencesByCoodMock).toHaveBeenCalledTimes(1);
    done();
  });

  xit('should not be able to sync geofences without a site', async done => {
    try {
      await geofencesService.syncGeofencesBySite(null);
    } catch (error) {
      expect(error).toEqual(new Error('site é obrigatório'));
      done();
    }
  });

  xit('should not be able to sync geofences by site when promise rejects', async done => {
    const listAllGeofencesByCoodMock = jest
      .spyOn(geofenceRepository, 'listAllGeofencesByCood')
      .mockReturnValue(
        new Observable(observer => {
          observer.error(new Error());
          observer.complete();
        })
      );

    try {
      await geofencesService.syncGeofencesBySite(DEFAULT_SITE_MOCK);
    } catch (_) {
      const { geofences } = geofencesService.getStore();

      expect(geofences).toEqual([]);
      expect(listAllGeofencesByCoodMock).toHaveBeenCalledTimes(1);
      done();
    }
  });

  // xit('should be able to sync geofences categories', async done => {
  //   const listGeofenceCategoriesMock = jest
  //     .spyOn(geofenceRepository, 'listGeofenceCategories')
  //     .mockReturnValue(
  //       new Observable(observer => {
  //         observer.next(CATEGORIES_MOCK);
  //         observer.complete();
  //       }),
  //     );

  //   await geofencesService.syncGeofencesCategories();

  //   const { geofencesCategories } = geofencesService.getStore();

  //   expect(geofencesCategories).toEqual(CATEGORIES_MOCK);

  //   expect(listGeofenceCategoriesMock).toHaveBeenCalledTimes(1);
  //   done();
  // });

  // xit('should not be able to sync geofences categories when promise rejects', async done => {
  //   const listGeofenceCategoriesMock = jest
  //     .spyOn(geofenceRepository, 'listGeofenceCategories')
  //     .mockReturnValue(
  //       new Observable(observer => {
  //         observer.error(new Error());
  //         observer.complete();
  //       }),
  //     );

  //   try {
  //     await geofencesService.syncGeofencesCategories();
  //   } catch (_) {
  //     const { geofencesCategories } = geofencesService.getStore();

  //     expect(geofencesCategories).toEqual([]);

  //     expect(listGeofenceCategoriesMock).toHaveBeenCalledTimes(1);
  //     done();
  //   }
  // });

  xit('should be able to select geofences', done => {
    geofencesService.updateGeofencesState({ geofences: GEOFENCES_MOCK });

    geofencesService.geofences$.subscribe(geofences => {
      expect(geofences).toEqual(GEOFENCES_MOCK);
      done();
    });
  });

  xit('should be able to select geofences categories', done => {
    geofencesService.updateGeofencesState({
      geofencesCategories: CATEGORIES_MOCK
    });

    geofencesService.geofencesCategories$.subscribe(categories => {
      expect(categories).toEqual(CATEGORIES_MOCK);
      done();
    });
  });

  xit('should be able to select geofences drawed markers', done => {
    geofencesService.updateGeofencesState({
      geofenceDrawedMarkers: MARKERS_MOCK
    });

    geofencesService.geofenceDrawedMarkers$.subscribe(markers => {
      expect(markers).toEqual(MARKERS_MOCK);
      done();
    });
  });
});
