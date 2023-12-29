import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { UserAgreementService } from './user-agreement.service';

describe('UserAgreementService', () => {
  let service: UserAgreementService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(UserAgreementService);
  });

  xit('should be created', () => {
    expect(service).toBeTruthy();
  });
});
