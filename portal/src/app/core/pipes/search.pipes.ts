import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'search'
})
export class SearchPipe implements PipeTransform {
  public transform(value, keys: string, term: string) {
    if (term == null) {
      return '';
    }

    if (!term) {
      term = term.toUpperCase();
      return value;
    }
    return (value || []).filter(item =>
      keys
        .split(',')
        .some(
          key =>
            item.hasOwnProperty(key) && new RegExp(term, 'gi').test(item[key])
        )
    );
  }
}
