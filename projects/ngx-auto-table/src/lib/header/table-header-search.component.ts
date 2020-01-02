import {
  Component,
  OnInit,
  EventEmitter,
  Input,
  Output,
  OnDestroy
} from '@angular/core';
import { ActionDefinitionBulk } from '../models';

import { v4 as uuidv4 } from 'uuid';
import { FormControl } from '@angular/forms';
import { SelectionModel } from '@angular/cdk/collections';
import { takeUntil, debounceTime } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'ngx-auto-table-header-search',
  template: `
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
  `,
  styleUrls: ['../ngx-auto-table.component.scss']
})
export class NgxAutoTableHeaderSearchComponent implements OnInit, OnDestroy {
  @Input()
  filterText: string;
  @Input()
  $clearTrigger: Subject<void>;

  @Output()
  searchChanged: EventEmitter<string> = new EventEmitter();

  autoCompleteObscureName = uuidv4();
  searchControl = new FormControl();

  private $onDestroyed = new Subject();

  ngOnInit() {
    this.searchControl.valueChanges
      .pipe(takeUntil(this.$onDestroyed), debounceTime(200))
      .subscribe(searchString => {
        this.searchChanged.next(searchString);
      });

    this.$clearTrigger.pipe(takeUntil(this.$onDestroyed)).subscribe(() => {
      this.searchControl.reset();
    });
  }

  ngOnDestroy() {
    this.$onDestroyed.next();
  }
}
