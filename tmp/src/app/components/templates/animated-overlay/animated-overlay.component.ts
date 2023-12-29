import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-animated-overlay',
  templateUrl: './animated-overlay.component.html',
  styleUrls: ['./animated-overlay.component.scss'],
})
export class AnimatedOverlayComponent {
  // em ms
  @Input()
  public animationTime = 75;

  // em ms
  @Input()
  public delay = 0;
}
