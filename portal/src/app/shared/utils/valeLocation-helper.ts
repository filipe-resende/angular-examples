import { ValeLocations } from '../models/valeLocations';

export const GetGeofenceNames = (
  valeLocations: ValeLocations[],
  isItForExport: boolean
): string => {
  if (!valeLocations || valeLocations.length === 0) {
    return '-';
  }
  const index = valeLocations.findIndex(vl => vl.index === 0);

  if (index !== -1) {
    valeLocations.splice(index, 1);
  }
  const delimiter = isItForExport ? '; ' : '\n';
  return valeLocations.map(vl => vl.name).join(delimiter) || '-';
};
