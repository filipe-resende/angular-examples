import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { BsModalRef } from 'ngx-bootstrap/modal';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { AlertModalComponent } from './alert-modal.component';

describe('AlertModalComponent', () => {
  let component: AlertModalComponent;
  let fixture: ComponentFixture<AlertModalComponent>;
  let debug: DebugElement;
  let bsModalRef: BsModalRef;
  let spyBsModalRef: BsModalRef;

  beforeEach(
    waitForAsync(() => {
      spyBsModalRef = jasmine.createSpyObj(['hide']);

      TestBed.configureTestingModule({
        declarations: [AlertModalComponent],
        providers: [{ provide: BsModalRef, useValue: spyBsModalRef }],
      })
        .compileComponents()
        .then(() => {
          fixture = TestBed.createComponent(AlertModalComponent);
          component = fixture.componentInstance;
          debug = fixture.debugElement;
          bsModalRef = TestBed.inject(BsModalRef);
        });
    }),
  );

  describe('Rendering the component', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should behave...', () => {
      expect(component).toBeTruthy();
    });
  });

  describe('Name of the group', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should call onClose', () => {
      const onClose = spyOn(component, 'onClose');

      const button = debug.query(By.css('.close'));
      button.triggerEventHandler('click', {});

      expect(onClose).toHaveBeenCalled();
    });

    it('should close the component', () => {
      component.onClose();
      fixture.detectChanges();

      expect(bsModalRef.hide).toHaveBeenCalled();
    });
  });
});
