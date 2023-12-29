import { Component, EventEmitter, Input, Output } from "@angular/core";

@Component({
  selector: "app-comments-section",
  templateUrl: "comments-section.component.html",
  styleUrls: ["./comments-section.component.scss"],
})
export class CommentsSectionComponent {
  @Input()
  public comments: Array<{
    text: string;
    date: Date;
    author: string;
    isNew?: boolean;
  }> = [];

  @Input()
  public iconName: string;

  @Input()
  public iconTolltipDescription: string;

  @Output()
  public onGetElementReference = new EventEmitter<HTMLElement>();

  @Output()
  public onClick = new EventEmitter();

  public commentReferenceEmmiter(element: HTMLElement) {
    this.onGetElementReference.emit(element);
  }

  public onClickEmitter(event) {
    this.onClick.emit(event);
  }
}
