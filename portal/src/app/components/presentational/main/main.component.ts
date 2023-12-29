import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import * as _ from 'lodash';
import { Observable, ReplaySubject } from 'rxjs';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent {
  public sidenavOpen = true;

  public sidenavMode = 'side';

  public title: string;

  public theme = {
    header: '',
    aside: '',
    logo: '',
  };

  private _media$: ReplaySubject<any> = new ReplaySubject(1);

  private _paths = [];

  public get media$(): Observable<any> {
    return this._media$.asObservable();
  }

  constructor(private router: Router) {
    this.router.events.subscribe(event => {
      this._paths = [];

      if (event instanceof NavigationEnd) {
        this.getTitle(this.router.routerState, this.router.routerState.root);
        this.title = _.last(this._paths);

        if (!_.isEmpty(this.title)) {
          this.title = `SIDEBAR.${this.title}`;
        }
      }
    });
  }

  public onTheme(theme) {
    this.theme = theme;
  }

  public getTitle(state: any, parent: any) {
    const data = [];

    if (parent && parent.snapshot.data && parent.snapshot.data.pageTitle) {
      this._paths.push(parent.snapshot.data.pageTitle);
    }

    if (state && parent) {
      data.push(...this.getTitle(state, state.firstChild(parent)));
    }

    return data;
  }
}
