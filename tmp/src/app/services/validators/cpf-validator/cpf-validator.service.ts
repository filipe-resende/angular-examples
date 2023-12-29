/* eslint-disable eqeqeq */
/* eslint-disable radix */
/* eslint-disable no-plusplus */
/* eslint-disable no-param-reassign */
import { Injectable } from '@angular/core';
import { AlertModalService } from '../../alert-modal/alert-modal.service';

@Injectable({
  providedIn: 'root',
})
export class CpfValidatorService {
  constructor(private alertService: AlertModalService) {}

  evaluateCpf(value: string): boolean {
    value = value.replace('.', '');
    value = value.replace('.', '');
    value = value.replace('-', '');

    let Soma: number;
    let Resto: number;

    Soma = 0;

    if (value == '00000000000') {
      this.alertService.showAlertDanger(`CPF inválido`, '');
      return false;
    }

    for (let i = 1; i <= 9; i++) {
      Soma += parseInt(value.substring(i - 1, i)) * (11 - i);
    }

    Resto = (Soma * 10) % 11;

    if (Resto == 10 || Resto == 11) {
      Resto = 0;
    }

    if (Resto != parseInt(value.substring(9, 10))) {
      this.alertService.showAlertDanger(`CPF inválido`, '');
      return false;
    }

    Soma = 0;

    for (let i = 1; i <= 10; i++) {
      Soma += parseInt(value.substring(i - 1, i)) * (12 - i);
    }

    Resto = (Soma * 10) % 11;

    if (Resto == 10 || Resto == 11) {
      Resto = 0;
    }

    if (Resto != parseInt(value.substring(10, 11))) {
      this.alertService.showAlertDanger(`CPF inválido`, '');
      return false;
    }

    return true;
  }
}
