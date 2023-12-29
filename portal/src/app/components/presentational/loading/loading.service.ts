import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface ILoadingState {
  show: boolean;
}

@Injectable()
export class LoadingService {
  private spinnerSubject = new Subject<ILoadingState>();

  private navigationSubject = new Subject<ILoadingState>();

  // tslint:disable-next-line:member-ordering
  public spinnerState = this.spinnerSubject.asObservable();

  // tslint:disable-next-line:member-ordering
  public navigationState = this.navigationSubject.asObservable();

  public setNavigationState(loading: boolean) {
    this.navigationSubject.next({ show: loading });
  }

  public setState(loading: boolean) {
    this.spinnerSubject.next({ show: loading });
  }

  public show() {
    this.spinnerSubject.next({ show: true });
  }

  public hide() {
    this.spinnerSubject.next({ show: false });
  }
}
