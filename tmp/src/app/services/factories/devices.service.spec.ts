/* eslint-disable prefer-destructuring */
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Roles } from 'src/app/shared/enums/iam.enums';
import { IUserInfoWithRole } from 'src/app/shared/interfaces/iam.interfaces';
import { environment } from 'src/environments/environment';
import { mockDevicesList } from '../../core/utils/tests/mock-devices';
import { DeviceItem } from '../../model/devices-interfaces';
import { AuthService } from '../auth/auth.service';
import { DevicesService } from './devices.service';

describe('Devices Service (Factory)', () => {
  const BASE_URL = `${environment.thingsManagementApiUrl}/applications`;
  const BFF_URL = `${environment.thingsManagementBffUrl}`;
  let deviceService: DevicesService;
  let httpMock: HttpTestingController;
  let mockDevice = mockDevicesList;
  const authServiceStub: Partial<AuthService> = {
    getUserInfo(): IUserInfoWithRole {
      return {
        mail: 'C0@vale.com',
        FirstName: 'FirstName',
        UserFullName: 'UserFullName',
        cn: 'C0',
        groupMembership: [],
        role: Roles.Administrador,
      };
    },
  };
  const applicationId = '1';
  const deviceId = '1';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        DevicesService,
        {
          provide: AuthService,
          useValue: authServiceStub,
        },
      ],
    });

    httpMock = TestBed.inject(HttpTestingController);
    deviceService = TestBed.inject(DevicesService);
  });

  describe('Listing Devices', () => {
    afterEach(() => httpMock.verify());

    it('should use the GET method', () => {
      deviceService.getAll(applicationId, 0, 10, '123', true).subscribe();

      const req = httpMock.expectOne(
        `${BFF_URL}/applications/${applicationId}/devices?skip=0&count=10&sourceInfoValue=123&associated=true`,
      );
      expect(req.request.method).toBe('GET');
    });

    it('should receive applicationId, skip and count as a parameter', () => {
      deviceService.getAll(applicationId, 0, 10, '123', true).subscribe();

      const req = httpMock.expectOne(
        `${BFF_URL}/applications/${applicationId}/devices?skip=0&count=10&sourceInfoValue=123&associated=true`,
      );

      req.flush({});

      const params = [applicationId, 'skip', 'count'];
      params.forEach((param: string) => {
        return expect(req.request.urlWithParams).toContain(param);
      });
    });

    // it('should receive a list of devices', () => {
    //   let data = [];
    //   deviceService.getAll(applicationId, 0, 10).
    //     subscribe(response => {
    //       expect(response).toBeTruthy;
    //       data = [...response];
    //       expect(data.length).toEqual(10);
    //     });

    //   const req = httpMock.expectOne(`${BASE_URL}/${applicationId}/devices?skip=0&count=10&sourceInfoValue='deviceId'&associated=true`);
    //   req.flush({ devices: mockDevice });
    // });
  });

  describe('fetching a single Device', () => {
    afterEach(() => httpMock.verify());

    it('should pass an applicationId and deviceId as a parameter', () => {
      mockDevice.forEach((element: DeviceItem) => {
        deviceService
          .getDeviceById(`${element.applicationId}`, `${element.id}`)
          .subscribe();

        const req = httpMock.expectOne(
          `${BFF_URL}/applications/${element.applicationId}/devices/${element.id}`,
        );
        expect(req.request.urlWithParams.includes(`${element.id}`)).toBe(true);
      });
    });

    it('should use the GET method', () => {
      deviceService.getDeviceById(applicationId, '1').subscribe();

      const req = httpMock.expectOne(
        `${BFF_URL}/applications/${applicationId}/devices/1`,
      );

      expect(req.request.method).toBe('GET');
    });

    it('should get an specific device', () => {
      let selectedDevice;

      deviceService
        .getDeviceById(applicationId, `${mockDevice[0].id}`)
        .subscribe(response => {
          selectedDevice = response;
          expect(selectedDevice).toBe(mockDevice[0]);
        });

      const req = httpMock.expectOne(
        `${BFF_URL}/applications/${applicationId}/devices/1`,
      );
      req.flush(mockDevice[0]);
    });

    describe('Creating a Device', () => {
      let requestBody;

      beforeEach(() => {
        requestBody = {
          applicationId: '12',
          name: 'Device 11',
          description: 'Some description',
          sourceInfos: [
            {
              type: 'cpf',
              value: '99999999999',
            },
          ],
        };
      });

      afterEach(() => httpMock.verify());

      it('should use the POST method', () => {
        deviceService.create(requestBody, applicationId).subscribe();

        const req = httpMock.expectOne(`${BASE_URL}/${applicationId}/devices`);

        expect(req.request.method).toBe('POST');
      });

      it('should send a body object', () => {
        deviceService.create(requestBody, applicationId).subscribe();

        const req = httpMock.expectOne(`${BASE_URL}/${applicationId}/devices`);
        req.flush({});

        expect(req.request.body).toBe(requestBody);
      });
    });

    describe('Update a device', () => {
      let requestBody: DeviceItem;

      beforeEach(() => {
        requestBody = mockDevice[0];
      });

      afterEach(() => httpMock.verify());

      it('should use the PUT method', () => {
        deviceService.update(applicationId, deviceId, requestBody).subscribe();

        const req = httpMock.expectOne(
          `${BFF_URL}/applications/${applicationId}/devices/${deviceId}`,
        );
        req.flush({});

        expect(req.request.method).toBe('PUT');
      });

      it('should send a body object', () => {
        deviceService.update(applicationId, deviceId, requestBody).subscribe();

        const req = httpMock.expectOne(
          `${BFF_URL}/applications/${applicationId}/devices/${deviceId}`,
        );
        req.flush({});

        expect(req.request.body).toBe(requestBody);
      });

      it('The new device should be different then the original', () => {
        const originalDevice = { ...mockDevice[0] };
        requestBody.description = 'A new description';

        deviceService
          .update(applicationId, deviceId, requestBody)
          .subscribe(() => {
            mockDevice = mockDevice.filter(el =>
              el.id === requestBody.id ? requestBody : el,
            );
          });

        const req = httpMock.expectOne(
          `${BFF_URL}/applications/${applicationId}/devices/${deviceId}`,
        );
        req.flush(requestBody);

        expect(originalDevice.description).not.toBe(mockDevice[0].description);
      });
    });

    // it('should get a single device by its sourceInfos', () => {
    //   deviceService.getBySourceInfo('1', 'deviceId').subscribe();

    //   const req = httpMock.expectOne(
    //     `${BASE_URL}/${applicationId}/devices/bySourceInfo/deviceId/123`,
    //   );
    //   expect(req.request.method).toBe('GET');
    // });
    // fit('should get a single device by its sourceInfos', () => {
    //   deviceService.getBySourceInfo('1', mockDevice[0].sourceInfos.type, mockDevice[0].sourceInfos.value).subscribe();

    //   const req = httpMock.expectOne(`${BASE_URL}/${applicationId}/devices/bySourceInfo/${mockDevice[0].sourceInfos.type}/${mockDevice[0].sourceInfos.value}`);
    //   req.flush('xxxxx');
    // });
  });
});
