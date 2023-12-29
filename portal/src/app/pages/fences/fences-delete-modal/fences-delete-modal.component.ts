import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-fences-delete-modal',
  templateUrl: './fences-delete-modal.component.html',
  styleUrls: ['./fences-delete-modal.component.scss'],
})
export class FencesDeleteModalComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<FencesDeleteModalComponent>,
  ) {}

  onDelete() {
    this.dialogRef.close(true);
  }
}
