import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { MapApplicationIdToMiddleware } from '../../../../core/constants/application-to-middleware';
import { PanicAlertService } from '../../../../stores/panic-alert/panic-alert.service';
import { CachePanicAlert } from '../../../../stores/panic-alert/panic-alert.state';
import { PanicAlertAnswerCallOverlay } from '../panic-alert-answer-call-overlay/panic-alert-answer-call-overlay.component';

@Component({
  selector: 'app-panic-alert-overlay',
  templateUrl: 'panic-alert-overlay.component.html',
  styleUrls: ['panic-alert-overlay.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PanicAlertOverlayComponent implements OnInit {
  @Input()
  public alert: CachePanicAlert;

  public isUpdatingAlertAwareStatus = false;

  public message$: Observable<any>;

  public middlewareName: string;

  constructor(
    private panicAlertService: PanicAlertService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.setMiddlewareName();
  }

  public onAnswerCallButtonClick() {
    this.dialog.open(PanicAlertAnswerCallOverlay, {
      disableClose: true,
      data: { alert: this.alert }
    });
  }

  public async onMarkCurrentAlertAsAwareButtonClick() {
    try {
      this.isUpdatingAlertAwareStatus = true;

      await this.panicAlertService.setAlertAsAware(this.alert);
    } finally {
      this.isUpdatingAlertAwareStatus = false;
    }
  }

  private setMiddlewareName() {
    this.middlewareName =
      MapApplicationIdToMiddleware[this.alert?.sourceApplicationId];
  }
}
