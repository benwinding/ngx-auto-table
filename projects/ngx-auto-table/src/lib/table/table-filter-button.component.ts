import { takeUntil, debounceTime } from 'rxjs/operators';
import { FilterOptions } from './../models';
import {
  Component,
  Input,
  OnDestroy,
  Output,
  EventEmitter,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subject, combineLatest } from 'rxjs';
import { ColumnFilterBy } from '../models.internal';
import { convertObservableToBehaviorSubject } from '../../utils/rxjs-helpers';

export interface KeyValueItem {
  key: string;
  value: string;
}

@Component({
  selector: 'ngx-auto-table-filter-button',
  template: `
    <button
      mat-icon-button
      #btnApps
      [matBadge]="($filtersActive | async) ? '1' : null"
      [matMenuTriggerFor]="settingsMenu"
      [matTooltip]="'Filter column'"
    >
      <mat-icon>filter_list</mat-icon>
    </button>
    <mat-menu #settingsMenu="matMenu">
      <h3 class="panel-header">Filter column</h3>
      <button
        class="m-4"
        mat-raised-button
        (click)="$event.stopPropagation(); onClickClear()"
        color="primary"
      >
        <mat-icon>clear</mat-icon>
        Clear Filters
      </button>
      <div class="m-4" *ngIf="!!filter?.bool">
        <mat-checkbox
          [formControl]="controlBool"
          [indeterminate]="controlBool.value == null"
          (change)="controlBool.setValue($event.checked)"
          color="primary"
          (click)="$event.stopPropagation()"
        >
          {{ header }}
        </mat-checkbox>
      </div>
      <div class="m-4" *ngIf="!!filter?.string">
        <mat-form-field class="filter-columns overflow-hidden">
          <mat-icon matPrefix>local_offer</mat-icon>
          <mat-select
            [placeholder]="'Filter by Value'"
            [formControl]="controlString"
            multiple
            (click)="$event.stopPropagation()"
          >
            <mat-option
              *ngFor="let item of controlStringOptions"
              [value]="item"
            >
              {{ item }}
            </mat-option>
          </mat-select>
        </mat-form-field>
      </div>
      <div class="m-4" *ngIf="!!filter?.stringArray">
        <mat-form-field class="filter-columns overflow-hidden">
          <mat-icon matPrefix matTooltip="∞">local_offer</mat-icon>
          <mat-select
            [placeholder]="'Filter by Value'"
            [formControl]="controlStringArray"
            (click)="$event.stopPropagation()"
            multiple
          >
            <mat-option
              *ngFor="let item of controlStringOptions"
              [value]="item"
            >
              {{ item }}
            </mat-option>
          </mat-select>
        </mat-form-field>
      </div>
    </mat-menu>
  `,
  styles: [
    `
      .m-4 {
        margin: 10px;
      }
      .panel-header {
        margin: 0;
        margin-bottom: 4px;
        text-align: center;
      }
    `,
  ],
})
export class NgxAutoTableFilterColumnComponent implements OnDestroy {
  @Input()
  fieldName: string;
  @Input()
  header: string;
  @Input()
  filter: FilterOptions;
  @Output()
  filterBy = new EventEmitter<ColumnFilterBy>();

  @Input()
  controlStringOptions: string[];

  $filtersActive = new Subject<boolean>();

  controlBool = new FormControl();
  controlString = new FormControl();
  controlStringArray = new FormControl();

  destroyed = new Subject();

  constructor() {
    combineLatest([
      convertObservableToBehaviorSubject<boolean>(
        this.controlBool.valueChanges,
        null
      ),
      convertObservableToBehaviorSubject<string[]>(
        this.controlString.valueChanges,
        null
      ),
      convertObservableToBehaviorSubject<string[]>(
        this.controlStringArray.valueChanges,
        null
      ),
    ])
      .pipe(debounceTime(50), takeUntil(this.destroyed))
      .subscribe(([bool, str, strArray]) => {
        const isBoolEmpty = bool == null;
        const isStrEmpty = !Array.isArray(str) || !str.length;
        const isStrArrayEmpty = !Array.isArray(strArray) || !strArray.length;
        const allEmpty = isBoolEmpty && isStrEmpty && isStrArrayEmpty;
        this.$filtersActive.next(!allEmpty);
        if (allEmpty) {
          this.filterBy.next(null);
          return;
        }
        const f: ColumnFilterBy = {
          fieldName: this.fieldName,
          bool: bool,
          stringArray: str || strArray,
        };
        this.filterBy.next(f);
      });
  }

  ngOnDestroy() {
    this.destroyed.next();
  }

  onClickClear() {
    this.controlBool.setValue(null);
    this.controlString.setValue(null);
    this.controlStringArray.setValue(null);
  }
}
