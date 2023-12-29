import { DatePipe } from '@angular/common';
import { DateFormatPipe } from './date-format.pipe';

describe('DateFormatPipe', () => {
  let datepipe: DatePipe;

  it('create an instance', () => {
    const pipe = new DateFormatPipe(new DatePipe('BR'));
    expect(pipe).toBeTruthy();
  });
});
