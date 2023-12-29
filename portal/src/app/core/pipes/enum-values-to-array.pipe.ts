import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'enumKeysToArray',
})
export class EnumKeysToArrayPipe implements PipeTransform {
  transform(data: any): unknown {
    return Object.keys(data);
  }
}
