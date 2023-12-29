import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { DialogComponent } from './dialog.component';

@NgModule({
  imports: [CommonModule, MatButtonModule],
  declarations: [DialogComponent],
  exports: [DialogComponent],
})
export class DialogModule {}
