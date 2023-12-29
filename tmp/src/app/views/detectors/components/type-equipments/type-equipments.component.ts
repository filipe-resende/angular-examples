import {
  Component,
  Output,
  EventEmitter,
  Input,
  SimpleChanges,
} from '@angular/core';

@Component({
  selector: 'app-type-equipments',
  templateUrl: './type-equipments.component.html',
  styleUrls: ['./type-equipments.component.scss'],
})
export class TypeEquipmentsComponent {
  @Input() selectedApplication: string;

  @Output() emitEquipmentsList = new EventEmitter();

  public selectedValue = '';

  public typeEquipmentsOptions = [
    { name: 'Tipo do Equipamento', value: '' },
    { name: 'Camera', value: 'Camera' },
    { name: 'Porta', value: 'Door' },
  ];

  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes.selectedApplication.currentValue !==
      changes.selectedApplication.previousValue
    ) {
      this.selectedValue = '';
    }
  }

  getByTypeEquipments(value: string) {
    this.emitEquipmentsList.emit(value);
  }
}
