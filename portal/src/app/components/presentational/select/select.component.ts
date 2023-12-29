import {
  Component,
  Input,
  Output,
  EventEmitter,
  ViewEncapsulation,
} from '@angular/core';

@Component({
  selector: 'app-select',
  templateUrl: 'select.component.html',
  styleUrls: ['select.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class SelectComponent {
  @Input()
  public label: string;

  @Input()
  public placeholder: string;

  @Input()
  public clearable = false;

  @Input()
  public items: any[] = [];

  @Input()
  public isItemsAsync = false;

  @Input()
  public loading = false;

  @Input()
  public disabled = false;

  @Input()
  public error = false;

  @Input()
  public searchable = true;

  @Input()
  public bindLabel: string;

  @Input()
  public bindValue: string;

  @Input()
  public multiple = false;

  @Input()
  public selected: any;

  @Input()
  public itemsCustomized: Array<{
    label: string;
    value: any;
    colorBox?: string;
    imgSrc?: string;
    imgOrColorBoxWidth?: number;
    imgOrColorBoxHeight?: number;
  }>;

  @Input()
  public dropdownType: string;

  @Output()
  public selectedChange = new EventEmitter<any>();

  @Output()
  public onSelect = new EventEmitter();

  public onChange(selectedValue) {
    this.onSelect.emit(selectedValue);
  }
}
