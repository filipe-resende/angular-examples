import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { SidenavItem } from './item/item.model';

@Injectable()
export class SidenavService {
  public languageChange: Subject<string> = new Subject<string>();

  public isIconSidenav: boolean;

  public _itemsSubject: BehaviorSubject<SidenavItem[]> = new BehaviorSubject<
    SidenavItem[]
  >([]);

  public items$: Observable<SidenavItem[]> = this._itemsSubject.asObservable();

  public profileItems: SidenavItem[] = [];

  private _items: SidenavItem[] = [];
  // public items$: Observable<SidenavItem[]> = this._itemsSubject.asObservable();

  private _currentlyOpenSubject: BehaviorSubject<SidenavItem[]> =
    new BehaviorSubject<SidenavItem[]>([]);

  private _currentlyOpen: SidenavItem[] = [];
  // private currentlyOpen$: Observable<SidenavItem[]> = this._currentlyOpenSubject.asObservable();

  constructor(private translate: TranslateService) {
    this.generateMenu(this.translate.currentLang);
  }

  public generateMenu(language: string) {
    this._items = [];
    // let sideTitles: any = [];
    this.translate.get(['SIDEBAR']).subscribe(res => {
      // sideTitles = res.SIDEBAR;

      // const dashboard = this.addItem("Dashboard", "dashboard", "/dashboard", 1);
      // // const list = this.addItem('Lista', 'assignment', '/list', 1);
      // const historic = this.addItem("Mapa", "map", "/historic", 1);
      // const fence = this.addItem("Cercas Virtuais", "filter_center_focus", "/fence", 1);
      // const poi = this.addItem("Pontos de Interesse", "place", "/poi", 1);

      // const list = this.addItem('Lista', 'assignment', null, 1);
      // this.addSubItem(list, 'Pessoas', '/list/people', 1);
      // this.addSubItem(list, 'Onibus ', /list/bus, 1);

      const list = this.addItem('Lista', 'assignment', null, 3);
      this.addSubItem(list, 'Pessoas', '/list', 1);
      this.addSubItem(list, 'Deslocamento', '/displacement', 1);

      // const profile = this.addItem(this.auth.userName, 'person', null, 1);
      // this.addSubItem(profile, sideTitles.SETTINGS_TEXT, '/pages/settings/redirect', 1);
      // this.addSubItem(profile, sideTitles.LOGOUT_TEXT, '/pages/logout/redirect', 2);

      // // Remove from main navigation menu
      // this.removeItem(profile);

      // this.profileItems = [];
      // this.profileItems.push(profile);
      this.languageChange.next('');
    });
  }

  public addItem(
    name: string,
    icon: string,
    route: any,
    position: number,
    badge?: string,
    badgeColor?: string,
    customClass?: string
  ) {
    const item = new SidenavItem({
      name,
      icon,
      route,
      subItems: [],
      position: position || 99,
      badge: badge || null,
      badgeColor: badgeColor || null,
      customClass: customClass || null
    });

    this._items.push(item);
    this._itemsSubject.next(this._items);

    return item;
  }

  public addSubItem(
    parent: SidenavItem,
    name: string,
    route: any,
    position: number,
    icon = ''
  ) {
    const item = new SidenavItem({
      name,
      route,
      parent,
      icon,
      subItems: [],
      position: position || 99
    });

    parent.subItems.push(item);
    this._itemsSubject.next(this._items);

    return item;
  }

  public removeItem(item: SidenavItem) {
    const index = this._items.indexOf(item);

    if (index > -1) {
      this._items.splice(index, 1);
    }

    this._itemsSubject.next(this._items);
  }

  public isOpen(item: SidenavItem) {
    return this._currentlyOpen.indexOf(item) !== -1;
  }

  public toggleCurrentlyOpen(item: SidenavItem) {
    let currentlyOpen = this._currentlyOpen;

    if (this.isOpen(item)) {
      if (currentlyOpen.length > 1) {
        currentlyOpen.length = this._currentlyOpen.indexOf(item);
      } else {
        currentlyOpen = [];
      }
    } else {
      currentlyOpen = this.getAllParents(item);
    }

    this._currentlyOpen = currentlyOpen;
    this._currentlyOpenSubject.next(currentlyOpen);
  }

  public getAllParents(item: SidenavItem, currentlyOpen: SidenavItem[] = []) {
    currentlyOpen.unshift(item);

    if (item.hasParent()) {
      return this.getAllParents(item.parent, currentlyOpen);
    }
    return currentlyOpen;
  }

  public nextCurrentlyOpen(currentlyOpen: SidenavItem[]) {
    this._currentlyOpen = currentlyOpen;
    this._currentlyOpenSubject.next(currentlyOpen);
  }

  public nextCurrentlyOpenByRoute(route: string) {
    // const currentlyOpen = [];
    // const item = this.findByRouteRecursive(route, this._items);
    // if (item && item.hasParent()) {
    //   currentlyOpen = this.getAllParents(item);
    // } else if (item) {
    //   currentlyOpen = [item];
    // }
    //
    // this.nextCurrentlyOpen(currentlyOpen);
  }

  public findByRouteRecursive(route: string, collection: SidenavItem[]) {
    let result = collection.filter(item => {
      if (item.route === route) {
        return item;
      }
    });

    if (!result) {
      collection.forEach(item => {
        if (item.hasSubItems()) {
          const found = this.findByRouteRecursive(route, item.subItems);

          if (found) {
            result = found;
            return false;
          }
        }
      });
    }

    return result;
  }

  get currentlyOpen() {
    return this._currentlyOpen;
  }

  public getSidenavItemByRoute(route) {
    return this.findByRouteRecursive(route, this._items);
  }
}
