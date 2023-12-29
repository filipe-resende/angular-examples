import { Component, Input, OnInit } from "@angular/core";
import { Observable } from "rxjs";
import { map, tap } from "rxjs/operators";
import { CachePanicAlert } from "../../../../stores/panic-alert/panic-alert.state";
import { PanicAlertService } from "../../../../stores/panic-alert/panic-alert.service";

@Component({
  selector: "app-panic-alert-subitem",
  templateUrl: "panic-alert-subitem.component.html",
  styleUrls: ["panic-alert-subitem.component.scss"],
})
export class PanicAlertSubItemComponent {
  @Input()
  public alert: CachePanicAlert;

  @Input()
  public index: number;

  public alert$: Observable<CachePanicAlert> = this.panicAlertService.alerts$.pipe(
    map((alerts) =>
      alerts.find(
        (item) => item.deviceSourceInfoId === this.alert.deviceSourceInfoId && this.alert.cacheId === item.cacheId
      )
    )
  );

  constructor(private panicAlertService: PanicAlertService) {}

  public setAlertAsMain() {
    this.panicAlertService.setAlertAsMainAlert(this.alert);
  }
}
