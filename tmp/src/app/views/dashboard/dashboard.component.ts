import {
  AfterViewChecked,
  AfterViewInit,
  Component,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { DashboardType } from 'src/app/core/constants/Charts/dashboard-type-charts';
import { ManagementDashboardComponent } from './management-dashboard/management-dashboard.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements AfterViewInit, AfterViewChecked {
  @ViewChild(ManagementDashboardComponent)
  childManagementDashboard: ManagementDashboardComponent;

  @ViewChild('mySelect') selectElement: ElementRef<HTMLSelectElement>;

  public selectedOption = DashboardType.ManagementDashboard;

  public buttonIsEnabled = false;

  public date = new Date();

  public stateExport: boolean;

  public text: any = {};

  public options: any = {};

  public typeDashboard = DashboardType;

  constructor(private translate: TranslateService) {
    this.setTranslateDashboard();

    this.options = [
      {
        label: this.text.management,
        value: this.typeDashboard.ManagementDashboard,
      },
      {
        label: this.text.useEffectivenessDashboard,
        value: this.typeDashboard.UseEffectivenessDashboard,
      },
    ];
  }

  private setTranslateDashboard(): void {
    this.translate.get('DASHBOARD.MANAGEMENT_DASHBOARD').subscribe(a => {
      this.text.management = a;
    });
    this.translate.get('DASHBOARD.USE_EFFECTIVENESS_DASHBOARD').subscribe(a => {
      this.text.useEffectivenessDashboard = a;
    });
  }

  ngAfterViewInit(): void {
    this.adjustSelectSize(this.selectElement.nativeElement);
  }

  ngAfterViewChecked(): void {
    if (
      Number(this.selectedOption) === this.typeDashboard.ManagementDashboard
    ) {
      this.childManagementDashboard.buttonIsEnabled.subscribe(hasData => {
        this.buttonIsEnabled = hasData;
      });
    }
  }

  adjustSelectSize(selectElement: HTMLSelectElement) {
    this.buttonIsEnabled = false;
    const selectedOption = this.options.find(
      option => option.value.toString() === selectElement.value,
    );

    if (selectedOption) {
      selectElement.style.width = `${selectedOption.label.length + 1}ex`;
    } else {
      selectElement.style.width = '20ex';
    }
  }

  public performSpecificActionButtonExport() {
    if (
      Number(this.selectedOption) === this.typeDashboard.ManagementDashboard
    ) {
      this.childManagementDashboard.openModalExport();
    }
  }
}
