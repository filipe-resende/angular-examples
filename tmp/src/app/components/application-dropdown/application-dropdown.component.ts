import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ListHandlerService } from 'src/app/services/list-handler/list-handler.service';

@Component({
  selector: 'app-application-dropdown',
  templateUrl: 'application-dropdown.component.html',
  styleUrls: ['application-dropdown.component.scss'],
})
export class ApplicationDropdownComponent implements OnInit {
  @Input() applicationList = [];

  @Input() ngClass: string;

  @Output() select = new EventEmitter();

  @Input() wider = false;

  @Input() selectedDropdown: any;

  public allApplications = '';

  public setValue: any;

  public findTheSetValue: any;

  constructor(private listHandler: ListHandlerService) {}

  ngOnInit() {
    this.listHandler.alphabeticalOrder(this.applicationList);
  }

  onSelect(event) {
    this.select.emit(event.target.value);
  }
}
