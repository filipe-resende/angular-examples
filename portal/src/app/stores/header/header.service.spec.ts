import { TestBed } from '@angular/core/testing';
import { NgxsModule } from '@ngxs/store';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NgxsDispatchPluginModule } from '@ngxs-labs/dispatch-decorator';
import { HeaderState } from './header.state';
import { HeaderService } from './header.service';

describe('Service: HEADER', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        NgxsModule.forRoot([HeaderState]),
        NgxsDispatchPluginModule.forRoot()
      ],
      providers: [HeaderService]
    });

    jest.spyOn(console, 'warn').mockImplementation(() => undefined);
  });

  it('should update searchbar visibility when calling updateVisibility', done => {
    const headerService: HeaderService = TestBed.inject(HeaderService);

    const {
      searchbar: { isVisible: isVisiblePreUpdate }
    } = headerService.getStore();

    expect(isVisiblePreUpdate).toBeFalsy();

    headerService.updateSearchbarVisibilityTo(true);

    const {
      searchbar: { isVisible: isVisiblePostUpdate }
    } = headerService.getStore();

    expect(isVisiblePostUpdate).toBeTruthy();

    headerService.searchbar$.subscribe(({ isVisible }) => {
      expect(isVisible).toBeTruthy();

      done();
    });
  });

  it('should update searchbar text and placeholder when calling updateSearchbar', done => {
    const SEARCHBAR_MOCK = {
      placeholder: 'placeholder',
      text: 'text'
    };

    const headerService: HeaderService = TestBed.inject(HeaderService);

    const {
      searchbar: { placeholder: placeholderPreUpdate, text: textPreUpdate }
    } = headerService.getStore();

    expect(placeholderPreUpdate).toEqual('');
    expect(textPreUpdate).toEqual('');

    headerService.updateSearchbar(SEARCHBAR_MOCK);

    const {
      searchbar: { placeholder: placeholderPostUpdate, text: textPostUpdate }
    } = headerService.getStore();

    const searchbarTextObtainedByGetter = headerService.getSearchbarText();

    expect(placeholderPostUpdate).toEqual(SEARCHBAR_MOCK.placeholder);
    expect(textPostUpdate).toEqual(SEARCHBAR_MOCK.text);
    expect(searchbarTextObtainedByGetter).toEqual(SEARCHBAR_MOCK.text);

    headerService.searchbar$.subscribe(({ text, placeholder }) => {
      expect(text).toEqual(SEARCHBAR_MOCK.text);
      expect(placeholder).toEqual(SEARCHBAR_MOCK.placeholder);

      done();
    });
  });

  it('should clear state when calling clearStore', done => {
    const SEARCHBAR_MOCK = {
      placeholder: 'placeholder',
      text: 'text'
    };

    const headerService: HeaderService = TestBed.inject(HeaderService);

    headerService.updateSearchbar(SEARCHBAR_MOCK);
    headerService.updateSearchbarVisibilityTo(true);
    headerService.clearHeaderStore();

    const {
      searchbar: {
        placeholder: placeholderPostUpdate,
        text: textPostUpdate,
        isVisible
      }
    } = headerService.getStore();

    const searchbarTextObtainedByGetter = headerService.getSearchbarText();

    expect(placeholderPostUpdate).toEqual('');
    expect(textPostUpdate).toEqual('');
    expect(searchbarTextObtainedByGetter).toEqual('');
    expect(isVisible).toBeFalsy();

    headerService.searchbar$.subscribe(({ text, placeholder }) => {
      expect(text).toEqual('');
      expect(placeholder).toEqual('');

      done();
    });
  });

  it('should trigger onSearchbarIconClick$ observable on searchbar icon click', done => {
    const headerService: HeaderService = TestBed.inject(HeaderService);

    headerService.onSearchbarIconClick$.subscribe(() => {
      // will accept test if done is called. Which means the trigger of iconClick was successfully fired.
      done();
    });

    headerService.onSearchbarIconClick();
  });
});
