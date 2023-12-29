import { Component, EventEmitter, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { environment } from '../../../environments/environment';
import { LoggingService } from '../../services/logging/logging.service';

export interface ClickableItem {
  icon: string;
  label: string;
  click?: () => void;
}

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  @Output() action = new EventEmitter();

  public readonly gapPortalUrl = environment.gapPortalUrl;

  public readonly valeLogo = '../../assets/Logotipo_Vale.svg';

  public isShowOptionsProfile: boolean;

  public isOpenProfile: boolean;

  constructor(
    private translate: TranslateService,
    private loggerService: LoggingService,
  ) {}

  public openInfo(): void {
    if (!this.isShowOptionsProfile) {
      this.isShowOptionsProfile = true;
    } else {
      this.isShowOptionsProfile = false;
    }
  }

  public openProfile(): void {
    this.isOpenProfile = true;
  }

  public onClose(): void {
    this.isOpenProfile = false;
  }

  public onChangeLanguage(language: string): void {
    this.translate.use(language);
    this.loggerService.logEventWithUserInfo('Portal TM - Alterando Linguagem');
  }

  public onClick(): void {
    this.action.emit();
  }
}
