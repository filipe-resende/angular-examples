export class UpdateDetectors {
  public static readonly type = '[DETECTORS] UpdateDetectors';

  constructor(
    public latitude: number,
    public longitude: number,
    public radius: number,
  ) {}
}
