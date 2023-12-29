import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-animated-overlay',
  templateUrl: 'animated-overlay.template.html',
  styleUrls: ['animated-overlay.template.scss'],
})
export class AnimatedOverlayComponent {
  // em ms
  @Input()
  public animationTime = 75;

  // em ms
  @Input()
  public delay = 0;
}
