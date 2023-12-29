import { Component, Input, Output, EventEmitter } from "@angular/core";

@Component({
  selector: "app-overlay-info",
  templateUrl: "overlay-info.component.html",
  styleUrls: ["overlay-info.component.scss"],
})
export class OverlayInfoComponent {
  @Input()
  public hideButtonSection = false;

  @Input()
  public buttonLabel = "";

  @Input()
  public buttonLoading = false;

  @Output()
  public buttonClick = new EventEmitter();
}
