import { Component } from '@angular/core';

// describe('Create Application (View)', () => {
//   const mockData: ApplicationToBeCreated = createApplication(11);

//   let component: ApplicationCreateComponent;
//   let componentForm: AC_FormComponent;
//   let fixture: ComponentFixture<ApplicationCreateComponent>;
//   let fixtureForm: ComponentFixture<AC_FormComponent>;
//   let debug: DebugElement;

//   let applicationService: any;
//   let mockLocationService: any;
//   let spyService: any;
//   let serviceModalSpy: any;
//   let alertModalService: any;
//   let router: Router;
//   let location: any;
//   let userService: any;
//   let userServiceStub: any;
//   let loggingServiceSpy: LoggingService;
//   let loggingService: LoggingService;

//   beforeEach(async(() => {
//     spyService = jasmine.createSpyObj(['create']);
//     serviceModalSpy = jasmine.createSpyObj([
//       'showAlertSuccess',
//       'showAlertDanger',
//     ]);
//     mockLocationService = { back: () => {} };
//     userServiceStub = { user: { name: 'user' } };
//     loggingServiceSpy = jasmine.createSpyObj(['logException', 'logEvent']);

//     TestBed.configureTestingModule({
//       declarations: [
//         ApplicationCreateComponent,
//         ActionButtonComponent,
//         MainTitleComponent,
//         ArrowButtonComponent,
//         AlertModalComponent,
//         AC_FormComponent,
//       ],
//       providers: [
//         { provide: ApplicationsService, useValue: spyService },
//         { provide: AlertModalService, useValue: serviceModalSpy },
//         { provide: UserService, useValue: userServiceStub },
//         { provide: LoggingService, useValue: loggingServiceSpy },
//       ],
//       imports: [
//         TranslateModule.forRoot(),
//         FormsModule,
//         ModalModule.forRoot(),
//         RouterTestingModule.withRoutes([
//           {
//             path: 'applications/create',
//             component: ApplicationCreateComponent,
//           },
//           { path: 'applications', component: MockContainerComponent },
//         ]),
//       ],
//     })
//       .compileComponents()
//       .then(() => {
//         fixture = TestBed.createComponent(ApplicationCreateComponent);
//         fixtureForm = TestBed.createComponent(AC_FormComponent);
//         component = fixture.componentInstance;
//         componentForm = fixtureForm.componentInstance;
//         debug = fixture.debugElement;
//         applicationService = TestBed.inject(ApplicationsService);
//         alertModalService = TestBed.inject(AlertModalService);
//         router = TestBed.inject(Router);
//         location = TestBed.inject(Location);
//         userService = TestBed.inject(UserService);
//         loggingService = TestBed.inject(LoggingService);
//         router.initialNavigation();
//       });
//   }));
//   describe('Rendering View and child components', () => {
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
//       fixtureForm.detectChanges();
//       const button = debug.query(By.directive(ActionButtonComponent));
//       expect(button).toBeTruthy();
//     });

//     it('should render the form', () => {
//       fixtureForm.detectChanges();
//       const form = debug.query(By.directive(AC_FormComponent));
//       expect(form).toBeTruthy();
//     });
//   });

//   describe('Form validation', () => {
//     it('should start empty', () => {
//       fixture.detectChanges();
//       const textInputs = debug.queryAll(By.css('on'));
//       textInputs.forEach(element => {
//         return expect(element.nativeElement.value).toBeTrue();
//       });
//     });

//     it('should render 2 text inputs', () => {
//       fixture.detectChanges();
//       const textInputs = debug.queryAll(By.css('input'));
//       expect(textInputs).toBeTruthy(`Text Inputs doesn't exit`);
//       expect(textInputs.length).toEqual(3, `Text Inputs doesn't exit`);
//     });

//     it('should render a form', () => {
//       fixture.detectChanges();
//       const form = fixture.debugElement.query(By.css('form'));

//       expect(form).toBeTruthy();
//     });

//     it('should start invalid', () => {
//       const textInputs = debug.queryAll(By.css('on'));
//       textInputs.forEach(element => {
//         expect(element.nativeElement.validity.valid).toBeFalse();
//       });
//     });

//     it('should be valid after typing', () => {
//       const textInputs = debug.queryAll(By.css('input'));
//       textInputs[0].nativeElement.value = 'something else';
//       textInputs[1].nativeElement.value = 'something else';
//       textInputs[0].nativeElement.dispatchEvent(new Event('on'));
//       textInputs[1].nativeElement.dispatchEvent(new Event('on'));

//       fixture.detectChanges();

//       textInputs.forEach(element => {
//         expect(element.nativeElement.validity.valid).toBeTrue();
//       });
//     });

//     // it('should display a error modal', () => {
//     //   alertModalService.create.and.returnValue(of(true));
//     //   fixture.detectChanges();
//     //   component.onSubmit(mockData);
//     //   fixture.detectChanges();
//     //   expect(alertModalService.showAlertDanger).toHaveBeenCalled();
//     // });

//     // it('should display an error modal if a name wasn\'t provided', () => {
//     //   fixture.detectChanges();

//     //   component.onSubmit(mockData);
//     //   fixture.detectChanges();

//     //   expect(alertModalService.showAlertDanger).toHaveBeenCalled();
//     // });

//     //     it('should display an error modal if a description wasn\'t provided', () => {
//     //       fixture.detectChanges();
//     //       component.name = 'something else';

//     //       component.onSubmit();
//     //       fixture.detectChanges();

//     //       expect(alertModalService.showAlertDanger).toHaveBeenCalled();
//     //     });

//     //     it('should display a success modal', () => {
//     //       applicationService.create.and.returnValue(of(true));
//     //       fixture.detectChanges();
//     //       component.name = 'something else';
//     //       component.description = 'something else';

//     //       component.onSubmit();
//     //       fixture.detectChanges();

//     //       expect(alertModalService.showAlertSuccess).toHaveBeenCalled();
//     //     });

//     //     it('should be false checkbox', () => {
//     //       expect(component.authorization).toBe(false);
//     //     });

//     //     // fit('should be true when click', fakeAsync(() => {
//     //     //   const checkbox = debug.query(By.css('#checkbox'));
//     //     //   checkbox.nativeElement.click();
//     //     //   tick();
//     //     //   expect(component.authorization).toBe(true);
//     //     // }));
//   });

//   describe('Create a new Application', () => {
//     // beforeEach(() => {
//     //   fixture.detectChanges();
//     // });
//     // it('should submit the form', () => {
//     //   const submitSpy = spyOn(component, 'onSubmit')
//     //   const form = debug.query(By.css('form'));
//     //   form.triggerEventHandler('submit', {});
//     //   fixture.detectChanges();
//     //   expect(submitSpy).toHaveBeenCalled();
//     // });
//     //     it('should call the validation function', () => {
//     //       const validation = spyOn(component, 'formCreateValidation');
//     //       component.onSubmit();
//     //       fixture.detectChanges();
//     //       expect(validation).toHaveBeenCalled();
//     //     });
//     //     it('should call formCreateValidation and return true', () => {
//     //       expect(component.formCreateValidation(mockData)).toBe(true);
//     //     });
//     //     it('should display a modal success', () => {
//     //       applicationService.create.and.returnValue(of(true));
//     //       component.name = 'something else';
//     //       component.description = 'something else';
//     //       component.onSubmit();
//     //       fixture.detectChanges();
//     //       expect(applicationService.create).toHaveBeenCalled();
//     //     });
//     //     it('should display a modal success', () => {
//     //       applicationService.create.and.returnValue(of(true));
//     //       component.name = 'something else';
//     //       component.description = 'something else';
//     //       component.onSubmit();
//     //       fixture.detectChanges();
//     //       expect(applicationService.create).toHaveBeenCalled();
//     //     });
//     //     it('should throw an error if the application already exists', () => {
//     //       applicationService.create.and.returnValue(throwError({ error: 'already exist'}));
//     //       component.name = 'something else';
//     //       component.description = 'something else';
//     //       component.onSubmit();
//     //       fixture.detectChanges();
//     //       expect(alertModalService.showAlertDanger).toHaveBeenCalled();
//     //       expect(alertModalService.showAlertDanger).toHaveBeenCalledWith('applicationCreate.saveResponse.nameAlreadyExists', '');
//     //     });
//   });

//   describe('Routing tests', () => {
//     beforeEach(() => {
//       fixture.detectChanges();
//     });

//     it('should be in the application create route', fakeAsync(() => {
//       router.navigate(['/applications/create']);
//       flush();
//       expect(location.path()).toBe('/applications/create');
//     }));

//     it('should go back to Applications Home View', fakeAsync(() => {
//       router.navigate(['/applications/create']);
//       tick();
//       const arrowButton = debug.query(By.directive(ArrowButtonComponent));
//       arrowButton.triggerEventHandler('click', {});
//       fixture.detectChanges();
//       tick();
//       expect(location.path()).toBe('/applications');
//     }));
//   });
// });

@Component({
  template: '',
})
class MockContainerComponent {}
