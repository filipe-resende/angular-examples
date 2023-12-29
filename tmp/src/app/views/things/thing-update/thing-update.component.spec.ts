// import { async, ComponentFixture, TestBed, fakeAsync, flush, flushMicrotasks, tick } from '@angular/core/testing';
// import { ThingUpdateComponent } from './thing-update.component';
// import { DebugElement, Component } from '@angular/core';
// import { MainTitleComponent } from 'src/app/components/main-title/main-title.component';
// import { ArrowButtonComponent } from 'src/app/components/arrow-button/arrow-button.component';
// import { ActionButtonComponent } from 'src/app/components/action-button/action-button.component';
// import { Router, ActivatedRoute } from '@angular/router';
// import { ThingsService } from 'src/app/services/factories/things.service';
// import { AlertModalService } from 'src/app/services/alert-modal/alert-modal.service';
// import { FormsModule } from '@angular/forms';
// import { ModalModule } from 'ngx-bootstrap/modal';
// import { RouterTestingModule } from '@angular/router/testing';
// import { Location } from '@angular/common';
// import { By } from '@angular/platform-browser';
// import { of, throwError } from 'rxjs';
// import { listThings } from '../../../shared/utils/tests/mock-things';
// import { LastPositionService } from 'src/app/services/last-position/last-position.service';
// import { TranslateModule } from '@ngx-translate/core';
// import { LoggingService } from 'src/app/services/logging/logging.service';
// import { UserService } from 'src/app/services/user-services/user.service';

// describe('ThingUpdateComponent', () => {
//   let thingObj = listThings[0];
//   let component: ThingUpdateComponent;
//   let fixture: ComponentFixture<ThingUpdateComponent>;
//   let debug: DebugElement;

//   let serviceSpy: any;
//   let thingsService: any;

//   let serviceModalSpy: any;
//   let alertModalService: any;

//   let activatedRouteStub: any;
//   let activatedRoute: any;

//   let router: Router;
//   let location: Location;

//   let lastPositionService: any;
//   let lastPositionSpy: any;

//   let userService;
//   let userServiceStub;

//   let loggingService
//   let loggingServiceSpy: LoggingService;

//   beforeEach(async(() => {
//     serviceSpy = jasmine.createSpyObj(['getById', 'update']);
//     activatedRouteStub = {params: of([{id: 1}])}
//     lastPositionSpy = jasmine.createSpyObj(['findLocationByLastEvent']);

//     serviceModalSpy = jasmine.createSpyObj(['showAlertSuccess', 'showAlertDanger']);
//     loggingServiceSpy = jasmine.createSpyObj(['logException', 'logEvent']);
//     userServiceStub = { user: { name: 'user' }};

//     TestBed.configureTestingModule({
//       declarations: [ ThingUpdateComponent, MainTitleComponent, ArrowButtonComponent, ActionButtonComponent ],
//       providers: [
//         { provide: ThingsService, useValue: serviceSpy },
//         { provide: ActivatedRoute, useValue: activatedRouteStub },
//         { provide: AlertModalService, useValue: serviceModalSpy },
//         { provide: LastPositionService, useValue: lastPositionSpy },
//         { provide: UserService, useValue: userServiceStub },
//         { provide: LoggingService, useValue: loggingServiceSpy },
//       ],
//       imports: [
//         TranslateModule.forRoot(),
//         FormsModule,
//         ModalModule.forRoot(),
//         RouterTestingModule.withRoutes([
//           { path: 'things/update/:id', component: ThingUpdateComponent },
//           { path: 'things', component: MockContainerComponent },
//         ])
//       ]
//     })
//     .compileComponents()
//       .then(() => {
//         fixture = TestBed.createComponent(ThingUpdateComponent);
//         component = fixture.componentInstance;
//         debug = fixture.debugElement;

//         thingsService = TestBed.inject(ThingsService);
//         activatedRoute = TestBed.inject(ActivatedRoute);
//         alertModalService = TestBed.inject(AlertModalService);
//         lastPositionService = TestBed.inject(LastPositionService);
//         router = TestBed.inject(Router);
//         location = TestBed.inject(Location);
//         router.initialNavigation();
//       })
//   }));

//   describe('Rendering View and child components', () => {

//     const renderErrorMsg = `Something went wrong, this(these) component(s) might not exist (yet) in this context. Check if you properly loaded everything before run the expectation`;

//     beforeEach(() => {
//       thingsService.getById.and.returnValue(of(thingObj));
//       lastPositionService.findLocationByLastEvent.and.returnValue(of(true));
//       component.loadData()
//       component.setData(thingObj);
//     //   component.getLastPosition(thingObj)
//       fixture.detectChanges();
//     });

//     it ('should create a button', () => {
//       expect(component).toBeTruthy();
//     })

//     it('should render a back button', () => {
//       const backButton = debug.query(By.css('app-arrow-button'));
//       expect(backButton).toBeTruthy(renderErrorMsg);
//     });

//     it('should render 7 text input fields', () => {
//       const textInputs = debug.queryAll(By.css('input'));
//       expect(textInputs.length).toBe(6, renderErrorMsg);
//       textInputs.forEach(el => expect(el).toBeTruthy(renderErrorMsg));
//     });

//     it ('should render a application dropdwon menu', () => {
//       const dropdown = debug.query(By.css('select'));
//       expect(dropdown).toBeTruthy(renderErrorMsg);
//     });

//   });

//   describe('Component Initialization', () => {

//     beforeEach(() => {
//       thingsService.getById.and.returnValue(of(thingObj));
//       lastPositionService.findLocationByLastEvent.and.returnValue(of(thingObj));
//     });

//     it('should call loadData', () => {
//       const loadData = spyOn(component, 'loadData');
//       fixture.detectChanges();
//       expect(loadData).toHaveBeenCalled();
//     });

//     it('should call activatedRoute.params.subscribe to receive data', () => {
//       const subscribe = spyOn(activatedRoute.params, 'subscribe');
//       fixture.detectChanges();
//       expect(subscribe).toHaveBeenCalled();
//     });

//     it('should fetch the thing by it\'s id', () => {
//       component.loadData();
//       expect(thingsService.getById).toHaveBeenCalled();
//     });

//     it ('should call setData', () => {
//       const setData = spyOn(component, 'setData');
//       fixture.detectChanges();
//       expect(setData).toHaveBeenCalled();
//     });

//     it('should render a message if the thing isn\'t associated with a device', () => {
//       lastPositionService.findLocationByLastEvent.and.returnValue(of(null));

//       fixture.detectChanges()

//       expect(component.coordinates).toBeFalsy();
//       expect(component.eventDateTime).toBeFalsy();
//       expect(component.locationInfo).toBeFalsy();
//     });

//   });

//   describe('Component Initialization (Rendering received data)', () => {

//     beforeEach(() => {
//       thingsService.getById.and.returnValue(of(thingObj));
//       lastPositionService.findLocationByLastEvent.and.returnValue(of(true));
//       component.loadData()
//       fixture.detectChanges();
//     });

//     it('should define thingToBeUpdated', () => {
//       expect(component.thingToBeUpdated).toEqual(thingObj);
//     });

//     it('should receive the correct type', () => {
//       component.setData(thingObj);
//       expect(component.selectedType).toEqual(thingObj.type);
//     });

//     it('should receive the correct name', () => {
//       component.setData(thingObj);
//       expect(component.name).toEqual(thingObj.name);
//     });

//     it('should receive the correct description', () => {
//       component.setData(thingObj);
//       expect(component.description).toEqual(thingObj.description);
//     });

//     it('should receive the correct sourceInfo', () => {
//       component.setData(thingObj);
//       // expect(component.sourceTypeCPF).toEqual(thingObj.sourceInfos[0].type);
//       // expect(component.sourceTypeMDM).toEqual(thingObj.sourceInfos[1].type);
//       // expect(component.sourceTypeIAM).toEqual(thingObj.sourceInfos[2].type);
//       // expect(component.sourceTypePASSPORT).toEqual(thingObj.sourceInfos[3].type);

//       expect(component.sourceValueCPF).toEqual(thingObj.sourceInfos[0].value);
//       expect(component.sourceValueMDM).toEqual(thingObj.sourceInfos[1].value);
//       expect(component.sourceValueIAM).toEqual(thingObj.sourceInfos[2].value);
//       expect(component.sourceValuePASSPORT).toEqual(thingObj.sourceInfos[3].value);
//     });
//     it('should receive the correct sourceInfo', () => {
//       const data = thingObj;
//       data.sourceInfos = [];
//       // fixture.detectChanges()
//       component.setData(data);
//       expect(component.thingToBeUpdated.sourceInfos.length).toEqual(0);
//     });

//     it('should set locationData to empty', () => {
//       thingObj.associatedDevices = [];
//       component.setData(thingObj);
//       expect(component.locationData).toEqual('empty');
//     });

//   });

//   describe('component interaction', () => {

//     beforeEach(() => {
//       thingsService.getById.and.returnValue(of(thingObj));
//       lastPositionService.findLocationByLastEvent.and.returnValue(of(true));
//       component.loadData()
//       component.setData(thingObj);
//       fixture.detectChanges();
//     });

//     it('should display an error modal if the name wasn\'t provided', () => {
//       component.name = '';
//       component.onSubmit();
//       expect(alertModalService.showAlertDanger).toHaveBeenCalled();
//     });

//     it('should display an error modal if the description wasn\'t provided', () => {
//       component.description = '';
//       component.onSubmit();
//       expect(alertModalService.showAlertDanger).toHaveBeenCalled();
//     });

//   });

//   describe(' input change, form submition and validation', () => {

//     beforeEach(() => {
//       thingsService.getById.and.returnValue(of(thingObj));
//       lastPositionService.findLocationByLastEvent.and.returnValue(of(true));

//       component.loadData()
//       component.setData(thingObj);
//     //   component.getLastPosition(thingObj);
//       fixture.detectChanges();

//       const textInputs = debug.queryAll(By.css('input'));
//       const select = debug.query(By.css('select'));

//       select.nativeElement.value = component.selectedType;
//       textInputs[0].nativeElement.value = component.name;
//       textInputs[1].nativeElement.value = component.description;
//       textInputs[2].nativeElement.value = component.type;
//       textInputs[3].nativeElement.value = component.value;
//     });

//     it('should change the value of the input field.', () => {
//       const textInputs = debug.queryAll(By.css('input'));

//       textInputs.forEach(element => {
//         element.nativeNode.value = 'something else';
//         element.nativeNode.dispatchEvent(new Event('input'));
//         expect(element.nativeNode.value).toEqual('something else');
//       });
//     });

//     it('should be different to the original data', fakeAsync(() => {
//       const textInputs = debug.queryAll(By.css('input'));
//       tick();

//       textInputs.forEach(element => {
//         element.nativeElement.value = 'other value';
//         element.nativeElement.dispatchEvent(new Event('input'));
//       });
//       tick();

//       expect(textInputs[0].nativeElement.value).not.toEqual(thingObj.name);
//       expect(textInputs[1].nativeElement.value).not.toEqual(thingObj.description);
//       expect(textInputs[2].nativeElement.value).not.toEqual(thingObj.type);
//       expect(textInputs[3].nativeElement.value).not.toEqual(thingObj.value);
//       flushMicrotasks();
//     }));

//     it('should persist data to the server', fakeAsync(() => {
//       const update = spyOn(component, 'onSubmit');
//       const textInputs = debug.queryAll(By.css('input'));
//       const form = debug.query(By.css('form'));

//       textInputs.forEach(element => {
//         element.nativeElement.value = 'other value';
//         element.nativeElement.dispatchEvent(new Event('input'));
//       });
//       form.triggerEventHandler('submit', {});
//       tick();
//       fixture.detectChanges();

//       expect(update).toHaveBeenCalled();
//       flushMicrotasks();
//     }));

//     it('should provide a valid name', fakeAsync(() => {
//       const textInputs = debug.queryAll(By.css('input'));
//       const form = debug.query(By.css('form'));

//       fixture.whenStable()
//       .then(() => {
//         textInputs[0].nativeElement.value = '';
//         textInputs[0].nativeElement.dispatchEvent(new Event('input'));
//         form.triggerEventHandler('submit', {});
//       })
//       .then(() => {
//         expect(alertModalService.showAlertDanger).toHaveBeenCalled();
//       })
//     }));

//     it('should provide a valid description', fakeAsync(() => {
//       const textInputs = debug.queryAll(By.css('input'));
//       const form = debug.query(By.css('form'));

//       fixture.whenStable()
//       .then(() => {
//           textInputs[1].nativeElement.value = '';
//           textInputs[1].nativeElement.dispatchEvent(new Event('input'));
//           form.triggerEventHandler('submit', {});
//       })
//       .then(() => {
//         expect(alertModalService.showAlertDanger).toHaveBeenCalled();
//       })
//       flushMicrotasks();
//     }));

//     it('should subscribe to the update function', fakeAsync(() => {
//       thingsService.update.and.returnValue(of(true));
//       const form = debug.query(By.css('form'));
//       const subscribe = spyOn(thingsService.update('1', thingObj), 'subscribe');

//       form.triggerEventHandler('submit', {});

//       flush();

//       expect(subscribe).toHaveBeenCalled()
//     }));

//     it('should call the thingService.update function', () => {
//       thingsService.update.and.returnValue(of(true));

//       component.onSubmit()

//       expect(thingsService.update).toHaveBeenCalled();
//     });

//     it('should throw an error and display a modal error if something went wrong in the API', () => {
//       thingsService.update.and.returnValue(throwError(true));

//       component.onSubmit()

//       expect(alertModalService.showAlertDanger).toHaveBeenCalled();
//     });

//     it('should display a success modal', fakeAsync(() => {
//       thingsService.update.and.returnValue(of(true));
//       fixture.detectChanges();

//       component.onSubmit();

//       fixture.whenStable()
//         .then(() => expect(alertModalService.showAlertSuccess).toHaveBeenCalled());

//       flushMicrotasks();
//     }));

//     it ('should display an error modal', fakeAsync(() => {
//       thingsService.update.and.returnValue(throwError(true));

//       component.onSubmit();

//       fixture.whenStable()
//         .then(() =>expect(alertModalService.showAlertDanger).toHaveBeenCalled());
//       flushMicrotasks();
//     }));
//   })

//   describe('Routing tests', () => {

//     beforeEach(() => {
//       thingsService.getById.and.returnValue(of(thingObj));
//       lastPositionService.findLocationByLastEvent.and.returnValue(of(true));
//       component.loadData()
//       component.setData(thingObj);
//       fixture.detectChanges();
//     });

//     it('should be in the devices update route', fakeAsync(() => {
//       router.navigate(['/things/update/1']);
//       flush();
//       expect(location.path()).toBe('/things/update/1');
//     }));

//     it ('should go back to Devies Home View', fakeAsync(() => {
//       router.navigate(['/things/update/1']);
//       const backButton = debug.query(By.css('app-arrow-button'));
//       flush();
//       backButton.triggerEventHandler('click', {});
//       flush();
//       expect(location.path()).toBe('/things');
//       expect(location.path()).not.toBe('/things/update/1');
//     }));

//     it('should go back to Devices Home View', fakeAsync(() => {
//       const button = debug.query(By.css('.blue'));
//       router.navigate(['/things/update/1']);
//       flush();

//       button.triggerEventHandler('click', {});
//       flush();

//       expect(location.path()).not.toBe('/');
//     }));

//     afterEach(fakeAsync(() => flushMicrotasks()));
//   });

// });

// @Component({
//   template: ''
// })
// class MockContainerComponent {}
