/* eslint-disable prefer-destructuring */
import { Component, EventEmitter, Output } from '@angular/core';
import { CompanyInfoService } from 'src/app/services/factories/company-info-service';

@Component({
  selector: 'app-thing-company',
  templateUrl: './thing-company.component.html',
  styleUrls: ['./thing-company.component.scss'],
})
export class ThingCompanyComponent {
  @Output() companyInfoName = new EventEmitter();

  public company = '';

  public selectedCompany: string;

  public loading: boolean;

  public thingCompanyInfoData: string[] = [];

  public filteredCompanyInfoData: string[] = [];

  constructor(private companyInfoService: CompanyInfoService) {}

  public filterCompanies(): void {
    if (this.thingCompanyInfoData.length > 0) {
      this.filteredCompanyInfoData = this.filterAndOrderCompanyInfoList();
    } else {
      this.loading = true;
      this.companyDisplay();
    }
  }

  private filterAndOrderCompanyInfoList(): string[] {
    return this.thingCompanyInfoData
      .filter(item => item.toLowerCase().includes(this.company.toLowerCase()))
      .sort(function order(a, b) {
        if (a < b) return -1;
        if (a > b) return 1;
        return 0;
      });
  }

  public valueCompanyName(text: string): void {
    this.company = text;
    this.selectedCompany = text;
    this.companyInfoName.emit(this.selectedCompany);
  }

  public companyDisplay(): void {
    this.companyInfoService.getCompaniesFilteredList().subscribe(data => {
      this.thingCompanyInfoData = data;
      this.filteredCompanyInfoData = this.filterAndOrderCompanyInfoList();
      this.loading = false;
    });
  }

  public resetCompanyField(): void {
    this.company = '';
    this.selectedCompany = '';
  }

  public onFocusLostCompany(): void {
    this.resetCompanyField();
    this.companyInfoName.emit(this.selectedCompany);
  }
}
