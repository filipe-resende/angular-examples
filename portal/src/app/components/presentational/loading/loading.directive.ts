import { Directive } from '@angular/core';

@Directive({
  selector: '[appLoading]',
  exportAs: 'appLoading'
})
export class LoadingDirective {
  constructor() {
    //
  }
}
