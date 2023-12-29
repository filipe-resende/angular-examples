import { TestBed } from '@angular/core/testing';
import { NgxsModule } from '@ngxs/store';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NgxsDispatchPluginModule } from '@ngxs-labs/dispatch-decorator';
import { Observable } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { MaterialComponentsModule } from '../../shared/material.module';
import {
  DevicesRepository,
  DeviceWithThingInfosAndTotalCount
} from '../../core/repositories/devices.repository';

import { DevicesState, DeviceModel, DevicesStateModel } from './devices.state';
import { DevicesService } from './devices.service';
import {
  DEVICE_WITH_THING_MOCK_1,
  DEVICE_WITH_THING_MOCK_2
} from '../../../../tests/mocks/devices';

import { BatteryState } from '../../shared/enums/batteryState';
import { SitesService } from '../sites/sites.service';
import { DEFAULT_SITE_MOCK } from '../../../../tests/mocks/site';
import { SitesState } from '../sites/sites.state';
import { NotificationService } from '../../components/presentational/notification';
import Application from '../../shared/models/application';

describe('Service: DEVICES', () => {
  let devicesRepository: DevicesRepository;
  let deviceService: DevicesService;
  let sitesService: SitesService;
  let notificationService: NotificationService;

  let DEVICE_LIST_RESPONSE_MOCK: DeviceWithThingInfosAndTotalCount;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        MaterialComponentsModule,
        NgxsModule.forRoot([DevicesState, SitesState]),
        NgxsDispatchPluginModule.forRoot()
      ],
      providers: [
        DevicesService,
        DevicesRepository,
        SitesService,
        { provide: NotificationService, useValue: notificationService }
      ]
    });

    jest.spyOn(console, 'warn').mockImplementation(() => undefined);
    devicesRepository = TestBed.inject(DevicesRepository);
    deviceService = TestBed.inject(DevicesService);

    sitesService.updateSelectedSiteModel({
      state: { name: 'Mina', latitude: 0, longitude: 0, radius: 0, zoom: 0 }
    });

    DEVICE_LIST_RESPONSE_MOCK = {
      data: [
        DEVICE_WITH_THING_MOCK_1,
        DEVICE_WITH_THING_MOCK_2,
        DEVICE_WITH_THING_MOCK_1,
        DEVICE_WITH_THING_MOCK_2
      ],
      totalCount: 4
    };
  });

  beforeEach(() => {
    sitesService = TestBed.inject(SitesService);
    devicesRepository = TestBed.inject(DevicesRepository);
    deviceService = TestBed.inject(DevicesService);

    sitesService.updateSelectedSiteModel({
      state: DEFAULT_SITE_MOCK
    });

    DEVICE_LIST_RESPONSE_MOCK = {
      data: [
        DEVICE_WITH_THING_MOCK_1,
        DEVICE_WITH_THING_MOCK_2,
        DEVICE_WITH_THING_MOCK_1,
        DEVICE_WITH_THING_MOCK_2
      ],
      totalCount: 4
    };
  });

  describe('Updating table data', () => {
    beforeEach(() => {
      jest.spyOn(devicesRepository, 'getAllDevicesBySite').mockReturnValue(
        new Observable(observer => {
          observer.next(DEVICE_LIST_RESPONSE_MOCK);
          observer.complete();
        })
      );

      deviceService.fetchNewDevices({ from: '2020-01-01', till: '2020-01-02' });
    });

    xit('should populate device list', () => {
      const { devices } = deviceService.getStore();

      expect(devices.length).toBeGreaterThan(0);
      expect(devices.length).toEqual(DEVICE_LIST_RESPONSE_MOCK.data.length);
    });

    xit('should update totalCount value', () => {
      const { totalCount } = deviceService.getStore();

      expect(totalCount).toBeGreaterThan(0);
      expect(totalCount).toEqual(DEVICE_LIST_RESPONSE_MOCK.totalCount);
    });

    xit('should call mapDeviceWithThingToDeviceModel when the table is populated', () => {
      const devicesServicePrototype = Object.getPrototypeOf(deviceService);
      const mapToDeviceModel = spyOn(
        devicesServicePrototype,
        'mapDeviceWithThingToDeviceModel'
      );
      const { devices } = deviceService.getStore();

      jest.spyOn(devicesRepository, 'getAllDevicesBySite').mockReturnValue(
        new Observable(observer => {
          observer.next(DEVICE_LIST_RESPONSE_MOCK);
        })
      );

      deviceService.fetchNewDevices({ from: '2020-01-01', till: '2020-01-02' });

      expect(DEVICE_WITH_THING_MOCK_1).not.toEqual(devices[0]);
      expect(mapToDeviceModel).toHaveBeenCalled();
    });
  });

  describe('Clearing table', () => {
    beforeEach(() => {
      jest.spyOn(devicesRepository, 'getAllDevicesBySite').mockReturnValue(
        new Observable(observer => {
          observer.next(DEVICE_LIST_RESPONSE_MOCK);
        })
      );

      deviceService.fetchNewDevices({ from: '2020-01-01', till: '2020-01-02' });
    });

    // Clearing
    xit('should clear device list when clearDevicesPageTable() is called', () => {
      const { devices: INITIAL_STATE } = deviceService.getStore();

      deviceService.clearDevicesTable();
      const { devices: UPDATED_STATE } = deviceService.getStore();

      expect(UPDATED_STATE).not.toEqual(INITIAL_STATE);
    });

    xit('should clear totalCount when clearDeviceTable() is called', () => {
      const { totalCount: INITIAL_STATE } = deviceService.getStore();

      deviceService.clearDevicesTable();
      const { totalCount: UPDATED_STATE } = deviceService.getStore();

      expect(UPDATED_STATE).not.toEqual(INITIAL_STATE);
    });

    xit('should clear devicesTablePaginator when clearDeviceTable() is called', () => {
      const { devicesTablePaginator: INITIAL_STATE } = deviceService.getStore();

      deviceService.updatePaginatorState({ ...INITIAL_STATE, page: 2 });
      const { devicesTablePaginator: CURRENT_STATE } = deviceService.getStore();

      expect(INITIAL_STATE).not.toEqual(CURRENT_STATE);

      deviceService.clearDevicesTable();
      const { devicesTablePaginator: CLEARED_STATE } = deviceService.getStore();

      expect(CLEARED_STATE).toEqual(INITIAL_STATE);
    });
  });

  describe('Updating and clearing filters', () => {
    xit('should update deviceNumber state when updateDeviceNumberFilter() is called', () => {
      const { deviceNumber: INITIAL_STATE } = deviceService.getStore();
      const NEW_DEVICE_NUMBER = '12345678';

      deviceService.updateDeviceNumberFilter(NEW_DEVICE_NUMBER);
      const { deviceNumber: UPDATED_STATE } = deviceService.getStore();

      expect(INITIAL_STATE).not.toEqual(UPDATED_STATE);
      expect(UPDATED_STATE).toEqual(NEW_DEVICE_NUMBER);
    });

    xit('should update selectedApplication when updateSelectedApplication is called', () => {
      const { selectedApplication: INITIAL_STATE } = deviceService.getStore();
      const NEW_SELECTED_APPLICATION = { name: 'SPOT', id: '1' } as Application;

      deviceService.updateSelectedApplicationState(NEW_SELECTED_APPLICATION);
      const { selectedApplication: UPDATED_STATE } = deviceService.getStore();

      expect(UPDATED_STATE).toEqual(NEW_SELECTED_APPLICATION);
      expect(INITIAL_STATE).not.toEqual(UPDATED_STATE);
    });

    xit('should clear selectedApplication when clearDeviceFilters is called', () => {
      const { selectedApplication: INITIAL_STATE } = deviceService.getStore();
      const newSelectedApplication = { name: 'SPOT', id: '1' } as Application;

      deviceService.updateSelectedApplication(newSelectedApplication);

      deviceService.clearDeviceFilters();
      const { selectedApplication: UPDATED_STATE } = deviceService.getStore();

      expect(UPDATED_STATE).toEqual({});
      expect(INITIAL_STATE).toEqual(UPDATED_STATE);
    });

    xit('should clear deviceNumber when clearDeviceFilters() is called', () => {
      const { deviceNumber: INITIAL_STATE } = deviceService.getStore();
      const newDeviceNumber = '12345678';

      deviceService.updateDeviceNumberFilter(newDeviceNumber);

      deviceService.clearDeviceFilters();
      const { deviceNumber: UPDATED_STATE } = deviceService.getStore();

      expect(UPDATED_STATE).toBeFalsy();
      expect(INITIAL_STATE).toEqual(UPDATED_STATE);
    });
  });

  describe('Fetching and receiving an error', () => {
    let RETURNED_ERROR: HttpErrorResponse;

    beforeEach(() => {
      RETURNED_ERROR = { status: 404 } as HttpErrorResponse;

      jest.spyOn(devicesRepository, 'getAllDevicesBySite').mockReturnValue(
        new Observable(observer => {
          observer.error(RETURNED_ERROR);
          observer.complete();
        })
      );
    });

    xit('should set devices list state to initial state when fetchNewDevices() throws an error', () => {
      const { devices: INITIAL_STATE } = deviceService.getStore();

      deviceService.fetchNewDevices({ from: '2020-01-01', till: '2020-01-02' });
      const { devices: UPDATED_STATE } = deviceService.getStore();

      expect(UPDATED_STATE).toEqual(INITIAL_STATE);
    });

    xit('should update httpErrorResponse when the fetchNewDevices() throws an error', () => {
      const { httpErrorResponse: INITIAL_STATE } = deviceService.getStore();
      expect(INITIAL_STATE).toEqual(null);

      deviceService.fetchNewDevices({ from: '2020-01-01', till: '2020-01-02' });
      const { httpErrorResponse: UPDATED_STATE } = deviceService.getStore();

      expect(INITIAL_STATE).not.toEqual(UPDATED_STATE);
      expect(UPDATED_STATE).toEqual(RETURNED_ERROR);
    });

    xit('should reset devices state by calling updateDevicesState with inital state when fetchNewDevices() catches an error', () => {
      const updateDevicesState = spyOn(deviceService, 'updateDevicesState');
      const { devices: INITIAL_STATE } = deviceService.getStore();

      deviceService.fetchNewDevices({ from: '2020-01-01', till: '2020-01-02' });

      expect(updateDevicesState).toHaveBeenCalled();
      expect(updateDevicesState).toHaveBeenCalledWith(INITIAL_STATE);
    });
  });

  // TESTE ANTIGO ALTERADO

  xit('should clear store', () => {
    const INITIAL_STATE: DevicesStateModel = deviceService.getStore();
    const MOCK_INITIAL_STATE = {
      devices: [],
      totalCount: 0,
      selectedApplication: {} as Application,
      devicesTablePaginator: { page: 1, perPage: 10, total: 0 },
      httpErrorResponse: null,
      deviceNumber: ''
    };

    expect(INITIAL_STATE).toEqual(MOCK_INITIAL_STATE);

    jest.spyOn(devicesRepository, 'getAllDevicesBySite').mockReturnValue(
      new Observable(observer => {
        observer.next({
          data: [
            DEVICE_WITH_THING_MOCK_1,
            DEVICE_WITH_THING_MOCK_2,
            DEVICE_WITH_THING_MOCK_1,
            DEVICE_WITH_THING_MOCK_2
          ]
        });
        observer.complete();
      })
    );

    deviceService.fetchNewDevices({ from: '2020-01-01', till: '2020-01-02' });
    const CURRENT_STATE: DevicesStateModel = deviceService.getStore();

    expect(INITIAL_STATE).not.toEqual(CURRENT_STATE);

    deviceService.clearDevicesStore();

    const CLEARED_STATE: DevicesStateModel = deviceService.getStore();
    expect(CLEARED_STATE).toEqual(INITIAL_STATE);
  });

  // TESTES ANTIGOS (DÉBITO TÉCNICO)
  // -----------------------------------------------------------------//

  xit('should map from DeviceWithThing To DeviceModel with success', () => {
    const devicesServicePrototype = Object.getPrototypeOf(deviceService);

    const DEVICES_MOCK_1 =
      devicesServicePrototype.mapDeviceWithThingToDeviceModel(
        DEVICE_WITH_THING_MOCK_1
      );

    const mapResponse1: DeviceModel = {
      thingName: 'nameThing 1',
      thingDoc: '111',
      deviceType: 'deviceType 1',
      deviceId: '111',
      lastReport: new Date('2020-01-01'),
      lastLocation: {
        lat: 10,
        lng: 10
      },
      batteryState: BatteryState.Good,
      applicationId: 'applicationId 1',
      batteryPercent: '50%'
    };

    expect(DEVICES_MOCK_1).toEqual(mapResponse1);

    const DEVICES_MOCK_2 =
      devicesServicePrototype.mapDeviceWithThingToDeviceModel(
        DEVICE_WITH_THING_MOCK_2
      );
    const mapResponse2: DeviceModel = {
      thingName: 'nameThing 2',
      thingDoc: '222',
      deviceType: 'deviceType 2',
      deviceId: '222',
      lastReport: new Date('2020-02-02'),
      lastLocation: {
        lat: 20,
        lng: 20
      },
      batteryState: BatteryState.Low,
      applicationId: 'applicationId 2',
      batteryPercent: '50%'
    };

    expect(DEVICES_MOCK_2).toEqual(mapResponse2);
  });

  xit('should update devices state without repeated devices with success', async done => {
    const devicesService: DevicesService = TestBed.inject(DevicesService);
    // const sitesService: SitesService = TestBed.inject(SitesService);
    const devicesServicePrototype = Object.getPrototypeOf(devicesService);

    const DEVICES_MOCK_1 =
      devicesServicePrototype.mapDeviceWithThingToDeviceModel(
        DEVICE_WITH_THING_MOCK_1
      );
    const DEVICES_MOCK_2 =
      devicesServicePrototype.mapDeviceWithThingToDeviceModel(
        DEVICE_WITH_THING_MOCK_2
      );

    jest.spyOn(devicesRepository, 'getAllDevicesBySite').mockReturnValue(
      new Observable(observer => {
        observer.next({
          data: [
            DEVICE_WITH_THING_MOCK_1,
            DEVICE_WITH_THING_MOCK_2,
            DEVICE_WITH_THING_MOCK_1,
            DEVICE_WITH_THING_MOCK_2
          ]
        });
        observer.complete();
      })
    );

    const { devices: devicesInitialState } = devicesService.getStore();
    expect(devicesInitialState).toEqual([]);

    // sitesService.updateSelectedSiteByVale(DEFAULT_SITE_MOCK);

    devicesService.fetchNewDevices({ from: '2020-01-01', till: '2020-01-02' });
    // .then(() => {
    //   const { devices: devicesFinalState } = devicesService.getStore();

    //   expect(devicesFinalState).toEqual([DEVICES_MOCK_1, DEVICES_MOCK_2]);

    //   done();
    // });
  });
});
