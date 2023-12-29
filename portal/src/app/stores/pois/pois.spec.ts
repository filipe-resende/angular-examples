import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NgxsModule } from '@ngxs/store';
import { NgxsDispatchPluginModule } from '@ngxs-labs/dispatch-decorator';
import { PoiRepository } from '../../core/repositories/poi.repository';
import { PoisService } from './pois.service';
import { PoisState } from './pois.state';

describe('Service: POIS', () => {
  let poiRepository: PoiRepository;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        NgxsModule.forRoot([PoisState]),
        NgxsDispatchPluginModule.forRoot()
      ],
      providers: [PoiRepository, PoisService]
    });

    poiRepository = TestBed.inject(PoiRepository);

    jest.spyOn(console, 'warn').mockImplementation(() => undefined);
  });

  it('', done => {
    done();
  });
});
