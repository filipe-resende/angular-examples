import {
  Directive,
  ElementRef,
  ModuleWithProviders,
  NgModule
} from '@angular/core';

@Directive({
  selector: '[notificationContainer]',
  exportAs: 'notificationContainer'
})
export class NotificationContainerDirective {
  constructor(private el: ElementRef) {}

  public getContainerElement(): HTMLElement {
    return this.el.nativeElement;
  }
}

// tslint:disable-next-line:max-classes-per-file
@NgModule({
  exports: [NotificationContainerDirective],
  declarations: [NotificationContainerDirective]
})
export class NotificationContainerModule {
  public static forRoot(): ModuleWithProviders<NotificationContainerModule> {
    return {
      ngModule: NotificationContainerModule,
      providers: []
    };
  }
}
