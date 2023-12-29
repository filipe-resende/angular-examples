import { Injectable } from '@angular/core';

declare let google: any;

@Injectable({
  providedIn: 'root',
})
export class MapSetup {
  private renderer2: any;

  public setup(
    lat: number,
    lng: number,
    zoom: number,
    mapRef: any,
    renderer2,
    type?: string,
  ) {
    this.renderer2 = renderer2;

    const mapElement: any = document.getElementById('map');

    if (mapElement.angularComponent && !mapElement.angularComponent.lat) {
      mapElement.angularComponent.lat = lat;
      mapElement.angularComponent.lng = lng;
      mapElement.angularComponent.zoom = zoom;

      if (type) {
        this.loadScriptInitMapElement();
      } else {
        this.loadScriptInitMapElementSatellite();
      }

      this.loadScriptGoogle();
      this.loadScriptGoogleCluster();
    } else if (google) {
      const position = new google.maps.LatLng(lat, lng);

      mapRef.setZoom(zoom);
      mapRef.panTo(position);
    }
  }

  private executeInitMapElement() {
    const scriptInitMapElement: any = document.getElementById(
      'executeInitMapElement',
    );

    if (!scriptInitMapElement) {
      const scriptInitMap = document.createElement('script');
      scriptInitMap.id = 'executeInitMapElement';
      scriptInitMap.text = `
        initMapElement();
      `;
      scriptInitMap.async = true;
      scriptInitMap.defer = true;

      document.getElementById('scriptMap').appendChild(scriptInitMap);
    }
  }

  private loadScriptInitMapElementSatellite() {
    const scriptInitMapElement: any = document.getElementById(
      'scriptInitMapElement',
    );

    if (!scriptInitMapElement) {
      const scriptInitMap = this.renderer2.createElement('script');
      scriptInitMap.id = 'scriptInitMapElement';
      scriptInitMap.text = `
      function initMapElement() {

        var mapElement = document.getElementById('map');
          if(mapElement.children.length==0){
            var  map = new google.maps.Map(mapElement, {
              center: {lat: mapElement.angularComponent.lat,
              lng: mapElement.angularComponent.lng},
              zoom: mapElement.angularComponent.zoom,
              mapTypeId: 'satellite',
              streetViewControl: false
            });
          }else{
            google.maps.event.trigger(map, 'resize');
          }
          mapElement.angularComponent.callBack.call(mapElement.angularComponent.scope, map);
        }
      `;
      scriptInitMap.async = true;
      scriptInitMap.defer = true;

      document.getElementById('scriptMap').appendChild(scriptInitMap);
    }
  }

  private loadScriptInitMapElement() {
    const scriptInitMapElement: any = document.getElementById(
      'scriptInitMapElement',
    );

    if (!scriptInitMapElement) {
      const scriptInitMap = this.renderer2.createElement('script');
      scriptInitMap.id = 'scriptInitMapElement';
      scriptInitMap.text = `
      function initMapElement() {

        var mapElement = document.getElementById('map');
          if(mapElement.children.length==0){
            var  map = new google.maps.Map(mapElement, {
              center: {lat: mapElement.angularComponent.lat,
              lng: mapElement.angularComponent.lng},
              zoom: mapElement.angularComponent.zoom,
              mapTypeId: 'roadmap',
              streetViewControl: false,
              mapTypeControl: false,
              fullscreenControl: false,
              scaleControl: true,
            });

          }else{
            google.maps.event.trigger(map, 'resize');
          }
          mapElement.angularComponent.callBack.call(mapElement.angularComponent.scope, map);
        }
      `;
      scriptInitMap.async = true;
      scriptInitMap.defer = true;

      document.getElementById('scriptMap').appendChild(scriptInitMap);
    }
  }

  private loadScriptGoogle() {
    if (!(window as any).google) {
      const s = this.renderer2.createElement('script');

      s.type = 'text/javascript';
      s.id = 'scriptGoogle';
      s.load = s.id;
      s.src =
        'https://maps.googleapis.com/maps/api/js' +
        '?key=AIzaSyA_Yk17iTjZHtF6gaRla_gXpqk61tGfgRM&callback=initMapElement&libraries=visualization';
      s.text = ``;
      s.async = true;
      s.defer = true;
      document.getElementById('scriptMap').appendChild(s);
    } else {
      this.executeInitMapElement();
    }
  }

  private loadScriptGoogleCluster() {
    const scriptGoogleCluster: any = document.getElementById(
      'scriptGoogleCluster',
    );

    if (!scriptGoogleCluster) {
      const sCluster = document.createElement('script');
      sCluster.type = 'text/javascript';
      sCluster.id = 'scriptGoogleCluster';
      sCluster.src =
        'https://developers.google.com/maps/documentation' +
        '/javascript/examples/markerclusterer/markerclusterer.js';
      sCluster.text = ``;
      sCluster.async = true;
      sCluster.defer = true;
      document.getElementById('scriptMap').appendChild(sCluster);
    }
  }
}
