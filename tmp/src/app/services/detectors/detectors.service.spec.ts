import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { DetectorsService } from './detectors.service';

describe('DetectorsService', () => {
  let service: DetectorsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(DetectorsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
