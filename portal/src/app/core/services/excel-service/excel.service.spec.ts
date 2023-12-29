import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed, getTestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { NgxsDispatchPluginModule } from '@ngxs-labs/dispatch-decorator';
import { NgxsModule } from '@ngxs/store';
import { NotificationService } from '../../../components/presentational/notification';
import { ExportRepository } from '../../repositories/export.repository';
import { ExcelService } from './excel.service';
import { UserProfileService } from '../../../stores/user-profile/user-profile.service';
import { UserProfileState } from '../../../stores/user-profile/user-profile.state';
import { DEFAULT_USER_MOCK } from '../../../../../tests/mocks/user';

fdescribe('ExcelService', () => {
  let injector: TestBed;
  let excelService: ExcelService;
  let exportRepo: ExportRepository;
  let userProfileService: UserProfileService;

  beforeEach(() => {
    jest.mock('../../../components/presentational/notification');
    const notificationServiceMock =
      NotificationService as jest.Mock<NotificationService>;

    TestBed.configureTestingModule({
      providers: [
        ExcelService,
        ExportRepository,
        UserProfileService,
        { provide: NotificationService, useValue: notificationServiceMock }
      ],
      imports: [
        MatDialogModule,
        TranslateModule.forRoot(),
        HttpClientTestingModule,
        NgxsModule.forRoot([UserProfileState]),
        NgxsDispatchPluginModule.forRoot()
      ]
    });
  });

  beforeEach(() => {
    injector = getTestBed();
    excelService = TestBed.inject(ExcelService);
    excelService = TestBed.inject(ExcelService);
    exportRepo = TestBed.inject(ExportRepository);
    userProfileService = TestBed.inject(UserProfileService);
  });

  it(`should call ${ExportRepository.prototype.exportDevices}
  whenever ${ExcelService.prototype.exportDevicesAsExcelToLoggedUserEmail} gets called`, () => {
    userProfileService.setUserProfile(DEFAULT_USER_MOCK);

    const exportDevices = jest.spyOn(exportRepo, 'exportDevices');

    excelService.exportDevicesAsExcelToLoggedUserEmail({
      site: 'site',
      deviceType: 'deviceType',
      periodFrom: 'periodFrom',
      periodTo: 'periodTo'
    });

    expect(exportDevices).toHaveBeenCalled();
  });
});
