import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-button',
  templateUrl: 'button.component.html',
  styleUrls: ['button.component.scss']
})
export class ButtonComponent {
  @Input()
  public primary = true;

  @Input()
  public flat = true;

  @Input()
  public disabled = false;

  @Input()
  public loading = false;

  @Input()
  public large = false;

  @Input()
  public strech = false;

  @Input()
  public iconOnly = false;

  @Input()
  public upperCased = false;

  @Input()
  public bordered = false;

  @Input()
  public type = 'button';

  @Input()
  public customClass = '';

  @Input()
  public stroked = false;

  @Output()
  public onClick = new EventEmitter();

  public get classes() {
    const classObj = {
      primary: this.primary,
      secondary: !this.primary,
      stroked: this.stroked,
      flat: this.flat,
      line: !this.flat,
      large: this.large,
      strech: this.strech,
      borderedPrimary: this.bordered && this.primary,
      borderedSecondary: this.bordered && !this.primary,
      disabled: this.disabled || this.loading,
      'icon-only': this.iconOnly,
      loading: this.loading
    };

    if (this.customClass) {
      classObj[this.customClass] = true;
    }

    return classObj;
  }

  public onClickEmitter(event): void {
    if (!this.disabled && !this.loading) {
      this.onClick.emit(event);
    }
  }
}
