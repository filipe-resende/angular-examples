import { Component, EventEmitter, Inject, Input, Output } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { SapPlantAll } from 'src/app/model/sap-plant-interfaces';
import { SapPlantService } from 'src/app/services/factories/sap-plant.service';
import { BatchLoadPlantSapComponent } from 'src/app/views/batch-load/batch-load-plant-sap/batch-load-plant-sap.component';

@Component({
  selector: 'app-sap-plant',
  templateUrl: './sap-plant.component.html',
  styleUrls: ['./sap-plant.component.scss'],
})
export class SapPlantComponent {
  @Input() createSapPlantValidator: boolean;

  @Input() showInputFilled: boolean;

  @Input() inputFilled: number;

  @Output() validatorShowInput = new EventEmitter();

  @Output() sapPlantCode = new EventEmitter();

  @Output() sendSapPlantId = new EventEmitter();

  public sapPlantId: string;

  public sapPlant: string;

  public sapPlantValidatorView = false;

  public sapPlantValue;

  public sapPlantLoading: boolean;

  public dataSapPlant: SapPlantAll;

  public filterDataSapPlants = [];

  private modalCreateSAP:
    | MatDialogRef<BatchLoadPlantSapComponent, any>
    | undefined;

  @Inject(MAT_DIALOG_DATA)
  public data: {
    sapPlantName: string;
    dataSapPlant: SapPlantAll;
  };

  constructor(
    public sapPlantService: SapPlantService,
    public matDialog: MatDialog,
  ) {
    this.sapPlantDisplay();
  }

  public clearEnter(): void {
    this.sapPlant = '';
  }

  public filterSapPlant(): void {
    if (this.dataSapPlant) {
      this.filterDataSapPlants = this.dataSapPlant.sapPlants
        .filter(item => item.code.toString().includes(this.sapPlant))
        .sort(function ordenar(a, b) {
          if (a.code < b.code) return -1;
          if (a.code > b.code) return 1;
          return 0;
        });
    } else {
      this.sapPlantLoading = true;
      this.sapPlantDisplay();
    }
  }

  public valueSapPlant(name): void {
    const sapPlantCode = `${name.code}`;
    this.sapPlant = sapPlantCode.concat(' - ', `${name.description}`);
    this.sapPlantId = name.id;
    this.sapPlantValidatorView = false;

    this.sapPlantCode.emit(sapPlantCode);
    this.sendSapPlantId.emit(this.sapPlantId);
  }

  public sapPlantDisplay(): void {
    this.sapPlantService.getSapPlant().subscribe(data => {
      this.sapPlantLoading = false;
      this.dataSapPlant = data;
      this.getInputFilled();
    });
  }

  public eventSapPlant(event: Event): void {
    if (event) {
      this.sapPlantValue = event;
      this.validatorSapPlant(event);
    }
  }

  public validatorSapPlant(event: Event): void {
    const result = this.filterDataSapPlants.filter(x => x.code === event);

    if (result.length > 0) {
      this.sapPlantId = result[0].id;
    } else {
      this.sapPlantValidatorView = true;
    }
  }

  public openCreateSapModal(): void {
    this.modalCreateSAP = this.matDialog.open(BatchLoadPlantSapComponent, {
      height: '222px',
      width: '597px',
      disableClose: true,
      data: {
        sapPlantName: this.sapPlantValue,
        dataSapPlant: this.dataSapPlant,
      },
    });
    this.modalCreateSAP.afterClosed().subscribe(data => {
      if (data) {
        this.dataSapPlant = null;
        this.sapPlantDisplay();
      }
    });
  }

  public getInputFilled(): void {
    if (this.showInputFilled) {
      const res = this.dataSapPlant.sapPlants.find(
        sapPlant => sapPlant.code === this.inputFilled,
      );
      this.valueSapPlant(res);
      this.validatorShowInput.emit(true);
    }
  }
}
