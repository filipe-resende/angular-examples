import {
  Component,
  Input,
  ViewEncapsulation,
  Output,
  EventEmitter,
} from '@angular/core';
import { ControlContainer, FormGroupDirective } from '@angular/forms';

@Component({
  selector: 'app-hourpicker-from-to',
  templateUrl: 'hourpicker-from-to.component.html',
  styleUrls: ['hourpicker-from-to.component.scss'],
  encapsulation: ViewEncapsulation.None,
  viewProviders: [
    {
      provide: ControlContainer,
      useExisting: FormGroupDirective,
    },
  ],
})
export class HourpickerFromToComponent {
  @Input()
  public label: string;

  @Input()
  public input1Value: string;

  @Output()
  public input1Change = new EventEmitter();

  @Input()
  public input2Value: string;

  @Output()
  public input2Change = new EventEmitter();

  @Input()
  public disabled = false;

  public onInput1Change(event: string): void {
    this.input1Change.emit(event);
  }

  public onInput2Change(event: string): void {
    this.input2Change.emit(event);
  }
}
