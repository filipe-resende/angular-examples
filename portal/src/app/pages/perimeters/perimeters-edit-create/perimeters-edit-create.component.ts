import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { NotificationService } from '../../../components/presentational/notification';
import { PerimetersService } from '../../../stores/perimeters/perimeters.service';
import { PerimetersPageModel } from '../../../stores/perimeters/perimeters.state';
import { SitesService } from '../../../stores/sites/sites.service';
import { MapComponent } from '../../../components/smart/map/map.component';

@Component({
  selector: 'app-perimeters-edit-create',
  templateUrl: 'perimeters-edit-create.component.html',
  styleUrls: ['perimeters-edit-create.component.scss'],
})
export class PerimetersEditCreateComponent implements OnInit, OnDestroy {
  @Input()
  public isEditing: boolean;

  @Input()
  public googleMap: MapComponent;

  @Input()
  public selectedTabChange: EventEmitter<any>;

  @Output()
  private setTabAsCreating: EventEmitter<any> = new EventEmitter();

  @Output()
  private selectFirstTab: EventEmitter<any> = new EventEmitter();

  public ngForm: FormGroup;

  public perimetersPageModel$: Observable<PerimetersPageModel>;

  public isValidatingPerimeter = false;

  public isUpdatingPerimeter = false;

  public isPerimeterValid = false;

  public perimeterHasBeenValidatedByService = false;

  private subscriptions: Subscription[] = [];

  constructor(
    private siteService: SitesService,
    private perimetersService: PerimetersService,
    private formBuilder: FormBuilder,
  ) {
    this.ngForm = this.formBuilder.group({
      name: ['', Validators.required],
    });
  }

  public ngOnInit() {
    this.perimetersPageModel$ = this.perimetersService.perimetersPageModel$;

    this.onTabSelectedChangeHandler();
    this.onIsPerimeterValidatedChangeHandler();
  }

  public ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  public clear() {
    this.ngForm.controls.name.setValue('');
    this.ngForm.controls.name.setErrors(null);
    this.perimetersService.draw.clear();
    this.isValidatingPerimeter = false;
    this.isPerimeterValid = false;
  }

  public edit() {
    if (!this.isValidToCreateOrUpdate()) return;

    this.isUpdatingPerimeter = true;
    this.perimetersService
      .edit(this.ngForm.value.name, this.siteService.getSelectedSiteModel())
      .then(() => this.handleCreateOrUpdateWithSuccess())
      .finally(() => (this.isUpdatingPerimeter = false));
  }

  public cancelEdition() {
    this.clear();
    this.selectFirstTab.emit();
    this.perimetersService.discartEdittedPerimeter();
    this.setTabAsCreating.emit();
  }

  public create() {
    if (!this.isValidToCreateOrUpdate()) return;

    this.isUpdatingPerimeter = true;
    this.perimetersService.draw
      .create(this.ngForm.value.name, this.siteService.getSelectedSiteModel())
      .then(() => this.handleCreateOrUpdateWithSuccess())
      .finally(() => (this.isUpdatingPerimeter = false));
  }

  public deleteMarker(googleMapsMarkerRef: any) {
    this.perimetersService.draw.removeMarker(
      googleMapsMarkerRef,
      this.googleMap.map,
    );
  }

  public validatePerimeter() {
    try {
      this.isValidatingPerimeter = true;

      setTimeout(() => {
        this.isPerimeterValid = this.perimetersService.draw.isPolygonValid();

        this.isValidatingPerimeter = false;
      }, 50);
    } catch {
      this.isPerimeterValid = false;
      this.isValidatingPerimeter = false;
    }
  }

  private isGoogleMapsLoaded() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return !!(window as any).google;
  }

  private onIsPerimeterValidatedChangeHandler() {
    this.subscriptions.push(
      this.perimetersService.newPerimeterPolygonValidated$.subscribe(
        isPerimeterValidated =>
          (this.perimeterHasBeenValidatedByService = isPerimeterValidated),
      ),
    );
  }

  private onTabSelectedChangeHandler() {
    this.subscriptions.push(
      this.selectedTabChange.subscribe(async ({ index: selectedTab }) => {
        if (selectedTab === 1) {
          if (this.isEditing) {
            const {
              perimetersPageModel: { editingPerimeter },
            } = this.perimetersService.getStore();
            this.ngForm.controls.name.setValue(
              editingPerimeter ? editingPerimeter.perimeterName : '',
            );
          }
          if (!this.isGoogleMapsLoaded) await this.waitForGoogleMapsToLoad();
          this.googleMap.enableOfficialPerimeterPolygonCreation();
        } else {
          this.googleMap.disableOfficialPerimeterPolygonCreation();
        }
      }),
    );
  }

  private async waitForGoogleMapsToLoad() {
    return new Promise<void>((res, rej) => {
      const tryToGetGoogleMapsReference = (tries = 0) => {
        if (this.isGoogleMapsLoaded()) {
          res();
        } else if (tries > 20) {
          rej();
        } else {
          setTimeout(() => tryToGetGoogleMapsReference(++tries), 400);
        }
      };

      tryToGetGoogleMapsReference();
    });
  }

  private isValidToCreateOrUpdate(): boolean {
    if (this.ngForm.status !== 'VALID' || !this.ngForm.controls.name.value) {
      this.ngForm.controls.name.markAsTouched();
      this.ngForm.controls.name.setErrors({ incorrect: true });
      return false;
    }

    if (this.perimeterHasBeenValidatedByService && this.isPerimeterValid) {
      return true;
    }

    return false;
  }

  private handleCreateOrUpdateWithSuccess() {
    this.perimetersService.syncPerimetersPageModelBySite(
      this.siteService.getSelectedSite(),
    );
    this.setTabAsCreating.emit();
    this.selectFirstTab.emit();
    this.clear();
  }
}
