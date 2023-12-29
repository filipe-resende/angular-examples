export interface DetectorItem {
  id: string;
  name: string;
  type: string;
  applicationId: string;
  areaId: string;
  isAreaAccessPoint: boolean;
  position: {
    geographic: {
      type: string;
      coordinates: [];
    };
  };
  createdAt?: string;
  updatedAt?: string;
  active: boolean;
}
export interface Detectors {
  applicationId: string;
  offset: number;
  count: number;
  detectors: DetectorItem[];
}
