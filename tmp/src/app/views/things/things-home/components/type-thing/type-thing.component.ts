import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  SimpleChanges,
  OnChanges,
} from '@angular/core';

@Component({
  selector: 'app-type-thing',
  templateUrl: './type-thing.component.html',
  styleUrls: ['./type-thing.component.scss'],
})
export class TypeThingComponent {
  @Output() searchType = new EventEmitter();

  public selectedType = '';

  public typeOptions = [
    { name: 'Tipo de Busca', value: '' },
    { name: 'Nome', value: 'name' },
    { name: 'CPF', value: 'cpf' },
    { name: 'IAM', value: 'iam' },
    { name: 'MDM', value: 'mdm' },
  ];

  getByThingType(type: string) {
    this.searchType.emit(type);
  }
}
