import {
  Component,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  ElementRef,
  ViewEncapsulation,
} from "@angular/core";

@Component({
  selector: "app-select-big",
  templateUrl: "select-big.component.html",
  styleUrls: ["./select-big.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class SelectBigComponent<T> {
  @Input()
  set selected(value: T) {
    this._itemSelected = value;
    this.resize();
  }

  public _itemSelected: T;

  @Input()
  public itemList: T[];

  @Input()
  public dataBind: string;

  @Input()
  public dataValue: string;

  @Input()
  public placeholder: string;

  @Output()
  public onOptionSelected = new EventEmitter();

  @ViewChild("hiddenText") public textEl: ElementRef;

  public width: number = 0;

  public onOptionSelectedEmitter(selectedOption) {
    this.resize();
    this.onOptionSelected.emit(selectedOption);
  }

  public resize() {
    setTimeout(() => (this.width = this.textEl.nativeElement.offsetWidth + 10));
  }
}
