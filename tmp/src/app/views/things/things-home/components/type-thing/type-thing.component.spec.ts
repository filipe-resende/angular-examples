import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TypeThingComponent } from './type-thing.component';

describe('TypeThingComponent', () => {
  let component: TypeThingComponent;
  let fixture: ComponentFixture<TypeThingComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [TypeThingComponent],
      }).compileComponents();
    }),
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(TypeThingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
