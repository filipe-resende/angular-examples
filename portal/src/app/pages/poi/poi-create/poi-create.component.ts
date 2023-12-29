import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { PointOfInterest } from "../../../shared/models/poi";
import { MatDialog } from "@angular/material/dialog";
import { DialogComponent } from "../../../components/presentational/dialog/dialog.component";
import { PoiRepository } from "../../../core/repositories/poi.repository";
import { Site } from "../../../shared/models/site";
import { Observable } from "rxjs";
import { SitesService } from "../../../stores/sites/sites.service";
import { PoisService } from "../../../stores/pois/pois.service";

@Component({
  selector: "app-poi-create",
  templateUrl: "poi-create.component.html",
  styleUrls: ["poi-create.component.scss"],
})
export class PoiCreateComponent implements OnInit {
  @Input()
  public googleMapRef;

  @Input()
  public poiCategorys;

  @Output()
  public selectFirstTab = new EventEmitter();

  @Output()
  public enablePoiCreation = new EventEmitter();

  @Output()
  public enablePoiCreationPassingCustomIcon = new EventEmitter();

  public ngForm: FormGroup;
  public poi: PointOfInterest = new PointOfInterest();
  public selectedIcon: any = { iconPath: "/assets/icons/default-marker.png" };
  public isFetchingNewPoi: boolean = false;

  public selectedSite$: Observable<Site>;

  constructor(
    private formBuilder: FormBuilder,
    private poisService: PoisService,
    private dialog: MatDialog,
    private sitesService: SitesService
  ) {
    this.ngForm = this.formBuilder.group({
      name: ["", Validators.required],
      desc: ["", Validators.required],
      category: ["", Validators.required],
    });
  }

  public ngOnInit(): void {
    this.selectedSite$ = this.sitesService.selectedSite$;
  }

  public onCancelButtonClick(): void {
    this.resetData();
  }

  public selectIcon(): void {
    const dialogRef = this.dialog.open(DialogComponent, {
      data: { Icon: this.selectedIcon },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.selectedIcon = result.data;
        this.poi.icon = result.data.fileName;
        this.updateMapMakerIcon();
      }
    });
  }

  public submitPoi(): void {
    if (this.googleMapRef.poiMarkerData.lat !== 0 && this.ngForm.status === "VALID") {
      this.isFetchingNewPoi = true;

      const firstPosition = this.googleMapRef.polyLines[0];
      this.googleMapRef.polyLines.push(firstPosition);
      this.poi.name = this.ngForm.value.name;
      this.poi.categoryId = this.ngForm.value.category;
      this.poi.description = this.ngForm.value.desc;
      this.poi.coordinates = this.googleMapRef.poiMarkerData;
      if (!this.poi.icon) {
        this.poi.icon = "place";
      }

      this.poisService
        .create({ ...this.poi })
        .then(() => {
          this.poi = new PointOfInterest();
          this.selectFirstTab.emit();
          this.resetData();
          this.poisService.syncPoisBySite(this.sitesService.getSelectedSite());
        })
        .finally(() => (this.isFetchingNewPoi = false));
    }
  }

  public resetData(): void {
    this.poi = new PointOfInterest();
    this.selectedIcon = { iconPath: "/assets/icons/default-marker.png" };

    if (this.googleMapRef && this.googleMapRef.poiMarkerData) {
      this.googleMapRef.poiMarkerData.lat = 0;
      this.googleMapRef.poiMarkerData.lng = 0;
      this.googleMapRef.poiMarker.setMap(null);
    }

    this.ngForm.reset();
  }

  private updateMapMakerIcon() {
    this.enablePoiCreation.emit(false);
    this.enablePoiCreationPassingCustomIcon.emit(this.poi.icon);
    this.googleMapRef.poiMarker.setMap(null);

    this.googleMapRef.setPoiMarker({
      coordinates: {
        lat: this.googleMapRef.poiMarkerData.lat,
        lng: this.googleMapRef.poiMarkerData.lng,
      },
      icon: this.poi.icon,
    });
  }
}
