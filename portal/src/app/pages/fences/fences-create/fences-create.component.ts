import {
  Component,
  Input,
  EventEmitter,
  Output,
  OnInit,
  OnDestroy,
  ElementRef,
  ViewChild,
  ViewEncapsulation,
  ChangeDetectorRef
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { MatDialog } from '@angular/material/dialog';
import { debounceTime, finalize, skip, take, tap } from 'rxjs/operators';
import * as turf from '@turf/turf';
import { Marker } from '../../../stores/geofences/geofences.state';
import { MapComponent } from '../../../components/smart/map/map.component';
import { Geofence } from '../../../shared/models/geofence';
import { GeofenceRepository } from '../../../core/repositories/geofence.repository';
import GeofenceCategory from '../../../shared/models/geofence-category';
import { GeofencesService } from '../../../stores/geofences/geofences.service';
import { Site } from '../../../shared/models/site';
import { SitesService } from '../../../stores/sites/sites.service';
import {
  getValeColorsAndNames,
  getEquivalentValeColor,
  getValeColorName
} from '../../../shared/enums/valeColors';
import { FencesInstructionsOverlayComponent } from '../../../components/templates/fences-instructions-overlay/fences-instructions-overlay.component';
import { Extensions } from '../../../shared/extensions';
import { applyRightHandRule } from '../../../shared/utils/geojson';
import { PerimetersService } from '../../../stores/perimeters/perimeters.service';
import { Perimeter } from '../../../shared/models/perimeter';
import { DetectorsService } from '../../../core/services/detectors.service';
import { ModalStatusComponent } from '../../../components/presentational/modal-status/modal-status.component';
import { PerimeterAccessControl } from '../../../shared/models/primeter-access-control';
import { Detector } from '../../../shared/models/Detector';
import { MultiSelectAutocompleteComponent } from '../../../components/presentational/multi-select-autocomplete/multi-select-autocomplete.component';
import { RadiusCategoryName } from '../../../core/constants/geofences.const';
import { UserProfileService } from '../../../stores/user-profile/user-profile.service';
import { UserProfile } from '../../../shared/models/user-profile';

@Component({
  selector: 'app-fences-create',
  templateUrl: 'fences-create.component.html',
  styleUrls: ['fences-create.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class FencesCreateComponent implements OnInit, OnDestroy {
  @ViewChild('colorPicker') public colorPicker: ElementRef;

  @ViewChild(MultiSelectAutocompleteComponent)
  public multiSelectAutocompleteComponent: MultiSelectAutocompleteComponent<Detector>;

  @ViewChild('f') public formRef: ElementRef;

  @Input()
  public googleMap: MapComponent;

  @Input()
  public openSnackBar: (message: string, type: string) => void;

  @Output()
  public resetData = new EventEmitter();

  @Output()
  public panToSelected = new EventEmitter();

  public geoFence: Geofence = new Geofence();

  public ngForm: FormGroup;

  public colors = [];

  public hasSubmittedForm = false;

  public isFetchingFencePost = false;

  public geofencesCategories$: Observable<GeofenceCategory[]>;

  public selectedSite$: Observable<Site>;

  public perimeters$: Observable<Perimeter[]>;

  public detectors = [];

  private selectedDetectors: Detector[] = [];

  private subscriptions: Subscription[] = [];

  private detectChangesInterval;

  private snackBarMessage: string;

  private currentUser: UserProfile;

  geofenceDrawedMarkers$: Observable<Marker[]>;

  public shouldDrawRadiusFence = false;

  public cantCrossFencesMessage: string;

  public showEmptyDetectorsWarning = false;

  public isRadiusGeofenceCreation$: Observable<boolean>;

  public geofenceCreationSuccess: string;

  public geofenceCreationFail: string;

  public geofenceCreationAlreadyExists: string;

  public geofenceCreationForbidden: string;

  public geofenceDrawedMarkers;

  constructor(
    private formBuilder: FormBuilder,
    private geofencesService: GeofencesService,
    private sitesService: SitesService,
    private userProfileService: UserProfileService,
    private geofenceRepository: GeofenceRepository,
    private cdRef: ChangeDetectorRef,
    private translateService: TranslateService,
    private dialog: MatDialog,
    private perimetersService: PerimetersService,
    private detectorsService: DetectorsService
  ) {
    this.ngForm = this.formBuilder.group({
      name: ['', Validators.required],
      desc: ['', Validators.required],
      color: ['', Validators.required],
      category: ['', Validators.required],
      latitude: 0,
      longitude: 0,
      radius: 0
    });
  }

  public ngOnInit(): void {
    this.selectedSite$ = this.sitesService.selectedSite$;
    this.geofencesCategories$ = this.geofencesService.geofencesCategories$;
    this.geofenceDrawedMarkers$ = this.geofencesService.geofenceDrawedMarkers$;
    this.geofenceDrawedMarkers$.subscribe(drawedMarkers => {
      this.geofenceDrawedMarkers = drawedMarkers;
    });
    this.perimeters$ = this.perimetersService.perimeters$;

    this.isRadiusGeofenceCreation$ =
      this.geofencesService.isRadiusGeofenceCreation$.pipe(
        tap(isRadius => {
          this.shouldDrawRadiusFence = isRadius;
        })
      );

    this.currentUser = this.userProfileService.getUserProfile();

    this.geofencesService.updateGeofencesCategories();

    this.onSelectedSiteChangeHandler();

    this.setupCustomizedColors();
    this.setupTranslations();
    this.setupValueChangesCategoryForm();
    this.setupValueChangesGeofenceRadiusForm();
    this.setupGeofenceRadiusMapUpdate();
    this.loadDetectorsInPolygonFence();
  }

  public ngAfterViewInit(): void {
    this.detectChangesInterval = setInterval(() => {
      this.cdRef.detectChanges();
    }, 500);
  }

  public ngOnDestroy(): void {
    clearInterval(this.detectChangesInterval);

    this.geofencesService.clearGeofencesStore();

    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  private setupGeofenceRadiusMapUpdate() {
    const geofenceRadius$ = this.geofencesService.geofenceRadius$
      .pipe(skip(1))
      .subscribe(({ latitude, longitude, radius }) => {
        this.ngForm.get('latitude').setValue(latitude, { emitEvent: false });
        this.ngForm.get('longitude').setValue(longitude, { emitEvent: false });
        this.ngForm.get('radius').setValue(radius, { emitEvent: false });

        this.loadDetectorsInRadiusFence(latitude, longitude, radius);
      });

    this.subscriptions.push(geofenceRadius$);
  }

  private setupValueChangesCategoryForm() {
    const category$ = this.ngForm
      .get('category')
      .valueChanges.subscribe(categoryId => {
        this.detectors = [];
        const categories = this.geofencesService.getStore().geofencesCategories;

        const selectedCategory = categories.find(
          category => category.id === categoryId
        );

        if (selectedCategory) {
          const isRadiusGeofenceCreation =
            selectedCategory.name.includes(RadiusCategoryName);

          this.geofencesService.updateIsRadiusGeofenceCreation(
            isRadiusGeofenceCreation
          );
          this.perimetersService.updatePerimeterClickability(true);
        } else {
          this.perimetersService.updatePerimeterClickability(false);
        }

        this.ngForm.patchValue({
          latitude: 0,
          longitude: 0,
          radius: 0
        });

        this.geoFence = new Geofence();
        this.resetData.emit();
        this.geofencesService.clearDrawedGeofence();
        this.selectedDetectors = [];
      });

    this.subscriptions.push(category$);
  }

  private setupValueChangesGeofenceRadiusForm() {
    const latitudeFormSub$ = this.ngForm
      .get('latitude')
      .valueChanges.pipe(debounceTime(300))
      .subscribe(latitude => {
        const { longitude, radius } = this.ngForm.value;

        this.setRadiusGeofence(
          Number(latitude),
          Number(longitude),
          Number(radius)
        );
      });

    const longitudeFormSub$ = this.ngForm
      .get('longitude')
      .valueChanges.pipe(debounceTime(300))
      .subscribe(longitude => {
        const { latitude, radius } = this.ngForm.value;

        this.setRadiusGeofence(
          Number(latitude),
          Number(longitude),
          Number(radius)
        );
      });

    const radiusFormSub$ = this.ngForm
      .get('radius')
      .valueChanges.pipe(debounceTime(300))
      .subscribe(radius => {
        const { longitude, latitude } = this.ngForm.value;

        this.setRadiusGeofence(
          Number(latitude),
          Number(longitude),
          Number(radius)
        );
      });

    this.subscriptions = [
      ...this.subscriptions,
      latitudeFormSub$,
      longitudeFormSub$,
      radiusFormSub$
    ];
  }

  private setRadiusGeofence(
    latitude: number,
    longitude: number,
    radius: number
  ) {
    if (latitude && longitude && radius) {
      const geofenceRadius = {
        latitude,
        longitude,
        radius,
        map: this.googleMap.map
      };

      this.geofencesService.updateGeofencesState({
        geofenceRadius
      });

      this.geofencesService.setRadiusFence(geofenceRadius);

      this.loadDetectorsInRadiusFence(latitude, longitude, radius);
    }
  }

  private loadDetectorsInRadiusFence(
    latitude: number,
    longitude: number,
    radius: number
  ) {
    this.detectorsService
      .getAllDetectorsOnRadius(latitude, longitude, radius)
      .pipe(take(1))
      .subscribe(detectors => {
        this.isFetchingFencePost = true;
        this.showEmptyDetectorsWarning = detectors === null;
        this.detectors = detectors.map(({ name, id, isAreaAccessPoint }) => ({
          name,
          id,
          isAreaAccessPoint
        }));

        if (this.multiSelectAutocompleteComponent) {
          this.multiSelectAutocompleteComponent.clear();
        }
        this.isFetchingFencePost = false;
      });
  }

  private loadDetectorsInPolygonFence(): void {
    this.geofenceDrawedMarkers$.subscribe(polygons => {
      if (polygons.length >= 3) {
        this.isFetchingFencePost = true;
        const coordinates = polygons.map(polygon => [polygon.lng, polygon.lat]);
        coordinates.push([polygons[0].lng, polygons[0].lat]);
        this.detectorsService
          .getAllDetectorsOnVirtualFence(coordinates)
          .pipe(take(1))
          .subscribe(detectors => {
            this.showEmptyDetectorsWarning = detectors === null;
            this.detectors = detectors.map(
              ({ name, id, isAreaAccessPoint }) => ({
                name,
                id,
                isAreaAccessPoint
              })
            );

            if (this.multiSelectAutocompleteComponent) {
              this.multiSelectAutocompleteComponent.clear();
            }
            this.isFetchingFencePost = false;
          });
      } else {
        this.detectors = [];
        this.selectedDetectors = [];
      }
    });
  }

  public getColorName(colorHex: string): string {
    const hexColorAsValeColor = getEquivalentValeColor(colorHex);

    return hexColorAsValeColor
      ? getValeColorName(hexColorAsValeColor)
      : colorHex;
  }

  public onCancelButtonClick(): void {
    this.ngForm.reset();
    this.geoFence = new Geofence();

    this.resetData.emit();
    this.geofencesService.clearDrawedGeofence();
    this.detectors = [];
    this.selectedDetectors = [];
  }

  public submitGeoFence(): void {
    const { geofenceDrawedMarkers } = this.geofencesService.getStore();

    this.hasSubmittedForm = true;

    if (
      (geofenceDrawedMarkers.length >= 3 || this.shouldDrawRadiusFence) &&
      this.ngForm.status === 'VALID'
    ) {
      const { name, category, desc, color, latitude, longitude, radius } =
        this.ngForm.value;

      const coordinates = this.setFencesCoordinates(
        latitude,
        longitude,
        radius
      );

      this.geoFence = {
        ...this.geoFence,
        name,
        coordinates,
        description: desc,
        categoryId: category,
        createdBy: this.formatCreatedBy(
          this.currentUser.userName,
          this.currentUser.email
        ),
        color: color.toLowerCase() || '#ffffff'
      };

      const { perimeters } = this.perimetersService.getStore();
      const [{ areaId: parentId }] = perimeters;

      this.onCreateGeofence(this.geoFence, parentId);
    } else {
      this.openSnackBar(this.snackBarMessage, 'Ok');
    }
  }

  private formatCreatedBy(userName: string, email: string): string {
    const formatedString = `${userName} (${email.split('@', 1)})`;
    return formatedString;
  }

  public onDetectorsSelectChange(selectedDetectors: Array<Detector>): void {
    this.selectedDetectors = [...selectedDetectors];
  }

  private getCoordinatesFromMarkers(geofenceDrawedMarkers: Marker[]) {
    const [firstPosition] = geofenceDrawedMarkers;

    const lastPosition: Marker = {
      ...firstPosition,
      labelIndex: geofenceDrawedMarkers.length,
      label: (geofenceDrawedMarkers.length + 1).toString()
    };

    const polygon = [...geofenceDrawedMarkers, lastPosition];

    const coordinates = applyRightHandRule(polygon);

    return coordinates.map(({ lng, lat, label, labelIndex }) => ({
      lng,
      lat,
      label,
      labelIndex
    }));
  }

  public onDisplayInstructionsOverlay(): void {
    this.dialog.open(FencesInstructionsOverlayComponent, {
      disableClose: true,
      width: Extensions.isMobile.any() ? '100%' : 'auto',
      data: { isError: false }
    });
  }

  public deleteMarker(googleMapsMarkerRef: any): void {
    this.geofencesService.removeMarker(googleMapsMarkerRef, this.googleMap.map);
  }

  private onSelectedSiteChangeHandler(): void {
    const selectedSite$ = this.sitesService.selectedSite$.subscribe(() => {
      this.onCancelButtonClick();
    });

    this.subscriptions.push(selectedSite$);
  }

  private setupCustomizedColors() {
    const valeColors = getValeColorsAndNames();

    this.colors = valeColors.map(({ color, name }) => ({
      label: name,
      value: color,
      colorBox: color,
      imgOrColorBoxWidth: 20,
      imgOrColorBoxHeight: 20
    }));
  }

  private setupTranslations(): void {
    const translate$ = this.translateService
      .get('FENCES')
      .subscribe(
        ({
          SNACKBAR_MESSAGE,
          CANT_CROSS_OTHER_FENCES,
          GEOFENCE_CREATION_SUCCESS,
          GEOFENCE_CREATION_ALREADY_EXISTS,
          GEOFENCE_CREATION_FORBIDDEN
        }) => {
          this.snackBarMessage = SNACKBAR_MESSAGE;
          this.cantCrossFencesMessage = CANT_CROSS_OTHER_FENCES;
          this.geofenceCreationSuccess = GEOFENCE_CREATION_SUCCESS;
          this.geofenceCreationAlreadyExists = GEOFENCE_CREATION_ALREADY_EXISTS;
          this.geofenceCreationForbidden = GEOFENCE_CREATION_FORBIDDEN;
        }
      );

    this.subscriptions.push(translate$);
  }

  private onCreateGeofence(geofence: Geofence, parentAreaId: string): void {
    this.isFetchingFencePost = true;
    this.geofenceRepository
      .createGeofence({ ...geofence, parentAreaId })
      .pipe(
        take(1),
        finalize(() => {
          this.isFetchingFencePost = false;
        })
      )
      .subscribe(
        createdPerimeter => {
          if (this.selectedDetectors && this.selectedDetectors.length > 0) {
            this.createPerimeterAccessControlAssociation(createdPerimeter);
            this.selectedDetectors = [];
            this.detectors = [];
          }

          this.modalStatusComponentSub(true);
          this.syncGeofences();
          this.hasSubmittedForm = false;
        },
        () => {
          this.modalStatusComponentSub(false);
        }
      );
  }

  private async createPerimeterAccessControlAssociation(geofence: Geofence) {
    const { perimeters } = this.perimetersService.getStore();
    const [{ areaId: officialPerimeterId }] = perimeters;

    const perimeterAccessControl = {
      perimeterName: geofence.name,
      perimeterId: geofence.id,
      officialPerimeterId,
      detectors: this.selectedDetectors,
      createdBy: this.currentUser.email
    } as PerimeterAccessControl;

    const promise = this.detectorsService
      .createPerimeterAccessControlAssociation(perimeterAccessControl)
      .toPromise();

    Promise.resolve(promise);
    this.multiSelectAutocompleteComponent.clear();
  }

  private setFencesCoordinates(
    latitude: string,
    longitude: string,
    radius: string
  ) {
    const { geofenceDrawedMarkers } = this.geofencesService.getStore();

    if (this.shouldDrawRadiusFence) {
      const center = [Number(longitude), Number(latitude)];
      const radiusKilometers = Number(radius) / 1000;
      const circle = turf.circle(center, radiusKilometers, {
        steps: 40,
        units: 'kilometers',
        properties: { foo: 'bar' }
      });

      return circle.geometry.coordinates[0].map(([lng, lat]) => ({
        lat,
        lng
      }));
    }
    return this.getCoordinatesFromMarkers(geofenceDrawedMarkers);
  }

  private syncGeofences() {
    const { selectedSite } = this.sitesService.getStore();
    this.geofencesService.syncGeofencesBySite(selectedSite);
  }

  private showDialogFencesInstructions() {
    this.dialog
      .open(FencesInstructionsOverlayComponent, {
        disableClose: true,
        width: Extensions.isMobile.any() ? '100%' : 'auto',
        data: { isError: true }
      })
      .afterClosed()
      .pipe(
        take(1),
        tap(() => {
          this.resetControls();

          this.geofencesService.clearDrawedGeofence();
          this.geoFence = new Geofence();
          this.detectors = [];
          this.selectedDetectors = [];
        })
      )
      .subscribe();
  }

  private modalStatusComponentSub(isSuccess: boolean) {
    const content: string = this.geofenceCreationSuccess;

    if (!isSuccess) {
      this.showDialogFencesInstructions();
    } else {
      this.dialog
        .open(ModalStatusComponent, {
          data: {
            isSuccess,
            content
          }
        })
        .afterClosed()
        .pipe(
          take(1),
          tap(() => {
            this.resetControls();

            this.geofencesService.clearDrawedGeofence();
            this.geoFence = new Geofence();
            this.detectors = [];
            this.selectedDetectors = [];
          })
        )
        .subscribe();
    }
  }

  private resetControls() {
    this.ngForm.controls.name.reset();
    this.ngForm.controls.desc.reset();
    this.ngForm.controls.color.reset();
    this.ngForm.controls.latitude.reset();
    this.ngForm.controls.longitude.reset();
    this.ngForm.controls.radius.reset();
  }
}
