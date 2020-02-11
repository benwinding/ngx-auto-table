import {
  Component,
  OnInit,
  EventEmitter,
  Input,
  Output,
  OnDestroy
} from '@angular/core';

import { v4 as uuidv4 } from 'uuid';
import { FormControl } from '@angular/forms';
import { takeUntil, debounceTime, filter, delay } from 'rxjs/operators';
import { Subject, BehaviorSubject } from 'rxjs';
import { KeyValue } from '@angular/common';
import { SimpleLogger } from '../../utils/SimpleLogger';

@Component({
  selector: 'ngx-auto-table-header-search',
  template: `
    <div class="flex-h align-center">
      <mat-form-field class="filter-search">
        <mat-icon matPrefix>search</mat-icon>
        <input
          matInput
          [formControl]="searchControl"
          [placeholder]="this.filterText || 'Search Rows...'"
          [name]="autoCompleteObscureName"
          autocomplete="dontcompleteme"
          #filterFieldBulk
        />
        <mat-icon class="has-pointer" matSuffix (click)="searchControl.reset()"
          >clear</mat-icon
        >
      </mat-form-field>
      <div [class.hide]="!hasFilterByColumn">
        <button mat-mini-fab (click)="matSelect.open()">
          <mat-icon>filter_list</mat-icon>
        </button>
        <div class="hide">
          <mat-select
            #matSelect
            [formControl]="chooseSearchColumnsControl"
            multiple
          >
            <mat-option [value]="ALL_KEY" (click)="toggleSelectAllColumns()">
              Select All
            </mat-option>
            <mat-optgroup label="Filter By">
              <mat-option
                *ngFor="let h of $headerKeyValues | async"
                [value]="h.key"
              >
                {{ h.value }}
              </mat-option>
            </mat-optgroup>
          </mat-select>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .flex-h {
        display: flex;
        flex-direction: row;
        align-items: center;
      }
      .filter-search {
        margin-top: 11px;
        margin-bottom: -9px;
        margin-right: 20px;
      }
      .has-pointer {
        cursor: pointer;
      }
      .hidden {
        display: hidden;
      }
      .hide {
        width: 0px;
        height: 0px;
        overflow: hidden;
      }
    `
  ],
  styleUrls: ['../ngx-auto-table.component.scss']
})
export class NgxAutoTableHeaderSearchComponent implements OnInit, OnDestroy {
  @Input()
  debug: boolean;
  @Input()
  filterText: string;
  @Input()
  hasFilterByColumn: boolean;

  @Input()
  set headerKeyValues(headerKeyValues) {
    this.$headerKeyValues.next(headerKeyValues);
  }
  get headerKeyValues() {
    return this.$headerKeyValues.getValue();
  }
  $headerKeyValues = new BehaviorSubject<KeyValue<string, string>[]>([]);

  @Input()
  $clearTrigger: Subject<void>;

  @Output()
  searchChanged: EventEmitter<string> = new EventEmitter();
  @Output()
  searchHeadersChanged: EventEmitter<string[]> = new EventEmitter();

  autoCompleteObscureName = uuidv4();
  searchControl = new FormControl();
  chooseSearchColumnsControl = new FormControl([]);

  ALL_KEY = '__all';

  private logger: SimpleLogger;

  private $onDestroyed = new Subject();

  ngOnInit() {
    this.logger = new SimpleLogger(this.debug);

    this.searchControl.valueChanges
      .pipe(takeUntil(this.$onDestroyed), debounceTime(200))
      .subscribe(searchString => {
        this.searchChanged.next(searchString);
      });

    this.chooseSearchColumnsControl.valueChanges
      .pipe(takeUntil(this.$onDestroyed), debounceTime(200))
      .subscribe(value => {
        this.logger.log('chooseSearchColumnsControl.valueChanges', { value });
        if (this.hasFilterByColumn) {
          this.searchHeadersChanged.next(this.getSearchByColumns());
        }
      });

    this.$clearTrigger.pipe(takeUntil(this.$onDestroyed)).subscribe(() => {
      this.searchControl.reset();
    });
  }

  ngOnDestroy() {
    this.$onDestroyed.next();
  }

  toggleSelectAllColumns() {
    const val: string[] = this.chooseSearchColumnsControl.value || [];
    if (!val.includes(this.ALL_KEY)) {
      this.chooseSearchColumnsControl.reset();
    } else {
      this.selectAllColumns();
    }
  }

  selectAllColumns() {
    const keys = Array.from(this.headerKeyValues.values()).map(v => v.key);
    keys.unshift(this.ALL_KEY);
    this.chooseSearchColumnsControl.setValue(keys);
  }

  getSearchByColumns() {
    const val: string[] = this.chooseSearchColumnsControl.value || [];
    return val.filter(v => v !== this.ALL_KEY);
  }
}
