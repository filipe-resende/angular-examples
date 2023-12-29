import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-bus-plates-search-selector',
  templateUrl: './bus-plates-search-selector.component.html',
  styleUrls: ['./bus-plates-search-selector.component.scss']
})
export class BusPlatesSearchSelectorComponent {
  @Output() displayTripSearch = new EventEmitter();

  public DefaultSearch = 'trips';

  public searchTypeSelector(changedSearch: boolean): void {
    this.displayTripSearch.emit(changedSearch);
  }
}
