/* eslint-disable no-param-reassign */

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { FocalPoint } from '../../../shared/models/focal';
import { Driver } from '../../../shared/models/driver';

@Injectable({
  providedIn: 'root'
})
export class SmsService {
  private baseUriZenvia: string = environment.apiSmsZenvia.baseUri;

  private username: string = environment.apiSmsZenvia.username;

  private password: string = environment.apiSmsZenvia.password;

  private authHeader = 'dmFsZS5hbGVydGFiYXJyYWdlbnM6b3phcGlzME5VRg==';

  constructor(private http: HttpClient) {}

  public sendSmsList(listFocalPoints: FocalPoint[], message: string) {
    message = this.removeGraphicalAccents(message);
    const body = this.createRequestBodyList(listFocalPoints, message);
    const headers = new HttpHeaders({
      Authorization: `Basic ${this.authHeader}`, // authHeader,
      'Content-Type': 'application/json',
      Accept: 'application/json'
    });
    return this.http
      .post(`${this.baseUriZenvia}/send-sms-multiple`, body, {
        headers
      })
      .toPromise();
  }

  public sendDriverSmsList(listDrivers: Driver[], message: string) {
    message = this.removeGraphicalAccents(message);
    const body = this.createDriverRequestBodyList(listDrivers, message);
    const headers = new HttpHeaders({
      Authorization: `Basic ${this.authHeader}`, // authHeader,
      'Content-Type': 'application/json',
      Accept: 'application/json'
    });
    return this.http
      .post(`${this.baseUriZenvia}/send-sms-multiple`, body, {
        headers
      })
      .toPromise();
  }

  public sendSms(focal: FocalPoint) {
    const body = this.createRequestBody(focal);
    const authHeader = btoa(`${this.username}:${this.password}`);
    const headers = new HttpHeaders({
      Authorization: `Basic ${authHeader}`,
      'Content-Type': 'application/json',
      Accept: 'application/json'
    });
    return this.http
      .post(`${this.baseUriZenvia}/send-sms`, body, { headers })
      .toPromise();
  }

  public sendDriverSms(driver: Driver) {
    const body = this.createDriverRequestBody(driver);
    const authHeader = btoa(`${this.username}:${this.password}`);
    const headers = new HttpHeaders({
      Authorization: `Basic ${authHeader}`,
      'Content-Type': 'application/json',
      Accept: 'application/json'
    });
    return this.http
      .post(`${this.baseUriZenvia}/send-sms`, body, { headers })
      .toPromise();
  }

  public createRequestBodyList(
    listFocalPoints: FocalPoint[],
    message: string
  ): any {
    message = this.removeGraphicalAccents(message);
    const smsList = [];
    listFocalPoints.forEach(x => {
      if (x.phoneNumber !== undefined) {
        const phoneList: string[] = x.phoneNumber.split(',');
        phoneList.forEach(phone => {
          const sms = {
            from: 'Vale S/A',
            to: `55${phone}`,
            msg: message
          };
          smsList.push(sms);
        });
      }
    });
    const requestBody = {
      sendSmsMultiRequest: {
        sendSmsRequestList: smsList
      }
    };
    return requestBody;
  }

  public createDriverRequestBodyList(
    listDrivers: Driver[],
    message: string
  ): any {
    message = this.removeGraphicalAccents(message);
    const smsDriverList = [];
    listDrivers.forEach(x => {
      if (x.phoneNumber !== undefined) {
        const phoneList: string[] = x.phoneNumber.split(',');
        phoneList.forEach(phone => {
          const sms = {
            from: 'Vale S/A',
            to: `55${phone}`,
            msg: message
          };
          smsDriverList.push(sms);
        });
      }
    });
    const requestBody = {
      sendSmsMultiRequest: {
        sendSmsRequestList: smsDriverList
      }
    };
    return requestBody;
  }

  private createRequestBody(focal: FocalPoint) {
    let sms;

    if (focal.phoneNumber !== undefined) {
      const phoneList: string[] = focal.phoneNumber.split(',');
      phoneList.forEach(phone => {
        sms = {
          from: 'Vale S/A',
          to: `55${phone}`,
          msg: 'Por gentileza, dirija-se para o Ponto de Encontro.'
        };
      });
    }

    const requestBody = {
      sendSmsRequest: sms
    };

    return requestBody;
  }

  private createDriverRequestBody(driver: Driver) {
    let sms;

    if (driver.phoneNumber !== undefined) {
      const phoneList: string[] = driver.phoneNumber.split(',');
      phoneList.forEach(phone => {
        sms = {
          from: 'Vale S/A',
          to: `55${phone}`,
          msg: 'Por gentileza, dirija-se para o Ponto de Encontro.'
        };
      });
    }

    const requestBody = {
      sendSmsRequest: sms
    };

    return requestBody;
  }

  public removeGraphicalAccents(str) {
    const comAcento =
      'ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖØÙÚÛÜÝŔÞßàáâãäåæçèéêëìíîïðñòóôõöøùúûüýþÿŕ';

    const semAcento =
      'AAAAAAACEEEEIIIIDNOOOOOOUUUUYRsBaaaaaaaceeeeiiiionoooooouuuuybyr';

    let novastr = '';

    for (let i = 0; i < str.length; i++) {
      let troca = false;

      for (let a = 0; a < comAcento.length; a++) {
        if (str.substr(i, 1) === comAcento.substr(a, 1)) {
          novastr += semAcento.substr(a, 1);
          troca = true;
          break;
        }
      }

      if (troca === false) {
        novastr += str.substr(i, 1);
      }
    }
    return novastr;
  }
}
