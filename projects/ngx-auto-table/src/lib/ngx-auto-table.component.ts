import { Component, OnInit, Input, OnDestroy, ViewChild } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { Subject, BehaviorSubject } from 'rxjs';
import { FormControl } from '@angular/forms';
import { SelectionModel } from '@angular/cdk/collections';
import {
  filter,
  takeUntil,
  throttleTime,
  distinctUntilChanged,
  debounceTime,
  map,
  tap
} from 'rxjs/operators';
import {
  AutoTableConfig,
  ActionDefinitionBulk,
  ColumnDefinitionMap
} from './AutoTableConfig';

import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { SimpleLogger } from './SimpleLogger';
import { ColumnsManager } from './columns-manager';
import { ColumnDefinitionInternal } from './AutoTableInternal';

function blankConfig<T>(): AutoTableConfig<T> {
  return {
    data$: new Subject<T[]>()
  };
}

@Component({
  selector: 'ngx-auto-table',
  template: `
    <pre>
    </pre>
    <ngx-table-viewer
      *ngIf="config"
      [isMobile]="isMobile"
      [desktopColumns]="desktopColumns"
      [mobileColumns]="mobileColumns"
      [data]="$data | async"
      [config]="config"
    ></ngx-table-viewer>
  `
})
export class AutoTableComponent<T> implements OnInit, OnDestroy {
  private _blankConfig: AutoTableConfig<T> = blankConfig<T>();
  private _config: AutoTableConfig<T>;
  @Input()
  set config(newConfig) {
    this._config = newConfig;
    setTimeout(() => {
      this.$onDestroyed.next();
      this.ngOnInit();
    });
  }
  get config() {
    return this._config || this._blankConfig;
  }
  @Input()
  columnDefinitions: ColumnDefinitionMap = {};
  @Input()
  columnDefinitionsMobile: ColumnDefinitionMap = {};

  public desktopColumns: ColumnDefinitionInternal[];
  public mobileColumns: ColumnDefinitionInternal[];

  public $data = new BehaviorSubject<T>(null);

  isMobile: boolean;

  $onDestroyed = new Subject();

  private logger: SimpleLogger;

  constructor(private breakpointObserver: BreakpointObserver) {}

  ngOnInit() {
    if (!this.config) {
      this.logger.log('no [config] set on auto-table component');
      return;
    }
    this.logger = new SimpleLogger(this.config.debug, 'main');
    this.initResponsiveTriggers();
    this.initDataTriggers();
  }

  ngOnDestroy() {
    this.$onDestroyed.next();
  }

  initResponsiveTriggers() {
    this.breakpointObserver
      .observe([Breakpoints.HandsetLandscape, Breakpoints.HandsetPortrait])
      .pipe(
        takeUntil(this.$onDestroyed),
        map(result => result.matches),
        debounceTime(200),
        distinctUntilChanged()
      )
      .subscribe(isMobile => {
        this.logger.log('this.breakpointObserver', { isMobile });
        this.isMobile = isMobile;
      });
  }

  initDataTriggers() {
    this.config.data$
      .pipe(filter(e => !!e))
      .pipe(takeUntil(this.$onDestroyed))
      .subscribe(originalData => {
        this.logger.log('config.data$.subscribed: ', { originalData });
        // Check if initialized before, before
        const hasBeenInitedBefore =
          this.dataSource &&
          this.dataSource.data &&
          this.dataSource.data.length;
        this.hasNoItems = originalData && !originalData.length;
        if (this.hasNoItems) {
          return;
        }
        if (this.config.onDataUpdated) {
          this.config.onDataUpdated(originalData);
        }
        if (!hasBeenInitedBefore) {
          this.columnsManager.InitializeDefinitions(
            this.columnDefinitions,
            this.columnDefinitionsMobile
          );
          const firstDataItem = originalData[0];
          this.columnsManager.InitializeDefinitionsFromRow(firstDataItem);
          if (this.config.selectFirstOnInit) {
            this.selectionSingle.select(firstDataItem);
          }
        }
        this.initExport(originalData);
        this.initFilterPredicate(originalData);
      });
  }
}
