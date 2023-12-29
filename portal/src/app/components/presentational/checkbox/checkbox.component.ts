import {
  Component,
  Input,
  EventEmitter,
  Output,
  ViewEncapsulation
} from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';

@Component({
  selector: 'app-checkbox',
  templateUrl: 'checkbox.component.html',
  styleUrls: ['checkbox.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CheckboxComponent {
  @Input()
  public tooltip: string;

  @Input()
  public label = '';

  @Input()
  public checked = false;

  @Input()
  public disabled = false;

  @Input()
  public loading = false;

  @Input()
  @Output()
  public onSelect = new EventEmitter();

  public onCheckboxClick(event: MatCheckboxChange): void {
    this.onSelect.emit(event);
  }
}
