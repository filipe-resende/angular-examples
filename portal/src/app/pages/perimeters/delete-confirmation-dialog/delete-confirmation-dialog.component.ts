import { Component, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { PerimetersService } from "../../../stores/perimeters/perimeters.service";
import { SitesService } from "../../../stores/sites/sites.service";
import { PerimeterCheckable } from "../perimeters.page";

export interface DeletePerimeterConfimationDialogComponentData {
  perimeter: PerimeterCheckable;
}

@Component({
  selector: "app-perimeters-delete-confirmation-dialog",
  templateUrl: "delete-confirmation-dialog.component.html",
  styleUrls: ["delete-confirmation-dialog.component.scss"],
})
export class DeletePerimeterConfimationDialogComponent {
  constructor(
    private perimetersService: PerimetersService,
    private sitesService: SitesService,
    public dialogRef: MatDialogRef<DeletePerimeterConfimationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DeletePerimeterConfimationDialogComponentData
  ) {}

  public confirmPerimeterDeletion() {
    this.closeDialog();
    this.data.perimeter.isFetching = true;
    this.perimetersService.deletePerimeter(this.data.perimeter.perimeterId).then(() => {
      this.perimetersService.syncPerimetersPageModelBySite(this.sitesService.getSelectedSite());
    });
  }

  public closeDialog() {
    this.dialogRef.close();
  }
}
