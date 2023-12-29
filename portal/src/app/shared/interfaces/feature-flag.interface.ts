export interface IFeatureFlag {
  name: string;
  value: boolean;
  activeForUser?: boolean;
}
