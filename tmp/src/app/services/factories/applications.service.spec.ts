/* eslint-disable prefer-destructuring */

import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { environment } from 'src/environments/environment';
import { HttpErrorResponse } from '@angular/common/http';

import { mockApplicationsList } from 'src/app/core/utils/tests/mock-applications';
import { OAuthModule } from 'angular-oauth2-oidc';
import { ApplicationsService } from './applications.service';
import { ApplicationItem } from '../../model/applications-interfaces';
import { AuthService } from '../auth/auth.service';

describe('Applications Service (Factory)', () => {
  const BASE_URL = `${environment.thingsManagementApiUrl}/applications`;
  let service: ApplicationsService;
  let httpMock: HttpTestingController;
  const mockData = mockApplicationsList;
  beforeAll(() => {
    window.onbeforeunload = () => '';
  });
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, OAuthModule.forRoot()],
      providers: [
        ApplicationsService,
        AuthService,
        { provide: Window, useValue: window },
      ],
    });

    httpMock = TestBed.inject(HttpTestingController);
    service = TestBed.inject(ApplicationsService);
  });

  // check for authorization header
  describe('Listing Applications', () => {
    afterEach(() => httpMock.verify());

    it('should use the GET method ', () => {
      service.getAll(0, 10).subscribe();

      const req = httpMock.expectOne(`${BASE_URL}/?skip=0&count=10`);

      expect(req.request.method).toBe('GET');
    });

    // it('should pass a skip and count as parameters', () => {
    //   service.getAll(0, 10).subscribe();

    //   const req = httpMock.expectOne(`${BASE_URL}/?skip=0&count=10`);
    //   req.flush({});

    //   const params = ['skip=0', 'count=10'];

    //   params.forEach((param: string) => {
    //     return expect(req.request.urlWithParams).toContain(param); }
    //   );

    // it('should receive a list of applications', () => {
    //   service.getAll()
    //     .subscribe(response => {
    //       // expect(response).toBeTruthy();
    //       // expect(response.length).toEqual(10);
    //     });
    //   const req = httpMock.expectOne(`${BASE_URL}/?skip=0&count=0`);

    //   req.flush({applications: mockData});
    // });
  });

  describe('Fetching a single Application', () => {
    afterEach(() => httpMock.verify());

    it('should pass an id as a parameter', () => {
      mockData.forEach((element: ApplicationItem) => {
        service.getById(`${element.id}`).subscribe();
        const req = httpMock.expectOne(`${BASE_URL}/${element.id}`);

        expect(req.request.urlWithParams.includes(`${element.id}`)).toBe(true);
      });
    });

    it('should use the GET method ', () => {
      service.getById('1').subscribe();

      const req = httpMock.expectOne(`${BASE_URL}/1`);

      expect(req.request.method).toBe('GET');
    });

    it('should get an specific application', () => {
      let selectedApplication;
      service.getById(`${mockData[0].id}`).subscribe(response => {
        selectedApplication = response;
        expect(selectedApplication).toBe(mockData[0]);
      });

      const req = httpMock.expectOne(`${BASE_URL}/1`);
      req.flush(mockData[0]);
    });
  });

  describe('Applications Errors', () => {
    afterEach(() => httpMock.verify());

    it('should throw an error if the applications saving fails', () => {
      service.getAll(0, 10).subscribe(
        () => fail('the operation should have failed'),
        (error: HttpErrorResponse) => {
          expect(error.status).toBe(404);
          expect(error.message).toContain('Not Found');
        },
      );

      const req = httpMock.expectOne(`${BASE_URL}/?skip=0&count=10`);
      req.flush('Authorization error', {
        status: 404,
        statusText: 'Not Found',
      });
    });
  });
});
