import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { getTestBed, TestBed } from '@angular/core/testing';
import { environment } from '../../../../environments/environment';
import { FeatureFlagsRepository } from './feature-flags.repository';

describe('FeatureFlagRepository', () => {
  let repository: FeatureFlagsRepository;
  let httpMock: HttpTestingController;
  let injector: TestBed;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [FeatureFlagsRepository],
    });
    injector = getTestBed();
    repository = TestBed.inject(FeatureFlagsRepository);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(repository).toBeTruthy();
  });

  it('#getFeatureFlags should return observable with correct value', (done: DoneFn) => {
    const featureFlagsMock = [
      { name: 'DeviceGroupDisclaimer', value: true },
      { name: 'DeviceGroupFiltering', value: true },
    ];

    repository.getFeatureFlags().subscribe(featureFlags => {
      expect(featureFlags.length).toBe(2);
      expect(featureFlags).toEqual(featureFlagsMock);
      done();
    });

    const req = httpMock.expectOne(
      `${environment.locationSuiteBff}/api/v1/feature-flags`,
    );
    expect(req.request.method).toBe('GET');
    req.flush(featureFlagsMock);
  });
});
