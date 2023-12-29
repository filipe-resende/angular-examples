import { Component, Input, OnInit } from '@angular/core';
import { ExportationTypes } from '../../../shared/enums/ExportationTypes';
import { UserProfileService } from '../../../stores/user-profile/user-profile.service';

@Component({
  selector: 'overlay-exporter',
  templateUrl: 'overlay-exporter.component.html',
  styleUrls: ['overlay-exporter.component.scss']
})
export class OverlayExporterComponent implements OnInit {
  @Input()
  public overlayRef;

  @Input()
  public from: string;

  @Input()
  public till: string;

  @Input()
  public exportCallback: (paramsObj: unknown) => Promise<void>;

  @Input()
  public exportDisplacementsCallback: (
    from: string,
    till: string,
    line: string | null,
    direction: string | null,
    plate: string | null
  ) => Promise<void>;

  public userEmail = '';

  public isLoadingExport = false;

  public hasExported = false;

  public paramsObj: unknown = {};

  public modalType: ExportationTypes;

  public textPrefix = '';

  constructor(private userProfileService: UserProfileService) {}

  public ngOnInit(): void {
    const {
      email
    } = this.userProfileService.getUserProfile();
    this.textPrefix = this.modalType;
    this.userEmail = email;
  }

  public export(): void {
    this.isLoadingExport = true;
    this.hasExported = true;

    /* eslint-disable-next-line @typescript-eslint/no-empty-function */
    const onSuccessCallback = () => {};

    this.exportCallback(this.paramsObj)
      .then(onSuccessCallback)
      .finally(() => {
        this.isLoadingExport = false;
      });
  }

  public close(): void {
    if (this.overlayRef) {
      this.overlayRef.detach();
    }
  }
}
