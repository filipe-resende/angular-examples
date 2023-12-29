import { AnyType } from '../types/shared-types';

// eslint-disable-next-line no-shadow
export enum BatteryState {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  GOOD = 'GOOD',
  UNKNOWN = 'UNKNOWN',
}

export function getBatteryState(percentOrState: AnyType): BatteryState {
  if (Number.isNaN(Number(percentOrState))) {
    const state = percentOrState.toString().toLocaleUpperCase();

    if ([BatteryState.LOW, BatteryState.GOOD].includes(state)) {
      return BatteryState[state];
    }
  } else {
    const percent = Number(percentOrState);

    if (percent <= 100 && percent >= 50) {
      return BatteryState.GOOD;
    }

    if (percent < 50 && percent >= 25) {
      return BatteryState.MEDIUM;
    }

    if (percent < 25 && percent >= 0) {
      return BatteryState.LOW;
    }
  }

  return BatteryState.UNKNOWN;
}
