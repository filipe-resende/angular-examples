import { GeometryTypes } from "../enums/perimetersTypes";

export class OfficialPerimeter {
  public id: string;
  public name: string;
  public geojson: {
    geometry: {
      type: GeometryTypes;
      coordinates: any;
    };
  };
}
