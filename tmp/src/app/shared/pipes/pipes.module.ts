import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { DateFormatPipe } from './date-format/date-format.pipe';
import { CpfFormatPipe } from './cpf-format/cpf-format.pipe';

@NgModule({
  declarations: [DateFormatPipe, CpfFormatPipe],
  imports: [CommonModule],
  exports: [DateFormatPipe, CpfFormatPipe],
  providers: [DatePipe],
})
export class PipesModule {}
