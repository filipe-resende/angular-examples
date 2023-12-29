// import { TestBed, ComponentFixture, waitForAsync } from '@angular/core/testing';
// import { DebugElement } from '@angular/core';
// import { LoggingService } from 'src/app/services/logging/logging.service';
// import { ListHandlerService } from 'src/app/services/list-handler/list-handler.service';
// import { AssociationPeriodsService } from 'src/app/services/factories/association-periods.service';
// import { ApplicationsService } from 'src/app/services/factories/applications.service';
// import { AlertModalService } from 'src/app/services/alert-modal/alert-modal.service';
// import { DatePipe } from '@angular/common';
// import { ModalModule } from 'ngx-bootstrap/modal';
// import { TranslateModule } from '@ngx-translate/core';
// import { of, throwError } from 'rxjs';
// import { DateFormatPipe } from 'src/app/shared/pipes/date-format/date-format.pipe';
// import { ThingHistoryComponent } from './thing-history.component';

// const history = {
//   associatedDevices: [
//     {
//       associatioDate: '',
//       device: {
//         name: '',
//         description: '',
//         id: '',
//         applicaionId: '',
//         sourceInfos: [{ type: '', value: '' }],
//       },
//       disassociationDate: '',
//     },
//   ],
// };

// describe('ActionButtonComponent', () => {
//   let component: ThingHistoryComponent;
//   let fixture: ComponentFixture<ThingHistoryComponent>;

//   let debug: DebugElement;

//   let logService: LoggingService;
//   let loggingServiceSpy: LoggingService;

//   let listHandler: ListHandlerService;
//   let listHandlerSpy: ListHandlerService;

//   let associationPeriodServiceSpy: any;
//   let associationPeriodService: any;

//   let applicationServiceSpy: ApplicationsService;
//   let applicationService: ApplicationsService;

//   let alertModalService: any;
//   let serviceModalSpy: any;

//   beforeEach(
//     waitForAsync(() => {
//       listHandlerSpy = jasmine.createSpyObj(['distinct']);
//       associationPeriodServiceSpy = jasmine.createSpyObj([
//         'getThingsAssociations',
//       ]);
//       applicationServiceSpy = jasmine.createSpyObj(['getById']);

//       serviceModalSpy = jasmine.createSpyObj([
//         'showAlertSuccess',
//         'showAlertDanger',
//       ]);
//       loggingServiceSpy = jasmine.createSpyObj(['logException', 'logEvent']);

//       TestBed.configureTestingModule({
//         declarations: [ThingHistoryComponent, DateFormatPipe],
//         imports: [ModalModule.forRoot(), TranslateModule.forRoot()],
//         providers: [
//           { provide: LoggingService, useVlaue: loggingServiceSpy },
//           { provide: ListHandlerService, useValue: listHandlerSpy },
//           {
//             provide: AssociationPeriodsService,
//             useValue: associationPeriodServiceSpy,
//           },
//           { provide: ApplicationsService, useValue: applicationServiceSpy },
//           { provide: AlertModalService, useValue: serviceModalSpy },
//           DatePipe,
//         ],
//       }).compileComponents();
//     }),
//   );

//   beforeEach(() => {
//     fixture = TestBed.createComponent(ThingHistoryComponent);
//     component = fixture.componentInstance;
//   });

//   describe('Name of the group', () => {
//     beforeEach(() => {
//       associationPeriodServiceSpy.getThingsAssociations.and.returnValues(
//         of(history),
//       );
//       fixture.detectChanges();
//     });

//     // it('should render the component', () => {
//     //   expect(component).toBeTruthy();
//     // });

//     // it('should fetch history data when refreshHistory is called', () => {
//     //   const getHistoryData = spyOn(component, 'getHistoryData');
//     //   component.refreshHistory()
//     //   expect(getHistoryData).toHaveBeenCalled();
//     // });

//     // it('should refresh history data when the lifecycle hook "onChanges" gets triggered', () => {
//     //   const refreshHistory = spyOn(component, 'refreshHistory');
//     //   component.ngOnChanges({})
//     //   expect(refreshHistory).toHaveBeenCalled();
//     // });
//   });
// });
