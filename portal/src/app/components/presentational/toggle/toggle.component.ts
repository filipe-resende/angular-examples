import { Component, Input, EventEmitter, Output, ViewEncapsulation } from "@angular/core";

@Component({
  selector: "app-toggle",
  templateUrl: "toggle.component.html",
  styleUrls: ["toggle.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class ToggleComponent {
  @Input()
  public tooltip: string;

  @Input()
  public label: string = "";

  @Input()
  public checked: boolean = false;

  @Input()
  public disabled: boolean = false;

  @Input()
  public loading: boolean = false;

  @Output()
  public onSelect = new EventEmitter();

  public onToggleClick(event): void {
    this.onSelect.emit(event);
  }
}
