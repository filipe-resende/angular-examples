const jsts = require('jsts');

export function mapGoogleMapsPolygonToWicketPolygon(
  polygonA: google.maps.Polygon,
  polygonB: google.maps.Polygon
) {
  // @ts-ignore
  const wicket = new Wkt.Wkt();

  wicket.fromObject(polygonA);
  const wkt1 = wicket.write();

  wicket.fromObject(polygonB);
  const wkt2 = wicket.write();

  return [wkt1, wkt2];
}

export function isWicketPolygonAInteresectingWicketPolygonB(
  wicketPolygonA: any,
  wicketPolygonB: any
) {
  const wktReader = new jsts.io.WKTReader();
  const geom1 = wktReader.read(wicketPolygonA);
  const geom2 = wktReader.read(wicketPolygonB);

  return geom2.intersects(geom1);
}
