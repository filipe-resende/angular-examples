import { Injectable } from '@angular/core';
import { SourceInfos } from 'src/app/model/things-interfaces';

@Injectable({
  providedIn: 'root',
})
export class SourceInfosValidatorService {
  private sourceTypeValidation(value: string): boolean {
    return !(value.length > 40);
  }

  validateSourceInfos(list: SourceInfos[]) {
    const isAllValid = list.map(el => this.sourceTypeValidation(el.value));
    return !!isAllValid.includes(false);
  }
}
