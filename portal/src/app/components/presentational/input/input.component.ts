import {
  Component,
  Input,
  Output,
  EventEmitter,
  forwardRef,
  HostListener,
} from '@angular/core';
import {
  NG_VALUE_ACCESSOR,
  ControlValueAccessor,
  ControlContainer,
  FormGroupDirective,
  FormGroup,
} from '@angular/forms';

@Component({
  selector: 'app-input',
  templateUrl: 'input.component.html',
  styleUrls: ['input.component.scss'],
  providers: [
    {
      provide: ControlContainer,
      useExisting: FormGroupDirective,
    },
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true,
    },
  ],
})
export class InputComponent implements ControlValueAccessor {
  @Input()
  public label: string;

  @Input()
  public icon: string;

  @Input()
  public error = false;

  @Input()
  public flat = false;

  @Input()
  public errorMessage = '';

  @Input()
  public autoFocus = false;

  @Input()
  public iconOnLeft = false;

  @Input()
  public iconCursorPointer = false;

  @Input()
  public disabled = false;

  @Input()
  public placeholder = '';

  @Input()
  public inputModel: string;

  @Input()
  public type = 'text';

  @Input()
  public form: FormGroup;

  @Input()
  public controlName = '';

  @Input()
  public matDatepicker: any;

  @Input()
  public maxlength: number;

  @Input()
  public customMask: string;

  @Output()
  public inputModelChange = new EventEmitter<string>();

  @Output()
  public onIconClick = new EventEmitter();

  @HostListener('keypress', ['$event']) public onKeyPress(
    e: KeyboardEvent,
  ): void {
    if (e.key === 'Enter' && this.icon) {
      this.onIconClickEmitter();
    }
  }

  public onIconClickEmitter(): void {
    this.onIconClick.emit(this.inputModel);
  }

  public onChange: () => void;

  public onTouch: () => void;

  public registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }

  public writeValue(input: string): void {
    this.inputModel = input;
  }
}
