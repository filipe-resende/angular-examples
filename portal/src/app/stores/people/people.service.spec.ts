import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { PeopleRepository } from '../../core/repositories/people/people.repository';
import { PeopleService } from '../../core/services/people-service/people-service';

describe('PeopleService', () => {
  let peopleService: PeopleService;
  const mockPeopleRepository: Partial<PeopleRepository> = {};

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        PeopleService,
        {
          provide: PeopleRepository,
          useValue: mockPeopleRepository
        }
      ]
    });
    peopleService = TestBed.inject(PeopleService);
  });

  it('should be created', () => {
    expect(peopleService).toBeTruthy();
  });
});
