import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  flush,
  tick,
  waitForAsync,
} from '@angular/core/testing';
import { DebugElement, Component } from '@angular/core';
import { MainTitleComponent } from 'src/app/components/main-title/main-title.component';
import { ArrowButtonComponent } from 'src/app/components/arrow-button/arrow-button.component';
import { ActionButtonComponent } from 'src/app/components/action-button/action-button.component';
import { Router } from '@angular/router';
import { ThingsService } from 'src/app/services/factories/things.service';
import { AlertModalService } from 'src/app/services/alert-modal/alert-modal.service';
import { FormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap/modal';
import { RouterTestingModule } from '@angular/router/testing';
import { Location } from '@angular/common';
import { By } from '@angular/platform-browser';
import { of, throwError } from 'rxjs';
import { mockThings } from 'src/app/core/utils/tests/mock-things';
import { TranslateModule } from '@ngx-translate/core';
import { LoggingService } from 'src/app/services/logging/logging.service';
import { OAuthModule } from 'angular-oauth2-oidc';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ThingCreateComponent } from './thing-create.component';

@Component({
  template: '',
})
class MockContainerComponent {}

describe('ThingCreateComponent', () => {
  const mockThing = mockThings[0];

  let component: ThingCreateComponent;
  let fixture: ComponentFixture<ThingCreateComponent>;
  let debug: DebugElement;

  let serviceSpy: any;
  let thingsService: any;
  let alertModalService: any;
  let serviceModalSpy: any;
  let router: Router;
  let location: Location;

  let loggingService;
  let loggingServiceSpy: LoggingService;

  beforeEach(
    waitForAsync(() => {
      serviceSpy = jasmine.createSpyObj(['create']);
      serviceModalSpy = jasmine.createSpyObj([
        'showAlertSuccess',
        'showAlertDanger',
      ]);

      loggingServiceSpy = jasmine.createSpyObj([
        'logException',
        'logEvent',
        'logEventWithUserInfo',
      ]);

      TestBed.configureTestingModule({
        declarations: [
          ThingCreateComponent,
          MainTitleComponent,
          ArrowButtonComponent,
          ActionButtonComponent,
        ],
        providers: [
          { provide: ThingsService, useValue: serviceSpy },
          { provide: AlertModalService, useValue: serviceModalSpy },
          { provide: LoggingService, useValue: loggingServiceSpy },
        ],
        imports: [
          TranslateModule.forRoot(),
          FormsModule,
          ModalModule.forRoot(),
          RouterTestingModule.withRoutes([
            { path: 'things/create', component: ThingCreateComponent },
            { path: 'things', component: MockContainerComponent },
          ]),
          OAuthModule.forRoot(),
          HttpClientTestingModule,
        ],
      })
        .compileComponents()
        .then(() => {
          fixture = TestBed.createComponent(ThingCreateComponent);
          component = fixture.componentInstance;
          debug = fixture.debugElement;

          thingsService = TestBed.inject(ThingsService);
          alertModalService = TestBed.inject(AlertModalService);

          loggingService = TestBed.inject(LoggingService);

          router = TestBed.inject(Router);
          location = TestBed.inject(Location);
          router.initialNavigation();
        });
    }),
  );

  describe('Rendering View and child components', () => {
    const renderErrorMsg = `Something went wrong, this(these) component(s) might exist (yet) in this context. Check if you properly loaded everything before run the expectation`;

    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should create component', () => {
      expect(component).toBeTruthy();
    });

    it('should render a back button', () => {
      const backButton = debug.query(By.css('app-arrow-button'));
      expect(backButton).toBeTruthy(renderErrorMsg);
    });

    // it('should render 6 text input fields', () => {
    //   const textInputs = debug.queryAll(By.css('input'));

    //   expect(textInputs.length).toBe(6, renderErrorMsg);
    //   textInputs.forEach(el => expect(el).toBeTruthy(renderErrorMsg));
    // });

    // it('should render a application dropdwon menu', () => {
    //   const dropdown = debug.queryAll(By.css('select'));

    //   dropdown.map(el => expect(el).toBeTruthy(renderErrorMsg));
    //   expect(dropdown.length).toEqual(1, renderErrorMsg);
    // });
  });

  describe('Form validation', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should start empty', () => {
      const textInputs = debug.queryAll(By.css('input'));

      textInputs.map(input => expect(input.nativeElement.value).toBeFalsy());
    });

    //     it('should start invalid', () => {
    //       const textInputs = debug.queryAll(By.css('input'));
    //       textInputs.forEach(input => expect(input.nativeElement.validity.valid).toBe(false));
    //     });

    //     it('should be valid after typing', () => {
    //       const textInputs = debug.queryAll(By.css('input'));

    //       textInputs.map(input => {
    //         input.nativeNode.value = 'something else';
    //         input.nativeElement.dispatchEvent(new Event('input'));

    //         expect(input.nativeElement.validity.valid).toBe(true);
    //       })
    //     })

    //     it('should call onChange when the (change) event is fired', () => {
    //       const onChange = spyOn(component, 'onChange');
    //       fixture.detectChanges();
    //       const cpfInput = debug.nativeElement.querySelector('input[name="sourceValueCPF"]'); // ?

    //       cpfInput.value = '22245608003';
    //       cpfInput.dispatchEvent(new Event('change'));
    //       fixture.detectChanges();

    //       expect(onChange).toHaveBeenCalled();
    //     });

    //     it('should display a error modal', () => {
    //       component.onSubmit();
    //       expect(alertModalService.showAlertDanger).toHaveBeenCalled();
    //     });

    // it('should display a error modal', fakeAsync(() => {
    //   const textInputs = debug.queryAll(By.css('input'));
    //   fixture.detectChanges()
    //   tick()

    //   textInputs[0].nativeElement.value = 'something else';
    //   textInputs[0].nativeElement.dispatchEvent(new Event('input'));
    //   fixture.detectChanges();
    //   tick();

    //   expect(component.name).toEqual('something else')
    // }));
  });

  //   describe('Create a new Thing', () => {
  //     beforeEach(() => {
  //       thingsService.create.and.returnValue(of(true));
  //       component = mockThing.name;
  //       component = mockThing.description;
  //       // component.sourceInfos.value = '22245608003';
  //     });

  //     // it('should submit the form', () => {
  //     //   const submitSpy = spyOn(component, 'onSubmit');
  //     //   const form = debug.query(By.css('form'));

  //     //   form.triggerEventHandler('submit', {});
  //     //   fixture.detectChanges();

  //     //   expect(submitSpy).toHaveBeenCalled();
  //     // });

  //     // it('should submit the form', () => {
  //     //   const validation = spyOn(component, 'onSubmit');
  //     //   const thing = mockThing;
  //     //   component.onSubmit(thing);

  //     //   expect(validation).toHaveBeenCalled();
  //     // });

  //     //     it('shouldn\t display an error modal if the required data was provided', () => {
  //     //       fixture.detectChanges();
  //     //       component.onSubmit();
  //     //       expect(alertModalService.showAlertDanger).not.toHaveBeenCalled();
  //     //     });

  //     //     it('should call sourceTypeValidation', () => {
  //     //       const sourceTypeValidation = spyOn(component, 'sourceTypeValidation');
  //     //       component.sourceInfos.type = 'IAM';
  //     //       component.sourceInfos.value = '12345678901234567890123456789012345678901234567890';

  //     //       component.onSubmit();

  //     //       expect(sourceTypeValidation).toHaveBeenCalled();
  //     //     });

  //     //     it('should call thingsService.create', () => {
  //     //       fixture.detectChanges();
  //     //       component.onSubmit();
  //     //       expect(thingsService.create).toHaveBeenCalled();
  //     //     });

  //     //     it('should subscribe to the thingsService.create function', () => {
  //     //       const subscribe = spyOn(thingsService.create(), 'subscribe');

  //     //       fixture.detectChanges();
  //     //       component.onSubmit();

  //     //       expect(subscribe).toHaveBeenCalled();
  //     //     });
  //   });

  //   describe('Create a new thing, general Exceptions', () => {
  //     beforeEach(() => {
  //       fixture.detectChanges();
  //     });

  //     // it("should display an error modal if a name wasn't provided", () => {
  //     //   const thing = mockThing;
  //     //   component.onSubmit(thing);
  //     //   expect(alertModalService.showAlertDanger).toHaveBeenCalled();
  //     // });

  //     // it("should display an error modal if a description wasn't provided", () => {
  //     //   component = mockThing.name;

  //     //   const thing = mockThing;
  //     //   component.onSubmit(thing);

  //     //   expect(alertModalService.showAlertDanger).toHaveBeenCalled();
  //     // });

  //     // it("should display an error modal if a source info value wasn't provided", () => {
  //     //   component = mockThing.name;
  //     //   component = mockThing.description;
  //     //   // component.sourceInfos.value = '';
  //     //   const thing = mockThing;
  //     //   component.onSubmit(thing);

  //     //   expect(alertModalService.showAlertDanger).toHaveBeenCalled();
  //     // });

  //     // it('should display an error modal if the source info value length is bigger than 40 characters', () => {
  //     //   component = mockThing.name;
  //     //   component = mockThing.description;
  //     //   // component.sourceInfos.type = 'IAM';
  //     //   // component.sourceInfos.value = '12345678901234567890123456789012345678901234567890';
  //     //   const thing = mockThing;
  //     //   component.onSubmit(thing);

  //     //   expect(alertModalService.showAlertDanger).toHaveBeenCalled();
  //     // });

  //     // it('should display an error modal if returns an error from the API call', () => {
  //     //   thingsService.create.and.returnValue(throwError(true));
  //     //   component = mockThing.name;
  //     //   component = mockThing.description;
  //     //   // component.sourceInfos.value = '22245608003';
  //     //   const thing = mockThing;
  //     //   component.onSubmit(thing);

  //     //   expect(alertModalService.showAlertDanger).toHaveBeenCalled();
  //     // });
  //   });

  //   describe('CPF exceptions', () => {
  //     beforeEach(() => {
  //       component = mockThing.name;
  //       fixture.detectChanges();
  //     });

  //     // it('should display an error modal if the CPF is invalid', () => {
  //     //   // component.sourceInfos.value = '12345678910';
  //     //   const thing = mockThing;

  //     //   component.onSubmit(thing);

  //     //   expect(alertModalService.showAlertDanger).toHaveBeenCalled();
  //     // });

  //     // it('should display an error modal if the CPF is invalid', () => {
  //     //   // component.sourceInfos.value = '00000000000';
  //     //   const thing = mockThing;
  //     //   component.onSubmit(thing);

  //     //   expect(alertModalService.showAlertDanger).toHaveBeenCalled();
  //     // });
  //   });
});
