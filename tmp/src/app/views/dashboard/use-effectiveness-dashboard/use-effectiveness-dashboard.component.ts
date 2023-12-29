import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { DataEffectiveness } from 'src/app/model/effectiveness/data-effectiveness-interface';
import { ActiveNotTransmittingDevices } from 'src/app/model/effectiveness/active-not-transmitting-devices-interface';
import { MemberTypeConst } from 'src/app/shared/constantes/member-type.const';
import { ThingsService } from 'src/app/services/factories/things.service';
import { ThingEmail } from 'src/app/shared/interfaces/thing-email.interface';
import { InputAutoComplete } from 'src/app/shared/interfaces/input-autocomplete.interface';
import {
  ManagementNameResponse,
  Management,
} from 'src/app/model/management-name-interfaces';
import { SapPlantAll, SapPlant } from 'src/app/model/sap-plant-interfaces';
import { SapPlantService } from 'src/app/services/factories/sap-plant.service';
import { ManagementNameService } from 'src/app/services/management-name/management-name.service';
import { EffectivenessDashboardService } from '../../../services/dashboard/effectiveness-dashboard.service';

@Component({
  selector: 'app-use-effectiveness-dashboard',
  templateUrl: './use-effectiveness-dashboard.component.html',
  styleUrls: ['./use-effectiveness-dashboard.component.scss'],
})
export class UseEffectivenessDashboardComponent implements OnInit {
  public AvailabilityByLocationColumn = [];

  public ActiveNotTransmittingDevicesSpotTable: DataEffectiveness[] = [];

  public ActiveNotTransmittingDevicesSmartBadgeTable: DataEffectiveness[] = [];

  public activeNotTransmittingLoading = false;

  public autoCompleteThingsEmail: InputAutoComplete[] = [];

  public autoCompleteSapPlants: InputAutoComplete[] = [];

  public autoCompleteManagements: InputAutoComplete[] = [];

  constructor(
    private translate: TranslateService,
    private effectivenessService: EffectivenessDashboardService,
    private thingsService: ThingsService,
    private sapPlantService: SapPlantService,
    private managementNameService: ManagementNameService,
  ) {
    this.translate.get('DASHBOARD_EFFECTIVENESS').subscribe(labels => {
      this.AvailabilityByLocationColumn = [
        labels.TOTAL_ACTIVE,
        labels.NOT_TRANSMISSION,
      ];
    });

    this.prepareFiltersList();
  }

  ngOnInit(): void {
    this.activeNotTransmittingLoading = true;
    this.effectivenessService.GetEffectivenessData().subscribe(response => {
      this.activeNotTransmittingDevicesData(
        response.spot[0].activeNotTransmittingDevices,
        this.ActiveNotTransmittingDevicesSpotTable,
      );

      this.activeNotTransmittingDevicesData(
        response.smartBadge[0].activeNotTransmittingDevices,
        this.ActiveNotTransmittingDevicesSmartBadgeTable,
      );
      this.activeNotTransmittingLoading = false;
    });
  }

  private prepareFiltersList(): void {
    this.prepareSapPlantsList();
    this.prepareDeviceManagersList();
    this.prepareManagementsList();
  }

  private prepareDeviceManagersList(): void {
    this.thingsService
      .getThingsIdAndEmailByMemberType(MemberTypeConst.Manager)
      .subscribe((emailsList: ThingEmail[]) => {
        this.autoCompleteThingsEmail = emailsList.map((email: ThingEmail) => {
          return {
            id: email.thingId,
            name: email.email,
            hasNumberAsValue: false,
          };
        });
      });
  }

  private prepareSapPlantsList(): void {
    this.sapPlantService
      .getSapPlant()
      .subscribe((sapPlantList: SapPlantAll) => {
        this.autoCompleteSapPlants = sapPlantList.sapPlants.map(
          (sapPlant: SapPlant) => {
            return {
              id: sapPlant.id,
              code: sapPlant.code,
              name: sapPlant.description,
              hasNumberAsValue: false,
            };
          },
        );
      });
  }

  private prepareManagementsList(): void {
    this.managementNameService
      .getManagementName()
      .subscribe((managements: ManagementNameResponse) => {
        this.autoCompleteManagements = managements.management.map(
          (management: Management) => {
            return {
              id: management.id,
              code: management.code,
              name: management.description,
              hasNumberAsValue: false,
            };
          },
        );
      });
  }

  private activeNotTransmittingDevicesData(
    activeNotTransmitting: ActiveNotTransmittingDevices[],
    arrayIntegrator: DataEffectiveness[],
  ) {
    activeNotTransmitting.forEach(group => {
      arrayIntegrator.push(
        this.generateEffectivenessTableObject(
          group.label,
          group.activeCount,
          group.notTransmittingCount,
          group.notTransmittingPercentage,
        ),
      );
    });
  }

  private generateEffectivenessTableObject(
    label: string,
    firstValue: number,
    secondValue: number,
    percentage: string,
  ): DataEffectiveness {
    return {
      labelReference: label,
      columnValue: [firstValue, `${secondValue} | ${percentage}`],
    };
  }
}
