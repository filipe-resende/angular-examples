import { TestBed } from '@angular/core/testing';
import { NgxsModule } from '@ngxs/store';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NgxsDispatchPluginModule } from '@ngxs-labs/dispatch-decorator';
import { Observable } from 'rxjs';
import { SitesState } from './sites.state';
import { SitesService } from './sites.service';
import { Type, Site } from '../../shared/models/site';
import { SiteRepository } from '../../core/repositories/site.repository';
import { DEFAULT_SITE_MOCK } from '../../../../tests/mocks/site';
import { SiteAsCountry, SiteAsUnit } from '../../shared/models/siteAsCountry';

describe('Service: SITES', () => {
  let siteRepository: SiteRepository;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        NgxsModule.forRoot([SitesState]),
        NgxsDispatchPluginModule.forRoot()
      ],
      providers: [SitesService]
    });

    siteRepository = TestBed.inject(SiteRepository);

    jest.spyOn(console, 'warn').mockImplementation(() => undefined);
  });

  xit('should update sites on sync', done => {
    const SITES_MOCK: SiteAsCountry[] = [
      {
        name: 'country',
        latitude: 15,
        longitude: -20,
        radius: 10,
        zoom: 1,
        id: '2',
        createdAt: new Date(),
        createdBy: '',
        lastUpdatedAt: new Date(),
        lastUpdatedBy: '',
        status: true,
        states: [
          {
            name: 'state',
            latitude: 15,
            longitude: -20,
            radius: 10,
            zoom: 1,
            id: '2',
            createdAt: new Date(),
            createdBy: '',
            lastUpdatedAt: new Date(),
            lastUpdatedBy: '',
            status: true,
            units: [
              {
                name: 'site 1',
                latitude: 15,
                longitude: -20,
                radius: 10,
                zoom: 1,
                id: '1',
                createdAt: new Date(),
                createdBy: '',
                lastUpdatedAt: new Date(),
                lastUpdatedBy: '',
                status: true
              }
            ]
          }
        ]
      }
    ];

    const sitesService: SitesService = TestBed.inject(SitesService);

    const listSitesByFilterMock = jest
      .spyOn(siteRepository, 'listAllSitesAsTree')
      .mockReturnValue(
        new Observable(observer => {
          observer.next(SITES_MOCK);
          observer.complete();
        })
      );

    sitesService.syncSites();

    const sitesServicePrototype = Object.getPrototypeOf(sitesService);
    const sitesMockMapped = sitesServicePrototype.mapSiteAsCountryListToSitesModelList(
      SITES_MOCK
    );

    // sync site by vale and state in the same method.
    expect(listSitesByFilterMock).toHaveBeenCalledTimes(1);

    sitesService.sites$.subscribe(sites => {
      expect(sites).toEqual(sitesMockMapped);

      done();
    });
  });

  xit('should update selectedSiteByVale state when calling updateSelectedSiteByVale', done => {
    const SITE_BY_VALE_MOCK: Site = {
      ...DEFAULT_SITE_MOCK,
      type: Type.Vale
    };

    const sitesService: SitesService = TestBed.inject(SitesService);

    const selectedSiteByValePreUpdate = sitesService.getSelectedSite();
    expect(selectedSiteByValePreUpdate).toEqual(null);

    sitesService.updateSelectedSiteModel({ site: SITE_BY_VALE_MOCK });

    const selectedSiteByValePostUpdate = sitesService.getSelectedSite();
    expect(selectedSiteByValePostUpdate).toEqual(SITE_BY_VALE_MOCK);

    sitesService.selectedSite$.subscribe(selectedSite => {
      expect(selectedSite).toEqual(SITE_BY_VALE_MOCK);

      done();
    });
  });

  xit('should update selectedSiteByState state when calling updateSelectedSiteByState', done => {
    const SITE_BY_STATE_MOCK: Site = {
      ...DEFAULT_SITE_MOCK,
      type: Type.Estado
    };

    const sitesService: SitesService = TestBed.inject(SitesService);

    const selectedSiteByStatePreUpdate = sitesService.getSelectedSite();
    expect(selectedSiteByStatePreUpdate).toEqual(null);

    sitesService.updateSelectedSiteModel({ site: SITE_BY_STATE_MOCK });

    const selectedSiteByStatePostUpdate = sitesService.getSelectedSite();
    expect(selectedSiteByStatePostUpdate).toEqual(SITE_BY_STATE_MOCK);

    sitesService.selectedSite$.subscribe(selectedSite => {
      expect(selectedSite).toEqual(SITE_BY_STATE_MOCK);

      done();
    });
  });

  xit('should empty state values on state clear', done => {
    const sitesService: SitesService = TestBed.inject(SitesService);

    sitesService.syncSites();
    sitesService.updateSelectedSiteModel({ site: DEFAULT_SITE_MOCK });
    sitesService.clearSitesStore();

    /**
     * syncSites depende do subscribe, então para garantir que nao ira quebrar
     * dependendo da velocidade da cpu do pc que executar
     */
    setTimeout(() => {
      const { selectedSite, sites } = sitesService.getStore();

      expect(selectedSite).toEqual(null);
      expect(sites).toEqual([]);

      done();
    }, 400);
  });
});
