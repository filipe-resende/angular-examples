import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { SeverityLevel } from '@microsoft/applicationinsights-web';
import { ThingsRepository } from 'src/app/core/repositories/things.repository';
import { AlertModalService } from 'src/app/services/alert-modal/alert-modal.service';
import { LoggingService } from 'src/app/services/logging/logging.service';
import { ThingsService } from '../../../services/factories/things.service';

@Component({
  selector: 'app-thing-create',
  templateUrl: './thing-create.component.html',
  styleUrls: ['./thing-create.component.scss'],
})
export class ThingCreateComponent implements OnInit {
  constructor(
    private alertService: AlertModalService,
    private location: Location,
    private loggingService: LoggingService,
    private thingsRepository: ThingsRepository,
  ) {}

  ngOnInit(): void {
    this.loggingService.logEventWithUserInfo(
      'Portal TM - Navegou para things/create',
    );
  }

  onSubmit(thing) {
    this.thingsRepository.createThing(thing).subscribe(
      () => {
        this.loggingService.logEventWithUserInfo('Portal TM - Criou uma Thing');
        this.alertService.showAlertSuccess('Pessoa criada com successo!');
        this.location.back();
      },
      error => {
        this.handleAPIErrors(error);
      },
    );
  }

  handleAPIErrors(error: any) {
    switch (error.status) {
      case 400:
        this.alertService.showAlertDanger(
          'Documento cadastrado anteriormente',
          'Por favor, verifique o documento inserido ou se a pessoa já se encontra cadastrada no sistema.',
        );
        break;
      case 401:
        this.alertService.showAlertDanger(
          'Você não possui autorização para realizar esta operação',
          'Por favor, verifique com o seu gerente.',
        );
        break;
      case 500:
        this.alertService.showAlertDanger(
          'Estamos com problemas em nossos servidores',
          'Por favor tente mais tarde',
        );
        break;
      case 501:
        this.alertService.showAlertDanger(
          'Estamos com problemas em nossos servidores',
          'Por favor tente mais tarde',
        );
        break;
      default:
        this.alertService.showAlertDanger(
          'Pessoa não pode ser criada',
          'por favor tente mais tarde',
        );
        break;
    }

    this.loggingService.logException(error, SeverityLevel.Warning);
  }
}
