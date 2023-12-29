import { Component, DebugElement } from '@angular/core';
import {
  ComponentFixture,
  fakeAsync,
  flushMicrotasks,
  TestBed,
  tick,
  waitForAsync,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { NgxPaginationModule } from 'ngx-pagination';
import { CustomPaginationComponent } from 'src/app/components/custom-pagination/custom-pagination.component';
import { mockApplicationsList } from 'src/app/core/utils/tests/mock-applications';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { ApplicationListComponent } from './application-list.component';

@Component({
  template: '',
})
class MockContainerComponent {}

describe('ActionButtonComponent', () => {
  let component: ApplicationListComponent;
  let fixture: ComponentFixture<ApplicationListComponent>;
  let debug: DebugElement;
  let router: Router;
  let location: Location;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [ApplicationListComponent, CustomPaginationComponent],
        imports: [
          NgxPaginationModule,
          RouterTestingModule.withRoutes([
            { path: '', component: ApplicationListComponent },
            {
              path: 'applications/update/:id',
              component: MockContainerComponent,
            },
          ]),
        ],
      }).compileComponents();
    }),
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(ApplicationListComponent);
    component = fixture.componentInstance;
    debug = fixture.debugElement;

    location = TestBed.inject(Location);
    router = TestBed.inject(Router);
    router.initialNavigation();
  });

  //   describe('Rendering components', () => {
  //     beforeEach(() => {
  //       component.applications = mockApplicationsList;
  //       fixture.detectChanges();
  //     });

  // it('should render the pagination component', () => {
  //   const paginationComponent = debug.query(
  //     By.directive(CustomPaginationComponent),
  //   );
  //   expect(paginationComponent).toBeTruthy(
  //     `Pagination component doesn't exist`,
  //   );
  // });

  // it('should render an edit button inside each application item', fakeAsync(() => {
  //   tick();
  //   const applications = debug.queryAll(By.css('app-item-application'));
  //   expect(applications.length).toBeTruthy();
  //   flushMicrotasks();
  // }));
  //   });

  describe('Component interaction', () => {
    beforeEach(() => {
      component.applications = mockApplicationsList;
      fixture.detectChanges();
    });

    it('should route the user to a specific application', fakeAsync(() => {
      component.onSelect('1');
      tick();
      expect(location.path()).toEqual('/applications/update/1');
    }));

    it('should change to a specific page', () => {
      component.changePage(1);
      expect(component.currentPage).toEqual(1);
    });

    it('should call paginate and emit a value', () => {
      const paginate = spyOn(component.paginate, 'emit');

      component.changePage(1);

      expect(paginate).toHaveBeenCalled();
      expect(paginate).toHaveBeenCalledWith(1);
    });
  });
});
