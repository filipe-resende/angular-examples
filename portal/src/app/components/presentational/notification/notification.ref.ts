import { OverlayRef } from '@angular/cdk/overlay';
import { Observable, Subject } from 'rxjs';

export class NotificationRef<T> {
  public componentInstance: T;

  private _afterClosed: Subject<any> = new Subject();

  private _activate: Subject<any> = new Subject();

  private _manualClose: Subject<any> = new Subject();

  constructor(private _overlayRef: OverlayRef) {}

  public manualClose() {
    this._manualClose.next();
    this._manualClose.complete();
  }

  public manualClosed(): Observable<any> {
    return this._manualClose.asObservable();
  }

  public close(): void {
    this._overlayRef.dispose();
    this._afterClosed.next();
    this._afterClosed.complete();
  }

  public afterClosed(): Observable<any> {
    return this._afterClosed.asObservable();
  }

  public isInactive() {
    return this._activate.isStopped;
  }

  public activate() {
    this._activate.next();
    this._activate.complete();
  }

  public afterActivate(): Observable<any> {
    return this._activate.asObservable();
  }
}
