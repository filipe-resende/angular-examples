import { Observable, Subject } from 'rxjs';
import { INotification } from './notification.interface';
import { NotificationRef } from './notification.ref';

export class NotificationConfig {
  private _onTap: Subject<any> = new Subject();

  private _onAction: Subject<any> = new Subject();

  constructor(
    public id: number,
    public config: INotification,
    public message: string | null | undefined,
    public title: string | undefined,
    public type: string,
    public notificationRef: NotificationRef<any>
  ) {}

  public triggerTap() {
    this._onTap.next();
    this._onTap.complete();
  }

  public onTap(): Observable<any> {
    return this._onTap.asObservable();
  }

  public triggerAction(action?: any) {
    this._onAction.next(action);
    this._onAction.complete();
  }

  public onAction(): Observable<any> {
    return this._onAction.asObservable();
  }
}
