import { Point, Polygon, Position } from '@turf/turf';
import { Geofence } from '../../src/app/shared/models/geofence';
import { Marker } from '../../src/app/stores/geofences/geofences.state';

export const CLOCKWISE_POSITIONS_MOCK: Position[] = [
  [-43.890087957763676, -20.42595979028774],
  [-43.875153417968754, -20.411641873170694],
  [-43.85772978820801, -20.429659709553835],
  [-43.87566840209961, -20.438989545542338],
  [-43.890087957763676, -20.42595979028774],
];

export const COUTER_CLOCKWISE_POSITIONS_MOCK: Position[] = [
  [-43.890087957763676, -20.42595979028774],
  [-43.87566840209961, -20.438989545542338],
  [-43.85772978820801, -20.429659709553835],
  [-43.875153417968754, -20.411641873170694],
  [-43.890087957763676, -20.42595979028774],
];

export const MARKERS_CLOCKWISE_FIXED_MOCK: Marker[] = [
  {
    lat: -20.42595979028774,
    lng: -43.890087957763676,
    label: '5',
    labelIndex: 4,
    googleMapsMarkerRef: null,
  },
  {
    lat: -20.438989545542338,
    lng: -43.87566840209961,

    label: '4',
    labelIndex: 3,
    googleMapsMarkerRef: null,
  },
  {
    lat: -20.429659709553835,
    lng: -43.85772978820801,
    label: '3',
    labelIndex: 2,
    googleMapsMarkerRef: null,
  },

  {
    lat: -20.411641873170694,
    lng: -43.875153417968754,
    label: '2',
    labelIndex: 1,
    googleMapsMarkerRef: null,
  },
  {
    lat: -20.42595979028774,
    lng: -43.890087957763676,
    label: '1',
    labelIndex: 0,
    googleMapsMarkerRef: null,
  },
];

export const MARKERS_CLOCKWISE_MOCK: Marker[] = [
  {
    lat: -20.42595979028774,
    lng: -43.890087957763676,
    label: '1',
    labelIndex: 0,
    googleMapsMarkerRef: null,
  },
  {
    lat: -20.411641873170694,
    lng: -43.875153417968754,
    label: '2',
    labelIndex: 1,
    googleMapsMarkerRef: null,
  },
  {
    lat: -20.429659709553835,
    lng: -43.85772978820801,
    label: '3',
    labelIndex: 2,
    googleMapsMarkerRef: null,
  },
  {
    lat: -20.438989545542338,
    lng: -43.87566840209961,

    label: '4',
    labelIndex: 3,
    googleMapsMarkerRef: null,
  },
  {
    lat: -20.42595979028774,
    lng: -43.890087957763676,
    label: '5',
    labelIndex: 4,
    googleMapsMarkerRef: null,
  },
];

export const MARKERS_COUTER_CLOCKWISE_MOCK: Marker[] = [
  {
    lat: -20.42595979028774,
    lng: -43.890087957763676,
    label: '1',
    labelIndex: 0,
    googleMapsMarkerRef: null,
  },
  {
    lat: -20.438989545542338,
    lng: -43.87566840209961,
    label: '2',
    labelIndex: 1,
    googleMapsMarkerRef: null,
  },
  {
    lat: -20.429659709553835,
    lng: -43.85772978820801,
    label: '3',
    labelIndex: 2,
    googleMapsMarkerRef: null,
  },
  {
    lat: -20.411641873170694,
    lng: -43.875153417968754,
    label: '4',
    labelIndex: 3,
    googleMapsMarkerRef: null,
  },
  {
    lat: -20.42595979028774,
    lng: -43.890087957763676,
    label: '5',
    labelIndex: 4,
    googleMapsMarkerRef: null,
  },
];

export const POINT_INSIDE_1: Point = {
  type: 'Point',
  coordinates: [0.5, 0.5],
};

export const POINT_OUTSIDE: Point = {
  type: 'Point',
  coordinates: [-1, 0],
};

export const POINT_INSIDE_2: Point = {
  type: 'Point',
  coordinates: [30, 30],
};

export const POLYGON: Polygon = {
  type: 'Polygon',
  coordinates: [
    [
      [0, 0],
      [0, 1],
      [1, 1],
      [1, 0],
      [0, 0],
    ],
  ],
};

export const POLYGONS: Polygon[] = [
  {
    type: 'Polygon',
    coordinates: [
      [
        [0, 0],
        [0, 1],
        [1, 1],
        [1, 0],
        [0, 0],
      ],
    ],
  },
  {
    type: 'Polygon',
    coordinates: [
      [
        [20, 30],
        [40, 40],
        [50, 20],
        [10, 10],
        [20, 30],
      ],
    ],
  },
];

export const POLYGON_MAPPED_FROM_PERIMETER: Polygon = {
  type: 'Polygon',
  coordinates: [
    [
      [-44.123705789821187, -20.106902196355385],
      [-44.123753725205084, -20.106846745459929],
      [-44.123900375837692, -20.10687112995274],
      [-44.123705789821187, -20.106902196355385],
    ],
  ],
};

export const GEOFENCE: Geofence = {
  categoryId: '1',
  color: '#ffffff',
  coordinates: [
    {lat: 0, lng: 0},
    {lat: 0, lng: 1},
    {lat: 1, lng: 1},
    {lat: 0, lng: 0}
  ],
  description: 'Description',
  id: '1',
  name: 'Name',
  parentId: '1'
}

export const GEOFENCE_CROSSED: Geofence = {
  categoryId: '1',
  color: '#ffffff',
  coordinates: [
    {lat: 2, lng: 2},
    {lat: -0.5, lng: 0.5},
    {lat: -2, lng: -2},
    {lat: 2, lng: 2}
  ],
  description: 'Description',
  id: '1',
  name: 'Name',
  parentId: '1'
}

export const GEOFENCE_NOT_CROSSED: Geofence = {
  categoryId: '1',
  color: '#ffffff',
  coordinates: [
    {lat: 2, lng: 2},
    {lat: 2, lng: 3},
    {lat: 3, lng: 3},
    {lat: 2, lng: 2}
  ],
  description: 'Description 3',
  id: '3',
  name: 'Name 3',
  parentId: '1'
}