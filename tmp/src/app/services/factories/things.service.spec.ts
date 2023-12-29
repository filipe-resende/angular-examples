/* eslint-disable prefer-destructuring */

import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { environment } from 'src/environments/environment';
import { IUserInfoWithRole } from 'src/app/shared/interfaces/iam.interfaces';
import { Roles } from 'src/app/shared/enums/iam.enums';
import { ThingsRepository } from 'src/app/core/repositories/things.repository';
import { ThingsService } from './things.service';
import { mockThings, createThing } from '../../core/utils/tests/mock-things';
import { ThingItem } from '../../model/things-interfaces';
import { AuthService } from '../auth/auth.service';

describe('Things Service (Factory)', () => {
  const BASE_URL = `${environment.thingsManagementApiUrl}/things`;
  const BFF_URL = `${environment.thingsManagementBffUrl}/things`;
  let things = mockThings;
  let service: ThingsService;
  let thingsRepository: ThingsRepository;
  let httpMock: HttpTestingController;
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
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        ThingsService,
        { provide: AuthService, useValue: authServiceStub },
      ],
    });

    httpMock = TestBed.inject(HttpTestingController);
    service = TestBed.inject(ThingsService);
    thingsRepository = TestBed.inject(ThingsRepository);
  });

  describe('Listing Things', () => {
    afterEach(() => httpMock.verify());

    it('should use the GET method', () => {
      service.getAll(0, 10).subscribe();

      const req = httpMock.expectOne(`${BFF_URL}/?skip=0&count=10`);

      expect(req.request.method).toBe('GET');
    });

    it('should pass a skip and count as parameters', () => {
      service.getAll(0, 10).subscribe();

      const req = httpMock.expectOne(`${BFF_URL}/?skip=0&count=10`);
      req.flush({});

      const params = ['skip', 'count'];

      params.forEach((param: string) =>
        expect(req.request.urlWithParams).toContain(param),
      );
    });

    it('should receive a list of things', () => {
      let data = [];
      service.getAll(0, 10).subscribe(() => {
        data = things;
      });

      const req = httpMock.expectOne(`${BFF_URL}/?skip=0&count=10`);
      req.flush(things);

      expect(data.length).toBe(10);
    });
  });

  describe('Fetching a single Application', () => {
    afterEach(() => httpMock.verify());

    it('should pass an id as a parameter', () => {
      service.getById('1').subscribe();

      const req = httpMock.expectOne(`${BFF_URL}/1`);

      expect(req.request.urlWithParams.includes('1')).toBe(true);
    });

    it('should use the GET method', () => {
      service.getById('1').subscribe();

      const req = httpMock.expectOne(`${BFF_URL}/1`);

      expect(req.request.method).toBe('GET');
    });

    it('should get an specific thing', () => {
      let selectedThing;
      service.getById('1').subscribe(() => {
        selectedThing = things[0];
      });

      const req = httpMock.expectOne(`${BFF_URL}/1`);
      req.flush(things[0]);

      expect(selectedThing).toBe(things[0]);
    });
  });

  describe('Creating a Thing', () => {
    let requestBody;

    beforeEach(() => {
      requestBody = createThing(1);
    });

    afterEach(() => httpMock.verify());

    it('should use the POST method', () => {
      thingsRepository.createThing(requestBody).subscribe();
      const req = httpMock.expectOne(BFF_URL);
      expect(req.request.method).toBe('POST');
    });

    it('should send a body object', () => {
      thingsRepository.createThing(requestBody).subscribe();

      const req = httpMock.expectOne(BFF_URL);
      req.flush(requestBody);

      expect(req.request.body).toBe(requestBody);
    });
  });

  describe('Update a Thing', () => {
    let requestBody: ThingItem;

    beforeEach(() => {
      requestBody = things[0];
    });

    afterEach(() => httpMock.verify());

    it('should use the PUT method', () => {
      service.update('1', requestBody).subscribe();

      const req = httpMock.expectOne(`${BFF_URL}/1/false`);
      req.flush({});

      expect(req.request.method).toBe('PUT');
    });

    it('should send a body object', () => {
      service.update('1', requestBody).subscribe();

      const req = httpMock.expectOne(`${BFF_URL}/1/false`);
      req.flush({});

      expect(req.request.body).toBe(requestBody);
    });

    it('The new thing should be different then the original', () => {
      const originalThing = { ...things[0] };
      requestBody.description = 'A new description';

      service.update('1', requestBody).subscribe(() => {
        things = things.filter(el =>
          el.id === requestBody.id ? requestBody : el,
        );
      });

      const req = httpMock.expectOne(`${BFF_URL}/1/false`);
      req.flush(requestBody);

      expect(originalThing.description).not.toBe(things[0].description);
    });

    // it('should fetch a thing by it\'s name', () => {
    //   service.getByName(things[0].name);

    //   const req = httpMock.expectOne()
    // });
  });
});
