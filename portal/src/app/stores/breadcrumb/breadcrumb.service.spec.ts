import { TestBed } from '@angular/core/testing';
import { NgxsModule } from '@ngxs/store';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NgxsDispatchPluginModule } from '@ngxs-labs/dispatch-decorator';
import { BreadcrumbState, BreadcrumbItem } from './breadcrumb.state';
import { BreadcrumbService } from './breadcrumb.service';
import { DEFAULT_DASHBAORD_BREADCRUMB_ITEM } from '../../../../tests/mocks/breadcrumb';

describe('Service: BREADCRUMB', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        NgxsModule.forRoot([BreadcrumbState]),
        NgxsDispatchPluginModule.forRoot()
      ],
      providers: [BreadcrumbService]
    });

    jest.spyOn(console, 'warn').mockImplementation(() => undefined);
  });

  it('should update breadcrumb stack on state on push new items', done => {
    const BREADCRUMB_ITEM_1_MOCK: BreadcrumbItem = {
      route: '/test1',
      text: 'test1'
    };

    const BREADCRUMB_ITEM_2_MOCK: BreadcrumbItem = {
      route: '/test2',
      text: 'test2'
    };

    const breadcrumbService: BreadcrumbService = TestBed.inject(
      BreadcrumbService
    );

    const { stack: stackPreUpdate } = breadcrumbService.getBreadcrumb();

    expect(stackPreUpdate).toEqual([DEFAULT_DASHBAORD_BREADCRUMB_ITEM]);

    breadcrumbService.pushBreadcrumbItem(BREADCRUMB_ITEM_1_MOCK);
    breadcrumbService.pushBreadcrumbItem(BREADCRUMB_ITEM_2_MOCK);

    const { stack: stackPostUpdate } = breadcrumbService.getBreadcrumb();

    expect(stackPostUpdate).toEqual([
      DEFAULT_DASHBAORD_BREADCRUMB_ITEM,
      BREADCRUMB_ITEM_1_MOCK,
      BREADCRUMB_ITEM_2_MOCK
    ]);

    breadcrumbService.stack$.subscribe(stackUpdated => {
      expect(stackUpdated).toEqual([
        DEFAULT_DASHBAORD_BREADCRUMB_ITEM,
        BREADCRUMB_ITEM_1_MOCK,
        BREADCRUMB_ITEM_2_MOCK
      ]);

      done();
    });
  });

  it('should clear state on calling clearStore', () => {
    const breadcrumbService: BreadcrumbService = TestBed.inject(
      BreadcrumbService
    );

    breadcrumbService.clearBreadcrumbStore();

    const { stack, isVisible } = breadcrumbService.getBreadcrumb();

    expect(stack).toEqual([DEFAULT_DASHBAORD_BREADCRUMB_ITEM]);
    expect(isVisible).toBeFalsy();
  });

  it('should update breadcrumb stack on state on pop', done => {
    const BREADCRUMB_ITEM_1_MOCK: BreadcrumbItem = {
      route: '/test1',
      text: 'test1'
    };

    const BREADCRUMB_ITEM_2_MOCK: BreadcrumbItem = {
      route: '/test2',
      text: 'test2'
    };

    const breadcrumbService: BreadcrumbService = TestBed.inject(
      BreadcrumbService
    );

    breadcrumbService.pushBreadcrumbItem(BREADCRUMB_ITEM_1_MOCK);
    breadcrumbService.pushBreadcrumbItem(BREADCRUMB_ITEM_2_MOCK);
    breadcrumbService.popBreadcrumbItem();

    const { stack: stackPostUpdate } = breadcrumbService.getBreadcrumb();

    expect(stackPostUpdate).toEqual([
      DEFAULT_DASHBAORD_BREADCRUMB_ITEM,
      BREADCRUMB_ITEM_1_MOCK
    ]);

    breadcrumbService.stack$.subscribe(stackUpdated => {
      expect(stackUpdated).toEqual([
        DEFAULT_DASHBAORD_BREADCRUMB_ITEM,
        BREADCRUMB_ITEM_1_MOCK
      ]);

      done();
    });
  });

  it('should update breadcrumb visibility on state when calling updateVisibility', done => {
    const breadcrumbService: BreadcrumbService = TestBed.inject(
      BreadcrumbService
    );

    const { isVisible: isVisiblePreUpdate } = breadcrumbService.getBreadcrumb();

    expect(isVisiblePreUpdate).toEqual(false);

    breadcrumbService.updateBreadcrumbVisibilityTo(true);

    const {
      isVisible: isVisiblePostUpdate
    } = breadcrumbService.getBreadcrumb();

    expect(isVisiblePostUpdate).toEqual(true);
    breadcrumbService.isVisible$.subscribe(isVisibleUpdated => {
      expect(isVisibleUpdated).toBeTruthy();

      done();
    });
  });

  it('should keep the stack with dashboard route even when poping it (stack length should keep at least 1)', () => {
    const breadcrumbService: BreadcrumbService = TestBed.inject(
      BreadcrumbService
    );

    breadcrumbService.popBreadcrumbItem();

    const { stack: stackPreUpdate } = breadcrumbService.getBreadcrumb();

    expect(stackPreUpdate).toEqual([DEFAULT_DASHBAORD_BREADCRUMB_ITEM]);

    breadcrumbService.popBreadcrumbItem();

    const { stack: stackPostUpdate } = breadcrumbService.getBreadcrumb();

    expect(stackPostUpdate).toEqual([DEFAULT_DASHBAORD_BREADCRUMB_ITEM]);
  });
});
