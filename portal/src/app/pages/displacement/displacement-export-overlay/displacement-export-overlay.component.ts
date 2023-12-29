import { Component, Input, OnInit } from '@angular/core';
import { UserProfileService } from '../../../stores/user-profile/user-profile.service';

@Component({
  selector: 'app-displacement-export-overlay',
  templateUrl: 'displacement-export-overlay.component.html',
  styleUrls: ['displacement-export-overlay.component.scss'],
})
export class DisplacementExportOverlayComponent implements OnInit {
  @Input()
  public overlayRef;

  @Input()
  public from: string;

  @Input()
  public till: string;

  @Input()
  public exportCallback: (from: string, till: string) => Promise<void>;

  public userEmail = '';

  public isLoadingExport = false;

  public hasExported = false;

  constructor(
    private userProfileService: UserProfileService
  ) { }

  public ngOnInit() {
    this.userEmail = this.userProfileService.getUserProfile().email;
  }

  public export() {
    this.isLoadingExport = true;

    const onSuccessCallback = () => {
      this.hasExported = true;
    };

    this.exportCallback(this.from, this.till)
      .then(onSuccessCallback)
      .finally(() => {
        this.isLoadingExport = false;
      });
  }

  public close() {
    if (this.overlayRef) {
      this.overlayRef.detach();
    }
  }
}
