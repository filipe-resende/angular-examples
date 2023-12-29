import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-placeholder',
  templateUrl: './placeholder.component.html',
  styleUrls: ['./placeholder.component.scss']
})
export class PlaceholderComponent implements OnInit {
  constructor() {
    //
  }

  public ngOnInit() {
    //
  }

  public onActivate(event, scrollContainer) {
    scrollContainer.scrollTop = 0;
  }
}
