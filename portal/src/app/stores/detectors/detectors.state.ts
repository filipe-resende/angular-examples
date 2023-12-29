import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { tap } from 'rxjs/operators';
import { DetectorsRepository } from '../../core/repositories/detectors.repository';
import { Detector } from '../../shared/models/Detector';
import { UpdateDetectors } from './detectors.actions';

export interface DetectorsStateModel {
  detectors: Detector[];
}

const INITIAL_STATE = {
  detectors: [],
};

type DetectorsStateContext = StateContext<DetectorsStateModel>;

@Injectable({ providedIn: 'root' })
@State<DetectorsStateModel>({
  name: 'detectors',
  defaults: INITIAL_STATE,
})
export class DetectorsState {
  @Selector()
  public static detectors({ detectors }: DetectorsStateModel) {
    return detectors;
  }

  constructor(private detectorsRepository: DetectorsRepository) {}

  @Action(UpdateDetectors)
  updateDetectors(
    { patchState }: DetectorsStateContext,
    { latitude, longitude, radius }: UpdateDetectors,
  ) {
    return this.detectorsRepository
      .getAllDetectorsOnRadius(latitude, longitude, radius)
      .pipe(tap(detectors => patchState({ detectors })));
  }
}
