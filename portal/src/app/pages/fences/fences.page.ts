import {
  Component,
  OnInit,
  ViewChild,
  ViewEncapsulation,
  OnDestroy
} from '@angular/core';

import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { MapComponent } from '../../components/smart/map/map.component';

import { Geofence } from '../../shared/models/geofence';
import { Site } from '../../shared/models/site';
import { GeofenceRepository } from '../../core/repositories/geofence.repository';
import { SitesService } from '../../stores/sites/sites.service';
import { GeofencesService } from '../../stores/geofences/geofences.service';
import { Extensions } from '../../shared/extensions';
import { FencesInstructionsOverlayComponent } from '../../components/templates/fences-instructions-overlay/fences-instructions-overlay.component';
import { FencesDeleteModalComponent } from './fences-delete-modal/fences-delete-modal.component';
import { PerimetersService } from '../../stores/perimeters/perimeters.service';
import { ModalStatusComponent } from '../../components/presentational/modal-status/modal-status.component';
import { UserProfileService } from '../../stores/user-profile/user-profile.service';

export class GeofenceCheckable extends Geofence {
  public checked: boolean;
}

@Component({
  selector: 'app-fences',
  templateUrl: './fences.page.html',
  styleUrls: ['./fences.page.scss'],
  encapsulation: ViewEncapsulation.None
})
export class FencesPage implements OnInit, OnDestroy {
  @ViewChild('googleMap') public googleMapRef: MapComponent;

  public showSecondTab = false;

  public showLoading = false;

  public panelOpenState = false;

  public lastSiteNameSelected: string;

  public enablePolyline = false;

  public geofenceDrawn = false;

  public showAllGeofencesToggle: boolean;

  public selectedSite: Site;

  public geofenceList: GeofenceCheckable[] = [];

  public name: string;

  public desc: string;

  public selectedIndex = 0;

  public isFetchingGeofences = false;

  public isLeftMenuOpened = true;

  public geofenceDeletionSuccess: string;

  public geofenceDeletionForbidden: string;

  public geofenceDeletionFail: string;

  private subscriptions: Subscription[] = [];

  constructor(
    private geofenceRepository: GeofenceRepository,
    private sitesService: SitesService,
    private geofencesService: GeofencesService,
    private snackbar: MatSnackBar,
    private dialog: MatDialog,
    private userProfileService: UserProfileService,
    private perimetersService: PerimetersService,
    private translateService: TranslateService
  ) {}

  public ngOnInit(): void {
    this.onSelectedSiteChangeHandler();
    this.onGeofencesChangeHandler();
    this.setupTranslations();
  }

  public ngOnDestroy(): void {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  public onTabClick(selectedTab: MatTabChangeEvent): void {
    if (selectedTab.index === 0) {
      this.selectedIndex = selectedTab.index;
      this.googleMapRef.polyLines = [];
      this.googleMapRef.clearPolyline();
      this.enablePolylineCreation(false);
    } else if (selectedTab.index === 1) {
      this.mapClickabilityHandler();
      this.selectedIndex = selectedTab.index;
      this.enablePolylineCreation(false);
      this.onDisplayInstructionsOverlay();
    }
  }

  public onOpenLeftMenuButtonClick(): void {
    this.onGeofencesChangeHandler();
    this.isLeftMenuOpened = true;
  }

  public onCloseLeftMenuButtonClick(): void {
    this.isLeftMenuOpened = false;
  }

  public setSiteOnMap(site: Site): void {
    if (this.googleMapRef) {
      if (site) {
        this.googleMapRef.initMap(site.latitude, site.longitude, site.zoom);
      }

      this.showSecondTab = true;
      this.syncGeofencesBySite(site);
    } else {
      setTimeout(() => this.setSiteOnMap(site), 300);
    }
  }

  public panToSelected(marker: any): void {
    if (marker) {
      if (marker.latitude) {
        const { latitude, longitude, zoom } = marker;
        this.googleMapRef.panTo({ latitude, longitude, zoom });
      } else if (marker.lat) {
        const { lat, lng, zoom } = marker;
        this.googleMapRef.panTo({ latitude: lat, longitude: lng, zoom });
      }
    }
  }

  public removeSelectedMarker(marker): void {
    const index = this.googleMapRef.polyLines.indexOf(marker, 0);

    if (index > -1) {
      this.googleMapRef.polyLines.splice(index, 1);

      const polylineIndex = this.googleMapRef.polylineMarkers.indexOf(
        marker,
        0
      );
      this.googleMapRef.polylineMarkers[polylineIndex].setMap(null);
    }
  }

  public setGeofence(geofence: any): void {
    if (this.showAllGeofencesToggle === false) {
      if (geofence.panelOpenState === true) {
        this.googleMapRef.clearPolygon();
        this.googleMapRef.setPolygon(geofence);
      } else {
        this.googleMapRef.clearPolygon();
      }
    }
  }

  public setPolygonsOnMap(geofences: GeofenceCheckable[]): void {
    geofences.forEach((geofence: GeofenceCheckable) => {
      if (geofence.checked) {
        this.googleMapRef.setPolygon(geofence);
      }
    });
  }

  public onSelectAllGeofences({ checked }: MatCheckboxChange): void {
    this.geofenceList = this.geofenceList.map(geofence => {
      return {
        ...geofence,
        checked
      };
    });

    this.setupGeofencesOnMap(this.geofenceList);
  }

  public updatePolygonsVisibility(geofences: GeofenceCheckable[]): void {
    this.showAllGeofencesToggle = !geofences.some(
      geofence => !geofence.checked
    );
    this.geofenceList = [...geofences].sort((a, b) =>
      a.name.localeCompare(b.name)
    );
    this.setupGeofencesOnMap(geofences);
  }

  private setupGeofencesOnMap(geofences: GeofenceCheckable[]): void {
    if (this.googleMapRef && geofences.length) {
      this.googleMapRef.clearPolygonArray();
      this.googleMapRef.clearPolygon();
      this.googleMapRef.clearFencesDetailsMarkers();
      this.setPolygonsOnMap(geofences);
    }
  }

  public onOpenDeleteConfirmationModal(geofence: Geofence): void {
    const dialogRef = this.dialog.open(FencesDeleteModalComponent, {
      disableClose: true,
      panelClass: 'modal-fences-delete-confirmation',
      closeOnNavigation: false,
      data: {
        fenceName: geofence.name
      }
    });

    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) this.deleteGeofence(geofence);
    });
  }

  public deleteGeofence(geofence: Geofence): void {
    const user = this.userProfileService.getUserProfile();

    this.isFetchingGeofences = true;

    this.geofenceRepository.deleteGeofence(geofence, user).subscribe(
      () => {
        this.googleMapRef.clearPolygon();
        this.googleMapRef.clearPolygonArray();
        this.googleMapRef.clearMarkers();
        this.googleMapRef.clearFencesDetailsMarkers();
        this.syncGeofencesBySite(this.selectedSite);
        this.openSnackBar('Cerca virtual apagada', 'Ok');
      },
      ({ status }) => {
        this.isFetchingGeofences = false;
        this.modalStatusComponentSub(false, status);
      }
    );
  }

  public resetData(): void {
    this.googleMapRef.polyLines = [];
    this.googleMapRef.clearPolyline();
  }

  public enablePolylineCreation(enablePolyline: boolean): void {
    this.googleMapRef.setPolylineMarkerClickEvent(enablePolyline);
  }

  public openSnackBar(message: string, action: string): void {
    this.snackbar.open(message, action, {
      duration: 4000
    });
  }

  private onSelectedSiteChangeHandler(): void {
    const selectedSite$ = this.sitesService.selectedSite$.subscribe(
      selectedSite => {
        this.selectedSite = selectedSite;

        if (selectedSite) {
          this.setSiteOnMap(selectedSite);
        }
      }
    );

    this.subscriptions.push(selectedSite$);
  }

  private onGeofencesChangeHandler(): void {
    const geofences$ = this.geofencesService.geofences$
      .pipe(filter(geofences => geofences.length >= 0))
      .subscribe(geofences => {
        this.geofenceList = geofences.map(geofence => ({
          ...geofence,
          checked: true,
          isEditMode: false
        }));

        this.updatePolygonsVisibility(this.geofenceList);
      });

    this.subscriptions.push(geofences$);
  }

  private onDisplayInstructionsOverlay() {
    this.dialog.open(FencesInstructionsOverlayComponent, {
      disableClose: true,
      width: Extensions.isMobile.any() ? '100%' : 'auto',
      data: { isError: false }
    });
  }

  private syncGeofencesBySite(site: Site): void {
    this.isFetchingGeofences = true;
    this.geofencesService.syncGeofencesBySite(site).finally(() => {
      this.isFetchingGeofences = false;
    });
  }

  private mapClickabilityHandler() {
    this.perimetersService.isClickable$.subscribe(isClickable => {
      this.enablePolylineCreation(isClickable);
    });
  }

  private modalStatusComponentSub(isSuccess: boolean, statusCode?: number) {
    let content: string = this.geofenceDeletionSuccess;

    if (!isSuccess) {
      if (statusCode === 403) {
        content = this.geofenceDeletionForbidden;
      } else {
        content = this.geofenceDeletionFail;
      }
    }

    this.dialog.open(ModalStatusComponent, {
      data: {
        isSuccess,
        content
      }
    });
  }

  private setupTranslations(): void {
    const translate$ = this.translateService
      .get('FENCES')
      .subscribe(
        ({
          GEOFENCE_DELETION_SUCCESS,
          GEOFENCE_DELETION_FORBIDDEN,
          GEOFENCE_DELETION_FAIL
        }) => {
          this.geofenceDeletionFail = GEOFENCE_DELETION_FAIL;
          this.geofenceDeletionSuccess = GEOFENCE_DELETION_SUCCESS;
          this.geofenceDeletionForbidden = GEOFENCE_DELETION_FORBIDDEN;
        }
      );

    this.subscriptions.push(translate$);
  }
}
