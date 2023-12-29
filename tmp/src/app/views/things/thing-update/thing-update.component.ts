import { DatePipe } from '@angular/common';
import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SeverityLevel } from '@microsoft/applicationinsights-web';
import { DatePickerComponent } from 'src/app/components/date-picker/date-picker.component';
import { ThingItem } from 'src/app/model/things-interfaces';
import { AlertModalService } from 'src/app/services/alert-modal/alert-modal.service';
import { ThingsService } from 'src/app/services/factories/things.service';
import { LoggingService } from 'src/app/services/logging/logging.service';

@Component({
  selector: 'app-thing-update',
  templateUrl: './thing-update.component.html',
  styleUrls: ['./thing-update.component.scss'],
  providers: [DatePipe],
})
export class ThingUpdateComponent implements OnInit {
  @ViewChild(DatePickerComponent) datepicker: DatePickerComponent;

  @HostListener('window:scroll')
  onScroll() {
    this.datepicker.hideCalendar();
  }

  public defaultInitialDate: string;

  public defaultLastDate: string;

  public name: string;

  public firstDate: string;

  public lastDate: string;

  public firstDateHour: string;

  public lastDateHour: string;

  public thingToBeUpdated: ThingItem;

  public formSubmited = false;

  constructor(
    private loggingService: LoggingService,
    private route: ActivatedRoute,
    private alertService: AlertModalService,
    private thingService: ThingsService,
    private datePipe: DatePipe,
  ) {}

  ngOnInit(): void {
    this.loadData();
    this.setDefaultDate();
    this.loggingService.logEventWithUserInfo(
      'Portal TM - Navegou para things/update',
    );
  }

  loadData() {
    this.route.params.subscribe(
      (params: any) => {
        this.thingService.getById(params.id).subscribe(
          data => {
            this.thingToBeUpdated = { ...data };
            this.name = data.name;
          },
          error =>
            this.loggingService.logException(error, SeverityLevel.Warning),
        );
      },
      error => this.loggingService.logException(error, SeverityLevel.Warning),
    );
  }

  public refresh(thingToBeUpdated: ThingItem) {
    this.thingToBeUpdated = { ...thingToBeUpdated };
  }

  update(thing: ThingItem): void {
    this.formSubmited = true;
    this.thingService.update(thing.id, thing).subscribe(
      () => {
        this.alertService.showAlertSuccess('Pessoa editada com sucesso!', '');
        this.loggingService.logEventWithUserInfo(
          'Portal TM - Editou uma Thing',
        );
        this.formSubmited = false;
      },
      error => {
        if (error.status === 400) {
          this.alertService.showAlertDanger(
            'Documento cadastrado anteriormente',
            'Por favor, verifique o documento inserido ou se a pessoa já se encontra cadastrada no sistema.',
          );
        } else {
          this.alertService.showAlertDanger(
            'Algo de errado aconteceu',
            'Por favor volte mais tarde',
          );
        }
        this.loggingService.logException(error, SeverityLevel.Information);
        this.formSubmited = false;
      },
    );
  }

  public getFirstDate(value) {
    this.firstDate = value;
  }

  public getLastDate(value) {
    this.lastDate = value;
  }

  public getFirstDateHour(value) {
    this.firstDateHour = value;
  }

  public getLastDateHour(value) {
    this.lastDateHour = value;
  }

  public setDefaultDate() {
    this.defaultInitialDate = '01/01/2010';
    this.defaultLastDate = this.datePipe.transform(
      new Date(),
      'dd/MM/yyyy',
      '+24',
    );
  }
}
