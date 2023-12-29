import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { MatTooltipModule } from '@angular/material/tooltip';
import {
  MatDialogModule,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

import { TranslateModule } from '@ngx-translate/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { BatchLoadRoutingModule } from './batch-load-routing.module';
import { BatchLoadComponent } from './batch-load.component';
import { BatchLoadPlantSapComponent } from './batch-load-plant-sap/batch-load-plant-sap.component';
import { BatchLoadExecutionErrorComponent } from './batch-load-execution-error/batch-load-execution-error.component';
import { BatchLoadExportLoadLogComponent } from './batch-load-export-load-log/batch-load-export-load-log.component';
import { PlantSapConfirmComponent } from './batch-load-plant-sap/plant-sap-confirm/plant-sap-confirm.component';
import { BatchLoadReplaceFileComponent } from './batch-load-replace-file/batch-load-replace-file.component';
import { BatchLoadExecutionComponent } from './batch-load-execution/batch-load-execution.component';

@NgModule({
  declarations: [
    BatchLoadComponent,
    BatchLoadPlantSapComponent,
    BatchLoadExecutionComponent,
    BatchLoadReplaceFileComponent,
    PlantSapConfirmComponent,
    BatchLoadExportLoadLogComponent,
    BatchLoadExecutionErrorComponent,
  ],
  imports: [
    CommonModule,
    BatchLoadRoutingModule,
    MatGridListModule,
    MatIconModule,
    MatSelectModule,
    FormsModule,
    MatTooltipModule,
    MatDialogModule,
    MatAutocompleteModule,
    TranslateModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatProgressSpinnerModule,
  ],
  providers: [
    { provide: MAT_DIALOG_DATA, useValue: {} },
    { provide: MatDialogRef, useValue: {} },
  ],
  bootstrap: [BatchLoadComponent],
})
export class BatchLoadModule {}
