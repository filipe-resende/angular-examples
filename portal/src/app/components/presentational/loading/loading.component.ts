import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ILoadingState, LoadingService } from './loading.service';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss']
})
export class LoadingComponent implements OnDestroy, OnInit {
  public visible = false;

  public bubbleVisible = false;

  public key = 'style-manager-loading';

  private spinnerStateChanged: Subscription;

  private navigationStateChanged: Subscription;

  constructor(private loadingService: LoadingService) {}

  public ngOnInit() {
    this.spinnerStateChanged = this.loadingService.spinnerState.subscribe(
      (state: ILoadingState) => {
        this.visible = state.show;
        // this.bubbleVisible = state.show;
      }
    );

    this.navigationStateChanged = this.loadingService.navigationState.subscribe(
      (state: ILoadingState) => {
        // this.visible = state.show;
        this.bubbleVisible = state.show;
      }
    );
  }

  public ngOnDestroy() {
    if (this.spinnerStateChanged) {
      this.spinnerStateChanged.unsubscribe();
    }

    if (this.navigationStateChanged) {
      this.navigationStateChanged.unsubscribe();
    }
  }
}
