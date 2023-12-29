export class SiteAsUnit {
  public name: string;
  public latitude: number;
  public longitude: number;
  public zoom: number;
  public radius: number;
  public id: string;
  public createdAt: Date;
  public lastUpdatedAt: Date;
  public createdBy: string;
  public lastUpdatedBy: string;
  public status: boolean;
  public code: number;
}

export class SiteAsCountry extends SiteAsUnit {
  public states: SiteAsState[];
}

export class SiteAsState extends SiteAsUnit {
  public units: SiteAsUnit[];
}
