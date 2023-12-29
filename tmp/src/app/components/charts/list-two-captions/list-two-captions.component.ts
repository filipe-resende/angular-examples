import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-list-two-captions',
  templateUrl: './list-two-captions.component.html',
  styleUrls: ['./list-two-captions.component.scss'],
})
export class ListTwoCaptionsComponent implements OnInit {
  @Input()
  image: string[];

  @Input()
  data: any[];

  @Input()
  selectedApplication = '';

  public imagePathFolder = '../../../../assets/iconsDashboard/';

  public firstIconPath: string;

  public secondIconPath: string;

  ngOnInit(): void {
    this.firstIconPath = `${this.imagePathFolder}${this.image[0]}`;
    this.secondIconPath = `${this.imagePathFolder}${this.image[1]}`;
  }
}
