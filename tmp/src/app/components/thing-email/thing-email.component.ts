/* eslint-disable prefer-destructuring */
import { Component, EventEmitter, Output } from '@angular/core';
import { ThingsService } from 'src/app/services/factories/things.service';
import { MemberTypeConst } from 'src/app/shared/constantes/member-type.const';
import { ThingEmail } from 'src/app/shared/interfaces/thing-email.interface';

@Component({
  selector: 'app-thing-email',
  templateUrl: './thing-email.component.html',
  styleUrls: ['./thing-email.component.scss'],
})
export class ThingEmailComponent {
  @Output() selectedThingId = new EventEmitter();

  @Output() selectedThingEmail = new EventEmitter();

  public thingEmail = '';

  public thingId = '';

  public loading: boolean;

  public thingEmailData: ThingEmail[] = [];

  public filteredThingEmailData: ThingEmail[] = [];

  constructor(private thingService: ThingsService) {}

  public filterThings(): void {
    if (this.thingEmailData.length > 0) {
      this.filteredThingEmailData = this.filterAndOrderThingEmailList();
    } else {
      this.loading = true;
      this.emailsDisplay();
    }
  }

  private filterAndOrderThingEmailList(): ThingEmail[] {
    return this.thingEmailData
      .filter(item =>
        item.email.toLowerCase().includes(this.thingEmail.toLowerCase()),
      )
      .sort(function order(a, b) {
        if (a.email < b.email) return -1;
        if (a.email > b.email) return 1;
        return 0;
      });
  }

  public valueThingEmail(thing: ThingEmail): void {
    this.thingId = thing.thingId;
    this.thingEmail = thing.email;
    this.selectedThingId.emit(this.thingId);
    this.selectedThingEmail.emit(this.thingEmail);
  }

  public emailsDisplay(): void {
    this.thingService
      .getThingsIdAndEmailByMemberType(MemberTypeConst.Manager)
      .subscribe(data => {
        this.thingEmailData = data;
        this.filteredThingEmailData = this.filterAndOrderThingEmailList();
        this.loading = false;
      });
  }

  public resetEmailField(): void {
    this.thingEmail = '';
    this.thingId = '';
  }

  public onFocusLostEmail(): void {
    this.resetEmailField();
    this.selectedThingId.emit(this.thingId);
    this.selectedThingEmail.emit(this.thingEmail);
  }
}
