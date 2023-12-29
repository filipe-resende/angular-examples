import {
  Component,
  Input,
  Output,
  EventEmitter,
  SimpleChanges,
} from '@angular/core';

@Component({
  selector: 'app-dropdown-perimeter',
  templateUrl: './dropdown-perimeter.component.html',
  styleUrls: ['./dropdown-perimeter.component.scss'],
})
export class DropdownPerimeterComponent {
  @Input() selectedApplication: string;

  @Output() emitPerimeterList = new EventEmitter();

  public selectedValue = '';

  public statusPerimeterOptions = [
    { name: 'Indicação de perímetro', value: '' },
    { name: 'Acesso Perímetro', value: true },
    { name: 'Acesso não Perímetro', value: false },
  ];

  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes.selectedApplication.currentValue !==
      changes.selectedApplication.previousValue
    ) {
      this.selectedValue = '';
    }
  }

  getByStatusPerimeter(value: string) {
    this.emitPerimeterList.emit(value);
  }
}
