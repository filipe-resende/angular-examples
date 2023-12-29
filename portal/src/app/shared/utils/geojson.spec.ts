import { TestBed } from '@angular/core/testing';
import {
  isRightHandRuleApplied,
  applyRightHandRule,
  isPointWithinPolygon,
  isPointWithinPolygons,
  mapPerimeterToPolygon,
  isGeofenceCrossesGeofences,
} from './geojson';
import {
  CLOCKWISE_POSITIONS_MOCK,
  COUTER_CLOCKWISE_POSITIONS_MOCK,
  MARKERS_CLOCKWISE_FIXED_MOCK,
  MARKERS_CLOCKWISE_MOCK,
  MARKERS_COUTER_CLOCKWISE_MOCK,
  POINT_INSIDE_1,
  POINT_INSIDE_2,
  POINT_OUTSIDE,
  POLYGON,
  POLYGONS,
  POLYGON_MAPPED_FROM_PERIMETER,
  GEOFENCE,
  GEOFENCE_CROSSED,
  GEOFENCE_NOT_CROSSED,
} from '../../../../tests/mocks/geojson';
import { PERIMETER_MOCK_1 } from '../../../../tests/mocks/perimeters';

describe('GeojsonService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be able to validate right hand rule of a polygon', () => {
    const isValidClockwisePositions = isRightHandRuleApplied(
      CLOCKWISE_POSITIONS_MOCK,
    );

    expect(isValidClockwisePositions).toBe(false);

    const isValidCounterClockwisePositions = isRightHandRuleApplied(
      COUTER_CLOCKWISE_POSITIONS_MOCK,
    );

    expect(isValidCounterClockwisePositions).toBe(true);
  });

  it('should be able to apply right hand rule on a polygon markers', () => {
    const markersClockwise = applyRightHandRule(MARKERS_CLOCKWISE_MOCK);

    expect(markersClockwise).toStrictEqual(MARKERS_CLOCKWISE_FIXED_MOCK);

    expect(MARKERS_CLOCKWISE_MOCK).toBe(MARKERS_CLOCKWISE_MOCK);

    const markersCouterClockwise = applyRightHandRule(
      MARKERS_COUTER_CLOCKWISE_MOCK,
    );

    expect(markersCouterClockwise).toStrictEqual(MARKERS_COUTER_CLOCKWISE_MOCK);
  });

  it('should be able to validate if point is inside polygon', () => {
    const isPointWithinPolygonWithPointInside = isPointWithinPolygon(
      POINT_INSIDE_1,
      POLYGON,
    );

    expect(isPointWithinPolygonWithPointInside).toBeTruthy();

    const isPointWithinPolygonWithPointOutside = isPointWithinPolygon(
      POINT_OUTSIDE,
      POLYGON,
    );

    expect(isPointWithinPolygonWithPointOutside).toBeFalsy();
  });

  it('should be able to validate if point is inside of at least one polygon', () => {
    const isPointWithinPolygonWithPointInsideFirst = isPointWithinPolygons(
      POINT_INSIDE_1,
      POLYGONS,
    );

    expect(isPointWithinPolygonWithPointInsideFirst).toBeTruthy();

    const isPointWithinPolygonWithPointInsideSecond = isPointWithinPolygons(
      POINT_INSIDE_2,
      POLYGONS,
    );

    expect(isPointWithinPolygonWithPointInsideSecond).toBeTruthy();

    const isPointWithinPolygonWithPointOutside = isPointWithinPolygons(
      POINT_OUTSIDE,
      POLYGONS,
    );

    expect(isPointWithinPolygonWithPointOutside).toBeFalsy();
  });

  xit('should be able to map perimeter to a polygon', () => {
    const polygonMapped = mapPerimeterToPolygon(PERIMETER_MOCK_1);

    expect(polygonMapped).toStrictEqual(POLYGON_MAPPED_FROM_PERIMETER);
  });

  it('should be able to validate if a geofence crosses other geofences', () => {
    const isGeofenceCrossesGeofencesWhenDoesCross = isGeofenceCrossesGeofences(
      GEOFENCE,
      [GEOFENCE_CROSSED, GEOFENCE_NOT_CROSSED],
    );

    expect(isGeofenceCrossesGeofencesWhenDoesCross).toBeTruthy();

    const isGeofenceCrossesGeofencesWhenDoesntCross = isGeofenceCrossesGeofences(
      GEOFENCE,
      [GEOFENCE_NOT_CROSSED],
    );

    expect(isGeofenceCrossesGeofencesWhenDoesntCross).toBeFalsy();
  });
});
