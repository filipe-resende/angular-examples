import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { LocalService } from '../../../core/services/local.service';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent implements OnInit {
  public allIcons = [];

  constructor(
    public dialogRef: MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    private _local: LocalService
  ) {}

  public onNoClick(): void {
    this.dialogRef.close();
  }

  public ngOnInit() {
    this.getIcons();
  }

  public async getIcons() {
    const icons = await this._local.getMapIcons();
    let i = 1;
    let row = [];

    for (const icon of icons) {
      icon.iconPath = `/assets/icons/${icon.fileName}`;

      if (i > 20) {
        this.allIcons.push(row);
        i = 1;
        row = [];
      }
      row.push(icon);
      i++;
    }
    this.allIcons.push(row);
  }

  // public magnifyImage(image) {
  //   this.selectedImage = image;
  // }

  public selectImage(image) {
    this.dialogRef.close({
      data: image
    });
  }
}
