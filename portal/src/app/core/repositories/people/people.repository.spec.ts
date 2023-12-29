import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { getTestBed, TestBed } from '@angular/core/testing';
import { environment } from '../../../../environments/environment';
import { PeopleLogStatus } from '../../../shared/enums/peopleLogStatus';
import { PeopleRepository } from './people.repository';

describe('PeopleRepository', () => {
  let repository: PeopleRepository;
  let injector: TestBed;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PeopleRepository]
    });
    injector = getTestBed();
    repository = TestBed.inject(PeopleRepository);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(repository).toBeTruthy();
  });

  it('#createPeopleLog should called once', () => {
    const site = 'tubarão';
    const email = 'teste@teste.com';
    const status = PeopleLogStatus.Success;

    repository.createPeopleLog(site, email, status);

    const req = httpMock.expectOne(
      `${environment.locationSuiteBff}/api/v1/people/export`
    );
    expect(req.request.method).toBe('POST');
  });
});
