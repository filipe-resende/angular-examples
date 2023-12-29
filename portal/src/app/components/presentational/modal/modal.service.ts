import { Injectable } from "@angular/core";

@Injectable({ providedIn: "root" })
export class ModalService {
  private modals: any[] = [];

  public add(modal: any) {
    this.modals.push(modal);
  }

  public remove(id: string) {
    this.modals = this.modals.filter((x) => x.id !== id);
  }

  public open(id: string) {
    this.tryToOpen(id);
  }

  public close(id: string) {
    const modal = this.modals.find((x) => x.id === id);

    if (modal) modal.close();
  }

  private tryToOpen(id: string, tries: number = 0) {
    const modal = this.modals.find((x) => x.id === id);

    if (tries > 20) return;

    if (modal) {
      modal.open();
    } else {
      setTimeout(() => this.tryToOpen(id, ++tries), 500);
    }
  }
}
