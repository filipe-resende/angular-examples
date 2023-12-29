import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TypeEquipmentsComponent } from './type-equipments.component';

describe('TypeEquipmentsComponent', () => {
  let component: TypeEquipmentsComponent;
  let fixture: ComponentFixture<TypeEquipmentsComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [TypeEquipmentsComponent],
      }).compileComponents();
    }),
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(TypeEquipmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
