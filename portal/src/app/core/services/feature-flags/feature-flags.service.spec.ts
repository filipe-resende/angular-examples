/* eslint-disable @typescript-eslint/no-empty-function */

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Observable, of } from 'rxjs';
import { IFeatureFlag } from '../../../shared/interfaces/feature-flag.interface';
import { FeatureFlagsRepository } from '../../repositories/feature-flags/feature-flags.repository';
import { FeatureFlagsService } from './feature-flags.service';

let featureFlagsService: FeatureFlagsService;
const featureFlagsMock: IFeatureFlag[] = [
  { name: 'DeviceGroupDisclaimer', value: true },
  { name: 'DeviceGroupFiltering', value: true }
];
const mockRepository: Partial<FeatureFlagsRepository> = {
  getFeatureFlags(): Observable<IFeatureFlag[]> {
    return new Observable<IFeatureFlag[]>();
  }
};

const spy = jest
  .spyOn(mockRepository, 'getFeatureFlags')
  .mockReturnValue(of(featureFlagsMock));

describe('FeatureFlagService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        FeatureFlagsService,
        {
          provide: FeatureFlagsRepository,
          useValue: mockRepository
        }
      ]
    });
    featureFlagsService = TestBed.inject(FeatureFlagsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be created', () => {
    expect(featureFlagsService).toBeTruthy();
  });

  it('should return mocked value', async (done: DoneFn) => {
    expect(await featureFlagsService.getFeatureFlags()).toBe(featureFlagsMock);
    expect(spy).toHaveBeenCalledTimes(1);
    done();
  });
});
