import {
  Component,
  Input,
  Output,
  EventEmitter,
  ViewEncapsulation,
  OnDestroy,
  OnChanges,
  ViewChild
} from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { TranslateService } from '@ngx-translate/core';
import { MatDialog } from '@angular/material/dialog';
import { GeofenceCheckable } from '../fences.page';
import {
  getEquivalentValeColor,
  getValeColorsAndNames,
  getValeColorName
} from '../../../shared/enums/valeColors';
import { GeofencesService } from '../../../stores/geofences/geofences.service';
import GeofenceCategory from '../../../shared/models/geofence-category';
import { DetectorsService } from '../../../core/services/detectors.service';
import { DetectorView } from '../../../shared/models/DetectorView';
import { MultiSelectAutocompleteComponent } from '../../../components/presentational/multi-select-autocomplete/multi-select-autocomplete.component';
import { Detector } from '../../../shared/models/Detector';
import { Geofence } from '../../../shared/models/geofence';
import { ModalConfirmationComponent } from '../../../components/smart/modal-confirmation/modal-confirmation.component';
import { HttpStatusCodeResponse } from '../../../shared/interfaces/http-response.interface';
import { HttpStatusCodes } from '../../../core/constants/http-status-codes.enum';
import { NotificationService } from '../../../components/presentational/notification';
import { ExportationDoneModalComponent } from '../../../components/presentational/exportation-done-modal/exportation-done-modal.component';
import { UserProfileService } from '../../../stores/user-profile/user-profile.service';

interface GeofenceCheckableWithCategory extends GeofenceCheckable {
  category: string;
}
@Component({
  selector: 'app-fences-accordion',
  templateUrl: 'fences-accordion.component.html',
  styleUrls: ['fences-accordion.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class FencesAccordionComponent implements OnDestroy, OnChanges {
  @ViewChild(MultiSelectAutocompleteComponent)
  public multiSelectAutocompleteComponent: MultiSelectAutocompleteComponent<Detector>;

  public geofenceListWithCategory: GeofenceCheckableWithCategory[] = [];

  public geofencesCategories: GeofenceCategory[];

  @Input()
  public geofenceList: GeofenceCheckable[];

  @Input()
  public loading = false;

  @Output()
  public setGeofence = new EventEmitter();

  @Output()
  public deleteGeofence = new EventEmitter();

  @Output()
  public updatePolygonsVisibility = new EventEmitter<
    GeofenceCheckableWithCategory[]
  >();

  public skeletonArray = Array(6);

  public colors = getValeColorsAndNames();

  public detectorsList: DetectorView[] = [];

  public detectorIsLoading = false;

  public isBusinessSecurityAnalyst = false;

  private subscriptions: Subscription[] = [];

  public fencesNames: unknown;

  public detectors$: Observable<DetectorView[]>;

  private selectedDetectors: Detector[] = [];

  public user: string;

  public userName: string;

  constructor(
    private geofencesService: GeofencesService,
    private translate: TranslateService,
    private detectorsService: DetectorsService,
    private dialog: MatDialog,
    private notify: NotificationService,
    private userProfileService: UserProfileService
  ) {
    const userEmail = this.userProfileService.getUserProfile().email;
    const regex = /.*(?=@)/;
    const extractedUserName = regex.exec(userEmail);
    const [userName] = extractedUserName;
    this.userName = userName;
    this.setupTranslations();
  }

  public ngOnChanges(): void {
    this.geofenceListWithCategory = this.appendCategoryToGeofence(
      this.geofencesCategories,
      this.geofenceList
    );

    this.setupGeofencesCategory();
    this.setupUserRole();
  }

  public setupUserRole(): void {
    this.user = this.userProfileService.getUserProfile().iamId;
    this.isBusinessSecurityAnalyst =
      this.userProfileService.IsBusinessSecurityAnalyst();
  }

  public ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  public getColorName(colorHex: string): string {
    const hexColorAsValeColor = getEquivalentValeColor(colorHex);

    return hexColorAsValeColor
      ? getValeColorName(hexColorAsValeColor)
      : colorHex;
  }

  public onDeleteButtonClick(geofence: GeofenceCheckableWithCategory): void {
    this.deleteGeofence.emit(geofence);
  }

  public onDetectorsSelectChange(selectedDetectors: Array<Detector>): void {
    this.selectedDetectors = [...selectedDetectors];
  }

  public onCancelButtonClick(geofence: Geofence): void {
    const modal = this.dialog.open(ModalConfirmationComponent, {
      data: {
        message: 'FENCES.ARE_YOU_SURE_TO_CANCEL_EDIT'
      }
    });

    modal.afterClosed().subscribe(confirm => {
      if (confirm) {
        geofence.isEditMode = false;
      }
    });
  }

  public onSaveButtonClick(geofence: GeofenceCheckableWithCategory): void {
    const modal = this.dialog.open(ModalConfirmationComponent, {
      data: {
        message: 'FENCES.ARE_YOU_SURE_TO_SET_DETECTORS_FENCE'
      }
    });

    modal.afterClosed().subscribe(confirm => {
      if (confirm) {
        this.detectorsService
          .EditDetectorsOnFence(geofence, this.selectedDetectors)
          .subscribe(
            () => {
              const close = this.dialog.open(ExportationDoneModalComponent);
              close.afterClosed().subscribe(() => {
                this.clearDetectorList(geofence);
                this.getDetectorsList(geofence.id);
              });
            },
            (error: HttpStatusCodeResponse) => {
              if (error.status === HttpStatusCodes.Forbidden) {
                this.translate
                  .get('PANIC_BUTTON.HTTP_ERRORS.FORBIDDEN')
                  .subscribe(msg => {
                    this.notify.error(msg);
                  });
              } else if (error.status === HttpStatusCodes.BadRequest) {
                this.translate
                  .get('PANIC_BUTTON.HTTP_ERRORS.BAD_REQUEST')
                  .subscribe(msg => {
                    this.notify.error(msg);
                  });
              } else {
                this.translate
                  .get('PANIC_BUTTON.HTTP_ERRORS.SERVER_ERROR')
                  .subscribe(msg => {
                    this.notify.error(msg);
                  });
              }
            }
          );
      }
    });
  }

  public onEditButtonClick(geofence: Geofence): void {
    geofence.isEditMode = !geofence.isEditMode;
    this.detectors$ =
      this.detectorsService.getDetectorsOnFencePolygon(geofence);
  }

  public onCheckboxClick(
    event: MatCheckboxChange,
    geofence: GeofenceCheckableWithCategory
  ): void {
    const newGeofenceList = this.geofenceListWithCategory.map(
      geofenceListed => {
        const checked =
          geofenceListed.id === geofence.id
            ? event.checked
            : geofenceListed.checked;

        return {
          ...geofenceListed,
          checked
        };
      }
    );

    this.updatePolygonsVisibility.emit(newGeofenceList);
  }

  private setupGeofencesCategory(): void {
    const geofencesCategorySub =
      this.geofencesService.geofencesCategories$.subscribe(
        geofenceCategories => {
          this.geofencesCategories = [...geofenceCategories];

          this.geofenceListWithCategory = this.appendCategoryToGeofence(
            geofenceCategories,
            this.geofenceList
          );
        }
      );

    this.subscriptions.push(geofencesCategorySub);
  }

  public appendCategoryToGeofence(
    geofenceCategories: GeofenceCategory[],
    geofences: GeofenceCheckable[]
  ): GeofenceCheckableWithCategory[] {
    const geofencesWithCategory = geofences.map(geofence => {
      const geofenceCategory = geofenceCategories.find(
        ({ id }) => id === geofence.categoryId
      );

      return {
        ...geofence,
        category: geofenceCategory
          ? this.fencesNames[geofenceCategory.name]
          : undefined
      };
    });

    return geofencesWithCategory.filter(({ category }) => !!category);
  }

  public getDetectorsList(geofenceId: string): void {
    this.detectorsService
      .getDetectorsOnFence(geofenceId)
      .subscribe((data: DetectorView[]) => {
        this.detectorsList = data;
        this.detectorIsLoading = false;
        if (this.detectorsList != null)
          this.detectorsList.sort((a, b) => a.name.localeCompare(b.name));
      });
  }

  public clearDetectorList(geofence: GeofenceCheckableWithCategory): void {
    this.detectorsList = [];
    this.detectorIsLoading = true;
    this.selectedDetectors = [];
    geofence.isEditMode = false;
  }

  private setupTranslations(): void {
    this.translate.get(['FENCES']).subscribe(resources => {
      const {
        FENCES: { VIRTUAL_FENCE, RADIUS_FENCE }
      } = resources;

      this.fencesNames = { VIRTUAL_FENCE, RADIUS_FENCE };
    });
  }

  public isThisCreatedBy(createdBy: string): boolean {
    return createdBy.includes(this.userName);
  }
}
