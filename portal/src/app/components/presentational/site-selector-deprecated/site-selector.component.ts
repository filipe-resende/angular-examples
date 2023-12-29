import {
  Component,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  ElementRef,
  ViewEncapsulation,
} from "@angular/core";
import { Site } from "../../../shared/models/site";

@Component({
  selector: "app-site-selector-deprecated",
  templateUrl: "site-selector.component.html",
  styleUrls: ["./site-selector.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class SiteSelectorDeprecatedComponent {
  @Input()
  set selectedSite(value: Site) {
    this._selectedSite = value;
    this.resize();
  }

  public _selectedSite: Site;

  @Input()
  public sitesList: Site[];

  @Input()
  public placeholder: string;

  @Output()
  public onSiteSelected = new EventEmitter();

  @ViewChild("hiddenText") public textEl: ElementRef;

  public width: number = 0;

  public onOptionSelectedEmitter(selectedOption) {
    this.resize();
    this.onSiteSelected.emit(selectedOption);
  }

  public resize() {
    setTimeout(() => (this.width = this.textEl.nativeElement.offsetWidth + 10));
  }
}
