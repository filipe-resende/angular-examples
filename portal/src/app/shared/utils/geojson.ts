import * as turf from '@turf/turf';
import * as _ from 'lodash';
import { Marker } from '../../stores/geofences/geofences.state';
import { Geofence } from '../models/geofence';
import { Perimeter } from '../models/perimeter';

/**
 * Validate if the positions create a valid polygon following the right hand rule
 *
 * @param {Position[]} positions All polygon positions in format [x, y] or [long, lat]
 * @returns {boolean} Whether right hand rule is applied
 */
export function isRightHandRuleApplied(positions: turf.Position[]): boolean {
  return !turf.booleanClockwise(positions);
}

/**
 * Reorder markers to be valid with the right hand rule
 *
 * @param {Marker[]} markers A list of clockwise ordered markers
 * @returns {Marker[]} A list of couter clockwise ordered markers
 */
export function applyRightHandRule(markers: Marker[]): Marker[] {
  const positions = _.chain(markers)
    .orderBy('labelIndex')
    .map<turf.Position>(({ lat, lng }) => [lng, lat])
    .value();

  return isRightHandRuleApplied(positions)
    ? markers
    : _.orderBy(markers, 'labelIndex', 'desc');
}

/**
 * Validate if the point is within the polygon
 *
 * @param {Point} point is a point
 * @param {Polygon} polygon is a polygon
 * @returns {boolean} true if the point is within the polygon
 */
export function isPointWithinPolygon(
  point: turf.Point,
  polygon: turf.Polygon,
): boolean {
  return turf.booleanPointInPolygon(point, polygon);
}

/**
 * Validate if the point is within at least one polygon
 *
 * @param {Point} point it's a Point
 * @param {Polygon[]} polygons it's an Array of polygon
 * @returns {boolean} true if the point is within at least one polygon
 */
export function isPointWithinPolygons(
  point: turf.Point,
  polygons: turf.Polygon[],
): boolean {
  return polygons.some(polygon => isPointWithinPolygon(point, polygon));
}

/**
 * Validate if the polygon is within the polygon
 *
 * @param {Polygon} insidePolygon is a polygon
 * @param {Polygon} outsidePolygon is a polygon
 * @returns {boolean} true if the polygon is within the polygon
 */
export function isPolygonWithinPolygon(
  insidePolygon: turf.Polygon,
  outsidePolygon: turf.Polygon,
): boolean {
  return turf.booleanContains(outsidePolygon, insidePolygon);
}

/**
 * Map a perimeter into a polygon
 *
 * @param {Perimeter} perimeter is a Perimeter
 * @returns {Polygon} a Polygon mapped from the perimeter
 */
export function mapPerimeterToPolygon({ coordinates }: Perimeter): any {
  const coordinatesMapped = coordinates.map(coordinate =>
    coordinate.map(({ lat: y, lng: x }) => [x, y]),
  );

  return turf.polygon(coordinatesMapped);
}

/**
 * Map a geofence into a polygon
 *
 * @param {Geofence} geofence is a Geofence
 * @returns {Polygon} a Polygon mapped from the perimeter
 */
export function mapGeofenceToPolygon({ coordinates }: Geofence): any {
  const coordinatesMapped = [
    coordinates.map<turf.Position>(({ lat, lng }) => [lng, lat]),
  ];

  return turf.polygon(coordinatesMapped);
}

/**
 * Validate if a geofence is within perimeter
 *
 * @param {Geofence} geofence is a Geofence
 * @param {Perimeter} perimeter ia a Perimeter
 * @returns true if perimeter contains the geofence
 */
export function perimetersContainGeofence(
  geofence: Geofence,
  perimeter: Perimeter,
): boolean {
  const insidePolygon = mapGeofenceToPolygon(geofence);
  const outsidePolygon = mapPerimeterToPolygon(perimeter);

  return isPolygonWithinPolygon(insidePolygon, outsidePolygon);
}

export function isGeofenceCrossesGeofences(
  geofenceToCompare: Geofence,
  geofences: Geofence[],
): boolean {
  const geofenceToCompareAsPolygon = mapGeofenceToPolygon(geofenceToCompare);
  const geofencesAsPolygons = geofences.map(mapGeofenceToPolygon);

  return geofencesAsPolygons.some(polygonGeofence =>
    turf.booleanOverlap(geofenceToCompareAsPolygon, polygonGeofence),
  );
}
