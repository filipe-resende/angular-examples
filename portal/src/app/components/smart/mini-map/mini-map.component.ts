import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { PerimetersService } from '../../../stores/perimeters/perimeters.service';
import { SitesService } from '../../../stores/sites/sites.service';
import { AzureMapComponent } from '../azure-map/azure-map.component';

@Component({
  selector: 'app-mini-map',
  templateUrl: './mini-map.component.html',
  styleUrls: ['./mini-map.component.scss']
})
export class MiniMapComponent implements OnInit, OnDestroy {
  @ViewChild(AzureMapComponent) public azureMapRef: AzureMapComponent;

  @Input()
  public eventDirection: string;

  @Input()
  public eventType: string;

  @Input()
  public latitude: any;

  @Input()
  public longitude: any;

  @Input()
  public middleware: any;

  @Input()
  public openMapExpanded = false;

  @Input()
  public panicButtonSite = null;

  public showDecreaseButton = true;

  public showMap = false;

  public expandMap = false;

  public siteZoom: number;

  private perimeters;

  private subscriptions: Subscription[] = [];

  constructor(
    private perimetersService: PerimetersService,
    private sitesService: SitesService
  ) {}

  public ngOnInit(): void {
    if (!this.panicButtonSite) {
      this.siteZoom = this.sitesService.getSelectedSite()?.zoom;
    } else {
      this.setSiteForPanicButton();
    }

    this.setPerimeter();
  }

  public ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  public openMap(): void {
    this.showMap = true;
    const options = {
      center: { lng: this.longitude, lat: this.latitude },
      zoom: this.siteZoom
    };

    if (this.openMapExpanded && !document.fullscreenElement) {
      this.expandMap = true;
      document?.documentElement.requestFullscreen();
      this.showDecreaseButton = false;
    }

    if (this.azureMapRef && this.perimeters && this.siteZoom) {
      this.azureMapRef.setMap(options);
      this.azureMapRef.mapStyleChanged('satellite');
      this.azureMapRef.setPerimetersOnMap(this.perimeters);
      this.azureMapRef.createThingsPositionswithClusters(
        [
          {
            latitude: this.latitude,
            longitude: this.longitude,
            middleware: this.middleware,
            eventDirection: this.eventDirection,
            eventType: this.eventType
          }
        ],
        false
      );
    } else {
      setTimeout(() => this.openMap(), 300);
    }
  }

  public closeMap() {
    this.showMap = false;

    if (document.fullscreenElement) {
      document?.exitFullscreen();
    }
    this.expandMap = false;
  }

  public changeMapSize() {
    if (this.expandMap) {
      document?.exitFullscreen();
    } else {
      document?.documentElement.requestFullscreen();
    }
    this.expandMap = !this.expandMap;
    setTimeout(() => this.azureMapRef.resizeMap(), 300);
  }

  private setPerimeter() {
    this.subscriptions.push(
      this.perimetersService.perimeters$.subscribe(perimeters => {
        this.perimeters = perimeters;
      })
    );
  }

  private setSiteForPanicButton() {
    this.subscriptions.push(
      this.sitesService.sites$.subscribe(sites => {
        if (sites) {
          const siteName = this.panicButtonSite.includes('_')
            ? this.sitesService.getNameSite(sites, this.panicButtonSite)
            : this.panicButtonSite;
          this.siteZoom = sites[0].childrenSites
            .flatMap(elem => elem.childrenSites)
            .find(x => x.name.includes(siteName)).zoom;

          this.perimetersService.syncPerimetersBySite({
            name: siteName,
            latitude: this.latitude,
            longitude: this.longitude,
            zoom: 0,
            radius: 0
          });
        }
      })
    );
  }
}
