// import { Location } from '@angular/common';
// import { Component, DebugElement } from '@angular/core';
// import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
// import { FormsModule } from '@angular/forms';
// import { Router } from '@angular/router';
// import { RouterTestingModule } from '@angular/router/testing';
// import { TranslateModule } from '@ngx-translate/core';
// import { ModalModule } from 'ngx-bootstrap/modal';
// import { of } from 'rxjs';
// import { ActionButtonOutlineComponent } from 'src/app/components/action-button-outline/action-button-outline.component';
// import { ComponentsModule } from 'src/app/components/components.module';
// import { ItemDeviceComponent } from 'src/app/components/item-device/item-device.component';
// import { MainTitleComponent } from 'src/app/components/main-title/main-title.component';
// import { PaginationComponent } from 'src/app/components/pagination/pagination.component';
// import { AlertModalService } from 'src/app/services/alert-modal/alert-modal.service';
// import { ApplicationsService } from 'src/app/services/factories/applications.service';
// import { DevicesService } from 'src/app/services/factories/devices.service';
// import { ListHandlerService } from 'src/app/services/list-handler/list-handler.service';
// import { LoggingService } from 'src/app/services/logging/logging.service';
// import { mockApplicationsList } from '../../../core/utils/tests/mock-applications';
// import { deviceDummyList } from '../../../core/utils/tests/mock-devices';
// import { DevicesHomeComponent } from './devices-home.component';

// // => Used to test view routing
// @Component({
//   template: '',
// })
// class MockContainerComponent {}
// describe('Device Home (View)', () => {
//   const applicationList = mockApplicationsList;
//   const devicesList = deviceDummyList(10, false);

//   let fixture: ComponentFixture<DevicesHomeComponent>;
//   let component: DevicesHomeComponent;
//   let debug: DebugElement;
//   let router: Router;
//   let location: Location;

//   let applicationsService;
//   let applicationsServiceSpy: ApplicationsService;

//   let devicesService;
//   let devicesServiceSpy: DevicesService;

//   let listHandlerService;
//   let serviceListHandlerSpy: ListHandlerService;

//   let loggingService;
//   let loggingServiceSpy: LoggingService;

//   let serviceModalSpy: AlertModalService;
//   let alertModalService;

//   beforeEach(
//     waitForAsync(() => {
//       devicesServiceSpy = jasmine.createSpyObj(['getAll', 'getBySourceInfo']);
//       applicationsServiceSpy = jasmine.createSpyObj(['getAll']);
//       serviceListHandlerSpy = jasmine.createSpyObj(['listAllTypes']);
//       serviceModalSpy = jasmine.createSpyObj([
//         'showAlertSuccess',
//         'showAlertDanger',
//         'show',
//       ]);

//       loggingServiceSpy = jasmine.createSpyObj(['logException', 'logEvent']);

//       TestBed.configureTestingModule({
//         declarations: [
//           DevicesHomeComponent,
//           ItemDeviceComponent,
//           ActionButtonOutlineComponent,
//           PaginationComponent,
//           MainTitleComponent,
//         ],
//         imports: [
//           TranslateModule.forRoot(),
//           ModalModule.forRoot(),
//           FormsModule,
//           ComponentsModule,
//           RouterTestingModule.withRoutes([
//             { path: '', component: DevicesHomeComponent },
//             { path: 'devices/create', component: MockContainerComponent },
//             {
//               path: 'devices/edit/:applicationid/:deviceId',
//               component: MockContainerComponent,
//             },
//           ]),
//         ],
//         providers: [
//           { provide: DevicesService, useValue: devicesServiceSpy },
//           { provide: ApplicationsService, useValue: applicationsServiceSpy },
//           { provide: ListHandlerService, useValue: serviceListHandlerSpy },
//           { provide: AlertModalService, useValue: serviceModalSpy },
//           { provide: LoggingService, useValue: loggingServiceSpy },
//         ],
//       })
//         .compileComponents()
//         .then(() => {
//           fixture = TestBed.createComponent(DevicesHomeComponent);
//           component = fixture.componentInstance;
//           debug = fixture.debugElement;

//           applicationsService = TestBed.inject(ApplicationsService);
//           devicesService = TestBed.inject(DevicesService);
//           listHandlerService = TestBed.inject(ListHandlerService);
//           loggingService = TestBed.inject(LoggingService);

//           router = TestBed.inject(Router);
//           location = TestBed.inject(Location);
//           router.initialNavigation();
//         });
//     }),
//   );

//   describe('Rendering View and child components', () => {
//     beforeEach(() => {
//       // applicationsService.getAll.and.returnValue(of(applicationList));
//       // devicesService.getAll.and.returnValue(of({devices: devicesList, totalCount: 1000}));
//       // fixture.detectChanges();
//       // component.selectedApplication = mockApplicationsList[0].id;
//       // fixture.detectChanges();
//     });

//     // it('should create the component', () => {
//     //   expect(component).toBeTruthy();
//     // });

//     //       it('should render the create (EDITAR) button', () => {
//     //         const createButton = debug.query(By.css('.blue'));
//     //         expect(createButton).toBeTruthy(`Create button doesn't exist`);
//     //       });

//     //       it('should render a the create button with "EDITAR" title', () => {
//     //         const buttonTitle = fixture.nativeElement.querySelector('.blue').textContent;
//     //         expect(buttonTitle).toEqual(' DEVICE_LIST.DEVICE_BOX.EDIT_BUTTON ');
//     //       });

//     //       it('should render the pagination component', () => {
//     //         const paginationComponent = debug.query(By.directive(PaginationComponent));
//     //         expect(paginationComponent).toBeTruthy(`Pagination component doesn't exist`);
//     //       });

//     //       it('should render devices items', () => {
//     //         const devicesItem = debug.queryAll(By.directive(ItemDeviceComponent));
//     //         expect(devicesItem).toBeTruthy();
//     //         expect(devicesItem.length).toBeGreaterThan(0, `Couldn't find applications`);
//     //       });
//   });

//   describe('Component initialization', () => {
//     beforeEach(() => {
//       applicationsService.getAll.and.returnValue(of(applicationList));
//       devicesService.getAll.and.returnValue(of(devicesList));
//     });

//     // it('should fetch applications', () => {
//     //   spyOn(component, 'getApplications');
//     //   fixture.detectChanges();
//     //   expect(component.getApplications).toHaveBeenCalled();
//     // });

//     // it('should subscribe to the fetch applications function', () => {
//     //   const subscribeSpy = spyOn(applicationsService.getAll(), 'subscribe');
//     //   fixture.detectChanges();
//     //   expect(subscribeSpy).toHaveBeenCalled();
//     // });

//     // it('should call getApplications and getDevices when redirectFromApplication is called', () => {
//     //   const getApplications = spyOn(component, 'getApplications');
//     //   const getDevices = spyOn(component, 'getDevices');

//     //   component.ngOnInit();
//     //   component.redirectedFromApplications('1');

//     //   expect(getApplications).toHaveBeenCalled();
//     //   expect(getDevices).toHaveBeenCalled();
//     // });
//   });

//   describe('Component interaction', () => {
//     beforeEach(() => {
//       applicationsService.getAll.and.returnValue(of(applicationList));
//       devicesService.getAll.and.returnValue(
//         of({ devices: devicesList, totalCount: 1000 }),
//       );

//       fixture.detectChanges();
//       component.selectedApplicationId = applicationList[0].id;
//       // component.getDevices();
//     });

//     //   it('should fetch devices and render the correct info', () => {
//     //     expect(component.devices.length).toEqual(10);
//     //     expect(component.devices[0]).toEqual(devicesList[0]);
//     //   });

//     //       it('should fetch a single device with the correct info', () => {
//     //         devicesService.getBySourceInfo.and.returnValue(of(devicesList[0]));
//     //         component.getBySourceInfo('1', 'deviceId 1', '12345678901');
//     //         expect(component.devices[0]).toEqual(devicesList[0]);
//     //       });

//     //       it('should fetch a filtered list of devices', () => {
//     //         const filteredList = deviceDummyList(10, true);
//     //         devicesService.getAll.and.returnValue(of({devices: filteredList}));

//     //         component.getByAssociation('true');

//     //         expect(component.devices).toEqual(filteredList);
//     //       });

//     //       it('should navigate to the next page', () => {
//     //         component.nextPage();
//     //         expect(component.skip).toEqual(10);
//     //       });

//     //       it('should navigate to the previous page', () => {
//     //         component.nextPage();
//     //         expect(component.skip).toEqual(10);
//     //         component.previousPage();
//     //         expect(component.skip).toEqual(0);
//     //       });

//     //       it('should add a device to isAllAssociated list', () => {
//     //         component.onCheck(true, devicesList[1]);
//     //         expect(component.isAllAssociated.length).toBeGreaterThan(0);
//     //       });

//     //       it('should remove a device from the isAllAssociated list', () => {
//     //         component.onCheck(false, devicesList[0]);
//     //         fixture.detectChanges();
//     //         expect(component.isAllAssociated.length).toEqual(0);
//     //       });

//     //       it('should add a device to the isAllDesassociated list', () => {
//     //         const device = devicesList[2];
//     //         device.associatedThings = [];

//     //         component.onCheck(true, device);

//     //         expect(component.isAllDesassociated.length).toEqual(1);
//     //       });

//     //       it('should remove device to the isAllDesassociated list', () => {
//     //         const device = devicesList[2];
//     //         device.associatedThings = [];

//     //         component.onCheck(false, device);
//     //         expect(component.isAllAssociated.length).toEqual(0);
//     //       });

//     //       it('should reset isAllAssociated list', () => {
//     //         component.isAllAssociated = [ devicesList[0], devicesList[1] ];
//     //         component.resetAssociationList();
//     //         expect(component.isAllAssociated.length).toEqual(0);
//     //       });

//     //       it('should reset isAllDesassociated list', () => {
//     //         devicesList[0].associatedThings = []
//     //         component.isAllDesassociated = [ devicesList[0] ];

//     //         component.resetAssociationList();

//     //         expect(component.isAllDesassociated.length).toEqual(0);
//     //       });
//   });

//   //     describe('Component template interaction (integration)', () => {

//   //       beforeEach(() => {
//   //         applicationsService.getAll.and.returnValue(of(applicationList));
//   //         devicesService.getAll.and.returnValue(of({devices: devicesList}));

//   //         fixture.detectChanges();
//   //         component.selectedApplication = mockApplicationsList[0].id;
//   //         component.getDevices();
//   //         component.selectedAssociation = 'true';
//   //         component.getByAssociation('true');
//   //         fixture.detectChanges();
//   //       });

//   //       it('should call onCheck', () => {
//   //         const onCheck = spyOn(component, 'onCheck');

//   //         const checkboxes = debug.queryAll(By.css('#checkbox'));
//   //         checkboxes[0].nativeElement.checked = true;
//   //         checkboxes[0].nativeElement.dispatchEvent(new Event('click'));
//   //         fixture.detectChanges();

//   //         expect(onCheck).toHaveBeenCalled();
//   //       });

//   //       it('should call onCheckAll', () => {
//   //         const onCheckAll = spyOn(component, 'onCheckAll');
//   //         const filteredList = deviceDummyList(10, true);
//   //         devicesService.getAll.and.returnValue(of(filteredList));

//   //         const checkbox = debug.query(By.css('#main-checkbox'));
//   //         checkbox.nativeElement.checked = true;
//   //         checkbox.nativeElement.dispatchEvent(new Event('click'));

//   //         expect(onCheckAll).toHaveBeenCalled();
//   //       });

//   //     });

//   //     describe('Routing tests', () => {

//   //       beforeEach(() => {
//   //           applicationsService.getAll.and.returnValue(of(applicationList));
//   //           devicesService.getAll.and.returnValue(of({devices: devicesList}));
//   //           fixture.detectChanges();

//   //           component.selectedApplication = mockApplicationsList[0].id;
//   //           component.getDevices();
//   //           fixture.detectChanges();
//   //         });

//   //         afterEach(fakeAsync(() => flushMicrotasks()))

//   //         it('should be in the device home route', () => {
//   //           expect(location.path()).toBe('/');
//   //         });

//   //         // it('should call the navigate function when the create (Adicionar) button is clicked', fakeAsync(() => {
//   //         //   const createButton = debug.query(By.css('#create-button')) // ?
//   //         //   // createButton.triggerEventHandler('click', {});
//   //         //   fixture.detectChanges()
//   //         //   flush();

//   //         //   expect(location.path()).toBe('devices/create');
//   //         //   expect(MockContainerComponent).toBeTruthy();
//   //         // }));

//   //         it('should call on select when the edit button is clicked with the correct parameter', () => {
//   //           const onSelect = spyOn(component, 'onSelect');
//   //           const editButton = debug.queryAll(By.css('app-button-outline'));
//   //           const buttons = editButton.map(element => element.query(By.css('button')));

//   //           buttons.forEach((button, index) => {
//   //             index += 1;
//   //             button.triggerEventHandler('click', `${index}`);
//   //             expect(onSelect).toHaveBeenCalled();
//   //           });
//   //         });

//   //     });
// });
