import { TestBed } from '@angular/core/testing';

import { SourceInfosValidatorService } from './source-infos-validator.service';

describe('SourceInfosValidatorService', () => {
  let service: SourceInfosValidatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SourceInfosValidatorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
