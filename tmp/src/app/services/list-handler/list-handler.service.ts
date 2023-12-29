/* eslint-disable no-restricted-syntax */
import { Injectable } from '@angular/core';
import { DeviceTypeList } from '../../model/devices-interfaces';

@Injectable({
  providedIn: 'root',
})
export class ListHandlerService {
  listAllTypes(list) {
    const newList = list.map(deviceItem =>
      deviceItem.device.sourceInfos.map((item: DeviceTypeList) => item.type),
    );

    let deviceTypes = [];

    for (const element of newList) {
      deviceTypes = [...deviceTypes, ...element];
    }

    return deviceTypes.filter(
      (element, index) => deviceTypes.indexOf(element) === index,
    );
  }

  alphabeticalOrder(list: any) {
    const names = list.map(element => element.name).sort();
    return names.map(name => list.filter(item => item.name === name)[0]);
  }

  distinct(list) {
    return [...new Set(list)];
  }
}
