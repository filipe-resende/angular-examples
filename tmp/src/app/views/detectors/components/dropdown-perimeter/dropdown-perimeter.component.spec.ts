import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DropdownPerimeterComponent } from './dropdown-perimeter.component';

describe('DropdownPerimeterComponent', () => {
  let component: DropdownPerimeterComponent;
  let fixture: ComponentFixture<DropdownPerimeterComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [DropdownPerimeterComponent],
      }).compileComponents();
    }),
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(DropdownPerimeterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
