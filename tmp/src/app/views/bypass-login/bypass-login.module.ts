import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { BypassLoginComponent } from './bypass-login.component';
import { BypassLoginRoutingModule } from './bypass-login-routing.module';
import { BypassLoginAuthService } from './bypass-login-auth.service';

@NgModule({
  declarations: [BypassLoginComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule.forChild({
      extend: true,
    }),
    BypassLoginRoutingModule,
    SharedModule,
  ],
  exports: [BypassLoginComponent],
  providers: [BypassLoginAuthService],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class BypassLoginModule {}
