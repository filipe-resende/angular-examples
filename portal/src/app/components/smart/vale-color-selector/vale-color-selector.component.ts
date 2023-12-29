import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { MatSelectChange } from '@angular/material/select';
import { ValeColor, ValeColorNames } from '../../../shared/enums/valeColors';

@Component({
  selector: 'app-vale-color-selector',
  templateUrl: './vale-color-selector.component.html',
  styleUrls: ['./vale-color-selector.component.scss'],
})
export class ValeColorSelectorComponent {
  @Input()
  public label = '';

  @Input()
  public model: string;

  @Output()
  public modelChange = new EventEmitter<string>();

  @ViewChild('colorPicker')
  public colorPickerElement: ElementRef;

  public isCustomColorSelected = false;

  public get ValeColorNames(): typeof ValeColorNames {
    return ValeColorNames;
  }

  public get ValeColor(): typeof ValeColor {
    return ValeColor;
  }

  public onSelectColor(color: MatSelectChange): void {
    this.setColor(color.value);
    this.isCustomColorSelected = false;
  }

  public onAddCustomColorClick(): void {
    this.colorPickerElement.nativeElement.click();
  }

  public onCustomColorSelected(color: string): void {
    this.setColor(color);
    this.isCustomColorSelected = true;
  }

  private setColor(color: string) {
    this.model = color;
    this.modelChange.emit(this.model);
  }
}
