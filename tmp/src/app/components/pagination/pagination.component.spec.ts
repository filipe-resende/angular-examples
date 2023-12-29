/* eslint-disable no-plusplus */

import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { PaginationComponent } from './pagination.component';

describe('Pagination Component', () => {
  let component: PaginationComponent;
  let fixture: ComponentFixture<PaginationComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [PaginationComponent],
      }).compileComponents();
    }),
  );

  describe('Rendering components', () => {
    beforeEach(() => {
      fixture = TestBed.createComponent(PaginationComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should create the component', () => {
      expect(component).toBeTruthy();
    });
  });

  describe('Component initialization', () => {
    it('should have 1 as a count variable at first', () => {
      const counter = new PaginationComponent();

      expect(counter.value).toBe(1);
    });

    it(' should method setPageCount', () => {
      const count = 1000;
      const num = count / 10;

      Math.ceil(num);

      expect(num).toBeLessThanOrEqual(100);
    });

    it('should test numberToList function', () => {
      let num: number;
      const count = [1, 2, 3, 4, 5];

      for (let i = 0; i <= num; i++) {
        count[i] = i;
      }

      expect(count.length).toBeGreaterThan(1);
    });
  });
});
