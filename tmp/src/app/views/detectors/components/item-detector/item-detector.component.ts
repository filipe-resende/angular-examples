/* eslint-disable no-unused-expressions */
import { Component, Input, OnInit } from '@angular/core';
import { AreaService } from 'src/app/services/area/area.service';
import { ApplicationsService } from 'src/app/services/factories/applications.service';
import { DetectorItem } from '../../../../model/detectors-interface';

@Component({
  selector: 'app-item-detector',
  templateUrl: './item-detector.component.html',
  styleUrls: ['./item-detector.component.scss'],
})
export class ItemDetectorComponent implements OnInit {
  @Input() externalData: DetectorItem;

  @Input() detectorList: DetectorItem[];

  data: DetectorItem;

  areaName: any;

  public areaId = '';

  public applicationName = '';

  constructor(
    private areaService: AreaService,
    private applicationService: ApplicationsService,
  ) {}

  ngOnInit(): void {
    if (this.externalData) {
      this.data = this.externalData;
      this.data.isAreaAccessPoint ? 'true' : 'false';
    }
    this.getApplicationById(this.data.applicationId);
  }

  getApplicationById(applicationId: string) {
    this.applicationService.getById(applicationId).subscribe(response => {
      this.applicationName = response.name;
    });
  }

  getAreaNameByAreaId(areaId: string, active: boolean) {
    this.areaService.getAreaById(areaId, active).subscribe(response => {
      this.areaName = response.areaName;
    });
  }
}
