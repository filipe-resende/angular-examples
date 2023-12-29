// import { ComponentFixture, TestBed, fakeAsync, tick, async, flush } from '@angular/core/testing';
// import { RouterTestingModule } from '@angular/router/testing';
// import { Component, DebugElement } from '@angular/core';
// import { FormsModule } from '@angular/forms';
// import { ModalModule } from 'ngx-bootstrap/modal';
// import { Router } from '@angular/router';
// import { Location } from '@angular/common';
// import { By } from '@angular/platform-browser';

// import { DeviceCreateComponent } from './device-create.component';
// import { ActionButtonComponent } from 'src/app/components/action-button/action-button.component';
// import { ArrowButtonComponent } from 'src/app/components/arrow-button/arrow-button.component';
// import { AlertModalComponent } from 'src/app/components/alert-modal/alert-modal.component';
// import { ApplicationsService } from 'src/app/services/factories/applications.service';
// import { MainTitleComponent } from 'src/app/components/main-title/main-title.component';
// import { AlertModalService } from 'src/app/services/alert-modal/alert-modal.service';
// import { DevicesService } from 'src/app/services/factories/devices.service';
// import { DeviceToBeCreated } from 'src/app/model/devices-interfaces';
// import { ActionButtonOutlineComponent } from 'src/app/components/action-button-outline/action-button-outline.component';

// import { of, throwError } from 'rxjs';
// import { mockApplicationsList } from '../../../shared/utils/tests/mock-applications';
// import { createDevice} from '../../../shared/utils/tests/mock-devices';
// import { TranslateModule } from '@ngx-translate/core';
// import { LoggingService } from 'src/app/services/logging/logging.service';
// import { UserService } from 'src/app/services/user-services/user.service';

// describe('Create Application (View)', () => {
//   const mockDevice: DeviceToBeCreated = createDevice(11);
//   const mockApplications = mockApplicationsList;

//   let component: DeviceCreateComponent;
//   let fixture: ComponentFixture<DeviceCreateComponent>;
//   let debug: DebugElement;

//   let applicationService: any;
//   let mockLocationService: any;

//   let serviceSpyApplications: any;
//   let serviceModalSpy: any;

//   let deviceService: any;
//   let serviceSpyDevice: any;

//   let alertModalService: any;

//   let router: any;
//   let location: any;

//   let userService;
//   let userServiceStub;

//   let loggingService
//   let loggingServiceSpy: LoggingService;

//   beforeEach(async(() => {
//     serviceSpyDevice = jasmine.createSpyObj(['create']);
//     serviceSpyApplications = jasmine.createSpyObj(['getAll']);
//     serviceModalSpy = jasmine.createSpyObj(['showAlertSuccess', 'showAlertDanger']);
//     mockLocationService = {back: () => {}, };

//     loggingServiceSpy = jasmine.createSpyObj(['logException', 'logEvent']);
//     userServiceStub = { user: { name: 'user' }};

//     TestBed.configureTestingModule({
//       declarations: [
//         DeviceCreateComponent,
//         ActionButtonComponent,
//         MainTitleComponent,
//         ArrowButtonComponent,
//         AlertModalComponent,
//         ActionButtonOutlineComponent
//       ],
//       providers: [
//         { provide: DevicesService, useValue: serviceSpyDevice },
//         { provide: ApplicationsService, useValue: serviceSpyApplications },
//         { provide: AlertModalService, useValue: serviceModalSpy },
//         { provide: UserService, useValue: userServiceStub },
//         { provide: LoggingService, useValue: loggingServiceSpy },
//       ],
//       imports: [
//         TranslateModule.forRoot(),
//         FormsModule,
//         ModalModule.forRoot(),
//         RouterTestingModule.withRoutes([
//           { path: 'app/devices/create', component: DeviceCreateComponent },
//           { path: 'app/devices', component: MockContainerComponent },
//         ]),
//       ]
//     })
//     .compileComponents()
//     .then(() => {
//       fixture = TestBed.createComponent(DeviceCreateComponent);
//       component = fixture.componentInstance;
//       debug = fixture.debugElement;
//       deviceService = TestBed.inject(DevicesService);
//       applicationService = TestBed.inject(ApplicationsService);
//       alertModalService = TestBed.inject(AlertModalService);

//       userService = TestBed.inject(UserService);
//       loggingService = TestBed.inject(LoggingService);

//       router = TestBed.inject(Router);
//       location = TestBed.inject(Location);
//       router.initialNavigation();
//     });
//   }));

//   describe('Rendering View and child components', () => {

//     beforeEach(() => {
//       applicationService.getAll.and.returnValue(of(mockApplications));
//       fixture.detectChanges();

//     });

//     it('should create component', () => {
//       expect(component).toBeTruthy();
//     });

//     it('should render a title', () => {
//       fixture.detectChanges();
//       const title = debug.query(By.directive(MainTitleComponent));
//       expect(title).toBeTruthy();
//     });

//     it('should render a back button', () => {
//       fixture.detectChanges();
//       const backButton = debug.query(By.directive(ArrowButtonComponent));
//       expect(backButton).toBeTruthy();
//     });

//     it('should render the create (Adicionar) button', () => {
//       const createButton = debug.query(By.css('.blue'));
//       expect(createButton).toBeTruthy(`Create button doesn't exist`);
//     });

//     it('should render the save (Salvar) button', () => {
//       const button = debug.query(By.css('.blue'));
//       expect(button).toBeTruthy();
//     });

//     it('should render 4 text inputs', () => {
//       fixture.detectChanges();
//       const textInputs = debug.queryAll(By.css('input'));
//       expect(textInputs).toBeTruthy(`Text Inputs doesn't exit`);
//       expect(textInputs.length).toEqual(4, `Text Inputs doesn't exit`);
//     });

//     it('should render a form', () => {
//       const form = fixture.debugElement.query(By.css('form'));
//       expect(form).toBeTruthy();
//     });
//   });

//   describe('Form validation', () => {

//     beforeEach(() => {
//       applicationService.getAll.and.returnValue(of(mockApplications));
//       fixture.detectChanges();
//     });

//     it('should start empty', () => {
//       const textInputs = debug.queryAll(By.css('input'));
//       textInputs.forEach(element => {
//         expect(element.nativeElement.value).toBeFalsy();
//       });
//     });

//     it('should start invalid', () => {
//       const textInputs = debug.queryAll(By.css('input'));
//       textInputs.forEach(element => {
//         expect(element.nativeElement.validity.valid).toBe(false);
//       });
//     });

//     it('should be valid after typing', () => {
//       const textInputs = debug.queryAll(By.css('input'));

//       textInputs.map(input => {
//         input.nativeNode.value = 'something else';
//         input.nativeElement.dispatchEvent(new Event('input'));

//         expect(input.nativeElement.validity.valid).toBe(true);
//       })
//     });

//   })

//   describe('Create a new Device', () => {

//     beforeEach(() => {
//       applicationService.getAll.and.returnValue(of(mockApplications));
//       fixture.detectChanges();
//     });

//     it('should call subscribe', fakeAsync(() => {
//       const validation = spyOn(component, 'formCreateValidation');
//       const submitSpy = spyOn(component, 'addDevice').and.callThrough();

//       const form = debug.query(By.css('form'));
//       form.triggerEventHandler('submit', {});

//       expect(submitSpy).toHaveBeenCalled();
//       expect(validation).toHaveBeenCalled();
//     }));

//     it('should call the validation function', () => {
//       const validation = spyOn(component, 'formCreateValidation');

//       component.addDevice();
//       fixture.detectChanges();

//       expect(validation).toHaveBeenCalled();
//     });

//     it('should call formCreateValidation and return true', () => {
//       expect(component.formCreateValidation(mockDevice)).toBe(true);
//     });

//     it('should call deviceServiceCreate', () => {
//       deviceService.create.and.returnValue(of(true));
//       component.applicationId = '1';
//       component.name =  '00112233';
//       component.description = 'description';
//       component.sourceInfos.type = 'deviceId';
//       component.sourceInfos.value = '00112233';

//       component.addDevice();

//       expect(deviceService.create).toHaveBeenCalled();

//     });

//     it('should display success modal', () => {
//       deviceService.create.and.returnValue(of(true));
//       component.applicationId = '1';
//       component.name =  '00112233';
//       component.description = 'description';
//       component.sourceInfos.type = 'deviceId';
//       component.sourceInfos.value = '00112233';

//       component.addDevice();

//       expect(alertModalService.showAlertSuccess).toHaveBeenCalled();
//     });

//     it('should display success modal', () => {
//       const resetForm = spyOn(component, 'resetForm');
//       deviceService.create.and.returnValue(of(true));
//       component.applicationId = '1';
//       component.name =  '00112233';
//       component.description = 'description';
//       component.sourceInfos.type = 'deviceId';
//       component.sourceInfos.value = '00112233';

//       component.addDevice();

//       expect(resetForm).toHaveBeenCalled();
//     });

//     it('should call deviceServiceCreate when saveAndBack is called', () => {
//       deviceService.create.and.returnValue(of(true));
//       component.applicationId = '1';
//       component.name =  '00112233';
//       component.description = 'description';
//       component.sourceInfos.type = 'deviceId';
//       component.sourceInfos.value = '00112233';

//       component.saveAndBack();

//       expect(deviceService.create).toHaveBeenCalled();

//     });

//   });

//   describe('Routing tests', () => {
//     beforeEach(() => {
//       applicationService.getAll.and.returnValue(of(mockApplications));
//       fixture.detectChanges();
//     });

//     it('should be in the device create route', fakeAsync(() => {
//       router.navigate(['/app/devices/create']);
//       flush();
//       expect(location.path()).toBe('/app/devices/create');
//     }));

//     it('should go back to Devices Home View', fakeAsync(() => {
//       router.navigate(['/app/devices/create']);
//       tick();
//       const arrowButton = debug.query(By.directive(ArrowButtonComponent));
//       arrowButton.triggerEventHandler('click', {});
//       fixture.detectChanges();
//       tick();
//       expect(location.path()).toBe('/');
//     }));

//   })

//   describe('Handling form exceptions', () => {

//     beforeEach(() => {
//       applicationService.getAll.and.returnValue(of(mockApplications));
//       fixture.detectChanges();
//     });

//     it('should display a error modal', () => {
//       component.addDevice();
//       fixture.detectChanges();
//       expect(alertModalService.showAlertDanger).toHaveBeenCalled();
//     });

//     it('should display a modal if a name wasn\'t provided', () => {
//       component.applicationId = '1';

//       component.addDevice();
//       fixture.detectChanges();

//       expect(alertModalService.showAlertDanger).toHaveBeenCalled();
//     });

//     it('should display a modal if a description wasn\'t provided', () => {
//       component.applicationId = '1';
//       component.name = 'something else';
//       component.addDevice();
//       fixture.detectChanges();

//       expect(alertModalService.showAlertDanger).toHaveBeenCalled();
//     });

//     it('should display a modal if a sourceInfo - type wasn\'t provided', () => {
//       component.applicationId = '1';
//       component.name = 'something else';
//       component.description = 'something else';

//       component.addDevice();
//       fixture.detectChanges();

//       expect(alertModalService.showAlertDanger).toHaveBeenCalled();
//     });

//     it('should display a modal if a sourceInfo - value wasn\'t provided', () => {
//       component.applicationId = '1';
//       component.name = 'something else';
//       component.description = 'something else';
//       component.sourceInfos.type = 'something else';

//       component.addDevice();
//       fixture.detectChanges();

//       expect(alertModalService.showAlertDanger).toHaveBeenCalled();
//     });

//   });

//   describe('Handling API return exceptions', () => {

//     beforeEach(() => {
//       applicationService.getAll.and.returnValue(of(mockApplications));
//       fixture.detectChanges();

//       component.applicationId = '1';
//       component.name = 'something else';
//       component.description = 'something else';
//       component.sourceInfos.type = 'something else';
//       component.sourceInfos.value = 'something else';
//     });

//     it('should display a modal if an unexpected error is returned from the API', () => {
//       deviceService.create.and.returnValue(throwError(true));
//       component.addDevice();
//       fixture.detectChanges();
//       expect(alertModalService.showAlertDanger).toHaveBeenCalled();
//     });

//     it('should display a modal if an error status 400 is returned from the API', () => {
//       deviceService.create.and.returnValue(throwError({status: 400}));
//       component.addDevice();
//       fixture.detectChanges();
//       expect(alertModalService.showAlertDanger).toHaveBeenCalled();
//     });

//     it('should display a modal if an error status 500 is returned from the API', () => {
//       deviceService.create.and.returnValue(throwError({status: 500}));
//       component.addDevice();
//       fixture.detectChanges();
//       expect(alertModalService.showAlertDanger).toHaveBeenCalled();
//     });

//   });
// })

// @Component({
//   template: ''
// })
// class MockContainerComponent {}
