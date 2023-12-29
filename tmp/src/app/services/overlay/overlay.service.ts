import { Injectable, OnDestroy, ComponentRef } from '@angular/core';
import {
  Overlay,
  OverlayPositionBuilder,
  OverlayRef,
  ConnectedPosition,
  FlexibleConnectedPositionStrategyOrigin,
} from '@angular/cdk/overlay';
import { Subscription } from 'rxjs';
import { ComponentPortal, ComponentType } from '@angular/cdk/portal';

@Injectable({
  providedIn: 'root',
})
export class OverlayService implements OnDestroy {
  private subscriptions: Subscription[] = [];

  constructor(
    private overlay: Overlay,
    private overlayPositionBuilder: OverlayPositionBuilder,
  ) {}

  public ngOnDestroy(): void {
    if (this.subscriptions.length)
      this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  public create(): OverlayRef {
    const overlayRef = this.overlay.create({
      hasBackdrop: true,
      backdropClass: 'cdk-overlay-transparent-backdrop',
    });

    this.setupOverlaySub(overlayRef);

    return overlayRef;
  }

  private setupOverlaySub(overlayRef: OverlayRef): void {
    const overlayRefSub = overlayRef
      .backdropClick()
      .subscribe(() => overlayRef.detach());

    this.subscriptions.push(overlayRefSub);
  }

  public open<T>(
    overlayRef: OverlayRef,
    DOMElementToAttach: FlexibleConnectedPositionStrategyOrigin,
    componentClass: ComponentType<T>,
    options?: ConnectedPosition,
    customParams?: Record<string, unknown>,
  ): void {
    const overlayPosition = this.overlayPositionBuilder
      .flexibleConnectedTo(DOMElementToAttach)
      .withPositions(
        options
          ? [options]
          : [
              {
                originX: 'center',
                originY: 'top',
                overlayX: 'center',
                overlayY: 'top',
                offsetY: 0,
                offsetX: 0,
              },
            ],
      );

    const portal = new ComponentPortal<T>(componentClass);

    overlayRef.updatePositionStrategy(overlayPosition);

    const portalRef = overlayRef.attach(portal) as any;

    if (customParams) {
      Object.entries(customParams).forEach(([key, value]) => {
        portalRef.instance[key] = value;
      });
    }

    portalRef.instance.overlayRef = overlayRef;
    portalRef.instance.target = DOMElementToAttach;
  }
}
