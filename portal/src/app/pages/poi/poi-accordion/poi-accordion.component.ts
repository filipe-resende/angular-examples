import { Component, Input, Output, EventEmitter, ViewEncapsulation } from "@angular/core";

@Component({
  selector: "app-poi-accordion",
  templateUrl: "poi-accordion.component.html",
  styleUrls: ["poi-accordion.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class PoiAccordionComponent {
  @Input()
  public poi;

  @Output()
  public setPoi = new EventEmitter();

  @Output()
  public deletePointOfInterest = new EventEmitter();
}
