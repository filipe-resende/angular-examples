import { Component, Input } from "@angular/core";

@Component({
  selector: "app-fixed-notification",
  templateUrl: "fixed-notification.component.html",
  styleUrls: ["fixed-notification.component.scss"],
})
export class FixedNotificationComponent {
  @Input()
  public visible: boolean = false;

  @Input()
  public message: string = "";
}
