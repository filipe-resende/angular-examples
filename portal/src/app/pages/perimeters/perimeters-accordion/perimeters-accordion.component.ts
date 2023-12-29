import {
  Component,
  Input,
  Output,
  EventEmitter,
  ViewEncapsulation,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PerimeterCheckable } from '../perimeters.page';
import {
  getEquivalentValeColor,
  getValeColorsAndNames,
  getValeColorName,
} from '../../../shared/enums/valeColors';
import { PerimetersService } from '../../../stores/perimeters/perimeters.service';
import { SitesService } from '../../../stores/sites/sites.service';
import { DeletePerimeterConfimationDialogComponent } from '../delete-confirmation-dialog/delete-confirmation-dialog.component';
import { MapComponent } from '../../../components/smart/map/map.component';

@Component({
  selector: 'app-perimeters-accordion',
  templateUrl: 'perimeters-accordion.component.html',
  styleUrls: ['perimeters-accordion.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class PerimetersAccordionComponent {
  @Input()
  public googleMap: MapComponent;

  @Input()
  public perimetersList: PerimeterCheckable[] = [];

  @Input()
  public loading = false;

  @Output()
  public setTabAsEditing = new EventEmitter();

  @Output()
  public selectSecondTab = new EventEmitter();

  @Output()
  public setPerimeters = new EventEmitter();

  @Output()
  public updateOfficialPerimetersVisibility = new EventEmitter();

  public skeletonArray = Array(6);

  public colors = getValeColorsAndNames();

  constructor(
    public dialog: MatDialog,
    private perimeterService: PerimetersService,
  ) {}

  public getColorName(colorHex: string): string {
    const hexColorAsValeColor = getEquivalentValeColor(colorHex);

    return hexColorAsValeColor
      ? getValeColorName(hexColorAsValeColor)
      : colorHex;
  }

  public onAccordionListItemClick(perimeter) {
    //
  }

  public onEditButtonClick(perimeter: PerimeterCheckable) {
    this.perimeterService.enablePerimeterEdition(perimeter, this.googleMap.map);
    this.setTabAsEditing.emit();
    this.selectSecondTab.emit();
  }

  public onDeleteButtonClick(perimeter: PerimeterCheckable) {
    this.dialog.open(DeletePerimeterConfimationDialogComponent, {
      data: { perimeter },
    });
  }

  public onCheckboxClick(event, Perimeters: PerimeterCheckable) {
    this.perimetersList.forEach(PerimetersListed => {
      if (PerimetersListed.perimeterName === Perimeters.perimeterName) {
        PerimetersListed.checked = event.checked;
      }
    });

    this.updateOfficialPerimetersVisibility.emit();
  }
}
