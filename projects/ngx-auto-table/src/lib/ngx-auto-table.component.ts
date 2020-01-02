import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { Subject } from 'rxjs';
import { SelectionModel } from '@angular/cdk/collections';
import { filter, takeUntil, debounceTime } from 'rxjs/operators';
import { AutoTableConfig, ColumnDefinitionMap } from './models';

import { ColumnsManager } from './columns-manager';
import { SimpleLogger } from '../utils/SimpleLogger';

function blankConfig<T>(): AutoTableConfig<T> {
  return {
    data$: new Subject<T[]>()
  };
}

@Component({
  selector: 'ngx-auto-table',
  template: `
    <div
      [class.isMobile]="config.disableMobileScroll"
      class="table-container mat-elevation-z8"
    >
      <ngx-auto-table-header
        [config]="config"
        [IsPerformingBulkAction]="IsPerformingBulkAction"
        [HasNoItems]="HasNoItems"
        [IsMaxReached]="IsMaxReached"
        [headerKeyValues]="columnsManager.HeadersChoicesKeyValues"
        [selectionMultiple]="selectionMultiple"
        [selectedHeaderKeys]="columnsManager.HeadersVisible"
        (searchChanged)="onSearchChanged($event)"
        (columnsChanged)="onColumnsChanged($event)"
        (bulkActionStatus)="IsPerformingBulkAction = $event"
      ></ngx-auto-table-header>
      <ngx-auto-table-content
        [IsPerformingBulkAction]="IsPerformingBulkAction"
        [IsAllSelected]="IsAllSelected"
        [IsMaxReached]="IsMaxReached"
        [HasNoItems]="HasNoItems"
        [HeadersVisible]="columnsManager.HeadersVisible"
        [config]="config"
        [debug]="config?.debug"
        [dataSource]="dataSource"
        [selectionMultiple]="selectionMultiple"
        [selectionSingle]="selectionSingle"
        [columnDefinitionsAll]="columnsManager.AllColumnDefinitions"
      ></ngx-auto-table-content>
      <ngx-auto-table-footer
        [HasNoItems]="HasNoItems"
        [IsLoading]="IsLoading"
        [config]="config"
        [dataSource]="dataSource"
      ></ngx-auto-table-footer>
    </div>
  `,
  styleUrls: ['./ngx-auto-table.component.scss']
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

  dataSource: MatTableDataSource<any>;

  columnsManager = new ColumnsManager();

  IsPerformingBulkAction = false;

  // Bulk items selection
  selectionMultiple = new SelectionModel<any>(true, []);
  selectionSingle = new SelectionModel<any>(false, []);

  $onDestroyed = new Subject();
  isMobile: boolean;
  $setDisplayedColumnsTrigger = new Subject<string[]>();

  private logger: SimpleLogger;

  get HasNoItems(): boolean {
    return (
      this.dataSource && this.dataSource.data && !this.dataSource.data.length
    );
  }

  get IsLoading(): boolean {
    return !this.dataSource || !this.dataSource.data;
  }

  get IsMaxReached(): boolean {
    if (!this.config.bulkSelectMaxCount) {
      return false;
    }
    const maxReached =
      this.selectionMultiple.selected.length >= this.config.bulkSelectMaxCount;
    return maxReached;
  }

  get IsAllSelected() {
    const numSelected = this.selectionMultiple.selected.length;
    if (!this.dataSource || !this.dataSource.filteredData) {
      return false;
    }
    const numInData = this.dataSource.filteredData.length;
    if (numSelected >= numInData) {
      return true;
    }
    if (
      this.config.bulkSelectMaxCount &&
      numSelected >= this.config.bulkSelectMaxCount
    ) {
      return true;
    }
    return false;
  }

  ngOnInit() {
    this.logger = new SimpleLogger(this.config.debug);

    if (!this.config) {
      this.logger.log('ngOnInit(), no [config] set on auto-table component');
      return;
    }

    this.$setDisplayedColumnsTrigger
      .pipe(takeUntil(this.$onDestroyed), debounceTime(100))
      .subscribe(newHeaders => {
        console.log('setDisplayedColumnsTrigger', { newHeaders });
        this.columnsManager.SetDisplayed<T>(
          newHeaders,
          !!this.config.actions,
          !!this.config.actionsBulk
        );
      });

    this.reInitializeVariables();
    this.config.data$
      .pipe(
        debounceTime(100),
        filter(originalData => Array.isArray(originalData))
      )
      .pipe(takeUntil(this.$onDestroyed))
      .subscribe(originalData => {
        this.logger.log('config.data$.subscribe: ', { originalData });
        this.dataSource = new MatTableDataSource(originalData);
        if (this.config.onDataUpdated) {
          this.config.onDataUpdated(originalData);
        }
        const firstDataItem = originalData[0];
        if (this.config.selectFirstOnInit) {
          this.selectionSingle.select(firstDataItem);
        }
        this.initTable(this.columnDefinitions, this.config, firstDataItem);
        this.initFilterPredicate(
          originalData,
          this.columnsManager.HeadersVisibleSet
        );
      });
    this.initializeConfigTriggers();
  }

  ngOnDestroy() {
    this.$onDestroyed.next();
  }

  reInitializeVariables() {
    this.selectionMultiple = new SelectionModel<any>(true, []);
    this.selectionSingle = new SelectionModel<any>(false, []);
    this.dataSource = undefined;
  }

  initializeConfigTriggers() {
    if (this.config.$triggerSelectItem) {
      this.config.$triggerSelectItem
        .pipe(debounceTime(300))
        .pipe(takeUntil(this.$onDestroyed))
        .subscribe(item => {
          this.logger.log(
            'config.$triggerSelectItem.subscribe: selecting item',
            { item }
          );
          const str = JSON.stringify(item);
          const foundItem = this.dataSource.data.find(
            row => JSON.stringify(row) === str
          );
          this.logger.log('config.$triggerSelectItem.subscribe: found item:', {
            foundItem
          });
          if (foundItem) {
            this.selectionSingle.select(foundItem);
          }
        });
    }

    if (this.config.$triggerClearSelected) {
      this.config.$triggerClearSelected
        .pipe(takeUntil(this.$onDestroyed))
        .subscribe(() => {
          this.logger.log(
            'config.$triggerClearSelected.subscribe: clearing selection'
          );
          this.selectionMultiple.clear();
          this.selectionSingle.clear();
        });
    }
  }

  initTable(
    columnDefinitions: ColumnDefinitionMap,
    config: AutoTableConfig<T>,
    firstDataItem: T
  ) {
    this.columnsManager.InitializeColumns(
      config,
      columnDefinitions,
      firstDataItem
    );
    const initialKeys = Object.keys(columnDefinitions).filter(
      k => !columnDefinitions[k].hide && !(config.hideFields || []).includes(k)
    );
    console.log('initialKeys', { initialKeys });
    this.columnsManager.SetDisplayed(
      initialKeys,
      !!this.config.actions,
      !!this.config.actionsBulk
    );
    this.refreshDefaultColumns();
  }

  refreshDefaultColumns() {
    const setMobile = this.isMobile && this.config.mobileFields;
    let columns: string[] = [];
    if (setMobile) {
      columns = this.config.mobileFields;
    } else {
      columns = [...this.columnsManager.HeadersVisible];
    }
    this.logger.log('refreshDefaultColumns()', {
      setMobile,
      columns
    });
    this.$setDisplayedColumnsTrigger.next(columns);
  }

  public onSearchChanged(inputValue: string) {
    const parsedString = inputValue || '';
    this.dataSource.filter = parsedString.trim().toLowerCase();
    this.selectionSingle.clear();
  }

  public onColumnsChanged(columns: string[]) {
    this.$setDisplayedColumnsTrigger.next(columns);
  }

  initFilterPredicate(originalData: T[], keysHeader: Set<string>) {
    if (!originalData.length) {
      return;
    }
    const firstRow = originalData[0];
    const firstRowKeys = Object.keys(firstRow);
    const firstRowKeysSet = new Set(firstRowKeys);
    keysHeader.delete('__bulk');
    keysHeader.delete('__star');
    const allFieldsExist = Array.from(keysHeader).reduce((acc, cur) => {
      return firstRowKeysSet.has(cur) && acc;
    }, true);

    this.logger.log('initFilterPredicate()', {
      firstRowKeysSet,
      allFieldsExist,
      keysHeader
    });
    this.dataSource.filterPredicate = (data: T, filterText: string) => {
      if (!filterText) {
        return true;
      }
      if (this.selectionMultiple.isSelected(data)) {
        return true;
      }
      if (!allFieldsExist) {
        const values = Object.values(data);
        for (let value of values) {
          try {
            const str = JSON.stringify(value) || '';
            const isFound = str.toLowerCase().includes(filterText);
            if (isFound) {
              return true;
            }
          } catch (error) {
            return false;
          }
        }
        return false;
      }
      for (const key of Array.from(keysHeader)) {
        const dataVal = data[key];
        try {
          const str = JSON.stringify(dataVal) || '';
          const isFound = str.toLowerCase().includes(filterText);
          if (isFound) {
            return true;
          }
        } catch (error) {
          return false;
        }
      }
    };
  }
}
