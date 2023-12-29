import { Component } from "@angular/core";
import { MsalService } from "@azure/msal-angular";
import { MessageType } from "../../components/presentational/message/message.component";

@Component({
  selector: "app-forbidden",
  templateUrl: "./forbidden.page.html",
  styleUrls: ["./forbidden.page.scss"],
})
export class ForbiddenPage {
  public messageType: MessageType = MessageType.alert;

  constructor(private authService: MsalService) {}

  public disconnect() {
    this.authService.logout();
  }
}
