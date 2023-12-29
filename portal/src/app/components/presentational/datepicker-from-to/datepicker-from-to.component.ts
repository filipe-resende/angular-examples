import {
  Component,
  Input,
  Output,
  EventEmitter,
  ViewEncapsulation,
  ViewChild
} from '@angular/core';
import { MatInput } from '@angular/material/input';

@Component({
  selector: 'app-datepicker-from-to',
  templateUrl: 'datepicker-from-to.component.html',
  styleUrls: ['datepicker-from-to.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DatepickerFromToComponent {
  @Input()
  public label: string;

  @Input()
  public error = false;

  @Input()
  public max;

  @Output()
  public dateChange = new EventEmitter();

  @Input()
  public max2;

  @Output()
  public dateChange2 = new EventEmitter();

  @Input()
  public dateInputValue: string;

  @Input()
  public dateInput2Value: string;

  @ViewChild('fromInput', {
    read: MatInput
  })
  public fromInput: MatInput;

  @ViewChild('toInput', {
    read: MatInput
  })
  public toInput: MatInput;

  public mask = [/\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/];

  public setDate(date) {
    this.dateChange.emit(date);
  }

  public setDate2(date) {
    this.dateChange2.emit(date);
  }

  public reset() {
    this.fromInput.value = '';
    this.toInput.value = '';
  }
}
