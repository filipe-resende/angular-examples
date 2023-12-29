import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { NgxPaginationModule } from 'ngx-pagination';
import { TranslateModule } from '@ngx-translate/core';

import { ComponentsModule } from 'src/app/components/components.module';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

import { ApplicationDropdownComponent } from '../../components/application-dropdown/application-dropdown.component';

import { AssociateButtonComponent } from '../../components/associate-button/associate-button.component';
import { DisassociateButtonComponent } from '../../components/disassociate-button/disassociate-button.component';
import { DatePickerComponent } from '../../components/date-picker/date-picker.component';
import { InfoCardsComponent } from '../../components/info-cards/info-cards.component';
import { DirectivesModule } from '../directives/directives.module';
import { PipesModule } from '../pipes/pipes.module';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ComponentsModule,
    NgxPaginationModule,
    TranslateModule,
    BsDatepickerModule,
    DirectivesModule,
    FormsModule,
    PipesModule,
  ],
  exports: [],
  providers: [DatePipe],
})
export class SharedComponentsModule {}
