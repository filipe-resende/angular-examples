import {
  Component,
  Input,
  Output,
  EventEmitter,
  ViewEncapsulation,
} from '@angular/core';

@Component({
  selector: 'app-hourpicker',
  templateUrl: 'hourpicker.component.html',
  styleUrls: ['hourpicker.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class HourpickerComponent {
  @Input()
  public label: string;

  @Input()
  public max;

  @Input()
  public value: string;

  @Input()
  public error: boolean;

  @Input()
  public disabled: boolean;

  @Input()
  public stretched = false;

  @Output()
  public hourChange = new EventEmitter();

  public setHour({ target: { value } }) {
    this.hourChange.emit(value);
  }
}
