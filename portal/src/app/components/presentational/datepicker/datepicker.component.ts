import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-datepicker',
  templateUrl: 'datepicker.component.html',
  styleUrls: ['datepicker.component.scss'],
})
export class DatepickerComponent {
  @Input()
  public label: string;

  @Input()
  public max;

  @Input()
  public min;

  @Input()
  public value: string;

  @Input()
  public stretched = false;

  @Input()
  public disabled = false;

  @Input()
  public placeholder: string;

  @Output()
  public dateChange = new EventEmitter();

  public mask = [/\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/];

  public setDate(date: string): void {
    this.dateChange.emit(date);
  }
}
