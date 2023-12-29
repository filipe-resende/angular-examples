import { IFeatureFlag } from '../../shared/interfaces/feature-flag.interface';

export class SetFeatureFlagsAction {
  public static readonly type = '[FEATURE-FLAGS] Set';

  constructor(public featureFlags: IFeatureFlag[] = []) {}
}
