import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalService {
  constructor(protected httpClient: HttpClient) {}

  public async getMapIcons(): Promise<any> {
    const uri = '/assets/mapicons.json';
    return await this.httpClient.get<any>(uri).toPromise();
  }
}
