import { Overlay } from '@angular/cdk/overlay';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { NgxsDispatchPluginModule } from '@ngxs-labs/dispatch-decorator';
import { NgxsModule } from '@ngxs/store';
import { Observable } from 'rxjs';
import { DEFAULT_SITE_MOCK } from '../../../../tests/mocks/site';
import {
  NotificationComponent,
  NotificationService
} from '../../components/presentational/notification';
import { APP_NOTIFICATION_DATA } from '../../components/presentational/notification/notification.token';
import { LocationRepository } from '../../core/repositories/location.repository';
import { BatteryState } from '../../shared/enums/batteryState';
import { NotificationType } from '../../shared/enums/notificationType';
import { MaterialComponentsModule } from '../../shared/material.module';
import { Notification } from '../../shared/models/notification';
import { ThingsService } from '../things/things.service';
import { ThingsState } from '../things/things.state';
import { NotificationsService } from './notifications.service';
import { NotificationsState } from './notifications.state';

describe('Service: NOTIFICATIONS', () => {
  let locationRepository: LocationRepository;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        MaterialComponentsModule,
        NgxsModule.forRoot([ThingsState, NotificationsState]),
        NgxsDispatchPluginModule.forRoot()
      ],
      providers: [
        LocationRepository,
        NotificationService,
        NotificationsService,
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

    locationRepository = TestBed.inject(LocationRepository);

    jest.spyOn(console, 'warn').mockImplementation(() => undefined);
  });

  xit('should update notifications with things containing low battery when things state change', done => {
    const THINGS_MOCK = [
      {
        id: 'ID 1',
        name: 'name 1',
        nameEmployee: 'name employee 1',
        document: 'document 1',
        eventDateTime: '2020-07-17T19:13:47.746Z',
        deviceType: 'SPOT',
        deviceId: '1',
        networkKey: '1',
        latitude: 16,
        longitude: -15,
        batteryState: 'LOW'
      },
      {
        id: 'ID 2',
        name: 'name 2',
        nameEmployee: 'name employee 2',
        document: 'document 2',
        eventDateTime: '2020-07-17T19:13:47.746Z',
        deviceType: 'SPOT',
        deviceId: '2',
        networkKey: '2',
        latitude: 26,
        longitude: -25,
        batteryState: 'GOOD'
      },
      {
        id: 'ID 3',
        name: 'name 3',
        nameEmployee: 'name employee 3',
        document: 'document 3',
        eventDateTime: '2020-07-17T19:13:47.746Z',
        deviceType: 'SPOT',
        deviceId: '3',
        networkKey: '3',
        latitude: 36,
        longitude: -35,
        batteryState: 'LOW'
      }
    ];

    const THINGS_AS_NOTIFICATIONS_MOCK: Notification[] = [
      {
        document: 'document 1',
        description: 'name 1',
        eventDate: new Date('2020-07-17T19:13:47.746Z'),
        type: NotificationType.LowBattery,
        batteryState: BatteryState.Low,
        device: '1',
        deviceType: 'SPOT',
        location: { lat: 16, lng: -15 },
        seen: false
      },
      {
        document: 'document 3',
        description: 'name 3',
        eventDate: new Date('2020-07-17T19:13:47.746Z'),
        type: NotificationType.LowBattery,
        batteryState: BatteryState.Low,
        device: '3',
        deviceType: 'SPOT',
        location: { lat: 36, lng: -35 },
        seen: false
      }
    ];

    const thingsService: ThingsService = TestBed.inject(ThingsService);
    const notificationsService: NotificationsService =
      TestBed.inject(NotificationsService);

    notificationsService.initListeners();
    // onThingsChangeHandler já deveria estar instanciado neste momento

    jest
      .spyOn(locationRepository, 'getAllThingsByLastLocation')
      .mockReturnValue(
        new Observable(observer => {
          observer.next(THINGS_MOCK);
          observer.complete();
        })
      );

    thingsService.syncThingsByLastLocation({ site: DEFAULT_SITE_MOCK });

    notificationsService.notifications$.subscribe(notifications => {
      if (notifications.length > 0) {
        expect(notifications).toEqual(THINGS_AS_NOTIFICATIONS_MOCK);
        done();
      }
    });
  });

  xit('should update the notifications only with the new things, the repeated things must be ignored', done => {
    const THINGS_MOCK = [
      {
        id: 'ID 1',
        name: 'name 1',
        nameEmployee: 'name employee 1',
        document: 'document 1',
        eventDateTime: '2020-07-17T19:13:47.746Z',
        deviceType: 'SPOT',
        deviceId: '1',
        networkKey: '1',
        latitude: 16,
        longitude: -15,
        batteryState: 'LOW'
      },
      {
        id: 'ID 2',
        name: 'name 2',
        nameEmployee: 'name employee 2',
        document: 'document 2',
        eventDateTime: '2020-07-17T19:13:47.746Z',
        deviceType: 'SPOT',
        deviceId: '2',
        networkKey: '2',
        latitude: 26,
        longitude: -25,
        batteryState: 'GOOD'
      },
      {
        id: 'ID 3',
        name: 'name 3',
        nameEmployee: 'name employee 3',
        document: 'document 3',
        eventDateTime: '2020-07-17T19:13:47.746Z',
        deviceType: 'SPOT',
        deviceId: '3',
        networkKey: '3',
        latitude: 36,
        longitude: -35,
        batteryState: 'LOW'
      }
    ];

    const THINGS_PART_2_WITH_ONE_REPEATED_MOCK = [
      {
        id: 'ID 1',
        name: 'name 1',
        nameEmployee: 'name employee 1',
        document: 'document 1',
        eventDateTime: '2020-07-17T19:13:47.746Z',
        deviceType: 'SPOT',
        deviceId: '1',
        networkKey: '1',
        latitude: 16,
        longitude: -15,
        batteryState: 'LOW'
      },
      {
        id: 'ID 5',
        name: 'name 5',
        nameEmployee: 'name employee 5',
        document: 'document 5',
        eventDateTime: '2020-07-17T19:13:47.746Z',
        deviceType: 'SPOT',
        deviceId: '5',
        networkKey: '5',
        latitude: 56,
        longitude: -25,
        batteryState: 'GOOD'
      },
      {
        id: 'ID 6',
        name: 'name 6',
        nameEmployee: 'name employee 6',
        document: 'document 6',
        eventDateTime: '2020-07-17T19:13:47.746Z',
        deviceType: 'SPOT',
        deviceId: '6',
        networkKey: '6',
        latitude: 36,
        longitude: -35,
        batteryState: 'LOW'
      }
    ];

    const THINGS_AS_NOTIFICATIONS_PART_2_WITH_ONE_REPEATED_MOCK: Notification[] =
      [
        {
          document: 'document 1',
          description: 'name 1',
          eventDate: new Date('2020-07-17T19:13:47.746Z'),
          type: NotificationType.LowBattery,
          batteryState: BatteryState.Low,
          device: '1',
          deviceType: 'SPOT',
          location: { lat: 16, lng: -15 },
          seen: false
        },
        {
          document: 'document 3',
          description: 'name 3',
          eventDate: new Date('2020-07-17T19:13:47.746Z'),
          type: NotificationType.LowBattery,
          batteryState: BatteryState.Low,
          device: '3',
          deviceType: 'SPOT',
          location: { lat: 36, lng: -35 },
          seen: false
        },
        {
          document: 'document 6',
          description: 'name 6',
          eventDate: new Date('2020-07-17T19:13:47.746Z'),
          type: NotificationType.LowBattery,
          batteryState: BatteryState.Low,
          device: '6',
          deviceType: 'SPOT',
          location: { lat: 36, lng: -35 },
          seen: false
        }
      ];

    const thingsService: ThingsService = TestBed.inject(ThingsService);
    const notificationsService: NotificationsService =
      TestBed.inject(NotificationsService);

    notificationsService.initListeners();
    // onThingsChangeHandler já deveria estar instanciado neste momento

    jest
      .spyOn(locationRepository, 'getAllThingsByLastLocation')
      .mockReturnValue(
        new Observable(observer => {
          observer.next(THINGS_MOCK);
          observer.complete();
        })
      );

    thingsService.syncThingsByLastLocation({ site: DEFAULT_SITE_MOCK });

    setTimeout(() => {
      jest
        .spyOn(locationRepository, 'getAllThingsByLastLocation')
        .mockReturnValue(
          new Observable(observer => {
            observer.next(THINGS_PART_2_WITH_ONE_REPEATED_MOCK);
            observer.complete();
          })
        );

      thingsService.syncThingsByLastLocation({ site: DEFAULT_SITE_MOCK });

      notificationsService.notifications$.subscribe(notifications => {
        if (notifications.length > 0) {
          expect(notifications).toEqual(
            THINGS_AS_NOTIFICATIONS_PART_2_WITH_ONE_REPEATED_MOCK
          );
          done();
        }
      });
    }, 1000);
  });

  xit('should hasNotifications update to true when updating notifications state', done => {
    const THINGS_MOCK = [
      {
        id: 'ID 1',
        name: 'name 1',
        nameEmployee: 'name employee 1',
        document: 'document 1',
        eventDateTime: '2020-07-17T19:13:47.746Z',
        deviceType: 'SPOT',
        deviceId: '1',
        networkKey: '1',
        latitude: 16,
        longitude: -15,
        batteryState: 'LOW'
      },
      {
        id: 'ID 2',
        name: 'name 2',
        nameEmployee: 'name employee 2',
        document: 'document 2',
        eventDateTime: '2020-07-17T19:13:47.746Z',
        deviceType: 'SPOT',
        deviceId: '2',
        networkKey: '2',
        latitude: 26,
        longitude: -25,
        batteryState: 'GOOD'
      },
      {
        id: 'ID 3',
        name: 'name 3',
        nameEmployee: 'name employee 3',
        document: 'document 3',
        eventDateTime: '2020-07-17T19:13:47.746Z',
        deviceType: 'SPOT',
        deviceId: '3',
        networkKey: '3',
        latitude: 36,
        longitude: -35,
        batteryState: 'LOW'
      }
    ];

    const thingsService: ThingsService = TestBed.inject(ThingsService);
    const notificationsService: NotificationsService =
      TestBed.inject(NotificationsService);

    notificationsService.initListeners();
    // onThingsChangeHandler já deveria estar instanciado neste momento

    jest
      .spyOn(locationRepository, 'getAllThingsByLastLocation')
      .mockReturnValue(
        new Observable(observer => {
          observer.next(THINGS_MOCK);
          observer.complete();
        })
      );

    const { hasNotifications: hasNotificationsPreUpdate } =
      notificationsService.getStore();

    expect(hasNotificationsPreUpdate).toBeFalsy();

    thingsService.syncThingsByLastLocation({ site: DEFAULT_SITE_MOCK });

    const { hasNotifications: hasNotificationsPostUpdate } =
      notificationsService.getStore();

    expect(hasNotificationsPostUpdate).toBeTruthy();

    notificationsService.hasNotifications$.subscribe(hasNotifications => {
      expect(hasNotifications).toBeTruthy();
      done();
    });
  });
});
