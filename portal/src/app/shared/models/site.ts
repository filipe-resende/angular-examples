// eslint-disable-next-line no-shadow
export enum Type {
  Vale = 1,
  Estado = 2,
  Abrangencia = 3,
}

export interface Site {
  name: string;
  latitude: number;
  longitude: number;
  radius: number;
  zoom: number;
  type?: Type;
  id?: string;
  code?: number;
}
