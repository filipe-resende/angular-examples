/* eslint-disable no-underscore-dangle */
/* eslint-disable no-param-reassign */

import { Overlay, OverlayConfig } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { ComponentRef, Inject, Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs';

import { NotificationComponent } from './notification.component';
import { NotificationConfig } from './notification.config';
import { NotificationInjector } from './notification.injector';
import { INotification } from './notification.interface';
import { NotificationRef } from './notification.ref';
import { APP_NOTIFICATION_DATA } from './notification.token';

export interface IActivate {
  id?: number;
  message?: string;
  portal?: ComponentRef<any>;
  notificationRef: NotificationRef<any>;
  onShown?: Observable<any>;
  onHidden?: Observable<any>;
  onTap?: Observable<any>;
  onAction?: Observable<any>;
}

@Injectable()
export class NotificationService {
  private notifications: IActivate[] = [];

  private index = 0;

  constructor(
    private injector: Injector,
    private _overlay: Overlay,
    @Inject(APP_NOTIFICATION_DATA) public config: INotification,
  ) {
    this.config = this.applyConfig(config);

    if (!this.config.iconClasses) {
      this.config.iconClasses = {};
    }
    this.config.iconClasses.error =
      this.config.iconClasses.error || 'notification-error';
    this.config.iconClasses.info =
      this.config.iconClasses.info || 'notification-info';
    this.config.iconClasses.success =
      this.config.iconClasses.success || 'notification-success';
    this.config.iconClasses.warning =
      this.config.iconClasses.warning || 'notification-warning';
    this.config.iconClasses.disclaim =
      this.config.iconClasses.disclaim || 'notification-disclaim';

    this.config.closeButton = this.use(config, this.config.closeButton, false);
    this.config.notificationClass = this.use(
      config,
      this.config.notificationClass,
      'notification',
    );
    this.config.positionClass = this.use(
      config,
      this.config.positionClass,
      'notification-top-right',
    );
    this.config.titleClass = this.use(
      config,
      this.config.titleClass,
      'notification-title',
    );
    this.config.messageClass = this.use(
      config,
      this.config.messageClass,
      'notification-message',
    );
    this.config.notificationComponent = this.use(
      config,
      this.config.notificationComponent,
      NotificationComponent,
    );
  }

  public show(
    message?: string,
    title?: string,
    config?: INotification,
    type = '',
    time?: number,
  ) {
    return this.open(message, title, this.applyConfig(config), type, time);
  }

  public success(
    message?: string,
    isMapScreen?: boolean,
    time?: number,
    config?: INotification,
  ) {
    const type = this.config.iconClasses.success || '';

    if (isMapScreen) {
      const positionClass = 'notification-top-right-on-map';

      if (config) {
        config.positionClass = positionClass;
      } else {
        config = { positionClass };
      }
    }

    return this.open(message, null, this.applyConfig(config), type, time);
  }

  public error(
    message?: string,
    isMapScreen?: boolean,
    time?: number,
    config?: INotification,
  ) {
    const type = this.config.iconClasses.error || '';

    if (isMapScreen) {
      const positionClass = 'notification-top-right-on-map';

      if (config) {
        config.positionClass = positionClass;
      } else {
        config = { positionClass };
      }
    }

    return this.open(message, null, this.applyConfig(config), type, time);
  }

  public info(
    message?: string,
    isMapScreen?: boolean,
    time?: number,
    config?: INotification,
  ) {
    const type = this.config.iconClasses.info || '';

    if (isMapScreen) {
      const positionClass = 'notification-top-right-on-map';

      if (config) {
        config.positionClass = positionClass;
      } else {
        config = { positionClass };
      }
    }

    return this.open(message, null, this.applyConfig(config), type, time);
  }

  public warning(
    message?: string,
    isMapScreen?: boolean,
    time?: number,
    config?: INotification,
  ) {
    const type = this.config.iconClasses.warning || '';

    if (isMapScreen) {
      const positionClass = 'notification-top-right-on-map';

      if (config) {
        config.positionClass = positionClass;
      } else {
        config = { positionClass };
      }
    }

    return this.open(message, null, this.applyConfig(config), type, time);
  }

  public custom(
    message?: string,
    isMapScreen?: boolean,
    time?: number,
    config?: INotification,
  ): IActivate {
    let customConfig = config;
    const type = this.config.iconClasses.disclaim || '';

    if (isMapScreen) {
      const positionClass = 'notification-top-right-on-map';

      if (customConfig) {
        customConfig.positionClass = positionClass;
      } else {
        customConfig = { positionClass };
      }
    }

    return this.open(message, null, this.applyConfig(customConfig), type, time);
  }

  public remove(id: number) {
    const result = this._findNotification(id);
    result.active.notificationRef.close();
    this.notifications.splice(result.index, 1);
  }

  public clear(id?: number) {
    this.notifications.forEach(notification => {
      if (id !== undefined) {
        if (notification.id === id) {
          notification.notificationRef.manualClose();
        }
      } else {
        notification.notificationRef.manualClose();
      }
    });
  }

  public open(
    message?: string,
    title?: string,
    config?: INotification,
    type = '',
    time?: number,
  ) {
    if (!config.notificationComponent) {
      throw new Error('notificationComponent required');
    }

    this.index += 1;
    const overlayRef = this.createOverlay();
    const notificationRef = new NotificationRef(overlayRef);
    const notificationConfig = new NotificationConfig(
      this.index,
      config,
      message,
      title,
      type,
      notificationRef,
    );
    const injector = this.createInjector(notificationConfig, notificationRef);
    const component = new ComponentPortal(
      config.notificationComponent,
      undefined,
      injector,
    );

    const instance: IActivate = {
      id: this.index,
      message,
      notificationRef,
      onShown: notificationRef.afterActivate(),
      onHidden: notificationRef.afterActivate(),
      onTap: notificationConfig.onTap(),
      onAction: notificationConfig.onAction(),
      portal: overlayRef.attach(component),
    };

    if (time) {
      setTimeout(() => {
        instance.notificationRef.activate();
      }, time);
    } else {
      setTimeout(() => {
        instance.notificationRef.activate();
      });
    }

    this.notifications.push(instance);

    return instance;
  }

  private createOverlay(config?: INotification) {
    const state = new OverlayConfig();
    return this._overlay.create(state);
  }

  private createInjector<T>(
    config: NotificationConfig,
    notificationRef: NotificationRef<T>,
  ) {
    return new NotificationInjector(config, this.injector);
  }

  private _findNotification(id: number) {
    for (let i = 0; i < this.notifications.length; i++) {
      if (this.notifications[i].id === id) {
        return { index: i, active: this.notifications[i] };
      }
    }

    return null;
  }

  private applyConfig(override: INotification = {}) {
    const current: INotification = { ...this.config };
    current.closeButton = this.use(
      override,
      override.closeButton,
      current.closeButton,
    );
    current.positionClass = this.use(
      override,
      override.positionClass,
      current.positionClass,
    );
    current.titleClass = this.use(
      override,
      override.titleClass,
      current.titleClass,
    );
    current.messageClass = this.use(
      override,
      override.messageClass,
      current.messageClass,
    );
    return current;
  }

  private use<T>(config, source: T, defaultValue: T): T {
    return config && source !== undefined ? source : defaultValue;
  }
}
