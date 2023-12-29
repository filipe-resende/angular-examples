import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { SmsService } from './sms.service';

describe('SmsService', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    })
  );

  it('should be created', () => {
    const service: SmsService = TestBed.inject(SmsService);
    expect(service).toBeTruthy();
  });
});
