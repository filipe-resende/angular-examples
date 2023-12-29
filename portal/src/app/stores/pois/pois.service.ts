import { Injectable } from "@angular/core";
import { Dispatch } from "@ngxs-labs/dispatch-decorator";
import { Select, Store } from "@ngxs/store";
import { Observable, Subscription } from "rxjs";
import { PoisState, PoisStateModel } from "./pois.state";
import { PointOfInterest } from "../../shared/models/poi";
import { UpdatePoisState, ClearPoisStore } from "./pois.actions";
import { PoiRepository } from "../../core/repositories/poi.repository";
import { Site } from "../../shared/models/site";
import { PoiCategory } from "../../shared/models/poi-category";
import { cloneObject } from "../../shared/utils/clone";

@Injectable({
  providedIn: "root",
})
export class PoisService {
  private poisSubscription: Subscription = new Subscription();
  private poisCategoriesSubscription: Subscription = new Subscription();

  @Select(PoisState.pois)
  public pois$: Observable<PointOfInterest[]>;

  @Select(PoisState.categories)
  public poisCategories$: Observable<PoiCategory[]>;

  constructor(private store: Store, private poiRepository: PoiRepository) {}

  public getStore() {
    return this.store.snapshot().pois as PoisStateModel;
  }

  @Dispatch()
  private updatePoisState(thingsStateModel: Partial<PoisStateModel>) {
    return new UpdatePoisState(thingsStateModel);
  }

  @Dispatch()
  public clearPoisStore() {
    this.unsubscribe();

    return new ClearPoisStore();
  }

  /**
   * Cria um novo ponto de interesse pela API e já acionia-o no STATE
   * @param poiToCreate ponto de interesse a ser criado
   */
  public create(poiToCreate: PointOfInterest): Promise<void> {
    const poiCreated = cloneObject(poiToCreate);

    return new Promise((resolve, reject) => {
      const onSuccessCallback = () => {
        const { pois } = this.getStore();

        pois.push(poiCreated);

        this.updatePoisState({ pois: [...pois] });

        resolve();
      };

      const onErrorCallback = (error) => {
        this.logRejectError(error);
        reject(error);
      };

      this.poiRepository.createPoi(poiToCreate).subscribe(onSuccessCallback, onErrorCallback);
    });
  }

  /**
   * Deleta tanto do STATE quanto do da API o ponto de interesse informado
   * @param poiToDelete ponto de interesse a ser removido
   */
  public delete(poiToDelete: PointOfInterest): Promise<void> {
    return new Promise((resolve, reject) => {
      const onSuccessCallback = (result) => {
        const { pois } = this.getStore();
        let poiToDeleteIndex: number = null;

        pois.forEach((poi, index) => {
          if (poi.id === poiToDelete.id) {
            poiToDeleteIndex = index;
          }
        });

        pois.splice(poiToDeleteIndex, 1);

        this.updatePoisState({ pois: [...pois] });

        resolve();
      };

      const onErrorCallback = (error) => {
        this.logRejectError(error);
        reject(error);
      };

      this.poiRepository.deletePoi(poiToDelete).subscribe(onSuccessCallback, onErrorCallback);
    });
  }

  /**
   * Atualiza o STATE de pontos de interesse com os pontos de interesse que estão contidos dentro do raio do site informado
   * @param site site usado de filtro para buscar os pontos de interesse
   */
  public syncPoisBySite(site: Site): Promise<void> {
    return new Promise((resolve, reject) => {
      const onSuccessCallback = (poisResponse: PointOfInterest[]) => {
        this.updatePoisState({ pois: poisResponse });
        resolve();
      };

      const onErrorCallback = (error) => {
        this.logRejectError(error);

        this.updatePoisState({ pois: [] });

        this.poisSubscription.unsubscribe();
        reject(error);
      };

      this.poisSubscription.unsubscribe();

      this.poisSubscription = this.poiRepository
        .listPoisByCoord(site.latitude, site.longitude, site.radius)
        .subscribe(onSuccessCallback, onErrorCallback);
    });
  }

  /**
   * Atualiza as categorias dos pontos de interesse no STATE
   */
  public syncPoisCategories(): Promise<void> {
    return new Promise((resolve, reject) => {
      const onSuccessCallback = (result) => {
        this.updatePoisState({ poisCategories: result });
        resolve();
      };

      const onErrorCallback = (error) => {
        this.logRejectError(error);

        this.updatePoisState({ pois: [] });

        this.poisCategoriesSubscription.unsubscribe();
        reject(error);
      };

      this.poisCategoriesSubscription.unsubscribe();

      this.poisCategoriesSubscription = this.poiRepository
        .listPoisCategorys()
        .subscribe(onSuccessCallback, onErrorCallback);
    });
  }

  /**
   * unsubscribe todos observables para cancelar os requests das apis
   */
  public unsubscribe() {
    this.poisSubscription.unsubscribe();
    this.poisCategoriesSubscription.unsubscribe();
  }

  private logRejectError(error) {
    console.warn("%c [POIS SERVICE]:", "color: red");
    console.warn(error);
  }
}
