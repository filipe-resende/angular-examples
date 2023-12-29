import {
  Component,
  OnInit,
  ViewChild,
  ViewEncapsulation,
  OnDestroy,
} from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { MapComponent } from '../../components/smart/map/map.component';
import { Perimeter } from '../../shared/models/perimeter';
import { Site } from '../../shared/models/site';
import { SitesService } from '../../stores/sites/sites.service';
import { PerimetersService } from '../../stores/perimeters/perimeters.service';

export class PerimeterCheckable extends Perimeter {
  public checked: boolean;

  public isFetching?: boolean;
}

@Component({
  selector: 'app-perimeters',
  templateUrl: './perimeters.page.html',
  styleUrls: ['./perimeters.page.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class PerimetersPage implements OnInit, OnDestroy {
  @ViewChild('googleMap') public googleMapRef: MapComponent;

  public showAllPerimetersToggle = true;

  public selectedSite: Site;

  public perimetersList: PerimeterCheckable[] = [];

  public isFetchingPerimeters = false;

  public isLeftMenuOpened = false;

  public isEditing = false;

  public isFetchingPerimetersInPerimeterPageModel$: Observable<boolean>;

  public tabSelected = 0;

  private subscriptions: Subscription[] = [];

  constructor(
    private sitesService: SitesService,
    private perimetersService: PerimetersService,
  ) {}

  public ngOnInit(): void {
    this.isFetchingPerimetersInPerimeterPageModel$ = this.perimetersService.isFetchingPerimetersInPerimeterPageModel$;

    this.onSelectedSiteChangeHandler();
    this.onPerimetersChangeHandler();
  }

  public ngOnDestroy(): void {
    this.perimetersService.clearPerimetersStore();
    this.perimetersService.draw.clear();
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  public onCloseLeftMenuButtonClick() {
    this.isLeftMenuOpened = false;
  }

  public onOpenLeftMenuButtonClick() {
    this.isLeftMenuOpened = true;
  }

  public onTabClick(tab): void {
    if (tab.index === 0) {
      this.tabSelected = tab.index;
    }

    if (tab.index === 1) {
      this.tabSelected = tab.index;
    }
  }

  public selectFirstTab() {
    this.tabSelected = 0;
  }

  public selectSecondTab() {
    this.tabSelected = 1;
  }

  public setTabAsEditing() {
    this.isEditing = true;
  }

  public setTabAsCreating() {
    this.isEditing = false;
  }

  public setPerimeters(perimeter) {
    if (this.showAllPerimetersToggle === false) {
      if (perimeter.panelOpenState === true) {
        this.googleMapRef.setOfficialPerimeters(perimeter);
      }
    }
  }

  public setSiteOnMap(site: Site) {
    if (!this.googleMapRef) {
      setTimeout(() => this.setSiteOnMap(site), 300);
    } else {
      this.googleMapRef.initMap(site.latitude, site.longitude, site.zoom);

      this.isFetchingPerimeters = true;
      this.perimetersService
        .syncPerimetersPageModelBySite(site)
        .finally(() => (this.isFetchingPerimeters = false));
    }
  }

  public toggleAllPerimeters(toggleEvent) {
    if (toggleEvent.source) {
      this.showAllPerimetersToggle = toggleEvent.checked;
    } else {
      this.showAllPerimetersToggle = toggleEvent;
    }

    this.perimetersList.forEach(
      perimeter => (perimeter.checked = this.showAllPerimetersToggle),
    );

    this.updateOfficialPerimetersVisibility();
  }

  public updateOfficialPerimetersVisibility() {
    if (!this.shouldCheckDisplayAllPerimetersToggle()) {
      this.showAllPerimetersToggle = false;
    } else if (this.shouldCheckDisplayAllPerimetersToggle()) {
      this.showAllPerimetersToggle = true;
    }

    if (this.googleMapRef) {
      this.googleMapRef.clearOfficialPerimetersArray();

      this.perimetersList.forEach((perimeter: PerimeterCheckable) => {
        if (perimeter.checked) {
          this.googleMapRef.setOfficialPerimeters(perimeter);
        }
      });
    }
  }

  private onPerimetersChangeHandler(): void {
    const perimeters$ = this.perimetersService.perimetersForMap$.subscribe(
      perimetersForMap => {
        const {
          perimetersPageModel: { editingPerimeter },
        } = this.perimetersService.getStore();
        const shouldUpdatePerimetersVisibility = !editingPerimeter;
        const shouldRerenderWithoutTheEditingPerimeter = !!editingPerimeter;

        if (shouldUpdatePerimetersVisibility) {
          this.perimetersList = perimetersForMap.map(perimeter => ({
            ...perimeter,
            checked: true,
          }));

          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          this.toggleAllPerimeters(!!(window as any).google);

          if (perimetersForMap.length === 0) {
            this.showAllPerimetersToggle = false;
          }
        }

        if (shouldRerenderWithoutTheEditingPerimeter) {
          this.perimetersList = this.perimetersList.filter(
            perimeter => perimeter.perimeterId !== editingPerimeter.perimeterId,
          );
          this.updateOfficialPerimetersVisibility();
        }
      },
    );

    this.subscriptions.push(perimeters$);
  }

  private onSelectedSiteChangeHandler(): void {
    const selectedSite$ = this.sitesService.selectedSite$.subscribe(
      selectedSite => {
        this.selectedSite = selectedSite;

        if (selectedSite) {
          this.setSiteOnMap(selectedSite);
        }
      },
    );

    this.subscriptions.push(selectedSite$);
  }

  private shouldCheckDisplayAllPerimetersToggle() {
    const [uncheckedPerimeter] = this.perimetersList.filter(
      perimeter => !perimeter.checked,
    );

    return !uncheckedPerimeter;
  }
}
