/* eslint-disable no-useless-escape */
import { FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';

export const checkIfAtLeastOneReceiverIsSelectedAndValid = (
  validator: ValidatorFn,
) => (group: FormGroup): ValidationErrors | null => {
  const hasAtLeastOne =
    group &&
    group.controls &&
    Object.keys(group.controls).some(k => !validator(group.controls[k]));
  return hasAtLeastOne ? null : { atLeastOne: true };
};

export const phoneRegEx = new RegExp(
  /^(?:(?:\+|00)?(55)\s?)?(?:\(?([1-9][0-9])\)?\s?)?(?:((?:9\d|[2-9])\d{3})\-?(\d{4}))$/,
);
