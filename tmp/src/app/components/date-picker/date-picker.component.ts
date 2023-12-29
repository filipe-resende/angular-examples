/* eslint-disable no-plusplus */
/* eslint-disable no-param-reassign */

import { DatePipe } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import {
  BsDatepickerConfig,
  BsDatepickerDirective,
  BsLocaleService,
} from 'ngx-bootstrap/datepicker';

import { defineLocale } from 'ngx-bootstrap/chronos';
import { ptBrLocale } from 'ngx-bootstrap/locale';

@Component({
  selector: 'app-date-picker',
  templateUrl: 'date-picker.component.html',
})
export class DatePickerComponent implements OnInit {
  @ViewChild(BsDatepickerDirective, { static: false })
  datepicker: BsDatepickerDirective;

  @Output() emitDay = new EventEmitter<string>();

  @Output() emitHour = new EventEmitter<string>();

  @Input() model: string;

  public datePickerConfig: Partial<BsDatepickerConfig>;

  public;

  public showDropDown = false;

  public hourCounter = 0;

  public dayHours = [
    '0',
    '1',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    '10',
    '11',
    '12',
    '13',
    '14',
    '15',
    '16',
    '17',
    '18',
    '19',
    '20',
    '21',
    '22',
    '23',
  ];

  constructor(
    private localeService: BsLocaleService,
    private datePipe: DatePipe,
  ) {}

  ngOnInit() {
    this.datePickerConfig = {
      showWeekNumbers: false,
      dateInputFormat: 'DD/MM/YYYY',
    };
    defineLocale('pt-br', ptBrLocale);
    this.localeService.use('pt-br');
  }

  public onSelectDay(date) {
    this.emitDay.emit(date);
  }

  public hideCalendar() {
    this.datepicker.hide();
  }

  public onSelectHour(hour, i) {
    this.hourCounter = i;
    hour = i < 9 ? `T0${hour}:00:00` : `T${hour}:00:00`;
    this.emitHour.emit(hour);
  }

  increaseHour() {
    this.hourCounter = this.hourCounter === 23 ? 23 : ++this.hourCounter;
    this.onSelectHour(`${this.hourCounter}`, this.hourCounter);
    return this.hourCounter;
  }

  decreaseHour() {
    this.hourCounter = this.hourCounter === 0 ? 0 : --this.hourCounter;
    this.onSelectHour(`${this.hourCounter}`, this.hourCounter);
    return this.hourCounter;
  }
}
