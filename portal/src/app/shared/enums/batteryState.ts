export enum BatteryState {
  Low = "LOW",
  Medium = "MEDIUM",
  Good = "GOOD",
  Unknown = "UNKNOWN",
}

export function getBatteryState(stateAsString: string): BatteryState {
  switch (stateAsString) {
    case "LOW":
      return BatteryState.Low;
    case "MEDIUM":
      return BatteryState.Medium;
    case "GOOD":
      return BatteryState.Good;
    default:
      return BatteryState.Unknown;
  }
}
