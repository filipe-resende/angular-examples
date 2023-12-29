import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-exportation-done-modal',
  templateUrl: './exportation-done-modal.component.html',
  styleUrls: ['./exportation-done-modal.component.scss']
})
export class ExportationDoneModalComponent {
  constructor(private dialogRef: MatDialogRef<ExportationDoneModalComponent>) {}

  onClickHandle() {
    this.dialogRef.close();
  }
}
