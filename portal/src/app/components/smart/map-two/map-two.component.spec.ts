import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapTwoComponent } from './map-two.component';

describe('MapTwoComponent', () => {
  let component: MapTwoComponent;
  let fixture: ComponentFixture<MapTwoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MapTwoComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MapTwoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  xit('should create', () => {
    expect(component).toBeTruthy();
  });
});
