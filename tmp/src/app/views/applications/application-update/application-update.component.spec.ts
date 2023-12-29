// import { Location } from '@angular/common';
// import { Component, DebugElement } from '@angular/core';
// import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
// import { FormsModule } from '@angular/forms';
// import { ActivatedRoute, Router } from '@angular/router';
// import { RouterTestingModule } from '@angular/router/testing';
// import { TranslateModule } from '@ngx-translate/core';
// import { ModalModule } from 'ngx-bootstrap/modal';
// import { ActionButtonComponent } from 'src/app/components/action-button/action-button.component';
// import { ArrowButtonComponent } from 'src/app/components/arrow-button/arrow-button.component';
// import { MainTitleComponent } from 'src/app/components/main-title/main-title.component';
// import { AlertModalService } from 'src/app/services/alert-modal/alert-modal.service';
// import { ApplicationsService } from 'src/app/services/factories/applications.service';
// import { LoggingService } from 'src/app/services/logging/logging.service';
// import { mockApplicationsList } from '../../../core/utils/tests/mock-applications';
// import { ApplicationUpdateComponent } from './application-update.component';

// @Component({
//   template: '',
// })
// class MockContainerComponent {}

// describe('Application Update (View)', () => {
//   const mockData = mockApplicationsList[0];
//   let component: ApplicationUpdateComponent;
//   let fixture: ComponentFixture<ApplicationUpdateComponent>;
//   let debug: DebugElement;

//   let serviceSpy: any;
//   let applicationsService: any;
//   let alertModalService: any;
//   let activatedRouteStub: any;
//   let activatedRoute: any;
//   let serviceModalSpy: any;

//   let router: Router;
//   let location: Location;

//   let loggingServiceSpy: any;
//   let loggingService: LoggingService;

//   beforeEach(
//     waitForAsync(() => {
//       serviceSpy = jasmine.createSpyObj(['getById', 'update']);
//       serviceModalSpy = jasmine.createSpyObj([
//         'showAlertSuccess',
//         'showAlertDanger',
//       ]);
//       activatedRouteStub = { snapshot: { params: { id: '1' } } };
//       loggingServiceSpy = jasmine.createSpyObj(['logException', 'logEvent']);

//       TestBed.configureTestingModule({
//         declarations: [
//           ApplicationUpdateComponent,
//           ActionButtonComponent,
//           MainTitleComponent,
//           ArrowButtonComponent,
//           ActionButtonComponent,
//         ],
//         providers: [
//           { provide: ApplicationsService, useValue: serviceSpy },
//           { provide: ActivatedRoute, useValue: activatedRouteStub },
//           { provide: AlertModalService, useValue: serviceModalSpy },
//           { provide: LoggingService, useValue: loggingServiceSpy },
//         ],
//         imports: [
//           TranslateModule.forRoot(),
//           FormsModule,
//           ModalModule.forRoot(),
//           RouterTestingModule.withRoutes([
//             {
//               path: 'applications/update/:id',
//               component: ApplicationUpdateComponent,
//             },
//             { path: 'applications', component: MockContainerComponent },
//           ]),
//         ],
//       })
//         .compileComponents()
//         .then(() => {
//           fixture = TestBed.createComponent(ApplicationUpdateComponent);
//           component = fixture.componentInstance;
//           debug = fixture.debugElement;
//           applicationsService = TestBed.inject(ApplicationsService);
//           activatedRoute = TestBed.inject(ActivatedRoute);
//           alertModalService = TestBed.inject(AlertModalService);
//           router = TestBed.inject(Router);
//           location = TestBed.inject(Location);
//           loggingService = TestBed.inject(LoggingService);
//         });
//     }),
//   );

//   describe('Rendering View and child components', () => {
//     beforeEach(() => {
//       applicationsService.getById.and.returnValue(of(mockData));
//       component.loadData();
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

//     it('should render the save button', () => {
//       const form = debug.query(By.css('app-au-form'));
//       expect(form).toBeTruthy();
//     });
//   });

//   describe('Component Initialization', () => {
//     beforeEach(() => {
//       applicationsService.getById.and.returnValue(of(mockData));
//       component.loadData();
//       fixture.detectChanges();
//     });

//     it('should call loadData', () => {
//       const loadData = spyOn(component, 'loadData');
//       component.ngOnInit();
//       expect(loadData).toHaveBeenCalled();
//     });

//     it("should fetch the application info by it's id's", () => {
//       expect(applicationsService.getById).toHaveBeenCalled();
//     });

//     // it('should log user infos in the specific route', () => {
//     //   expect(loggingService.logEvent).toHaveBeenCalled();
//     // });

//     it('should populate the formData object with the retrievied data', () => {
//       expect(component.formData).toEqual(mockData);
//     });
//   });

//   describe('Persisting data', () => {
//     beforeEach(() => {
//       applicationsService.getById.and.returnValue(of(mockData));
//       component.loadData();
//       fixture.detectChanges();
//     });

//     it('should call the update function', () => {
//       const body = { ...component.formData };
//       body.name = 'Other Name';
//       body.description = 'Other Description';
//       applicationsService.update.and.returnValue(of(body));

//       component.update(body);

//       expect(applicationsService.update).toHaveBeenCalled();
//     });
//   });

//   describe('Routing tests', () => {
//     beforeEach(() => {
//       router.initialNavigation();
//       applicationsService.getById.and.returnValue(of(mockData));
//       component.loadData();
//       fixture.detectChanges();
//     });

//     it('should be in the application update route', fakeAsync(() => {
//       router.navigate(['/applications/update/1']);
//       flush();
//       expect(location.path()).toBe('/applications/update/1');
//       expect(component).toBeTruthy();
//     }));

//     it('should go back to Applications Home View', fakeAsync(() => {
//       router.navigate(['/applications/update/1']);
//       tick();
//       const arrowButton = debug.query(By.directive(ArrowButtonComponent));
//       arrowButton.triggerEventHandler('click', {});
//       tick();
//       expect(location.path()).toEqual('/applications');
//     }));

//     // it('should go back to Applications Home View when updated', fakeAsync(() => {
//     //   applicationsService.update.and.returnValue(of(true));
//     //   router.navigate(['/applications/update/1']);
//     //   tick();
//     //   component.update(component.formData);
//     //   tick();
//     //   expect(location.path()).toEqual('/applications');
//     // }));
//   });

//   describe('Applications Update Exceptions', () => {
// it('should log an exception when no data is retrieved', () => {
//   applicationsService.getById.and.returnValue(throwError(true));
//   fixture.detectChanges();
//   expect(loggingService.logException).toHaveBeenCalled();
// });
// it('should behave...', () => {
//   const error = { error: {includes: () => true } };
//   applicationsService.update.and.returnValue(throwError(error));
//   component.update(mockData);
//   expect(alertModalService.showAlertDanger).toHaveBeenCalled();
//   expect(loggingService.logException).toHaveBeenCalled();
// });
//   });
// });

//   describe('Should change the input value', () => {

//     beforeEach(() => {
//       component.loadData();
//       activatedRoute.params.subscribe();
//       applicationsService.getById(mockData.id);
//       component.startView(mockData);
//       fixture.detectChanges();
//       const textInputs = debug.queryAll(By.css('input'));
//       textInputs[0].nativeElement.value = component.name;
//       textInputs[1].nativeElement.value = component.description;
//     });

//     it('should change the value of the input field.', fakeAsync(() => {
//       const textInputs = debug.queryAll(By.css('input'));

//       textInputs.forEach(element => {
//         element.nativeElement.value = 'something else';
//         element.nativeElement.dispatchEvent(new Event('input'));

//         tick();

//         fixture.detectChanges();
//         expect(element.nativeElement.value).toEqual('something else');
//       });
//     }));

//     it('should be different to the original data', fakeAsync(() => {
//       const textInputs = debug.queryAll(By.css('input'));

//       textInputs[0].nativeElement.value = 'something else';
//       textInputs[1].nativeElement.value = 'something else';

//       textInputs[0].nativeElement.dispatchEvent(new Event('input'));
//       textInputs[1].nativeElement.dispatchEvent(new Event('input'));

//       tick();
//       fixture.detectChanges();

//       expect(textInputs[0].nativeElement.value).not.toEqual(mockData.name);
//       expect(textInputs[1].nativeElement.value).not.toEqual(mockData.description);

//     }));

//     it('should call the update function', fakeAsync(() => {
//       const update = spyOn(component, 'update');
//       const textInputs = debug.queryAll(By.css('input'));

//       textInputs[0].nativeElement.value = 'something else';
//       textInputs[1].nativeElement.value = 'something else';

//       textInputs[0].nativeElement.dispatchEvent(new Event('input'));
//       textInputs[1].nativeElement.dispatchEvent(new Event('input'));
//       const form = debug.query(By.css('form'));

//       form.triggerEventHandler('submit', {});
//       tick();
//       fixture.detectChanges();

//       expect(update).toHaveBeenCalled();
//     }));

//     it('should call applicationService.update', () => {
//       applicationsService.update.and.returnValue(of(true));

//       component.update();

//       expect(applicationsService.update).toHaveBeenCalled();
//       expect(alertModalService.showAlertSuccess).toHaveBeenCalled();
//     });

//   });
