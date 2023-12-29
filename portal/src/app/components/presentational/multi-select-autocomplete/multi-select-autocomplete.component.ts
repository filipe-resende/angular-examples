/* eslint-disable no-underscore-dangle */
import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { Observable, timer } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-multi-select-autocomplete',
  templateUrl: './multi-select-autocomplete.component.html',
  styleUrls: ['./multi-select-autocomplete.component.scss']
})
export class MultiSelectAutocompleteComponent<
  Option extends { name: string; isChecked?: boolean; id?: string }
> implements OnInit
{
  @Input()
  public label = '';

  @Input()
  public warning: boolean;

  @Input()
  public isFormField = true;

  @Input()
  public isLoading = true;

  @Input()
  public isFenceEdit = false;

  @Output()
  public selectChange = new EventEmitter<Option[]>();

  @Output()
  public allOptions = new EventEmitter<Option[]>();

  public searchText = new FormControl('');

  public selectedOptionsText = new FormControl();

  public filteredOptions: Observable<Option[]>;

  public isDropdownOpened = false;

  @Input()
  private set options(options: Option[]) {
    this._options = options;
    this.searchText.setValue('');
  }

  private get options(): Option[] {
    return this._options;
  }

  private _options: Option[] = [];

  @ViewChild('dropdown')
  private dropdownRef: ElementRef;

  private selectedOptions: Option[] = [];

  public border = 'blue';

  public ngOnInit(): void {
    this.filteredOptions = this.searchText.valueChanges.pipe(
      startWith(''),
      map(value => this.filter(value))
    );
  }

  public onCheckboxChange(event: MatCheckboxChange, option: Option): void {
    if (event.checked) {
      this.addOptionToSelectedOptions(option);
    } else {
      this.removeOptionFromSelectedOptions(option);
    }

    this.selectChange.emit(this.selectedOptions);
  }

  public onCheckboxChangeFenceEdit(
    event: MatCheckboxChange,
    option: Option
  ): void {
    this.getAssociationsChanges(event, option);
    this.selectChange.emit(this.selectedOptions);
  }

  public onRemoveOptionClick(event: MouseEvent, option: Option): void {
    event.stopPropagation();
    this.removeOptionFromSelectedOptions(option);

    this.selectChange.emit(this.selectedOptions);
  }

  public openDropdown(): void {
    this.selectedOptionsText.disable();

    const FIFTY_MILLISECONDS = 50;
    const ONE_HUNDRED_MILLISECONDS = 100;

    const timerToOpenDropdown = timer(FIFTY_MILLISECONDS);
    const timerToMoveDropdownIntoView = timer(ONE_HUNDRED_MILLISECONDS);

    timerToOpenDropdown.subscribe(() => {
      this.isDropdownOpened = true;

      timerToMoveDropdownIntoView.subscribe(() => {
        this.dropdownRef.nativeElement.scrollIntoView({
          behavior: 'smooth'
        });
      });
    });
  }

  public closeDropdown(): void {
    this.isDropdownOpened = false;

    this.selectedOptionsText.enable();
  }

  public clear(): void {
    this.selectedOptions = [];
    this.selectChange.emit(this.selectedOptions);
  }

  private addOptionToSelectedOptions(option: Option): void {
    const isSelected = this.selectedOptions.find(
      selectedOption => option === selectedOption
    );

    if (!isSelected) this.selectedOptions.push(option);
  }

  private getAssociationsChanges(
    event: MatCheckboxChange,
    option: Option
  ): void {
    const index = this.selectedOptions.findIndex(
      selection => selection.id === option.id
    );

    if (index === -1) {
      this.selectedOptions.push({ ...option, isChecked: event.checked });
    } else {
      this.selectedOptions[index] = { ...option, isChecked: event.checked };
    }
  }

  private removeOptionFromSelectedOptions(option: Option): void {
    this.selectedOptions = this.selectedOptions.filter(
      selectedOption => selectedOption !== option
    );
  }

  private filter(value: string): Option[] {
    const filterValue = value?.toLowerCase();

    return this.options?.filter(option =>
      option.name.toLowerCase().includes(filterValue)
    );
  }
}
