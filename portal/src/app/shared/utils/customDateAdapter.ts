import { NativeDateAdapter } from "@angular/material/core";
import * as moment from "moment";
import { Injectable } from "@angular/core";

@Injectable()
export class CustomDateAdapter extends NativeDateAdapter {
  public format(date: Date): string {
    moment.locale("pt-BR");
    const formatString = "DD/MM/YYYY";
    return moment(date).format(formatString);
  }

  public parse(value: any): Date | null {
    const date = moment(value, "DD/MM/YYYY");
    return date.isValid() ? date.toDate() : moment().toDate();
  }
}
