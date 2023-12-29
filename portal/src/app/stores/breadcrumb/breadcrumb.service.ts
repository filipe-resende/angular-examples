import { Injectable } from '@angular/core';
import { Dispatch } from '@ngxs-labs/dispatch-decorator';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import {
  BreadcrumbState,
  BreadcrumbItem,
  BreadcrumbStateModel,
} from './breadcrumb.state';
import {
  ClearBreadcrumbStore,
  PushBreadcrumbItem,
  PopBreadcrumbItem,
  UpdateBreadcrumbVisibility,
} from './breadcrumb.actions';

@Injectable({
  providedIn: 'root',
})
export class BreadcrumbService {
  @Select(BreadcrumbState.stack)
  public stack$: Observable<BreadcrumbItem[]>;

  @Select(BreadcrumbState.isVisible)
  public isVisible$: Observable<boolean>;

  constructor(private store: Store) {}

  private getStore() {
    return this.store.snapshot().breadcrumb as BreadcrumbStateModel;
  }

  /**
   * Adiciona um novo item na pilha de items do breadcrumb (aparecerá a direita e em negrito)
   */
  @Dispatch()
  public pushBreadcrumbItem(breadcrumbItem: BreadcrumbItem) {
    return new PushBreadcrumbItem(breadcrumbItem);
  }

  /**
   * Remove o último elemento da pilha da items do breadcrumb
   */
  @Dispatch()
  public popBreadcrumbItem() {
    return new PopBreadcrumbItem();
  }

  /**
   * Altera a visibilidade do componente de breadcrumb
   */
  @Dispatch()
  public updateBreadcrumbVisibilityTo(isVisible: boolean) {
    return new UpdateBreadcrumbVisibility(isVisible);
  }

  /**
   * Limpa a pilha de items do breadcrumb
   */
  @Dispatch()
  public clearBreadcrumbStore() {
    return new ClearBreadcrumbStore();
  }

  /**
   * Retorna o STATE do breadcrumb
   */
  public getBreadcrumb() {
    return this.getStore();
  }
}
