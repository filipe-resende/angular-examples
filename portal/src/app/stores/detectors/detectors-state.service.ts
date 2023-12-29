import { Injectable } from '@angular/core';
import { Dispatch } from '@ngxs-labs/dispatch-decorator';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { Detector } from '../../shared/models/Detector';
import { UpdateDetectors } from './detectors.actions';
import { DetectorsState } from './detectors.state';

@Injectable({
  providedIn: 'root',
})
export class DetectorsStateService {
  @Select(DetectorsState.detectors)
  public detectors$: Observable<Detector[]>;

  @Dispatch()
  public updateDetectors(
    latitude: number,
    longitude: number,
    radius: number,
  ): UpdateDetectors {
    return new UpdateDetectors(latitude, longitude, radius);
  }
}
