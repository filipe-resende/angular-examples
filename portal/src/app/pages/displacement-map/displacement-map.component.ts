import { Component, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { MapComponent } from '../../components/smart/map/map.component';
import { Site } from '../../shared/models/site';
import { SitesService } from '../../stores/sites/sites.service';

@Component({
  selector: 'app-displacement-map',
  templateUrl: './displacement-map.component.html',
  styleUrls: ['./displacement-map.component.scss'],
})
export class DisplacementMapComponent implements OnDestroy, AfterViewInit {
  @ViewChild('googleMap') public googleMap: MapComponent;

  constructor(private sitesService: SitesService, private router: Router) {}

  public ngAfterViewInit(): void {
    const { selectedSite } = this.sitesService.getStore();
    this.refreshMapConfiguration(selectedSite);
  }

  public ngOnDestroy(): void {
    this.googleMap.ngOnDestroy();
  }

  public refreshMapConfiguration(site: Site, retryCounter = 0): void {
    if (this.googleMap) {
      this.googleMap.initMap(site.latitude, site.longitude, site.zoom, 'map');
    } else if (retryCounter < 20) {
      setTimeout(() => {
        this.refreshMapConfiguration(site, retryCounter + 1);
      }, 200);
    }
  }

  public onNavigateToDisplacements(): void {
    this.router.navigateByUrl('/displacement-new');
  }
}
