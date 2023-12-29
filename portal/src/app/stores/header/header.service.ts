import { Injectable } from '@angular/core';
import { Dispatch } from '@ngxs-labs/dispatch-decorator';
import { Select, Store } from '@ngxs/store';
import { Observable, Subject } from 'rxjs';
import { HeaderState, HeaderSearchbar, HeaderStateModel } from './header.state';
import { UpdateSearchbar, ClearHeaderStore } from './header.actions';

@Injectable({
  providedIn: 'root',
})
export class HeaderService {
  @Select(HeaderState.searchbar)
  public searchbar$: Observable<HeaderSearchbar>;

  public onSearchbarIconClick$ = new Subject();

  constructor(private store: Store) {}

  public getStore(): HeaderStateModel {
    return this.store.snapshot().header as HeaderStateModel;
  }

  /**
   * Atualiza o STATE da searchbar
   */
  @Dispatch()
  public updateSearchbar(
    updatedSearchbar: Partial<HeaderSearchbar>,
  ): UpdateSearchbar {
    return new UpdateSearchbar(updatedSearchbar);
  }

  /**
   * Altera a visibilidade da searchbar no header da aplicação
   */
  @Dispatch()
  public updateSearchbarVisibilityTo(isVisible: boolean): UpdateSearchbar {
    return new UpdateSearchbar({ isVisible });
  }

  /**
   * Limpa todo o STATE
   */
  @Dispatch()
  public clearHeaderStore(): ClearHeaderStore {
    return new ClearHeaderStore();
  }

  /**
   * Obtém o valor digitado atual na searchbar
   */
  public getSearchbarText(): string {
    return this.getStore().searchbar.text;
  }

  /**
   * Dispara o evento do observable onSearchbarIconClick$ para saber que a ícone de busca da searchbar foi clicado
   */
  public onSearchbarIconClick(): void {
    this.onSearchbarIconClick$.next();
  }
}
