import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { ItemComponent } from './item/item.component';
import { SidenavComponent } from './sidenav.component';
import { SidenavService } from './sidenav.service';

import { SharedModule } from '../../../../shared/shared.module';

@NgModule({
  imports: [
    SharedModule,
    RouterModule,
    PerfectScrollbarModule, // .forChild(),
    TranslateModule.forChild()
  ],
  declarations: [SidenavComponent, ItemComponent],
  exports: [SidenavComponent],
  providers: [
    // { provide: 'sidenavService', useClass: SidenavService }
    SidenavService
  ]
})
export class SidenavModule {}
