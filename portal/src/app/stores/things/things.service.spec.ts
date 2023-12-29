import { TestBed } from '@angular/core/testing';
import { NgxsModule } from '@ngxs/store';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NgxsDispatchPluginModule } from '@ngxs-labs/dispatch-decorator';
import { Overlay } from '@angular/cdk/overlay';
import { Observable } from 'rxjs';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MaterialComponentsModule } from '../../shared/material.module';

import { ThingsState } from './things.state';
import { ThingsService } from './things.service';

import {
  NotificationService,
  NotificationComponent
} from '../../components/presentational/notification';

import {
  LocationRepository,
  LocationRepositoryDocumentType
} from '../../core/repositories/location.repository';

import { Thing } from '../../shared/models/thing';
import { DEFAULT_SITE_MOCK } from '../../../../tests/mocks/site';
import {
  THINGS_LIST_MOCK_1,
  THINGS_LIST_MOCK_2
} from '../../../../tests/mocks/things';

import { APP_NOTIFICATION_DATA } from '../../components/presentational/notification/notification.token';

fdescribe('Service: THINGS', () => {
  let locationRepository: LocationRepository;
  let notificationService: NotificationService;
  let translateService: TranslateService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot(),
        HttpClientTestingModule,
        MaterialComponentsModule,
        NgxsModule.forRoot([ThingsState]),
        NgxsDispatchPluginModule.forRoot()
      ],
      providers: [
        TranslateService,
        LocationRepository,
        NotificationService,
        ThingsService,
        Overlay,
        { provide: APP_NOTIFICATION_DATA }
      ],
      declarations: [NotificationComponent]
    }).overrideModule(BrowserDynamicTestingModule, {
      set: {
        entryComponents: [NotificationComponent]
      }
    });

    locationRepository = TestBed.get(LocationRepository);
    notificationService = TestBed.get(NotificationService);
    translateService = TestBed.get(TranslateService);
    jest.spyOn(console, 'warn').mockImplementation(() => undefined);
    jest.spyOn(translateService, 'get').mockImplementation(() => undefined);
  });

  xit('should update things', () => {
    const THINGS_MOCK: Thing[] = [
      {
        id: '1',
        name: 'thing name 1'
      },
      {
        id: '2',
        name: 'thing name 2'
      }
    ];

    const thingsService: ThingsService = TestBed.get(ThingsService);

    const thingsPreUpdate: Thing[] = thingsService.getThings();
    expect(thingsPreUpdate).toEqual([]);

    thingsService.updateThings(THINGS_MOCK);

    const thingsPostUpdate: Thing[] = thingsService.getThings();
    expect(thingsPostUpdate).toEqual(THINGS_MOCK);
  });

  xit('should sync things by last location from repository to the state', async done => {
    const THINGS_MOCK: Thing[] = [
      {
        id: '1',
        name: 'thing name 1',
        document: 'doc'
      },
      {
        id: '2',
        name: 'thing name 2',
        document: 'doc'
      }
    ];

    const thingsService: ThingsService = TestBed.get(ThingsService);
    const { things$ } = thingsService;
    const { thingsCount$ } = thingsService;
    const getAllThingsByLastLocationMock = jest
      .spyOn(locationRepository, 'getAllThingsByLastLocation')
      .mockReturnValue(
        new Observable(observer => {
          observer.next(THINGS_MOCK);
          observer.complete();
        })
      );
    const countAllThingsByLastLocationMock = jest
      .spyOn(locationRepository, 'countAllThingsByLastLocation')
      .mockReturnValue(
        new Observable(observer => {
          observer.next(THINGS_MOCK.length);
          observer.complete();
        })
      );

    await thingsService.syncThingsByLastLocation({ site: DEFAULT_SITE_MOCK });

    const things = thingsService.getThings();

    things$.subscribe(thingsUpdated => {
      expect(thingsUpdated).toEqual(THINGS_MOCK);

      thingsCount$.subscribe(thingsCountUpdated => {
        expect(thingsCountUpdated).toEqual(THINGS_MOCK.length);
        done();
      });
    });

    expect(things).toEqual(THINGS_MOCK);
    expect(getAllThingsByLastLocationMock).toHaveBeenCalledTimes(1);
    expect(countAllThingsByLastLocationMock).toHaveBeenCalledTimes(1);
  });

  xit('should sync thing tracking by thing id to the state', async done => {
    const DEVICES_LOCATION_MOCK = {
      id: '22',
      name: 'name',
      document: 'C0',
      devicesLocation: [
        {
          eventDateTime: '2020-01-01',
          deviceType: 'SPOT',
          deviceId: '11',
          latitude: 15,
          longitude: -20,
          deviceName: '',
          batteryState: 'GOOD'
        },
        {
          eventDateTime: '2020-01-01',
          deviceType: 'SPOT',
          deviceId: '22',
          latitude: 15,
          deviceName: '',
          longitude: -20,
          batteryState: 'BAD'
        }
      ]
    };
    const DATE_FROM_MOCK = '2020-07-07T00:00:00Z';
    const DATE_TILL_MOCK = '2020-08-08T00:00:00Z';

    const thingsService: ThingsService = TestBed.get(ThingsService);
    const { thingTracking$ } = thingsService;

    const getMultipleDevicesLocationByThingMock = jest
      .spyOn(locationRepository, 'getMultipleDevicesLocationByThing')
      .mockReturnValue(
        new Observable(observer => {
          observer.next(DEVICES_LOCATION_MOCK);
          observer.complete();
        })
      );
    const getMultipleDevicesLocationByDocumentMock = jest
      .spyOn(locationRepository, 'getMultipleDevicesLocationByDocument')
      .mockReturnValue(
        new Observable(observer => {
          observer.next(DEVICES_LOCATION_MOCK);
          observer.complete();
        })
      );

    thingTracking$.subscribe(thingTracking => {
      if (thingTracking && !!thingTracking.thingId) {
        expect(thingTracking.thingId).toEqual(DEVICES_LOCATION_MOCK.id);
        expect(thingTracking.devicesLocation).toEqual(
          DEVICES_LOCATION_MOCK.devicesLocation
        );
        expect(thingTracking.lastDeviceLocation).toEqual(
          DEVICES_LOCATION_MOCK.devicesLocation[
            DEVICES_LOCATION_MOCK.devicesLocation.length - 1
          ]
        );
        expect(thingTracking.filteredFrom).toEqual(DATE_FROM_MOCK);
        expect(thingTracking.filteredTill).toEqual(DATE_TILL_MOCK);

        done();
      }
    });

    await thingsService.syncThingTracking(
      DEVICES_LOCATION_MOCK.id,
      null,
      DATE_FROM_MOCK,
      DATE_TILL_MOCK
    );

    expect(getMultipleDevicesLocationByThingMock).toHaveBeenCalledTimes(1);
    expect(getMultipleDevicesLocationByDocumentMock).toHaveBeenCalledTimes(0);
  });

  xit('should sync thing tracking by thing document to the state', async done => {
    const DEVICES_LOCATION_MOCK = {
      id: '22',
      name: 'name',
      document: 'C0',
      devicesLocation: [
        {
          eventDateTime: '2020-01-01',
          deviceType: 'SPOT',
          deviceId: '11',
          latitude: 15,
          longitude: -20,
          batteryState: 'GOOD',
          deviceName: ''
        },
        {
          eventDateTime: '2020-01-01',
          deviceType: 'SPOT',
          deviceId: '22',
          latitude: 15,
          longitude: -20,
          batteryState: 'BAD',
          deviceName: ''
        }
      ]
    };
    const DATE_FROM_MOCK = '2020-07-07T00:00:00Z';
    const DATE_TILL_MOCK = '2020-08-08T00:00:00Z';

    const thingsService: ThingsService = TestBed.get(ThingsService);
    const { thingTracking$ } = thingsService;

    const getMultipleDevicesLocationByThingMock = jest
      .spyOn(locationRepository, 'getMultipleDevicesLocationByThing')
      .mockReturnValue(
        new Observable(observer => {
          observer.next(DEVICES_LOCATION_MOCK);
          observer.complete();
        })
      );
    const getMultipleDevicesLocationByDocumentMock = jest
      .spyOn(locationRepository, 'getMultipleDevicesLocationByDocument')
      .mockReturnValue(
        new Observable(observer => {
          observer.next(DEVICES_LOCATION_MOCK);
          observer.complete();
        })
      );

    thingTracking$.subscribe(thingTracking => {
      if (thingTracking && !!thingTracking.document) {
        expect(thingTracking.document).toEqual(DEVICES_LOCATION_MOCK.document);
        expect(thingTracking.devicesLocation).toEqual(
          DEVICES_LOCATION_MOCK.devicesLocation
        );
        expect(thingTracking.lastDeviceLocation).toEqual(
          DEVICES_LOCATION_MOCK.devicesLocation[
            DEVICES_LOCATION_MOCK.devicesLocation.length - 1
          ]
        );
        expect(thingTracking.filteredFrom).toEqual(DATE_FROM_MOCK);
        expect(thingTracking.filteredTill).toEqual(DATE_TILL_MOCK);

        done();
      }
    });

    await thingsService.syncThingTracking(
      null,
      {
        thingDocument: DEVICES_LOCATION_MOCK.document,
        thingDocumentType: LocationRepositoryDocumentType.cpf
      },
      DATE_FROM_MOCK,
      DATE_TILL_MOCK
    );

    expect(getMultipleDevicesLocationByThingMock).toHaveBeenCalledTimes(0);
    expect(getMultipleDevicesLocationByDocumentMock).toHaveBeenCalledTimes(1);
  });

  xit('should set things empty on sync things by last location with error', async done => {
    const thingsService: ThingsService = TestBed.get(ThingsService);

    jest
      .spyOn(locationRepository, 'getAllThingsByLastLocation')
      .mockReturnValue(
        new Observable(observer => {
          observer.error();
        })
      );

    try {
      await thingsService.syncThingsByLastLocation({ site: DEFAULT_SITE_MOCK });
    } catch {
      const things = thingsService.getThings();

      expect(things).toEqual([]);
      done();
    }
  });

  xit('should set things count 0 on sync things counter by last Location with error', async done => {
    const thingsService: ThingsService = TestBed.get(ThingsService);

    jest
      .spyOn(locationRepository, 'countAllThingsByLastLocation')
      .mockReturnValue(
        new Observable(observer => {
          observer.error();
        })
      );
    jest
      .spyOn(locationRepository, 'getAllThingsByLastLocation')
      .mockReturnValue(
        new Observable(observer => {
          observer.next([]);
          observer.complete();
        })
      );

    await thingsService.syncThingsByLastLocation({ site: DEFAULT_SITE_MOCK });
    const { thingsCount } = thingsService.getStore();

    expect(thingsCount).toEqual(0);
    done();
  });

  xit('should set thing tracking null on sync thing tracking with error', async done => {
    const thingsService: ThingsService = TestBed.get(ThingsService);

    jest
      .spyOn(locationRepository, 'getMultipleDevicesLocationByThing')
      .mockReturnValue(
        new Observable(observer => {
          observer.error();
        })
      );

    try {
      await thingsService.syncThingTracking('MOCK');
    } catch {
      thingsService.thingTracking$.subscribe(thingTracking => {
        expect(thingTracking).toEqual(null);

        done();
      });
    }
  });

  xit('should get error when trying to call sync thing tracking without passing thing Id or thing Document', async done => {
    const thingsService: ThingsService = TestBed.get(ThingsService);

    try {
      await thingsService.syncThingTracking();
    } catch (error) {
      expect(error).toEqual(
        'thingId or thindDocument must be informed in order to sync the thing tracking'
      );

      done();
    }
  });

  xit('should display notification when user didnt report positions when try to sync thing track by thing Id', async done => {
    const DEVICES_LOCATION_EMPTY_MOCK = {
      id: '22',
      name: 'name',
      document: 'C0',
      devicesLocation: []
    };

    const thingsService: ThingsService = TestBed.get(ThingsService);

    jest
      .spyOn(locationRepository, 'getMultipleDevicesLocationByThing')
      .mockReturnValue(
        new Observable(observer => {
          observer.next(DEVICES_LOCATION_EMPTY_MOCK);
          observer.complete();
        })
      );

    const notificationWarningMock = jest.spyOn(notificationService, 'warning');

    await thingsService.syncThingTracking(DEVICES_LOCATION_EMPTY_MOCK.id);

    expect(notificationWarningMock).toHaveBeenCalled();

    done();
  });

  xit('should display notification when user didnt report positions when try to sync thing track by thing Document', async done => {
    const DEVICES_LOCATION_EMPTY_MOCK = {
      id: '22',
      name: 'name',
      document: 'C0',
      devicesLocation: []
    };

    const thingsService: ThingsService = TestBed.get(ThingsService);

    jest
      .spyOn(locationRepository, 'getMultipleDevicesLocationByDocument')
      .mockReturnValue(
        new Observable(observer => {
          observer.next(DEVICES_LOCATION_EMPTY_MOCK);
          observer.complete();
        })
      );

    const notificationWarningMock = jest.spyOn(notificationService, 'warning');

    await thingsService.syncThingTracking(null, {
      thingDocument: DEVICES_LOCATION_EMPTY_MOCK.document,
      thingDocumentType: LocationRepositoryDocumentType.cpf
    });

    expect(notificationWarningMock).toHaveBeenCalled();

    done();
  });
});
