import { TestBed } from '@angular/core/testing';
import { NgxsModule } from '@ngxs/store';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NgxsDispatchPluginModule } from '@ngxs-labs/dispatch-decorator';
import { Observable } from 'rxjs';
import { Overlay } from '@angular/cdk/overlay';
import { PanicAlertState } from './panic-alert.state';
import { PanicAlertService } from './panic-alert.service';
import { NotificationRepository } from '../../core/repositories/notification.repository';
import {
  PANIC_ALERTS_MOCK,
  PANIC_ALERT_1990_MOCK,
  PANIC_ALERT_1995_MOCK,
  PANIC_ALERT_1996_MOCK,
  PANIC_ALERT_2020_MOCK
} from '../../../../tests/mocks/panicAlert';
import { NotificationsService } from '../notifications/notifications.service';
import { ThingsManagmentRepository } from '../../core/repositories/thingsManagment.repository';
import { CacheService } from '../../core/services/cache-service/cache.service';
import { NotificationService } from '../../components/presentational/notification';
import { APP_NOTIFICATION_DATA } from '../../components/presentational/notification/notification.token';
import { DEFAULT_USER_MOCK } from '../../../../tests/mocks/user';
import { UserProfileState } from '../user-profile/user-profile.state';
import { UserProfileService } from '../user-profile/user-profile.service';

describe('Service: PERIMETERS', () => {
  let panicAlertRepository: NotificationRepository;
  let cacheService: CacheService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        NgxsModule.forRoot([PanicAlertState, UserProfileState]),
        NgxsDispatchPluginModule.forRoot()
      ],
      providers: [
        PanicAlertService,
        NotificationRepository,
        NotificationsService,
        ThingsManagmentRepository,
        UserProfileService,
        CacheService,
        NotificationService,
        Overlay,
        { provide: APP_NOTIFICATION_DATA }
      ]
    });

    panicAlertRepository = TestBed.inject(NotificationRepository);
    cacheService = TestBed.inject(CacheService);
    jest.spyOn(console, 'warn').mockImplementation(() => undefined);
  });

  xit('should update alerts array with success', () => {
    const panicAlertService: PanicAlertService =
      TestBed.inject(PanicAlertService);

    const { alerts: alertsPreUpdate } = panicAlertService.getStore();
    expect(alertsPreUpdate).toEqual([]);

    panicAlertService.updatePanicAlerts(PANIC_ALERTS_MOCK);

    const { alerts: alertsPostUpdate } = panicAlertService.getStore();
    expect(alertsPostUpdate).toEqual(PANIC_ALERTS_MOCK);
  });

  xit('should remove the panic alert when mark it as read with success', async () => {
    const panicAlertService: PanicAlertService =
      TestBed.inject(PanicAlertService);
    const userService: UserProfileService = TestBed.inject(UserProfileService);

    const markNotificationAsReadMock = jest
      .spyOn(panicAlertRepository, 'markNotificationAsRead')
      .mockReturnValue(
        new Observable(observer => {
          observer.next();
          observer.complete();
        })
      );

    const updateCacheMock = jest
      .spyOn(cacheService, 'updateCache')
      .mockReturnValue(null);

    userService.setUserProfile(DEFAULT_USER_MOCK);

    const [alertToMarkAsRead, ...PANIC_ALERTS_MOCK_BUT_FIRST] =
      PANIC_ALERTS_MOCK;

    panicAlertService.updatePanicAlerts(PANIC_ALERTS_MOCK);
    await panicAlertService.setAlertAsAware(alertToMarkAsRead);

    const { alerts: alertsPostUpdate } = panicAlertService.getStore();

    expect(alertsPostUpdate).toEqual(PANIC_ALERTS_MOCK_BUT_FIRST);
    expect(markNotificationAsReadMock).toHaveBeenCalledTimes(1);
    expect(updateCacheMock).toHaveBeenCalledTimes(1);
  });

  xit('should reorder alerts to place the selected one into the top and keep the other ordered by date', () => {
    const panicAlertService: PanicAlertService =
      TestBed.inject(PanicAlertService);

    const PANIC_ALERTS_MOCK_INITIAL_ORDENATION = [
      PANIC_ALERT_2020_MOCK,
      PANIC_ALERT_1990_MOCK,
      PANIC_ALERT_1995_MOCK,
      PANIC_ALERT_1996_MOCK
    ];
    panicAlertService.updatePanicAlerts(PANIC_ALERTS_MOCK_INITIAL_ORDENATION);

    const { alerts: alertsPreSetMainAlert } = panicAlertService.getStore();
    expect(alertsPreSetMainAlert).toEqual(PANIC_ALERTS_MOCK_INITIAL_ORDENATION);

    panicAlertService.setAlertAsMainAlert(PANIC_ALERT_1995_MOCK);

    const EXPECTED_RESULT_WITH_1995_AS_MAIN = [
      PANIC_ALERT_1995_MOCK,
      PANIC_ALERT_2020_MOCK,
      PANIC_ALERT_1996_MOCK,
      PANIC_ALERT_1990_MOCK
    ];
    const { alerts: alertsPost1995AlertUpdate } = panicAlertService.getStore();
    expect(alertsPost1995AlertUpdate).toEqual(
      EXPECTED_RESULT_WITH_1995_AS_MAIN
    );

    panicAlertService.setAlertAsMainAlert(PANIC_ALERT_1990_MOCK);

    const EXPECTED_RESULT_WITH_1990_AS_MAIN = [
      PANIC_ALERT_1990_MOCK,
      PANIC_ALERT_2020_MOCK,
      PANIC_ALERT_1996_MOCK,
      PANIC_ALERT_1995_MOCK
    ];
    const { alerts: alertsPost1990AlertUpdate } = panicAlertService.getStore();
    expect(alertsPost1990AlertUpdate).toEqual(
      EXPECTED_RESULT_WITH_1990_AS_MAIN
    );

    panicAlertService.setAlertAsMainAlert(PANIC_ALERT_2020_MOCK);

    const EXPECTED_RESULT_WITH_2020_AS_MAIN = [
      PANIC_ALERT_2020_MOCK,
      PANIC_ALERT_1996_MOCK,
      PANIC_ALERT_1995_MOCK,
      PANIC_ALERT_1990_MOCK
    ];
    const { alerts: alertsPost2020AlertUpdate } = panicAlertService.getStore();
    expect(alertsPost2020AlertUpdate).toEqual(
      EXPECTED_RESULT_WITH_2020_AS_MAIN
    );
  });

  xtest('if panic alert is in state with isAlertAlreadyInState', () => {
    const panicAlertService: PanicAlertService =
      TestBed.inject(PanicAlertService);

    const isInStateWithEmptyState = (
      panicAlertService as any
    ).isAlertAlreadyInState(PANIC_ALERT_2020_MOCK);
    expect(isInStateWithEmptyState).toBeFalsy();

    panicAlertService.updatePanicAlerts(PANIC_ALERTS_MOCK);

    const isInStateWithAllAlertMocks = (
      panicAlertService as any
    ).isAlertAlreadyInState(PANIC_ALERT_2020_MOCK);
    expect(isInStateWithAllAlertMocks).toBeTruthy();
  });

  xit('should create a new CachePanicAlert object with cacheId 1 when there is no repeated deviceSourceInfoId alert in state', () => {
    const panicAlertService: PanicAlertService =
      TestBed.inject(PanicAlertService);

    const createdCachePanicAlert = (
      panicAlertService as any
    ).createNewCachePanicAlertFromPanicAlert(PANIC_ALERT_2020_MOCK);
    expect(createdCachePanicAlert).toEqual({
      ...PANIC_ALERT_2020_MOCK,
      cacheId: 1
    });
  });

  xit(`should create a new CachePanicAlert object with cacheId > 1 when there is
      at least one repeated deviceSourceInfoId alert in state`, () => {
    const panicAlertService: PanicAlertService =
      TestBed.inject(PanicAlertService);

    panicAlertService.updatePanicAlerts([
      PANIC_ALERT_2020_MOCK,
      PANIC_ALERT_2020_MOCK
    ]);

    const createdCachePanicAlert = (
      panicAlertService as any
    ).createNewCachePanicAlertFromPanicAlert(PANIC_ALERT_2020_MOCK);
    expect(createdCachePanicAlert).toEqual({
      ...PANIC_ALERT_2020_MOCK,
      cacheId: 2
    });
  });
});
