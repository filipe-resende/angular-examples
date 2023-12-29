import { TestBed } from '@angular/core/testing';
import { NgxsModule } from '@ngxs/store';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NgxsDispatchPluginModule } from '@ngxs-labs/dispatch-decorator';
import { Observable } from 'rxjs';
import {
  PerimetersPageModel,
  PerimetersState,
  PerimetersStateModel
} from './perimeters.state';
import { PerimetersService } from './perimeters.service';
import {
  MULTIPOLYGON_OFFICIAL_PERIMETER_MOCK,
  PERIMETER_MOCK_1,
  POLYGON_OFFICIAL_PERIMETER_MOCK
} from '../../../../tests/mocks/perimeters';
import { PerimetersRepository } from '../../core/repositories/perimeters.repository';
import { DEFAULT_SITE_MOCK } from '../../../../tests/mocks/site';
import { Perimeter } from '../../shared/models/perimeter';

describe('Service: PERIMETERS', () => {
  let perimetersRepository: PerimetersRepository;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        NgxsModule.forRoot([PerimetersState]),
        NgxsDispatchPluginModule.forRoot()
      ],
      providers: [PerimetersService, PerimetersRepository]
    });

    perimetersRepository = TestBed.inject(PerimetersRepository);
    jest.spyOn(console, 'warn').mockImplementation(() => undefined);
  });

  it('should map polygon from geojson format to google maps coordinates format', () => {
    const perimetersService: PerimetersService = TestBed.inject(
      PerimetersService
    );
    const perimetersServicePrototype = Object.getPrototypeOf(perimetersService);

    const POLYGON_AS_GOOGLE_MAPS_FORMAT = perimetersServicePrototype.mapOfficialGeoJsonFormatToGoogleMapsFormat(
      POLYGON_OFFICIAL_PERIMETER_MOCK
    );

    expect(POLYGON_AS_GOOGLE_MAPS_FORMAT).toEqual([
      [
        { lng: -43.3270184029999, lat: -19.667474979 },
        { lng: -43.326774961, lat: -19.667563956 },
        { lng: -43.3257816989999, lat: -19.667923381 },
        { lng: -43.325320543, lat: -19.6680938909999 },
        { lng: -43.3234402529999, lat: -19.6687842589999 },
        { lng: -43.3231726819999, lat: -19.669221356 },
        { lng: -43.322476389, lat: -19.6703496169999 },
        { lng: -43.3222504519999, lat: -19.670542823 },
        { lng: -43.3232597429999, lat: -19.6630049609999 },
        { lng: -43.323299595, lat: -19.6630517679999 },
        { lng: -43.324087063, lat: -19.663653101 },
        { lng: -43.3241152049999, lat: -19.663698082 },
        { lng: -43.3244458149999, lat: -19.6646360949999 },
        { lng: -43.324467442, lat: -19.664674782 },
        { lng: -43.326893959, lat: -19.666692919 },
        { lng: -43.3270184029999, lat: -19.667474979 }
      ]
    ]);
  });

  xit('should map multipolygon from geojson format to google maps coordinates format', () => {
    const perimetersService: PerimetersService = TestBed.inject(
      PerimetersService
    );
    const perimetersServicePrototype = Object.getPrototypeOf(perimetersService);

    const MULTIPOLYGON_AS_GOOGLE_MAPS_FORMAT = perimetersServicePrototype.mapOfficialGeoJsonFormatToGoogleMapsFormat(
      MULTIPOLYGON_OFFICIAL_PERIMETER_MOCK
    );

    expect(MULTIPOLYGON_AS_GOOGLE_MAPS_FORMAT).toEqual([
      [
        { lng: -44.123705789821187, lat: -20.106902196355385 },
        { lng: -44.123753725205084, lat: -20.106846745459929 },
        { lng: -44.123900375837692, lat: -20.10687112995274 },
        { lng: -44.123705789821187, lat: -20.106902196355385 }
      ],
      [
        { lng: -44.076579527699572, lat: -20.133452330949691 },
        { lng: -44.075336603003763, lat: -20.132824255910332 },
        { lng: -44.07520436765266, lat: -20.132650965137188 },
        { lng: -44.077940478359558, lat: -20.129426122560961 },
        { lng: -44.07663151047754, lat: -20.129677744386086 },
        { lng: -44.07640402227026, lat: -20.130254856050811 },
        { lng: -44.076888283380562, lat: -20.131482093424815 },
        { lng: -44.077492622835706, lat: -20.13203398460433 },
        { lng: -44.077407320320717, lat: -20.132985397288497 },
        { lng: -44.0771203312986, lat: -20.132867141538831 },
        { lng: -44.076579527699572, lat: -20.133452330949691 }
      ]
    ]);
  });

  test('if geojson is not a polygon nor multipolygon, then map must return an empty google maps polygon', () => {
    const perimetersService: PerimetersService = TestBed.inject(
      PerimetersService
    );
    const perimetersServicePrototype = Object.getPrototypeOf(perimetersService);

    const RANDOM_GEOJSON_TYPE_MOCK = {
      id: 'id',
      name: 'name',
      geojson: {
        type: 'Feature',
        geometry: {
          type: 'RANDOM TYPE',
          coordinates: [
            [
              [-43.3270184029999, -19.667474979, 0.0],
              [-43.326893959, -19.666692919, 0.0],
              [-43.3270184029999, -19.667474979, 0.0]
            ]
          ]
        },
        properties: {}
      }
    };

    const RANDOM_GEOJSON_TYPE_AS_GOOGLE_MAPS_FORMAT = perimetersServicePrototype.mapOfficialGeoJsonFormatToGoogleMapsFormat(
      RANDOM_GEOJSON_TYPE_MOCK
    );

    expect(RANDOM_GEOJSON_TYPE_AS_GOOGLE_MAPS_FORMAT).toEqual([[]]);
  });

  it('should sync perimeters by site with success', async done => {
    const perimetersService: PerimetersService = TestBed.inject(
      PerimetersService
    );

    jest.spyOn(perimetersRepository, 'getValePerimetersBySite').mockReturnValue(
      new Observable(observer => {
        observer.next([PERIMETER_MOCK_1]);
        observer.complete();
      })
    );

    const { perimeters: perimetersPreUpdate } = perimetersService.getStore();
    expect(perimetersPreUpdate).toEqual([]);

    await perimetersService.syncPerimetersBySite(DEFAULT_SITE_MOCK);

    const expectedResponse: Perimeter[] = [
      {
        coordinates: [
          [
            {
              lat: -20.106902196355385,
              lng: -44.12370578982119
            },
            {
              lat: -20.10684674545993,
              lng: -44.123753725205084
            },
            {
              lat: -20.10687112995274,
              lng: -44.12390037583769
            },
            {
              lat: -20.106902196355385,
              lng: -44.12370578982119
            }
          ]
        ],
        perimeterId: 'id1',
        perimeterName: 'perimeterName1'
      }
    ];
    const { perimeters: perimetersPostUpdate } = perimetersService.getStore();
    expect(perimetersPostUpdate).toEqual(expectedResponse);

    perimetersService.perimeters$.subscribe(perimeters => {
      expect(perimeters).toEqual(expectedResponse);
      done();
    });
  });

  it('should not sync perimeters if api response is not an array', async () => {
    const perimetersService: PerimetersService = TestBed.inject(
      PerimetersService
    );
    jest.spyOn(perimetersRepository, 'getValePerimetersBySite').mockReturnValue(
      new Observable(observer => {
        observer.next(PERIMETER_MOCK_1);
        observer.complete();
      })
    );

    const { perimeters: perimetersPreUpdate } = perimetersService.getStore();
    expect(perimetersPreUpdate).toEqual([]);

    await perimetersService.syncPerimetersBySite(DEFAULT_SITE_MOCK);

    const { perimeters: perimetersPostUpdate } = perimetersService.getStore();
    expect(perimetersPostUpdate).toEqual([]);
  });

  it('should sync perimeters for perimeters page by site with success', async done => {
    const perimetersService: PerimetersService = TestBed.inject(
      PerimetersService
    );

    jest
      .spyOn(perimetersRepository, 'getOfficialValePerimetersBySite')
      .mockReturnValue(
        new Observable(observer => {
          observer.next([POLYGON_OFFICIAL_PERIMETER_MOCK]);
          observer.complete();
        })
      );

    const {
      perimetersPageModel: perimetersPageModelPreUpdate
    } = perimetersService.getStore();
    expect(perimetersPageModelPreUpdate.perimetersForMap).toEqual([]);
    expect(perimetersPageModelPreUpdate.perimetersFromApi).toEqual([]);

    await perimetersService.syncPerimetersPageModelBySite(DEFAULT_SITE_MOCK);

    const expectedResponse: PerimetersPageModel = {
      perimetersFromApi: [POLYGON_OFFICIAL_PERIMETER_MOCK],
      perimetersForMap: [
        {
          perimeterName: '124_MG_Itabira',
          perimeterId: '005cc0bc-5dc7-4241-8365-0f446c9c6942',
          coordinates: [
            [
              { lng: -43.3270184029999, lat: -19.667474979 },
              { lng: -43.326774961, lat: -19.667563956 },
              { lng: -43.3257816989999, lat: -19.667923381 },
              { lng: -43.325320543, lat: -19.6680938909999 },
              { lng: -43.3234402529999, lat: -19.6687842589999 },
              { lng: -43.3231726819999, lat: -19.669221356 },
              { lng: -43.322476389, lat: -19.6703496169999 },
              { lng: -43.3222504519999, lat: -19.670542823 },
              { lng: -43.3232597429999, lat: -19.6630049609999 },
              { lng: -43.323299595, lat: -19.6630517679999 },
              { lng: -43.324087063, lat: -19.663653101 },
              { lng: -43.3241152049999, lat: -19.663698082 },
              { lng: -43.3244458149999, lat: -19.6646360949999 },
              { lng: -43.324467442, lat: -19.664674782 },
              { lng: -43.326893959, lat: -19.666692919 },
              { lng: -43.3270184029999, lat: -19.667474979 }
            ]
          ]
        }
      ]
    };
    const {
      perimetersPageModel: {
        perimetersForMap,
        perimetersFromApi,
        isFetchingPerimeters
      }
    } = perimetersService.getStore();
    expect(perimetersForMap).toEqual(expectedResponse.perimetersForMap);
    expect(perimetersFromApi).toEqual(expectedResponse.perimetersFromApi);
    expect(isFetchingPerimeters).toBeFalsy();

    perimetersService.perimetersPageModel$.subscribe(perimetersPageModel => {
      const {
        perimetersForMap: perimetersForMapOnSubs,
        perimetersFromApi: perimetersFromApiOnSubs,
        isFetchingPerimeters: isFetchingPerimetersOnSubs
      } = perimetersPageModel;

      expect(perimetersForMapOnSubs).toEqual(expectedResponse.perimetersForMap);
      expect(perimetersFromApiOnSubs).toEqual(
        expectedResponse.perimetersFromApi
      );
      expect(isFetchingPerimetersOnSubs).toBeFalsy();

      done();
    });
  });

  it('should not sync perimeters for perimeters page if api response is not an array', async () => {
    const perimetersService: PerimetersService = TestBed.inject(
      PerimetersService
    );

    jest
      .spyOn(perimetersRepository, 'getOfficialValePerimetersBySite')
      .mockReturnValue(
        new Observable(observer => {
          observer.next(POLYGON_OFFICIAL_PERIMETER_MOCK);
          observer.complete();
        })
      );

    const {
      perimetersPageModel: perimetersPageModelPreUpdate
    } = perimetersService.getStore();
    expect(perimetersPageModelPreUpdate.perimetersForMap).toEqual([]);
    expect(perimetersPageModelPreUpdate.perimetersFromApi).toEqual([]);

    await perimetersService.syncPerimetersPageModelBySite(DEFAULT_SITE_MOCK);

    const {
      perimetersPageModel: perimetersPageModelPostUpdate
    } = perimetersService.getStore();
    expect(perimetersPageModelPostUpdate.perimetersForMap).toEqual([]);
    expect(perimetersPageModelPostUpdate.perimetersFromApi).toEqual([]);
  });

  it('should clear store', async () => {
    const perimetersService: PerimetersService = TestBed.inject(
      PerimetersService
    );

    jest
      .spyOn(perimetersRepository, 'getOfficialValePerimetersBySite')
      .mockReturnValue(
        new Observable(observer => {
          observer.next([POLYGON_OFFICIAL_PERIMETER_MOCK]);
          observer.complete();
        })
      );

    jest.spyOn(perimetersRepository, 'getValePerimetersBySite').mockReturnValue(
      new Observable(observer => {
        observer.next([PERIMETER_MOCK_1]);
        observer.complete();
      })
    );

    await perimetersService.syncPerimetersPageModelBySite(DEFAULT_SITE_MOCK);
    await perimetersService.syncPerimetersBySite(DEFAULT_SITE_MOCK);

    perimetersService.clearPerimetersStore();

    const { perimeters, perimetersPageModel } = perimetersService.getStore();
    expect(perimetersPageModel).toEqual({
      isFetchingPerimeters: false,
      perimetersForMap: [],
      editingPerimeter: null,
      perimetersForMapBackupForEdition: [],
      perimetersFromApi: [],
      drawedPerimeterPolygonMarkers: [],
      drawedPerimeterPolygonValidated: false
    });

    expect(perimeters).toEqual([]);
  });
});
