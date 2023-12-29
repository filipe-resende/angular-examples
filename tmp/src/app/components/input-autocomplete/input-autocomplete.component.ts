import { Component, EventEmitter, Input, Output } from '@angular/core';
import { InputAutoComplete } from 'src/app/shared/interfaces/input-autocomplete.interface';

@Component({
  selector: 'app-input-autocomplete',
  templateUrl: './input-autocomplete.component.html',
  styleUrls: ['./input-autocomplete.component.scss'],
})
export class InputAutoCompleteComponent {
  @Input() listData: InputAutoComplete[];

  @Input() placeHolder = '';

  @Output() selectedElementId = new EventEmitter();

  public elementName = '';

  public elementId = '';

  public filteredData: InputAutoComplete[] = [];

  public filterData(): void {
    this.filteredData = this.determineFilterType();
  }

  private filterAndOrderDataListByCode(): InputAutoComplete[] {
    return this.listData
      .filter(item => item.code.toString().includes(this.elementName))
      .sort(function order(a, b) {
        if (a.name < b.name) return -1;
        if (a.name > b.name) return 1;
        return 0;
      });
  }

  private filterAndOrderDataList(): InputAutoComplete[] {
    return this.listData
      .filter(item =>
        item.name.toLowerCase().includes(this.elementName.toLowerCase()),
      )
      .sort(function order(a, b) {
        if (a.name < b.name) return -1;
        if (a.name > b.name) return 1;
        return 0;
      });
  }

  private determineFilterType(): InputAutoComplete[] {
    const hasCodeValue = this.listData[0].code;
    if (hasCodeValue) return this.filterAndOrderDataListByCode();
    return this.filterAndOrderDataList();
  }

  public valueElementName(element: InputAutoComplete): void {
    if (element.code) {
      const code = `${element.code}`;
      this.elementName = code.concat(' - ', element.name);
    } else {
      this.elementName = element.name;
    }
    this.elementId = element.id;
    this.selectedElementId.emit(this.elementId);
  }

  public resetFields(): void {
    this.elementName = '';
    this.elementId = '';
  }

  public onFocusLostList(): void {
    this.resetFields();
    this.selectedElementId.emit(this.elementId);
  }
}
