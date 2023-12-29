// import { Component, DebugElement } from '@angular/core';
// import {
//   TestBed,
//   ComponentFixture,
//   async,
//   fakeAsync,
//   flush,
//   tick,
// } from '@angular/core/testing';
// import { ApplicationsService } from 'src/app/services/factories/applications.service';
// import { RouterTestingModule } from '@angular/router/testing';
// import { of, throwError } from 'rxjs';
// import { By } from '@angular/platform-browser';
// import { ItemApplicationComponent } from 'src/app/components/item-application/item-application.component';
// import { ActionButtonOutlineComponent } from 'src/app/components/action-button-outline/action-button-outline.component';

// import { ComponentsModule } from 'src/app/components/components.module';
// import { Router } from '@angular/router';
// import { Location } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { MainTitleComponent } from 'src/app/components/main-title/main-title.component';
// import { AlertModalService } from 'src/app/services/alert-modal/alert-modal.service';
// import { UserService } from 'src/app/services/user-services/user.service';
// import { LoggingService } from 'src/app/services/logging/logging.service';
// import { TranslateModule } from '@ngx-translate/core';
// import { ActionButtonComponent } from 'src/app/components/action-button/action-button.component';
// import { CustomPaginationComponent } from 'src/app/components/custom-pagination/custom-pagination.component';
// import { SharedModule } from 'src/app/shared/shared.module';
// import {
//   mockApplicationsList,
//   mockAllApplications,
// } from '../../../core/utils/tests/mock-applications';
// import { ApplicationHomeComponent } from './application-home.component';

// describe('Application Home (View)', () => {
//   const mockData = mockApplicationsList;
//   let fixture: ComponentFixture<ApplicationHomeComponent>;
//   let debug: DebugElement;
//   let component: ApplicationHomeComponent;
//   let serviceSpy;
//   let serviceModalSpy;
//   let applicationsService: any;
//   let alertService: any;
//   let router: Router;
//   let location: Location;

//   let userService: any;
//   let userServiceStub: any;
//   let loggingServiceSpy: LoggingService;
//   let loggingService: LoggingService;

//   beforeEach(async(() => {
//     serviceSpy = jasmine.createSpyObj(['getAll', 'getById']);
//     serviceModalSpy = jasmine.createSpyObj([
//       'showAlertDanger',
//       'showAlertSuccess',
//     ]);
//     userServiceStub = { user: { name: 'user' } };
//     loggingServiceSpy = jasmine.createSpyObj(['logException', 'logEvent']);

//     TestBed.configureTestingModule({
//       declarations: [
//         ApplicationHomeComponent,
//         ItemApplicationComponent,
//         ActionButtonOutlineComponent,
//         CustomPaginationComponent,
//         MainTitleComponent,
//       ],
//       imports: [
//         SharedModule,
//         TranslateModule.forRoot(),
//         FormsModule,
//         ComponentsModule,
//         RouterTestingModule.withRoutes([
//           { path: '', component: ApplicationHomeComponent },
//           { path: 'create', component: MockContainerComponent },
//           {
//             path: 'applications/update/:id',
//             component: MockContainerComponent,
//           },
//         ]),
//       ],
//       providers: [
//         { provide: ApplicationsService, useValue: serviceSpy },
//         { provide: AlertModalService, useValue: serviceModalSpy },
//         { provide: UserService, useValue: userServiceStub },
//         { provide: LoggingService, useValue: loggingServiceSpy },
//       ],
//     })
//       .compileComponents()
//       .then(() => {
//         fixture = TestBed.createComponent(ApplicationHomeComponent);
//         component = fixture.componentInstance;
//         debug = fixture.debugElement;
//         applicationsService = TestBed.inject(ApplicationsService);
//         alertService = TestBed.inject(AlertModalService);
//         router = TestBed.inject(Router);
//         location = TestBed.inject(Location);
//         userService = TestBed.inject(UserService);
//         loggingService = TestBed.inject(LoggingService);
//         router.initialNavigation();
//       });
//   }));

//   describe('Rendering View and child components', () => {
//     beforeEach(() => {
//       applicationsService.getAll
//         .withArgs(0, 10)
//         .and.returnValue(of({ applications: mockData }));
//       applicationsService.getAll.and.returnValue(
//         of({ applications: mockData, count: 20 }),
//       );
//       fixture.detectChanges();
//     });

//     it('should create the component', () => {
//       expect(component).toBeTruthy();
//     });

//     it('should render the create (Adicionar) button', () => {
//       const createButton = debug.query(By.directive(ActionButtonComponent));
//       expect(createButton).toBeTruthy(`Create button doesn't exist`);
//     });

//     it('should render a the create button with "Adicionar" title', () => {
//       const buttonTitle = debug.query(By.directive(ActionButtonComponent))
//         .nativeElement;
//       expect(buttonTitle.textContent).toEqual(' applicationList.createButton ');
//     });
//   });

//   describe('Component initialization', () => {
//     beforeEach(() => {
//       applicationsService.getAll
//         .withArgs(0, 10)
//         .and.returnValue(of({ applications: mockData, count: 20 }));
//       applicationsService.getAll.and.returnValue(
//         of({ applications: mockAllApplications }),
//       );
//       component.ngOnInit();
//     });

//     it('should fetch applications', () => {
//       spyOn(component, 'getApplications');
//       fixture.detectChanges();
//       expect(component.getApplications).toHaveBeenCalled();
//     });

//     it('should call getApplications with skip = 0 and page = 10', () => {
//       fixture.detectChanges();
//       expect(applicationsService.getAll).toHaveBeenCalledWith(0, 10);
//     });

//     it('should subscribe to the fetch applications function', () => {
//       const subscribeSpy = spyOn(applicationsService.getAll(), 'subscribe');
//       fixture.detectChanges();
//       expect(subscribeSpy).toHaveBeenCalled();
//     });

//     it('should receive an array with 10 applications', () => {
//       fixture.detectChanges();
//       expect(component.applications.length).toBe(10);
//     });
//   });

//   describe('Component interaction', () => {
//     beforeEach(() => {
//       applicationsService.getAll.and.returnValue(
//         of({ applications: mockAllApplications }),
//       );
//       fixture.detectChanges();
//     });

//     it('should fetch a single application', () => {
//       applicationsService.getById.and.returnValue(of(mockData[0]));
//       component.getSingleApplication(mockData[0].id);
//       expect(component.applications[0]).toEqual(mockData[0]);
//     });
//   });

//   describe('Routing tests', () => {
//     beforeEach(() => {
//       applicationsService.getAll
//         .withArgs(0, 10)
//         .and.returnValue(of({ applications: mockData, count: 20 }));
//       applicationsService.getAll.and.returnValue(
//         of({ applications: mockAllApplications }),
//       );
//       fixture.detectChanges();
//     });

//     afterEach(fakeAsync(() => flush()));

//     it('should be in the application home route', fakeAsync(() => {
//       router.navigate(['']);
//       tick();
//       expect(location.path()).toBe('/');
//       expect(component).toBeTruthy();
//     }));

//     it('should call the navigate function when the create (Adicionar) button is clicked', fakeAsync(() => {
//       const createButton = debug.query(By.css('.blue'));

//       createButton.triggerEventHandler('click', null);
//       tick();

//       expect(location.path()).toBe('/create');
//       expect(MockContainerComponent).toBeTruthy();
//     }));
//   });

//   //   describe('Throw exceptions', () => {

//   //       it('should throw an error if no application was found in the initialization', () => {
//   //         applicationsService.getAll.and.returnValue(throwError(true));
//   //         fixture.detectChanges();

//   //         expect(component.applications.length).toEqual(0);
//   //         expect(alertService.showAlertDanger).toHaveBeenCalled();
//   //       });

//   //       it('should throw an error if no application was found when getSingleApplication is called', () => {
//   //         applicationsService.getAll.withArgs(0, 10).and.returnValue(of({applications: mockData, count: 20}));
//   //         applicationsService.getAll.and.returnValue(of({applications: mockAllApplications}));
//   //         applicationsService.getById.and.returnValue(throwError(true));
//   //         fixture.detectChanges();

//   //         component.getSingleApplication(mockData[0].id);

//   //         expect(alertService.showAlertDanger).toHaveBeenCalled();
//   //       });
//   //   });
// });

// @Component({
//   template: '',
// })
// class MockContainerComponent {}
