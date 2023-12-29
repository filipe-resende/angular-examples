import {
  Component,
  OnInit,
  ViewChild,
  ViewEncapsulation,
  OnDestroy
} from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { MapComponent } from '../../components/smart/map/map.component';
import { PointOfInterest } from '../../shared/models/poi';
import { Site } from '../../shared/models/site';
import { SitesService } from '../../stores/sites/sites.service';
import { PoisService } from '../../stores/pois/pois.service';
import { PoiCategory } from '../../shared/models/poi-category';

@Component({
  selector: 'app-poi',
  templateUrl: './poi.component.html',
  styleUrls: ['./poi.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PoiComponent implements OnInit, OnDestroy {
  @ViewChild('googleMap') public googleMapRef: MapComponent;

  public showAllPoisToggle: boolean;

  public panelOpenState = false;

  public isLeftMenuOpened = false;

  public showSecondTab: any;

  public skeletonArray = Array(6);

  public poiCategorys = [];

  public selectedCategory: any;

  public isFetchingPoi = false;

  public isFetchingPoisCategories = false;

  public poiList: PointOfInterest[] = [];

  public filteredPoiList: PointOfInterest[] = [];

  public sitesList: Site[] = [];

  public selectedIndex = 0;

  public enablePoiMarker: any;

  public selectedSite: Site;

  private subscriptions: Subscription[] = [];

  constructor(
    private sitesService: SitesService,
    private poisService: PoisService
  ) {}

  public ngOnInit(): void {
    this.onSelectedSiteChangeHandler();
    this.onPoisChangeHandler();
    this.onPoisCategoriesChangeHandler();

    this.setupPoisCategories();
  }

  public ngOnDestroy(): void {
    this.poisService.unsubscribe();
  }

  public setSiteOnMap(site: Site): void {
    if (!this.googleMapRef) {
      setTimeout(() => this.setSiteOnMap(site), 300);
      return;
    }

    if (this.googleMapRef) {
      this.googleMapRef.initMap(site.latitude, site.longitude, site.zoom);
    }

    this.showSecondTab = true;
  }

  public toggleAllPois(toggleEvent): void {
    this.showAllPoisToggle = toggleEvent;

    if (this.googleMapRef) {
      if (this.showAllPoisToggle) {
        this.poiList.forEach((poi: PointOfInterest) => {
          this.googleMapRef.setPoiMarker(poi);
        });
      } else {
        this.googleMapRef.clearPoiMarkers();
      }
    }
  }

  public setPoi(poi): void {
    if (this.showAllPoisToggle === false) {
      if (poi.panelOpenState === true) {
        this.googleMapRef.clearPoiMarkers();
        this.googleMapRef.setPoiMarker(poi);
      } else {
        this.googleMapRef.clearPoiMarkers();
      }
    }
  }

  public deletePointOfInterest(poi: PointOfInterest): void {
    this.poisService.delete(poi).then(() => {
      this.googleMapRef.clearPoiMarkers();
      this.toggleFilteredPois();
    });
  }

  public enablePoiCreation(enablePoiMarker: boolean): void {
    this.googleMapRef.setPoiMarkerClickEvent(enablePoiMarker);
  }

  public enablePoiCreationPassingCustomIcon(customIcon?: string): void {
    this.googleMapRef.setPoiMarkerClickEvent(true, customIcon);
  }

  public resetData(): void {
    this.googleMapRef.clearPoiMarkers();
    this.googleMapRef.poiMarkerData = { lat: 0, lng: 0 };
    this.selectedIndex = 0;
    this.syncPoisBySite(this.selectedSite);
  }

  public onSelectCategory(selectedCategory: PoiCategory): void {
    if (!selectedCategory) {
      this.filteredPoiList = this.poiList;
    }

    this.selectedCategory = selectedCategory;
    this.filterPoiListByCategory();
    this.toggleFilteredPois();
  }

  public onTabClick(tab): void {
    if (tab.index === 0) {
      this.selectedIndex = tab.index;
      this.enablePoiCreation(false);
      this.googleMapRef.poiMarkerData = { lat: 0, lng: 0 };
      this.googleMapRef.clearPoiMarkers();
      this.toggleAllPois(this.showAllPoisToggle);
    }

    if (tab.index === 1) {
      this.googleMapRef.poiMarkerData = { lat: 0, lng: 0 };
      this.selectedIndex = tab.index;
      this.googleMapRef.clearPoiMarkers();
      this.enablePoiCreation(true);
    }
  }

  public onToggleClick(event) {
    if (event.source) {
      if (event.checked) {
        this.onSelectCategory(undefined);
      }

      this.toggleAllPois(event.checked);
    }
  }

  public onOpenLeftMenuButtonClick(): void {
    this.isLeftMenuOpened = true;
  }

  public onCloseLeftMenuButtonClick(): void {
    this.isLeftMenuOpened = false;
  }

  private onSelectedSiteChangeHandler(): void {
    const selectedSite$ = this.sitesService.selectedSite$.subscribe(
      selectedSite => {
        this.selectedSite = selectedSite;

        if (selectedSite) {
          this.setSiteOnMap(selectedSite);
          this.syncPoisBySite(selectedSite);
        }
      }
    );

    this.subscriptions.push(selectedSite$);
  }

  private onPoisChangeHandler(): void {
    const pois$ = this.poisService.pois$.subscribe(pois => {
      this.poiList = pois;
      this.filteredPoiList = pois;
      this.showAllPoisToggle = pois.length > 0;

      this.filterPoiListByCategory();

      if (this.googleMapRef) {
        this.googleMapRef.clearPoiMarkers();
      }

      if (window.google) {
        this.toggleFilteredPois();
      } else {
        setTimeout(() => this.toggleFilteredPois(), 1500);
      }
    });

    this.subscriptions.push(pois$);
  }

  private onPoisCategoriesChangeHandler(): void {
    const pois$ = this.poisService.poisCategories$.subscribe(poiCategorys => {
      this.poiCategorys = poiCategorys;
    });

    this.subscriptions.push(pois$);
  }

  private setupPoisCategories(): void {
    this.isFetchingPoisCategories = true;

    this.poisService.syncPoisCategories().finally(() => {
      this.isFetchingPoisCategories = false;
    });
  }

  private syncPoisBySite(site: Site): void {
    this.isFetchingPoi = true;
    this.poisService.syncPoisBySite(site).finally(() => {
      this.isFetchingPoi = false;
    });
  }

  private filterPoiListByCategory(): void {
    if (this.selectedCategory) {
      this.filteredPoiList = this.poiList.filter(
        poi => poi.categoryId === this.selectedCategory.id
      );
    }

    this.sortFilteredPoiList();

    this.showAllPoisToggle =
      this.filteredPoiList.length === this.poiList.length;
  }

  private sortFilteredPoiList() {
    this.filteredPoiList.sort((a, b) => {
      if (a.name < b.name) {
        return -1;
      }

      if (a.name > b.name) {
        return 1;
      }
      return 0;
    });
  }

  private toggleFilteredPois(): void {
    if (this.googleMapRef) {
      this.googleMapRef.clearPoiMarkers();
      this.filteredPoiList.forEach((poi: PointOfInterest) => {
        this.googleMapRef.setPoiMarker(poi);
      });
    }
  }
}
