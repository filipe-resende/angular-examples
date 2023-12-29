// import { async, ComponentFixture, TestBed } from '@angular/core/testing';

// import { ThingsModalComponent } from './things-modal.component';
// import { AlertModalService } from 'src/app/services/alert-modal/alert-modal.service';
// import { AssociationPeriodsService } from 'src/app/services/factories/association-periods.service';
// import { ThingsService } from 'src/app/services/factories/things.service';
// import { FormsModule } from '@angular/forms';
// import { ActionButtonComponent } from '../action-button/action-button.component';
// import { PaginationComponent } from '../pagination/pagination.component';
// import { mockThings } from '../../utils/mock-things';
// import { mockDevicesList } from '../../utils/mock-devices';
// import { of, throwError } from 'rxjs';
// import { DebugElement } from '@angular/core';
// import { By } from '@angular/platform-browser';
// import { BsModalRef, ModalModule } from 'ngx-bootstrap/modal';
// import { ItemModalComponent } from '../item-modal/item-modal.component';
// import { LoggingService } from 'src/app/services/logging/logging.service';
// import { UserService } from 'src/app/services/user-services/user.service';
// import { TranslateModule } from '@ngx-translate/core';

// describe('ThingsModalComponent', () => {
//   let component: ThingsModalComponent;
//   let fixture: ComponentFixture<ThingsModalComponent>;
//   let debug: DebugElement;

//   let thingsServiceSpy: any
//   let serviceModalSpy: any;
//   let associationPeriodsSpy: any;

//   let thingsService: any
//   let alertModalService: any;
//   let associationPeriodsService: any;

//   let bsModalStub: any
//   let bsModalRef: any;

//   let userService: any;
//   let userServiceStub: any;
//   let loggingServiceSpy: LoggingService;
//   let loggingService: LoggingService

//   beforeEach(async(() => {
//     thingsServiceSpy = jasmine.createSpyObj(['getAll', 'getByName']);
//     serviceModalSpy = jasmine.createSpyObj(['showAlertSuccess', 'showAlertDanger']);
//     associationPeriodsSpy = jasmine.createSpyObj(['create']);
//     bsModalStub = { hide: () => {} };

//     userServiceStub = { user: { name: 'user' }};
//     loggingServiceSpy = jasmine.createSpyObj(['logException', 'logEvent']);

//     TestBed.configureTestingModule({
//       declarations: [
//         ThingsModalComponent,
//         ItemModalComponent,
//         ActionButtonComponent,
//         PaginationComponent,
//       ],
//       providers: [
//         { provide: AlertModalService, useValue: serviceModalSpy },
//         { provide: AssociationPeriodsService, useValue: associationPeriodsSpy },
//         { provide: ThingsService, useValue: thingsServiceSpy },
//         { provide: BsModalRef, useValue: bsModalStub },
//         { provide: UserService, useValue: userServiceStub },
//         { provide: LoggingService, useValue: loggingServiceSpy }
//       ],
//       imports: [
//         TranslateModule.forRoot(),
//         FormsModule,
//         ModalModule.forRoot(),
//       ],
//     })
//     .compileComponents()
//     .then(() => {
//       fixture = TestBed.createComponent(ThingsModalComponent);
//       component = fixture.componentInstance;
//       debug = fixture.debugElement;
//       thingsService = TestBed.inject(ThingsService),
//       alertModalService = TestBed.inject(AlertModalService);
//       associationPeriodsService = TestBed.inject(AssociationPeriodsService);
//       bsModalRef = TestBed.inject(BsModalRef);
//       component.externalData = mockDevicesList;
//     })
//   }));

//   describe('Rendering View and child components', () => {

//     beforeEach(() => {
//       thingsService.getAll.and.returnValue(of({things: mockThings, countPage: 20}));
//       fixture.detectChanges();
//     });

//     it('should create component', () => {
//       expect(component).toBeTruthy();
//     });

//     it('should render 10 thing items', () => {
//       fixture.detectChanges();
//       const thingItem = debug.queryAll(By.directive(ItemModalComponent));
//       expect(thingItem).toBeTruthy();
//       expect(component.things.length).toEqual(10);
//       expect(component.things).toEqual(mockThings);
//     });

//     it('should render pagination component', () => {
//       const paginationComponent = debug.query(By.directive(PaginationComponent));
//       expect(paginationComponent).toBeTruthy();
//     });

//   });

//   describe('Component initialization', () => {

//     beforeEach(() => {
//       thingsService.getAll.and.returnValue(of({things: mockThings, countPage: 20}));
//     });

//     it('should call getThings', () => {
//       spyOn(component, 'getThings');
//       fixture.detectChanges();
//       expect(component.getThings).toHaveBeenCalled();
//     })

//     it('should call thingsService.getAll', () => {
//       fixture.detectChanges();
//       expect(thingsService.getAll).toHaveBeenCalled();
//     })

//     it ('should call subscribe', () => {
//       const subscribe = spyOn(thingsService.getAll(), 'subscribe');
//       fixture.detectChanges();
//       expect(subscribe).toHaveBeenCalled();
//     });

//   });

//   describe('Component interaction', () => {

//     beforeEach(() => {
//       thingsService.getAll.and.returnValue(of({things: mockThings, countPage: 20}));
//       fixture.detectChanges();
//     });

//     it('should search for a thing with a specific name', () => {
//       thingsServiceSpy.getByName.and.returnValue(of(mockThings[0]));
//       component.searchByName(mockThings[0].name);
//       expect(component.things).toEqual(mockThings[0]);
//     });

//     it('should increase page and skip when nextPage is called', () => {
//       const originalskip = component.skip;
//       component.nextPage();

//       expect(originalskip).not.toEqual(component.skip);
//       expect(component.skip).toEqual(5);
//     });

//     it('should decrease page and skip when previousPage is called', () => {
//       const originalskip = component.skip;
//       component.nextPage();

//       component.previousPage();

//       expect(originalskip).toEqual(component.skip);
//       expect(component.skip).toEqual(0);
//     });

//     it('should call BSModalRef.hide', () => {
//       const hide = spyOn(bsModalRef, 'hide');

//       component.onClose();

//       expect(hide).toHaveBeenCalled();
//     });

//     it('should set the page for an especific page', () => {
//       component.setPage(2);
//       expect(component.skip).toEqual(10);
//     });

//     it('should stay in the same page', () => {
//       const originalSkip = component.skip;
//       component.setPage(0);
//       expect(component.skip).toEqual(originalSkip);
//     });

//     it('should reset the view', () => {
//       const originalSkip = component.skip;
//       component.skip = 15;
//       component.thingsPreview = [mockThings];
//       component.showDropDown = true;

//       component.resetView();

//       expect(component.skip).toEqual(originalSkip);
//       expect(component.thingsPreview.length).toBeFalsy();
//       expect(component.showDropDown).toBeFalsy();
//     });

//     it('should call associationPeriodsService.create', () => {
//       spyOn(component, 'createAssociationObject');
//       associationPeriodsService.create.and.returnValue(of(true));

//       component.createAssociationPeriod();

//       expect(associationPeriodsService.create).toHaveBeenCalled();
//     })

//     it('should select the correct thing', () => {
//       component.onSelect(mockThings[0]);
//       expect(component.thingId).toEqual(mockThings[0].id);
//     });

//     it('should return an association object', () => {
//       const associationObj = component.createAssociationObject(mockDevicesList[0]);
//       expect(associationObj.applicationId).toBeTruthy()
//       expect(associationObj.associationDate).toBeTruthy()
//       expect(associationObj.deviceId).toBeTruthy()
//     });

//   });

//   describe('Deep integration tests', () => {

//     beforeEach(() => {
//       thingsService.getAll.and.returnValue(of({things: mockThings, countPage: 20}));
//       fixture.detectChanges();
//     });

//     it('should call nextPage()', () => {
//       const nextPage = spyOn(component, 'nextPage');

//       fixture.detectChanges();
//       const paginationComponent = debug.query(By.directive(PaginationComponent));
//       const fowardButton = paginationComponent.query(By.css('.fa-arrow-right'));
//       fowardButton.triggerEventHandler('click', null);

//       expect(nextPage).toHaveBeenCalled();
//     });

//     it('should call previousPage()', () => {
//       const previousPage = spyOn(component, 'previousPage');

//       fixture.detectChanges();
//       const paginationComponent = debug.query(By.directive(PaginationComponent));
//       const prevButton = paginationComponent.query(By.css('.fa-arrow-left'));
//       prevButton.triggerEventHandler('click', null);

//       expect(previousPage).toHaveBeenCalled();
//     });

//     it('should not decrease skip it its value is already 0 and call getThings', () => {
//       const getThings = spyOn(component, 'getThings');
//       const fowardButton = debug.query(By.css('.fa-arrow-right'));
//       const prevButton = debug.query(By.css('.fa-arrow-left'));

//       fowardButton.triggerEventHandler('click', {});
//       prevButton.triggerEventHandler('click', {});

//       expect(getThings).toHaveBeenCalled();
//     });

//     it ('should call onClose', () => {
//       const onClose = spyOn(component, 'onClose');
//       const closeButton = debug.query(By.css('.close'));

//       closeButton.triggerEventHandler('click', {});

//       expect(onClose).toHaveBeenCalled();
//     });

//     it('should call onSelect', () => {
//       const onSelect = spyOn(component, 'onSelect');
//       const radioBtns = debug.queryAll(By.css('#radio'));

//       radioBtns[0].triggerEventHandler('click', {});

//       expect(onSelect).toHaveBeenCalled();
//     });

//     it('should try to fetch things sugestions if the searchInput.length is >= 3', () => {
//       const toggleDropDown = spyOn(component, 'toggleDropDown');
//       thingsService.getByName.and.returnValue(of(mockThings));
//       const originalThingsPreview = component.thingsPreview.length;

//       component.onChange('John');

//       expect(component.thingsPreview.length).toBeTruthy();
//       expect(component.thingsPreview.length).not.toEqual(originalThingsPreview);
//       expect(toggleDropDown).toHaveBeenCalled();
//     });

//     it('should fetch things with the initial skip and count, and reset the view', () => {
//       const resetView = spyOn(component, 'resetView');
//       const getThings = spyOn(component, 'getThings');
//       thingsService.getByName.and.returnValue(of(true));

//       component.onChange('');

//       expect(resetView).toHaveBeenCalled();
//       expect(getThings).toHaveBeenCalled();
//     });

//     it('should call searchByName', () => {
//       const searchByName = spyOn(component, 'searchByName');
//       const searchButton = debug.query(By.css('.mdi-magnify'));
//       searchButton.triggerEventHandler('click', mockThings[0].name);
//       expect(searchByName).toHaveBeenCalled();
//     });

//     it('should call createAssociationPeriod', () => {
//       const createAssociationPeriod = spyOn(component, 'createAssociationPeriod');
//       const button = debug.query(By.css('app-action-button .blue')); // ?
//       button.triggerEventHandler('click', {})
//       expect(createAssociationPeriod).toHaveBeenCalled();
//     });

//   });

//   describe('Component exceptions', () => {
//     it('should throw an exception if something went wrong in the getThings response', () => {
//       thingsService.getAll.and.returnValue(throwError(true));
//       fixture.detectChanges();
//       expect(component.things.length).toBe(0);
//     });

//     it('should throw an exception if something went wrong when calling sarchByName', () => {
//       thingsService.getAll.and.returnValue(of({things: mockThings, countPage: 20}));
//       thingsService.getByName.and.returnValue(throwError(true));
//       fixture.detectChanges();

//       component.searchByName(mockThings[0].name);

//       expect(component.things).not.toEqual(mockThings[0]);
//       expect(alertModalService.showAlertDanger).toHaveBeenCalled();
//     });

//     it('should throw an exception if something went wrong when calling onChange', () => {
//       thingsService.getAll.and.returnValue(of({things: mockThings, countPage: 20}));
//       thingsService.getByName.and.returnValue(throwError(true));
//       fixture.detectChanges();

//       component.onChange('John');

//       expect(component.thingsPreview.length).toEqual(0);
//       expect(alertModalService.showAlertDanger).toHaveBeenCalled();
//     });

//     it('should trhow an exception if something went wrong when calling createAssociationPeriod' , () => {
//       thingsService.getAll.and.returnValue(of({things: mockThings, countPage: 20}));
//       associationPeriodsService.create.and.returnValue(throwError(true));

//       fixture.detectChanges();
//       component.createAssociationPeriod();

//       expect(alertModalService.showAlertDanger).toHaveBeenCalled();
//     });

//   });

// });
