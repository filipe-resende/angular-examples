// import { Location } from '@angular/common';
// import { Component, DebugElement } from '@angular/core';
// import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
// import { ActivatedRoute, Router } from '@angular/router';
// import { RouterTestingModule } from '@angular/router/testing';
// import { TranslateModule } from '@ngx-translate/core';
// import { of } from 'rxjs';
// import { ActionButtonComponent } from 'src/app/components/action-button/action-button.component';
// import { ComponentsModule } from 'src/app/components/components.module';
// import { MainTitleComponent } from 'src/app/components/main-title/main-title.component';
// import { PaginationComponent } from 'src/app/components/pagination/pagination.component';
// import { AlertModalService } from 'src/app/services/alert-modal/alert-modal.service';
// import { ThingsService } from 'src/app/services/factories/things.service';
// import { LoggingService } from 'src/app/services/logging/logging.service';
// import { listThings } from '../../../core/utils/tests/mock-things';
// import { ItemThingComponent } from './components/item-thing/item-thing.component';
// import { ThingsHomeComponent } from './things-home.component';

// @Component({
//   template: '',
// })
// class MockContainerComponent {}

// describe('ThingsHomeComponent', () => {
//   const thingList: any = listThings;
//   let component: ThingsHomeComponent;
//   let fixture: ComponentFixture<ThingsHomeComponent>;
//   let debug: DebugElement;
//   let router: Router;
//   let location: Location;

//   let serviceSpy: any;
//   let thingsService: any;

//   let serviceModalSpy: any;
//   let alertModalService: any;

//   let loggingService;
//   let loggingServiceSpy: LoggingService;

//   let activatedRouteStub;
//   let activatedRoute;

//   beforeEach(
//     waitForAsync(() => {
//       serviceSpy = jasmine.createSpyObj(['getAll', 'getById', 'getByName']);
//       serviceModalSpy = jasmine.createSpyObj([
//         'showAlertSuccess',
//         'showAlertDanger',
//       ]);
//       loggingServiceSpy = jasmine.createSpyObj(['logException', 'logEvent']);
//       activatedRouteStub = { queryParams: of([{ thingName: 'John Doe 1' }]) };

//       TestBed.configureTestingModule({
//         declarations: [
//           ThingsHomeComponent,
//           ItemThingComponent,
//           ActionButtonComponent,
//           PaginationComponent,
//           MainTitleComponent,
//         ],
//         imports: [
//           TranslateModule.forRoot(),
//           ComponentsModule,
//           RouterTestingModule.withRoutes([
//             { path: '', component: ThingsHomeComponent },
//             { path: 'create', component: MockContainerComponent },
//             {
//               path: 'things/update/:id',
//               component: MockContainerComponent,
//             },
//           ]),
//         ],
//         providers: [
//           { provide: ThingsService, useValue: serviceSpy },
//           { provide: AlertModalService, useValue: serviceModalSpy },
//           { provide: LoggingService, useValue: loggingServiceSpy },
//           { provide: ActivatedRoute, useValue: activatedRouteStub },
//         ],
//       })
//         .compileComponents()
//         .then(() => {
//           fixture = TestBed.createComponent(ThingsHomeComponent);
//           component = fixture.componentInstance;
//           debug = fixture.debugElement;

//           activatedRoute = TestBed.inject(ActivatedRoute);
//           thingsService = TestBed.inject(ThingsService);
//           alertModalService = TestBed.inject(AlertModalService);
//           router = TestBed.inject(Router);
//           location = TestBed.inject(Location);
//           router.initialNavigation();
//         });
//     }),
//   );

//   describe('Rendering View and child components', () => {
//     beforeEach(() => {
//       thingsService.getAll.and.returnValue(
//         of({ things: thingList, totalCount: 20 }),
//       );
//       fixture.detectChanges();
//     });

//     // it('should create the component', () => {
//     //   expect(component).toBeTruthy();
//     // });

//     // it('should render the create (Adicionar) button', () => {
//     //   const createButton = debug.query(By.css('.blue'));
//     //   expect(createButton).toBeTruthy(`Create button doesn't exist`);
//     //   const buttonTitle = createButton.nativeElement.textContent;
//     //   expect(buttonTitle).toEqual('THING_LIST.CREATE_BUTTON');
//     // });

//     // it('should render the thing list component', () => {
//     //   const paginationComponent = debug.query(By.css('app-thing-list'));
//     //   expect(paginationComponent).toBeTruthy(
//     //     `Pagination component doesn't exist`,
//     //   );
//     // });

//     // it('should render application items', () => {
//     //   const thingItems = debug.queryAll(By.directive(ItemThingComponent));
//     //   expect(thingItems.length).toBeGreaterThan(0, `Couldn't find things`);
//     // });
//   });

//   describe('Component initialization', () => {
//     beforeEach(() => {
//       thingsService.getAll.and.returnValue(
//         of({ things: thingList, totalCount: 20 }),
//       );
//       fixture.detectChanges();
//     });

//     // it('should fetch things', () => {
//     //   const getThings = spyOn(component, 'getThings');

//     //   fixture.detectChanges();
//     //   expect(getThings).toHaveBeenCalled();
//     // });

//     // it('should call getThings with skip = 0 and page = 10 ', () => {
//     //   thingsService.getAll.and.returnValue(
//     //     of({ things: thingList, totalCount: 20 }),
//     //   );
//     //   fixture.detectChanges();
//     //   expect(thingsService.getAll).toHaveBeenCalled();
//     // });

//     // it('should subscribe to the fetch things function', () => {
//     //   thingsService.getAll.and.returnValue(of({ things: thingList, totalCount: 20 }));
//     //   const subscribeSpy = spyOn(thingsService.getAll(), 'subscribe');

//     //   fixture.detectChanges();
//     //   expect(subscribeSpy).toHaveBeenCalled();
//     // });

//     // it('should receive an array with 10 things', () => {
//     //   thingsService.getAll.and.returnValue(
//     //     of({ things: thingList, totalCount: 20 }),
//     //   );
//     //   fixture.detectChanges();
//     //   expect(component.things.length).toBe(10);
//     // });

//     // it('should call loadData', () => {
//     //   const loadData = spyOn(component, 'loadData');
//     //   component.ngOnInit();
//     //   expect(loadData).toHaveBeenCalled();
//     // });
//   });

//   describe('Component shallow tests', () => {
//     beforeEach(() => {
//       thingsService.getAll.and.returnValue(
//         of({ things: thingList, totalCount: 20 }),
//       );
//       fixture.detectChanges();
//     });

//     // it('should search a thing by its name', () => {
//     //   thingsService.getByName.and.returnValue(of([thingList[0]]));

//     //   component.searchByName('John Doe 1');
//     //   fixture.detectChanges();

//     //   expect(component.things.length).toEqual(10);
//     // });

//     //     it('should reset page, skip, thingsPreview and toggleDropDown', () => {
//     //       const toggleDropDown = spyOn(component, 'toggleDropDown');
//     //       component.skip = 10;
//     //       component.thingsPreview = [thingList];

//     //       component.resetView();
//     //       expect(component.skip).toBe(0);
//     //       expect(component.thingsPreview.length).toBe(0);
//     //       expect(toggleDropDown).toHaveBeenCalled();
//     //     });

//     //     it('should go one page foward', () => {
//     //       const skip = component.skip;
//     //       const getThings = spyOn(component, 'getThings');

//     //     //   component.nextPage();
//     //       expect(getThings).toHaveBeenCalled();
//     //       expect(skip).not.toEqual(component.skip);
//     //     });

//     //     it('should go one page backwards', () => {
//     //       const skip = component.skip;
//     //       const getThings = spyOn(component, 'getThings');
//     //     //   component.nextPage();
//     //     //   component.previousPage();

//     //       expect(getThings).toHaveBeenCalledWith(skip, 10);
//     //       expect(getThings).toHaveBeenCalled();
//     //       expect(skip).toEqual(component.skip);
//     //     });

//     //     it('should stay on the first page', () => {
//     //       const skip = component.skip;
//     //       const getThings = spyOn(component, 'getThings');

//     //     //   component.previousPage();
//     //       expect(skip).toEqual(component.skip);
//     //     });

//     //     it('should select an especific page', () => {
//     //     //   component.setPage(2);
//     //       expect(component.skip).toEqual(20);
//     //     });

//     //     it('should stay in the first page when the page 1 is selected', () => {
//     //       const skip = component.skip;
//     //     //   component.setPage(0);
//     //       expect(component.skip).toEqual(skip);
//     //     });

//     //     it('should returned a list of things as a sugestion for the user', () => {
//     //       const event = { target: { value: 'John' } }
//     //       thingsService.getByName.and.returnValue(of(thingList));

//     //       component.onChange(event);

//     //       expect(component.thingsPreview.length).toBeGreaterThan(0);
//     //       expect(component.showDropDown).toBe(true);
//     //     });

//     // it('should reset the thing list if the input is empty', () => {
//     //   const resetView = spyOn(component, 'resetView');
//     //   const getThings = spyOn(component, 'getThings');
//     //   const event = { target: { value: '' } };

//     //   component.onChange(event);
//     //   expect(resetView).toHaveBeenCalled();
//     //   expect(getThings).toHaveBeenCalled();
//     // });
//   });

//   //   describe('Component interaction', () => {

//   //     beforeEach(() => {
//   //       thingsService.getAll.and.returnValue(of({ things: thingList, totalCount: 20 }));
//   //       fixture.detectChanges();
//   //     });

//   //     it('should call nextPage()', () => {
//   //       const nextPage = spyOn(component, 'nextPage');

//   //       fixture.detectChanges();
//   //       const paginationComponent = debug.query(By.directive(PaginationComponent));
//   //       const fowardButton = paginationComponent.query(By.css('.fa-arrow-right'));
//   //       fowardButton.triggerEventHandler('click', null);

//   //       expect(nextPage).toHaveBeenCalled();
//   //     });

//   //     // it('should call previousPage()', () => {
//   //     //   const previousPage = spyOn(component, 'previousPage');

//   //     //   fixture.detectChanges();
//   //     //   const paginationComponent = debug.query(By.directive(PaginationComponent));
//   //     //   const prevButton = paginationComponent.query(By.css('.fa-arrow-left'));
//   //     //   prevButton.triggerEventHandler('click', null);

//   //     //   expect(previousPage).toHaveBeenCalled();
//   //     // });

//   //     // it('should increase page and skip when nextPage is called', () => {
//   //     //   const prevSkip = component.skip
//   //     //   const fowardButton = debug.query(By.css('.fa-arrow-right'));

//   //     //   fowardButton.triggerEventHandler('click', {});

//   //     //   expect(prevSkip).not.toEqual(component.skip);
//   //     // });

//   //     // it('should decrease page and skip when previousPage is called', () => {
//   //     //   const prevSkip = component.skip

//   //     //   const prevButton = debug.query(By.css('.fa-arrow-left'));

//   //     //   prevButton.triggerEventHandler('click', {});
//   //     //   expect(prevSkip).not.toEqual(component.skip);

//   //     // });

//   //     // it('should not decrease skip it its value is already 0 and call getThings', () => {
//   //     //   const getThings = spyOn(component, 'getThings');
//   //     //   const fowardButton = debug.query(By.css('.fa-arrow-right'));
//   //     //   const prevButton = debug.query(By.css('.fa-arrow-left'));

//   //     //   fowardButton.triggerEventHandler('click', {});
//   //     //   prevButton.triggerEventHandler('click', {});

//   //     //   expect(getThings).toHaveBeenCalled();
//   //     //   expect(getThings).toHaveBeenCalledWith(0, 10);
//   //     // });

//   //   });

//   //   describe('Search interaction', () => {

//   //     beforeEach(() => {
//   //       thingsService.getAll.and.returnValue(of({ things: thingList, totalCount: 20 }));
//   //       fixture.detectChanges();
//   //     });

//   //   //   it('should change the value of the input', () => {
//   //   //     const input = debug.query(By.css('input')).nativeElement;

//   //   //     input.value = 'search term';
//   //   //     input.dispatchEvent(new Event('input'));

//   //   //     expect(component.searchInput.length).toBeGreaterThan(0);
//   //   //     expect(component.searchInput).toBeTruthy();
//   //   //   });

//   //     // checks if the searchByName function is triggered after the length of the search term is >= 3
//   //     // it('should fetch data after the third term is typed', fakeAsync(() => {
//   //     //   thingsService.getByName.and.returnValue(of(thingList[0]));
//   //     //   const input = debug.query(By.css('input')).nativeElement;

//   //     //   input.value = 'abc';
//   //     //   input.dispatchEvent(new Event('input'));
//   //     //   flush();
//   //     //   expect(thingsService.getByName).toHaveBeenCalled();
//   //     //   expect(component.thingsPreview).toEqual(thingList[0]);
//   //     //   expect(component.thingsPreview.length).toBeLessThan(16);
//   //     // }));

//   //   // it('should change the things array when an option is selected', fakeAsync(() => {
//   //   //   thingsService.getByName.and.returnValue(of(mockData));
//   //   //   const input = debug.query(By.css('input')).nativeElement;

//   //   //   input.dispatchEvent(new Event('click'));
//   //   //   input.value = 'search term';
//   //   //   input.dispatchEvent(new Event('input'));
//   //   //   flush();
//   //   //   thingsService.getByName.and.returnValue(of(mockData[0]));
//   //   //   fixture.detectChanges();
//   //   //   const state = debug.queryAll(By.css('.state'));
//   //   //   state[0].triggerEventHandler('click', {});

//   //   //   fixture.whenStable()
//   //   //     .then(() => {
//   //   //       expect(state.length).toBeGreaterThan(0, `State isn't been displayed yet`);
//   //   //       expect(component.things.length).not.toEqual(mockData.length);
//   //   //       expect(component.things).not.toEqual(mockData);
//   //   //     })
//   //   // }));

//   //   // it('should call searchByName when an option is selected', fakeAsync(() => {
//   //   //   const searchByName = spyOn(component, 'searchByName');
//   //   //   thingsService.getByName.and.returnValue(of(mockData));
//   //   //   const input = debug.query(By.css('input')).nativeElement;

//   //   //   input.dispatchEvent(new Event('click'));
//   //   //   input.value = 'search term';
//   //   //   input.dispatchEvent(new Event('input'));
//   //   //   flush();
//   //   //   thingsService.getByName.and.returnValue(of(mockData[0]));
//   //   //   fixture.detectChanges();
//   //   //   const state = debug.queryAll(By.css('.state'));
//   //   //   state[0].triggerEventHandler('click', {});

//   //   //   fixture.whenStable()
//   //   //     .then(() => {
//   //   //       expect(searchByName).toHaveBeenCalled();
//   //   //       expect(searchByName).toHaveBeenCalledWith(mockData[0].name);
//   //   //     })
//   //   // }));

//   //   // it('should call onChange when the value changes', fakeAsync(() => {
//   //   //   const onChange = spyOn(component, 'onChange');
//   //   //   const input = debug.query(By.css('input')).nativeElement;

//   //   //   input.value = 'search term';
//   //   //   input.dispatchEvent(new Event('input'));
//   //   //   flush();

//   //   //   expect(onChange).toHaveBeenCalled();
//   //   // }));

//   //   // it('should call call thingsService.getAll when the input field changes to empty string', fakeAsync(() => {
//   //   //   const input = debug.query(By.css('input')).nativeElement;

//   //   //   input.value = 'search term';
//   //   //   input.dispatchEvent(new Event('input'));
//   //   //   flush();
//   //   //   input.value = '';
//   //   //   input.dispatchEvent(new Event('input'));
//   //   //   flush();
//   //   //   fixture.detectChanges();

//   //   //   expect(component.things).toEqual(mockData);
//   //   //   expect(thingsService.getAll).toHaveBeenCalled();
//   //   // }));

//   //   //  afterEach(fakeAsync(() => flushMicrotasks()));

//   //   });

//   //   describe('Routing tests', () => {

//   //     beforeEach(() => {
//   //       thingsService.getAll.and.returnValue(of({ things: thingList, totalCount: 20 }));
//   //       fixture.detectChanges();
//   //     });

//   //     afterEach(fakeAsync(() =>  flushMicrotasks() ))

//   //     it('should be in the thing home route', () => {
//   //       expect(location.path()).toBe('/');
//   //     });

//   //     it('should route to an especific route when onSelect is called', fakeAsync(() => {
//   //       component.onSelect(listThings[1]);
//   //       flush();
//   //       expect(location.path()).toBe('/things/update/1');
//   //     }));

//   //     // it('should call the navigate function when the create (Adicionar) button is clicked', fakeAsync(() => {
//   //     //   fixture.detectChanges();
//   //     //   const createButton = debug.query(By.directive(ActionButtonComponent));
//   //     //   createButton.triggerEventHandler('click', null);

//   //       // expect(location.path()).toBe('/create');
//   //       // expect(MockContainerComponent).toBeTruthy();
//   //     // }));

//   //     it('should call on select when the edit button is clicked with the correct parameter', () => {
//   //       spyOn(component, 'onSelect');
//   //       const editButton = debug.queryAll(By.css('app-button-outline'));
//   //       const buttons = editButton.map(element => element.query(By.css('button')));
//   //       buttons[1].triggerEventHandler('click', '1');
//   //       expect(component.onSelect).toHaveBeenCalled();

//   //       // buttons.forEach((button, index) => {
//   //       //   index += 1;
//   //       //   button.triggerEventHandler('click', `${index}`);
//   //       //   expect(component.onSelect).toHaveBeenCalled();
//   //       // });
//   //     });

//   //     it('should call router.navigate() when the edit button clicked', () => {
//   //       const navigate = spyOn(router, 'navigate');
//   //       const editButton = debug.queryAll(By.css('app-button-outline'));

//   //       const button = editButton[1].query(By.css('button'));
//   //       button.triggerEventHandler('click', '1');

//   //       expect(navigate).toHaveBeenCalled();

//   //       // const buttons = editButton.map(element => element.query(By.css('button')));
//   //       // buttons.forEach((button, index) => {
//   //       //   button.triggerEventHandler('click', `${index}`);
//   //       // });
//   //     });

//   //     it('should navigate to the /update route with the correct id', fakeAsync(() => {
//   //       const editButton = debug.queryAll(By.css('app-button-outline'));
//   //       const buttons = editButton.map((element, index) => element.query(By.css('button')));

//   //       buttons[1].triggerEventHandler('click', '1');
//   //       fixture.detectChanges();
//   //       tick();

//   //       expect(location.path()).toBe(`/things/update/1`);
//   //     }));

//   //   });

//   //   describe('Exceptions', () => {
//   //     it(`should throw an "exception" modal if something wrong happenend in the API when calling getThings`, () => {
//   //       thingsService.getAll.and.returnValue(throwError(true));
//   //       fixture.detectChanges();
//   //       expect(component.things.length).toBeFalsy();
//   //       expect(alertModalService.showAlertDanger).toHaveBeenCalled();
//   //     });

//   // it('should throw an "exception" modal if something wrong happenend in the API when calling searchByName.', () => {
//   //   thingsService.getAll.and.returnValue(
//   //     of({ things: thingList, totalCount: 20 }),
//   //   );
//   //   thingsService.getByName.and.returnValue(throwError(true));

//   //   fixture.detectChanges();
//   //   component.searchByName('John Doe 1');
//   //   expect(alertModalService.showAlertDanger).toHaveBeenCalled();
//   // });

//   // it('should throw an "exception" modal if something wrong happenend in the API when using the autocomplete feature', () => {
//   //   thingsService.getAll.and.returnValue(
//   //     of({ things: thingList, totalCount: 20 }),
//   //   );
//   //   thingsService.getByName.and.returnValue(throwError(true));

//   //   fixture.detectChanges();
//   //   const event = { target: { value: 'John' } };
//   //   component.onChange(event);

//   //   expect(alertModalService.showAlertDanger).toHaveBeenCalled();
//   // });
//   //   });
// });
