import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  Management,
  ManagementNameResponse,
} from 'src/app/model/management-name-interfaces';
import { ManagementNameService } from 'src/app/services/management-name/management-name.service';

@Component({
  selector: 'app-management',
  templateUrl: './management.component.html',
  styleUrls: ['./management.component.scss'],
})
export class ManagementComponent {
  @Input() showInputFilled: boolean;

  @Input() inputFilled: number;

  @Output() validatorShowInput = new EventEmitter();

  @Output() managementName = new EventEmitter();

  @Output() managementId = new EventEmitter();

  public management: string;

  public managementNameLoading: boolean;

  public managementNameValidatorView = false;

  public dataManagementName: ManagementNameResponse;

  public filterDataManagementName: Management[] = [];

  public managementNameId = null;

  constructor(public managementService: ManagementNameService) {
    this.managementNameDisplay();
  }

  public filterManagementName(): void {
    if (this.dataManagementName) {
      this.filterDataManagementName = this.dataManagementName.management
        .filter(item =>
          item.code
            .toString()
            .toLowerCase()
            .includes(this.management.toLowerCase()),
        )
        .sort(function ordenar(a, b) {
          if (a.description < b.description) return -1;
          if (a.description > b.description) return 1;
          return 0;
        });
    } else {
      this.managementNameLoading = true;
      this.managementNameDisplay();
    }
  }

  managementNameDisplay(): void {
    this.managementService.getManagementName().subscribe(data => {
      this.managementNameLoading = false;
      this.dataManagementName = data;
      this.getInputFilled();
    });
  }

  public clearEnterManagementName(): void {
    this.management = '';
  }

  public validatorManagementName(event: string): void {
    if (event) {
      const result = this.filterDataManagementName.filter(
        item => item.code.toString() === event,
      );

      if (result.length > 0) {
        this.managementNameId = result[0].id;
      } else {
        this.managementNameValidatorView = true;
      }
    }
  }

  public valueManagementName(item: Management): void {
    const code = `${item.code}`;
    this.management = code.concat(' - ', `${item.description}`);
    this.managementNameId = item.id;
    this.managementNameValidatorView = false;

    this.managementName.emit(this.management);
    this.managementId.emit(this.managementNameId);
  }

  getInputFilled(): void {
    if (this.showInputFilled) {
      const res = this.dataManagementName.management.find(
        management => management.code === this.inputFilled,
      );
      this.valueManagementName(res);
      this.validatorShowInput.emit(true);
    }
  }
}
