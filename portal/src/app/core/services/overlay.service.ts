import { Injectable, OnDestroy, ElementRef } from '@angular/core';
import {
  Overlay,
  OverlayPositionBuilder,
  OverlayRef,
  ConnectedPosition,
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
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  /**
   * Instancia um novo overlay
   */
  public create(): OverlayRef {
    const overlayRef = this.overlay.create({
      hasBackdrop: true,
      backdropClass: 'cdk-overlay-transparent-backdrop',
    });

    const overlayRef$ = overlayRef
      .backdropClick()
      .subscribe(() => overlayRef.detach());

    this.subscriptions.push(overlayRef$);

    return overlayRef;
  }

  /**
   * Abre o overlay que foi criado previamente
   * @param overlayRef referencia do overlay que foi criado
   * @param DOMElementToAttach referência para o elemento do DOM ao qual o overlay será acoplado
   * @param componentClass nome da Classe que deve ser instanciada ao criar o novo overlay. e.g.: OverlayInfoComponent
   * @param options parâmetros para posicionamento. default: { originX: "center", originY: "top", overlayX: "center", overlayY: "top" }
   * @param customParams parâmetros para enviar para o componente criado dentro do overlay
   */
  public open<T>(
    overlayRef: OverlayRef,
    DOMElementToAttach: ElementRef,
    componentClass: ComponentType<T>,
    options?: ConnectedPosition,
    customParams?: any,
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

    const portalRef: any = overlayRef.attach(portal);

    if (customParams) {
      Object.entries(customParams).forEach(([key, value]) => {
        portalRef.instance[key] = value;
      });
    }

    portalRef.instance.overlayRef = overlayRef;
    portalRef.instance.target = DOMElementToAttach;
  }
}
