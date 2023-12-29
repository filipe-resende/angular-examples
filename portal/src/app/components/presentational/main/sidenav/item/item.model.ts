export class SidenavItem {
  public name: string;

  public icon: string;

  public route: any;

  public parent: SidenavItem;

  public subItems: SidenavItem[];

  public position: number;

  public badge: string;

  public badgeColor: string;

  public customClass: string;

  constructor(model: any = null) {
    if (model) {
      this.name = model.name;
      this.icon = model.icon;
      this.route = model.route;
      this.parent = model.parent;
      this.subItems = this.mapSubItems(model.subItems);
      this.position = model.position;
      this.badge = model.badge;
      this.badgeColor = model.badgeColor;
      this.customClass = model.customClass;
    }
  }

  public hasSubItems() {
    if (this.subItems) {
      return this.subItems.length > 0;
    }
    return false;
  }

  public hasParent() {
    return !!this.parent;
  }

  public mapSubItems(list: SidenavItem[]) {
    if (list) {
      list.forEach((item, index) => {
        list[index] = new SidenavItem(item);
      });

      return list;
    }
  }

  public isRouteString() {
    return this.route instanceof String || typeof this.route === 'string';
  }
}
