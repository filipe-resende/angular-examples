// import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
// import { DisassociateModalComponent } from './disassociate-modal.component';
// import { By } from '@angular/platform-browser';
// import { BsModalRef, ModalModule } from 'ngx-bootstrap/modal';
// import { AssociationPeriodsService } from 'src/app/services/factories/association-periods.service';
// import { AlertModalService } from 'src/app/services/alert-modal/alert-modal.service';
// import { DebugElement } from '@angular/core';
// import { ActionButtonOutlineComponent } from 'src/app/components/action-button-outline/action-button-outline.component';
// import { ActionButtonComponent } from '../action-button/action-button.component';
// import { deviceDummy, mockDevicesList } from '../../utils/mock-devices';
// import { of } from 'rxjs';
// import { TranslateModule } from '@ngx-translate/core';
// import { LoggingService } from 'src/app/services/logging/logging.service';
// import { UserService } from 'src/app/services/user-services/user.service';

// describe('DisassociateModalComponent', () => {
//   let component: DisassociateModalComponent;
//   let debug: DebugElement;
//   let fixture: ComponentFixture<DisassociateModalComponent>;
//   let associationPeriodSpy: any;
//   let bsModalRef: any;
//   let bsModalStub: any;
//   let alertServiceSpy: any;
//   let alertService: any;

//   let associationPeriodService: any;

//   let userService: any;
//   let userServiceStub: any;
//   let loggingServiceSpy: any;
//   let loggingService: LoggingService

//   beforeEach(async(() => {
//     associationPeriodSpy = jasmine.createSpyObj(['disassociate']);
//     bsModalStub = { hide: () => {} };
//     alertServiceSpy = jasmine.createSpyObj(['showAlertSuccess', 'showAlertDanger']);

//     userServiceStub = { user: { name: 'user' }};
//     loggingServiceSpy = jasmine.createSpyObj(['logException', 'logEvent']);

//     TestBed.configureTestingModule({
//       declarations: [ DisassociateModalComponent, ActionButtonOutlineComponent, ActionButtonComponent ],
//       providers: [BsModalRef,
//         { provide: BsModalRef, useValue: bsModalStub },
//         { provide: AssociationPeriodsService, useValue: associationPeriodSpy },
//         { provide: AlertModalService, useValue: alertServiceSpy },
//         { provide: UserService, useValue: userServiceStub },
//         { provide: LoggingService, useValue: loggingServiceSpy }
//       ],
//       imports: [
//           TranslateModule.forRoot(),
//           ModalModule.forRoot()
//       ],
//     })
//     .compileComponents()
//     .then(() => {
//         fixture = TestBed.createComponent(DisassociateModalComponent);
//         component = fixture.componentInstance;
//         debug = fixture.debugElement;
//         associationPeriodService = TestBed.inject(AssociationPeriodsService);
//         bsModalRef = TestBed.inject(BsModalRef);
//         alertService = TestBed.inject(AlertModalService);
//     });
//   }));

//   describe('Rendering View and child components', () => {

//     beforeEach(() => {
//       component.externalData = [deviceDummy];
//       fixture.detectChanges();
//     })

//     it('should create the component', () => {
//         expect(component).toBeTruthy();
//     });

//     it('should render the cancel (cancelar) button', () => {
//         const cancelButton = debug.query(By.directive(ActionButtonOutlineComponent));
//         expect(cancelButton).toBeTruthy();
//     });

//     it('should render the disassociate (desassociar) button', () => {
//       const submitButton = debug.query(By.directive(ActionButtonComponent));
//       expect(submitButton).toBeTruthy();
//     });
//   });

//   describe('Component interaction', () => {

//     beforeEach(() => {
//       fixture.detectChanges();
//     })

//     it('should call BSModalRef.hide', () => {
//         const hide = spyOn(bsModalRef, 'hide')

//         component.onClose();
//         fixture.detectChanges();

//         expect(hide).toHaveBeenCalled();
//     });

//     it('should call associationPeriodService.disassociate', () => {
//       associationPeriodService.disassociate.and.returnValue(of(true));
//       component.externalData = [deviceDummy];

//       component.multipleDesassociate();

//       expect(associationPeriodService.disassociate).toHaveBeenCalled();
//     });

//     it('should call associationPeriodService.disassociate', () => {
//       associationPeriodService.disassociate.and.returnValue(of(true));
//       component.singleData = deviceDummy;

//       component.singleDisassociation();

//       expect(associationPeriodService.disassociate).toHaveBeenCalled();
//       expect(alertService.showAlertSuccess).toHaveBeenCalled();
//     });

//   })

// });
