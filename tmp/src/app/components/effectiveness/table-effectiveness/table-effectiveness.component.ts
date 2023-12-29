import { Component, Input, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import moment from 'moment';
import { DataEffectiveness } from 'src/app/model/effectiveness/data-effectiveness-interface';
import { InputAutoComplete } from 'src/app/shared/interfaces/input-autocomplete.interface';

@Component({
  selector: 'app-table-effectiveness',
  templateUrl: './table-effectiveness.component.html',
  styleUrls: ['./table-effectiveness.component.scss'],
})
export class TableEffectivenessComponent implements OnInit {
  @Input()
  public dashName = '';

  @Input()
  public thingsEmailListData: InputAutoComplete[] = [];

  @Input()
  public sapPlantListData: InputAutoComplete[] = [];

  @Input()
  public managementListData: InputAutoComplete[] = [];

  @Input()
  public applicationName = '';

  @Input()
  public columnsName = [];

  @Input()
  public dataAll: DataEffectiveness[];

  public yesterday = `${moment().subtract(1, 'days').format('DD/MMM/YY')}`;

  public total = 0;

  public totalPercentage = 0;

  private othersLabel: string;

  public data: DataEffectiveness[] = [];

  private managementId = '';

  private deviceManagerId = '';

  private sapPlantId = '';

  constructor(private translate: TranslateService) {
    moment.locale('pt-br');
    this.translate.get('TABLE_EFFECTIVENESS_COMPONENT').subscribe(labels => {
      this.othersLabel = labels.OTHERS;
    });
  }

  ngOnInit() {
    this.calcTotal();
    this.topFiveConstructor();
  }

  private calcTotal(): void {
    this.total = this.dataAll.reduce(
      (acc, element) => acc + (element.columnValue[0] as number),
      0,
    );
    this.totalPercentage = this.dataAll.reduce((acc, element) => {
      const getNumberValue = element.columnValue[1].toString().split(' |')[0];
      return acc + Number(getNumberValue);
    }, 0);
  }

  private topFiveConstructor(): void {
    const arrayOrderByAsc = [...this.dataAll].sort((a, b) =>
      a.columnValue[0] > b.columnValue[0] ? -1 : 1,
    );

    arrayOrderByAsc.push(
      ...this.preferenceFullyPopulatedLabel(arrayOrderByAsc),
    );

    if (this.dataAll.length > 5) {
      const topFive = arrayOrderByAsc.slice(0, 5);
      const others: DataEffectiveness = {
        labelReference: this.othersLabel,
        columnValue: [0, ''],
      };
      let secondColumnTotal = 0;

      arrayOrderByAsc.slice(5).forEach(element => {
        others.columnValue[0] += element.columnValue[0] as number;
        const getNumberValue = element.columnValue[1].toString().split(' |')[0];
        secondColumnTotal += Number(getNumberValue);
      });

      const percentage = (
        (secondColumnTotal / others.columnValue[0]) *
        100
      ).toFixed(2);
      others.columnValue[1] = `${secondColumnTotal} | ${percentage}%`;

      this.data = [...topFive, others];
    } else {
      this.data = arrayOrderByAsc;
    }
  }

  private preferenceFullyPopulatedLabel(
    arrayOrderByAsc: DataEffectiveness[],
  ): DataEffectiveness[] {
    const lessPriorityLabel: DataEffectiveness[] = [];

    arrayOrderByAsc.forEach(data => {
      const parametersLabel = data.labelReference.split(' | ');

      if (parametersLabel[2] === '-') {
        lessPriorityLabel.push(data);
      }
    });

    lessPriorityLabel.forEach(remove => {
      const index = arrayOrderByAsc.indexOf(remove);
      arrayOrderByAsc.splice(index, 1);
    });

    return lessPriorityLabel;
  }

  public saveManagerId(managerId: string): void {
    this.deviceManagerId = managerId;
  }

  public saveManagementId(managementId: string): void {
    this.managementId = managementId;
  }

  public saveSapPlantId(sapPlantId: string): void {
    this.sapPlantId = sapPlantId;
  }
}
