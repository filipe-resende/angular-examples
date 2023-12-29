import { Component, Input } from "@angular/core";

export enum MessageType {
  alert = "alert",
  info = "info",
}

@Component({
  selector: "app-message",
  templateUrl: "message.component.html",
  styleUrls: ["message.component.scss"],
})
export class MessageComponent {
  @Input()
  public type: MessageType = MessageType.info;

  @Input()
  public hideIcon: boolean = false;
}
