import {
  ChangeDetectorRef,
  Component,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FocalPoint } from '../../shared/models/focal';
import { FocalService } from '../../core/services/focal-service/focal.service';
import { SmsService } from '../../core/services/sms/sms.service';
import { PointOfInterest } from '../../shared/models/poi';
import { Site } from '../../shared/models/site';
import { PushNotificationService } from '../../core/services/push-notification-service/push-notification.service';
import { SiteRepository } from '../../core/repositories/site.repository';
import { LocationRepository } from '../../core/repositories/location.repository';
import { PoiRepository } from '../../core/repositories/poi.repository';
import { MapComponent } from '../../components/smart/map/map.component';
import { Driver } from '../../shared/models/driver';

import { DriverService } from '../../core/services/driver-service/driver.service';

@Component({
  selector: 'app-focal',
  templateUrl: './focal.component.html',
  styleUrls: ['./focal.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class FocalComponent implements OnInit {
  @ViewChild('googleMap') public googleMap: MapComponent;

  public showAllPoisToggle: boolean;

  public selectedAll = false;

  public selectedDriverAll = false;

  public showLoading = false;

  public showDriverLoading = false;

  public showSecondTab = false;

  public showEditTab = false;

  public showEditTabDriver = false;

  public lastAreaIdSelected: string;

  private lastAreaSelected: any;

  public showButtonAlert = false;

  public showButtonDriverAlert = false;

  public site: Site;

  public sitesList: Site[] = [];

  public poiCategorys = [];

  public poi: PointOfInterest = new PointOfInterest();

  public poiList: PointOfInterest[] = [];

  public focal: FocalPoint = new FocalPoint();

  public focalList: FocalPoint[] = [];

  public driver: Driver = new Driver();

  public driverList: Driver[] = [];

  public sendSmsDriverList: Driver[] = [];

  public driverPoiList: PointOfInterest[] = [];

  public sendSmsFocalList: FocalPoint[] = [];

  public focalPoiList: PointOfInterest[] = [];

  public notificationMessage: string;

  public notificationDriverMessage: string;

  public enableFocalPoiMarker: any;

  private categoryPoi: string;

  public listPhone: string[] = [];

  public messageId;

  public messageDriverId;

  public messagesDriverList = [
    {
      id: 1,
      title: 'MENSAGEM PADRÃO PARA NE-1',
      description:
        'Elevação do nível de emergência da Barragem X para NE1. Mantenha-se em prontidão! Obs.: É necessário confirmar o recebimento desta notificação no aplicativo Alerta de Barragens.',
    },
    {
      id: 2,
      title: 'MENSAGEM PADRÃO PARA NE-2',
      description:
        'Elevação do nível de emergência da Barragem X para NE2. Realizar o PROCEDIMENTO DE EVACUAÇÃO! Deverá acionar sua equipe de apoio, dirigir-se ao Posto de Distribuição para retirar o KIT do PE e deslocar-se imediatamente ao PE sob sua responsabilidade. Obs.: É necessário confirmar o recebimento desta notificação.',
    },
    {
      id: 3,
      title: 'MENSAGEM PADRÃO PARA NE-3',
      description:
        'Elevação do nível de emergência da Barragem X para NE3. Mantenha-se em prontidão! Obs.: Não deverá se deslocar ao PE,a população já foi evacuada em NE2. Caso seja necessária sua atuação, você será informado. É necessário confirmar o recebimento desta notificação.',
    },
    {
      id: 4,
      title: 'SIMULADO',
      description:
        'SIMULADO! Realizar o PROCEDIMENTO DE EVACUAÇÃO! Deverá acionar sua equipe de apoio, dirigir-se ao Posto de Distribuição para retirar o KIT do PE e deslocar-se imediatamente ao PE sob sua responsabilidade. Obs.: É necessário confirmar o recebimento desta notificação.',
    },
    {
      id: 5,
      title: 'TESTE DE PRONTIDÃO 1',
      description:
        'Exercício de PRONTIDÃO! Mantenha-se atento aos acionamentos. Não é necessário deslocar-se ao PE, somente confirme o recebimento desta notificação. Obs.: É necessário confirmar o recebimento desta notificação.',
    },
    {
      id: 6,
      title: 'TESTE DE PRONTIDÃO 2',
      description:
        'Exercício de PRONTIDÃO! Dirigir-se imediatamente ao PE sob sua responsabilidade. Obs.: É necessário confirmar o recebimento desta notificação.',
    },

    {
      id: 7,
      title: '',
      description:
        'Por gentileza vá para o Ponto de encontro. Obs.: É necessário confirmar o recebimento desta notificação.',
    },
  ];

  public messagesList = [
    {
      id: 1,
      title: 'MENSAGEM PADRÃO PARA NE-1',
      description:
        'Elevação do nível de emergência da Barragem X para NE1. Mantenha-se em prontidão! Obs.: É necessário confirmar o recebimento desta notificação no aplicativo Alerta de Barragens.',
    },
    {
      id: 2,
      title: 'MENSAGEM PADRÃO PARA NE-2',
      description:
        'Elevação do nível de emergência da Barragem X para NE2. Realizar o PROCEDIMENTO DE EVACUAÇÃO! Deverá acionar sua equipe de apoio, dirigir-se ao Posto de Distribuição para retirar o KIT do PE e deslocar-se imediatamente ao PE sob sua responsabilidade. Obs.: É necessário confirmar o recebimento desta notificação.',
    },
    {
      id: 3,
      title: 'MENSAGEM PADRÃO PARA NE-3',
      description:
        'Elevação do nível de emergência da Barragem X para NE3. Mantenha-se em prontidão! Obs.: Não deverá se deslocar ao PE,a população já foi evacuada em NE2. Caso seja necessária sua atuação, você será informado. É necessário confirmar o recebimento desta notificação.',
    },
    {
      id: 4,
      title: 'SIMULADO',
      description:
        'SIMULADO! Realizar o PROCEDIMENTO DE EVACUAÇÃO! Deverá acionar sua equipe de apoio, dirigir-se ao Posto de Distribuição para retirar o KIT do PE e deslocar-se imediatamente ao PE sob sua responsabilidade. Obs.: É necessário confirmar o recebimento desta notificação.',
    },
    {
      id: 5,
      title: 'TESTE DE PRONTIDÃO 1',
      description:
        'Exercício de PRONTIDÃO! Mantenha-se atento aos acionamentos. Não é necessário deslocar-se ao PE, somente confirme o recebimento desta notificação. Obs.: É necessário confirmar o recebimento desta notificação.',
    },
    {
      id: 6,
      title: 'TESTE DE PRONTIDÃO 2',
      description:
        'Exercício de PRONTIDÃO! Dirigir-se imediatamente ao PE sob sua responsabilidade. Obs.: É necessário confirmar o recebimento desta notificação.',
    },

    {
      id: 7,
      title: '',
      description:
        'Por gentileza vá para o Ponto de encontro. Obs.: É necessário confirmar o recebimento desta notificação.',
    },
  ];

  public selectedIndex = 0;

  public selectedGeneralIndex = 0;

  public selectedDriverIndex = 0;

  public ngForm: FormGroup;

  constructor(
    private focalService: FocalService,
    private driverService: DriverService,
    private siteService: SiteRepository,
    private _snackBar: MatSnackBar,
    private dialog: MatDialog,
    private poiRepository: PoiRepository,
    private thingsService: LocationRepository,
    private fb: FormBuilder,
    private cdRef: ChangeDetectorRef,
    private pushNotification: PushNotificationService,
    private smsService: SmsService,
  ) {
    this.ngForm = this.fb.group({
      name: ['', Validators.required],
      matricula: ['', Validators.required],
      phone: [undefined],
      site: ['', Validators.required],
      category: ['', Validators.required],
      pointOfInterest: ['', Validators.required],
      message: ['', Validators.required],
    });
  }

  public async ngOnInit() {
    const lastSiteFromStorage = localStorage.getItem('lastSiteAreaSelected');

    if (lastSiteFromStorage) {
      this.lastAreaSelected = JSON.parse(lastSiteFromStorage);
      this.lastAreaIdSelected = this.lastAreaSelected.id;
    }
    this.listAllSites();

    this.showStandardMessage({
      id: 7,
      title: '',
      description:
        'Por gentileza vá para o Ponto de encontro. Obs.: É necessário confirmar o recebimento desta notificação.',
    });

    this.showStandardDriverMessage({
      id: 5,
      title: '',
      description:
        '(Motorista) Por gentileza vá para o Ponto de encontro. Obs.: É necessário confirmar o recebimento desta notificação.',
    });
  }

  public ngAfterViewInit() {
    if (this.lastAreaSelected) {
      this.setSiteOnMap(this.lastAreaSelected);
      this.listAllFocalPointBySite(this.lastAreaSelected);
    }
    this.cdRef.detectChanges();
  }

  private listAllSites() {
    this.siteService
      .listSitesGeographicByCategory('CD05A357-65B0-42A5-3DF4-08D7CF51E5FA')
      .subscribe(response => {
        this.sitesList = response.body;
      });
  }

  public thingNameByMatricula() {
    if (this.ngForm.value.matricula) {
      this.thingsService
        .thingNameByMatricula(this.ngForm.value.matricula)
        .subscribe(response => {
          this.ngForm.value.name = response.body.name;
        });
    } else {
      this.ngForm.value.name = undefined;
    }
  }

  public setSiteOnMap(site: Site) {
    localStorage.setItem('lastSiteAreaSelected', JSON.stringify(site));
    this.site = site;
    this.lastAreaSelected = this.site;
    this.lastAreaIdSelected = this.site.id;
    this.showSecondTab = true;
    this.googleMap.initMap(site.latitude, site.longitude, site.zoom);
  }

  private listAllFocalPointBySite(site: Site) {
    this.focalService.listByArea(site.id).subscribe((res: any) => {
      this.focalList = res;
      this.focalPoiList = this.focalList.map(x => x.pointOfInterest);
      this.toggleAllPois(!!(window as any).google, this.focalPoiList);

      if (this.focalPoiList.length === 0) {
        this.showAllPoisToggle = false;
      }
      this.selectedAll = false;
      this.showButtonAlert = this.selectedAll;
    });
    this.sendSmsFocalList = [];
  }

  private listAllDriversBySite(site: Site) {
    this.driverService.listByArea(site.id).subscribe((res: any) => {
      this.driverList = res;
      this.driverPoiList = this.driverList.map(x => x.pointOfInterest);
      this.toggleAllPois(!!(window as any).google, this.driverPoiList);

      if (this.driverPoiList.length === 0) {
        this.showAllPoisToggle = false;
      }
      this.selectedDriverAll = false;
      this.showButtonDriverAlert = this.selectedDriverAll;
    });
    this.sendSmsDriverList = [];
  }

  public setPoi(poi) {
    if (this.showAllPoisToggle === false) {
      if (poi.panelOpenState === true) {
        this.googleMap.clearPoiMarkers();
        this.googleMap.setPoiMarker(poi);
      } else {
        this.googleMap.clearPoiMarkers();
      }
    }
  }

  public selectedAllList() {
    this.focalList.forEach(x => {
      x.selected = this.selectedAll;
    });
    this.showButtonAlert = this.selectedAll;
    // this.showStandardMessage();
    this.addAllSmsList();
  }

  public selectedDriverAllList() {
    this.driverList.forEach(x => {
      x.selected = this.selectedDriverAll;
    });
    this.showButtonDriverAlert = this.selectedDriverAll;
    // this.showStandardDriverMessage();
    this.addDriverAllSmsList();
  }

  public showStandardMessage(message) {
    this.messageId = message.id;
    this.notificationMessage = message.description;
    // "Por gentileza vá para o Ponto de encontro. Obs.: É necessário confirmar o recebimento desta notificação.";
  }

  public showStandardDriverMessage(message) {
    this.messageDriverId = message.id;
    this.notificationDriverMessage = message.description;
    // "Por gentileza vá para o Ponto de encontro. Obs.: É necessário confirmar o recebimento desta notificação.";
  }

  public selectedFocalPoint(focal) {
    this.addSmsSendList(focal);
    this.focalList.forEach(x => {
      if (x.id === focal.id) {
        x.selected = focal.selected;
      }
    });
    this.showButtonAlert =
      this.focalList.filter(x => x.selected === true).length > 0;
    this.selectedAll = !(
      this.focalList.filter(
        x => x.selected === undefined || x.selected === false,
      ).length > 0
    );

    if (!this.showButtonAlert) {
      // this.showStandardMessage();
    }
  }

  public selectedDriver(driver) {
    this.addDriverSmsSendList(driver);
    this.driverList.forEach(x => {
      if (x.id === driver.id) {
        x.selected = driver.selected;
      }
    });
    this.showButtonDriverAlert =
      this.driverList.filter(x => x.selected === true).length > 0;
    this.selectedDriverAll = !(
      this.driverList.filter(
        x => x.selected === undefined || x.selected === false,
      ).length > 0
    );

    if (!this.showButtonDriverAlert) {
      // this.showStandardDriverMessage();
    }
  }

  public toggleAllPois(toggleEvent, poiList) {
    if (toggleEvent.source) {
      this.showAllPoisToggle = toggleEvent.checked;
    } else {
      this.showAllPoisToggle = toggleEvent;
    }

    if (this.showAllPoisToggle) {
      poiList.forEach((poi: PointOfInterest) => {
        this.googleMap.setPoiMarker(poi);
      });
    } else {
      this.googleMap.clearPoiMarkers();
    }
  }

  public deleteFocalPoint(focal) {
    this.focalService.delete(focal).subscribe(res => {
      this.listAllFocalPointBySite(this.site);
      this.googleMap.clearPoiMarkers();
      this.openSnackBar('Ponto Focal apagado', 'Ok');
    });
  }

  public deleteDriver(driver) {
    this.driverService.delete(driver).subscribe(res => {
      this.listAllDriversBySite(this.site);
      this.googleMap.clearPoiMarkers();
      this.openSnackBar('Motorista apagado', 'Ok');
    });
  }

  private openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 4000,
    });
  }

  public listAllPoisCategorys() {
    this.poiRepository.listPoisCategorys().subscribe(res => {
      this.poiCategorys = res;
    });
  }

  public listAllPointOfInterestBySite(site, category) {
    this.poiRepository.listByArea(site, category).subscribe((res: any) => {
      this.poiList = res;
      this.toggleAllPois(!!(window as any).google, this.poiList);

      if (this.poiList.length === 0) {
        this.showAllPoisToggle = false;
      }
    });
  }

  public tabClick(tab) {
    if (tab.index === 0) {
      this.selectedIndex = tab.index;
      this.googleMap.poiMarkerData = { lat: 0, lng: 0 };
      this.googleMap.clearPoiMarkers();
      this.toggleAllPois(this.showAllPoisToggle, this.focalPoiList);
    }

    if (tab.index === 1) {
      this.googleMap.poiMarkerData = { lat: 0, lng: 0 };
      this.selectedIndex = tab.index;
      this.googleMap.clearPoiMarkers();
      this.listAllPoisCategorys();
    }

    if (tab.index === 2) {
      this.listPhone = [];
      this.googleMap.poiMarkerData = { lat: 0, lng: 0 };
      this.selectedIndex = tab.index;
      this.googleMap.clearPoiMarkers();
      this.listAllPoisCategorys();
    }
  }

  public tabGeneralClick(tab) {
    if (tab.index === 0) {
      this.selectedGeneralIndex = tab.index;
      this.googleMap.poiMarkerData = { lat: 0, lng: 0 };
      this.googleMap.clearPoiMarkers();
      this.toggleAllPois(this.showAllPoisToggle, this.focalPoiList);
    }

    if (tab.index === 1) {
      this.googleMap.poiMarkerData = { lat: 0, lng: 0 };
      this.selectedGeneralIndex = tab.index;
      this.googleMap.clearPoiMarkers();
      this.listAllPoisCategorys();
    }

    if (tab.index === 2) {
      this.listPhone = [];
      this.googleMap.poiMarkerData = { lat: 0, lng: 0 };
      this.selectedGeneralIndex = tab.index;
      this.googleMap.clearPoiMarkers();
      this.listAllPoisCategorys();
    }
  }

  public tabDriverClick(tab) {
    if (tab.index === '3') {
      this.selectedDriverIndex = tab.index;
      this.googleMap.poiMarkerData = { lat: 0, lng: 0 };
      this.googleMap.clearPoiMarkers();
      this.toggleAllPois(this.showAllPoisToggle, this.driverPoiList);
    }

    if (tab.index === '4') {
      this.googleMap.poiMarkerData = { lat: 0, lng: 0 };
      this.selectedDriverIndex = tab.index;
      this.googleMap.clearPoiMarkers();
      this.listAllPoisCategorys();
    }

    if (tab.index === '5') {
      this.listPhone = [];
      this.googleMap.poiMarkerData = { lat: 0, lng: 0 };
      this.selectedDriverIndex = tab.index;
      this.googleMap.clearPoiMarkers();
      this.listAllPoisCategorys();
    }
  }

  public submitFocalPoi() {
    let focalPoi: any;

    if (this.focal.id) {
      focalPoi = {
        id: this.focal.id,
        name: this.ngForm.value.name,
        matricula: this.ngForm.value.matricula,
        phoneNumber:
          this.listPhone.length > 0 ? this.listPhone.join(',') : null,
        localityId: this.ngForm.value.site,
        pointOfInterestId: this.ngForm.value.pointOfInterest,
      };
      this.focalService.put(focalPoi).subscribe(res => {
        this.openSnackBar('Ponto Focal Atualizado', 'Ok');
        this.resetData();
      });
    } else {
      focalPoi = {
        name: this.ngForm.value.name,
        matricula: this.ngForm.value.matricula,
        phoneNumber:
          this.listPhone.length > 0 ? this.listPhone.join(',') : null,
        localityId: this.ngForm.value.site,
        pointOfInterestId: this.ngForm.value.pointOfInterest,
      };
      this.focalService.create(focalPoi).subscribe(res => {
        this.openSnackBar('Ponto Focal criado', 'Ok');
        this.resetData();
      });
    }
  }

  public submitDriverPoi() {
    let driverPoi: any;

    if (this.driver.id) {
      driverPoi = {
        id: this.driver.id,
        name: this.ngForm.value.name,
        matricula: this.ngForm.value.matricula,
        phoneNumber:
          this.listPhone.length > 0 ? this.listPhone.join(',') : null,
        localityId: this.ngForm.value.site,
        pointOfInterestId: this.ngForm.value.pointOfInterest,
      };
      this.driverService.put(driverPoi).subscribe(res => {
        this.openSnackBar('Motorista Atualizado', 'Ok');
        this.resetDriverData();
      });
    } else {
      driverPoi = {
        name: this.ngForm.value.name,
        matricula: this.ngForm.value.matricula,
        phoneNumber:
          this.listPhone.length > 0 ? this.listPhone.join(',') : null,
        localityId: this.ngForm.value.site,
        pointOfInterestId: this.ngForm.value.pointOfInterest,
      };
      this.driverService.create(driverPoi).subscribe(res => {
        this.openSnackBar('Motorista criado', 'Ok');
        this.resetDriverData();
      });
    }
  }

  public editFocalPoi(focal) {
    this.listPhone = [];
    this.listAllPoisCategorys();
    this.categoryPoi = '467f3403-2250-42c4-2ac6-08d7cf5128f8';
    this.listAllPointOfInterestBySite(focal.localityId, this.categoryPoi);
    this.selectedIndex = 2;
    this.showEditTab = true;
    this.focal = focal;

    if (this.focal.phoneNumber && this.focal.phoneNumber.includes(',')) {
      this.listPhone = this.focal.phoneNumber.split(',');
    } else if (this.focal.phoneNumber && this.focal.phoneNumber !== '0') {
      this.listPhone.push(this.focal.phoneNumber);
    }
  }

  public editDriverPoi(driver) {
    this.listPhone = [];
    this.listAllPoisCategorys();
    this.categoryPoi = '467f3403-2250-42c4-2ac6-08d7cf5128f8';
    this.listAllPointOfInterestBySite(driver.localityId, this.categoryPoi);
    this.selectedDriverIndex = 2;
    this.showEditTabDriver = true;
    this.driver = driver;

    if (this.driver.phoneNumber && this.driver.phoneNumber.includes(',')) {
      this.listPhone = this.driver.phoneNumber.split(',');
    } else if (this.driver.phoneNumber && this.driver.phoneNumber !== '0') {
      this.listPhone.push(this.driver.phoneNumber);
    }
  }

  public async cancelEditDriverPoi() {
    this.showEditTabDriver = false;
    this.resetDriverData();
  }

  public async cancelEditFocalPoi() {
    this.showEditTab = false;
    this.resetData();
  }

  public async resetDriverData() {
    this.driver = new Driver();
    this.lastAreaIdSelected = this.lastAreaSelected.id;
    this.listAllDriversBySite(this.site);
    this.ngForm.reset({
      site: this.lastAreaIdSelected,
      name: null,
      matricula: null,
      phone: null,
      category: null,
      pointOfInterest: null,
    });
    this.poiList = [];
    this.googleMap.clearPoiMarkers();
    this.listPhone = [];
    this.showEditTabDriver = false;
    this.selectedIndex = 0;
  }

  public async resetData() {
    this.focal = new FocalPoint();
    this.lastAreaIdSelected = this.lastAreaSelected.id;
    this.listAllFocalPointBySite(this.site);
    this.ngForm.reset({
      site: this.lastAreaIdSelected,
      name: null,
      matricula: null,
      phone: null,
      category: null,
      pointOfInterest: null,
    });
    this.poiList = [];
    this.googleMap.clearPoiMarkers();
    this.listPhone = [];
    this.showEditTab = false;
    // this.showEditTabDriver = false;
    this.selectedIndex = 0;
  }

  public async sendNotificationToDevice() {
    this.showLoading = true;
    this.selectSendListMessages();
    const alertSentList = this.focalList.filter(x => x.selected === true);

    for (const x of alertSentList) {
      await this.sendNotificationByMatricula(x);
    }
    this.openSnackBar('Alerta enviado', 'Ok');
    this.listAllFocalPointBySite(this.lastAreaSelected);
    this.focalList.forEach(x => (x.selected = false));
    this.selectedAll = false;
    this.showButtonAlert = this.selectedAll;
    this.showLoading = false;
  }

  // TODO: modificar o metodo de envio de notificacao para o motorista
  public async sendNotificationToDriverDevice() {
    this.showDriverLoading = true;
    this.selectSendDriverListMessages(); // mudar para lista de sms de motorista
    const alertSentList = this.driverList.filter(x => x.selected === true); // mudar para lista de sms de motorista

    for (const x of alertSentList) {
      await this.sendDriverNotificationByMatricula(x);
    }
    this.openSnackBar('Alerta enviado', 'Ok');
    this.listAllDriversBySite(this.lastAreaSelected);
    this.driverList.forEach(x => (x.selected = false));
    this.selectedDriverAll = false;
    this.showButtonDriverAlert = this.selectedDriverAll;
    this.showDriverLoading = false;
  }

  public async sendNotificationByMatricula(focalPoint, onlyOne = false) {
    if (onlyOne) {
      this.showLoading = true;
    }
    const notificationArray: any = [];
    const notiTag = [
      {
        tag: focalPoint.matricula,
      },
    ];
    notificationArray.push({
      title: 'Emergência',
      subTitle: `${this.notificationMessage}\n\r PE: ${focalPoint.pointOfInterest.name}`,
      tag: notiTag,
    });
    await this.pushNotification
      .sendNotification(notificationArray)
      .then(async resp => {
        if (onlyOne) {
          this.openSnackBar('Alerta enviado', 'Ok');
          this.listAllFocalPointBySite(this.lastAreaSelected);
          this.focalList.forEach(x => (x.selected = false));
          this.selectedAll = false;
          this.showButtonAlert = this.selectedAll;
          this.showLoading = false;
        }
      });
    this.selectSendMessage(focalPoint);
  }

  public async sendDriverNotificationByMatricula(driver, onlyOne = false) {
    if (onlyOne) {
      this.showDriverLoading = true;
    }
    const notificationArray: any = [];
    const notiTag = [
      {
        tag: driver.matricula,
      },
    ];
    notificationArray.push({
      title: 'Emergência',
      subTitle: `${this.notificationDriverMessage}\n\r PE: ${driver.pointOfInterest.name}`,
      tag: notiTag,
    });

    try {
      await this.pushNotification
        .sendNotification(notificationArray)
        .then(async resp => {
          if (onlyOne) {
            this.openSnackBar('Alerta enviado', 'Ok');
            this.listAllDriversBySite(this.lastAreaSelected);
            this.driverList.forEach(x => (x.selected = false));
            this.selectedDriverAll = false;
            this.showButtonDriverAlert = this.selectedDriverAll;
            this.showDriverLoading = false;
          }
        });
    } catch (error) {
      if (this.showDriverLoading) {
        this.openSnackBar('Alerta enviado', 'Ok');
        this.listAllDriversBySite(this.lastAreaSelected);
        this.driverList.forEach(x => (x.selected = false));
        this.selectedDriverAll = false;
        this.showButtonDriverAlert = this.selectedDriverAll;
        this.showDriverLoading = false;
      }
    }

    this.selectSendDriverMessage(driver);
  }

  public addPhoneFocalPoi() {
    if (this.ngForm.value.phone && this.ngForm.value.phone !== 0) {
      this.listPhone.push(this.ngForm.value.phone);
      this.ngForm.patchValue({
        phone: undefined,
      });
    }
  }

  public addPhoneDriverPoi() {
    if (this.ngForm.value.phone && this.ngForm.value.phone !== 0) {
      this.listPhone.push(this.ngForm.value.phone);
      this.ngForm.patchValue({
        phone: undefined,
      });
    }
  }

  public removePhoneFocalPoi(item) {
    const index = this.listPhone.indexOf(item);

    if (index !== -1) {
      this.listPhone.splice(index, 1);
    }
  }

  public removePhoneDriverPoi(item) {
    const index = this.listPhone.indexOf(item);

    if (index !== -1) {
      this.listPhone.splice(index, 1);
    }
  }

  private selectSendListMessages() {
    this.smsService.sendSmsList(
      this.sendSmsFocalList,
      this.notificationMessage,
    );
  }

  private selectSendDriverListMessages() {
    this.smsService.sendDriverSmsList(
      this.sendSmsDriverList,
      this.notificationDriverMessage,
    );
  }

  private selectSendMessage(focal) {
    const listSms = [];
    listSms.push(focal);
    this.smsService.sendSmsList(listSms, this.notificationMessage);
  }

  private selectSendDriverMessage(driver) {
    const driverlistSms = [];
    driverlistSms.push(driver);
    this.smsService.sendDriverSmsList(
      driverlistSms,
      this.notificationDriverMessage,
    );
  }

  private addSmsSendList(focal) {
    if (
      this.sendSmsFocalList.length === 0 ||
      !this.sendSmsFocalList.includes(focal)
    ) {
      this.sendSmsFocalList.push(focal);
    } else {
      const index: number = this.sendSmsFocalList.indexOf(focal);
    }
  }

  private addDriverSmsSendList(driver) {
    if (
      this.sendSmsDriverList.length === 0 ||
      !this.sendSmsDriverList.includes(driver)
    ) {
      this.sendSmsDriverList.push(driver);
    } else {
      const index: number = this.sendSmsDriverList.indexOf(driver);
    }
  }

  private addAllSmsList() {
    if (this.selectedAll) {
      this.sendSmsFocalList = this.focalList.slice(0);
    } else {
      this.sendSmsFocalList = [];
    }
  }

  private addDriverAllSmsList() {
    if (this.selectedDriverAll) {
      this.sendSmsDriverList = this.driverList.slice(0);
    } else {
      this.sendSmsDriverList = [];
    }
  }
}
