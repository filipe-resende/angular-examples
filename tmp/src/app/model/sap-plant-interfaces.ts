export interface SapPlantAll {
  skip: number;
  count: number;
  totalCount: number;
  // eslint-disable-next-line no-use-before-define
  sapPlants: SapPlant[];
}

export interface SapPlant {
  id: string;
  code: number;
  description: string;
}
