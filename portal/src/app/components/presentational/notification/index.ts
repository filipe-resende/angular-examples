import { Overlay, OverlayContainer } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import {
  ModuleWithProviders,
  NgModule,
  Optional,
  SkipSelf,
} from '@angular/core';
import { NotificationComponent } from './notification.component';
import { NotificationService } from './notification.service';
import { APP_NOTIFICATION_DATA } from './notification.token';
import { MaterialComponentsModule } from '../../../shared/material.module';

@NgModule({
  imports: [CommonModule, MaterialComponentsModule],
  exports: [NotificationComponent],
  declarations: [NotificationComponent],
})
export class NotificaitonModule {
  public static forRoot(config?): ModuleWithProviders<NotificaitonModule> {
    return {
      ngModule: NotificaitonModule,
      providers: [
        { provide: APP_NOTIFICATION_DATA, useValue: config },
        OverlayContainer,
        Overlay,
        NotificationService,
      ],
    };
  }

  constructor(@Optional() @SkipSelf() parentModule: NotificaitonModule) {
    if (parentModule) {
      throw new Error(
        "NotificaitonModule is already loaded. It should only be imported in your application's main module.",
      );
    }
  }
}

export * from './notification.component';
export * from './notification.service';
export * from './notification.injector';
export * from './notification.ref';
export * from './notification.directive';
