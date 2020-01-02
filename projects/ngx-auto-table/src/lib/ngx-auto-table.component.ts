import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { Subject } from 'rxjs';
import { SelectionModel } from '@angular/cdk/collections';
import { filter, takeUntil, debounceTime } from 'rxjs/operators';
import {
  AutoTableConfig,
  ColumnDefinition,
  ColumnDefinitionMap
} from './AutoTableConfig';

import { HeaderManager } from './header-manager';
import { SimpleLogger } from '../utils/SimpleLogger';
import { formatPretty } from '../utils/utils';

function blankConfig<T>(): AutoTableConfig<T> {
  return {
    data$: new Subject<T[]>()
  };
}

interface ColumnDefinitionInternal extends ColumnDefinition {
  field: string;
  header_pretty: string;
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
        [AllColumnStrings]="headerManager.HeadersDisplayedChoices"
        [selectionMultiple]="selectionMultiple"
        (searchChanged)="applyFilterToDatasource($event)"
        (bulkActionStatus)="IsPerformingBulkAction = $event"
      ></ngx-auto-table-header>
      <ngx-auto-table-content
        [IsPerformingBulkAction]="IsPerformingBulkAction"
        [IsAllSelected]="IsAllSelected"
        [IsMaxReached]="IsMaxReached"
        [HasNoItems]="HasNoItems"
        [HeadersVisible]="headerManager.HeadersVisible"
        [config]="config"
        [debug]="config?.debug"
        [dataSource]="dataSource"
        [selectionMultiple]="selectionMultiple"
        [selectionSingle]="selectionSingle"
        [columnDefinitions]="columnDefinitions"
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

  columnDefinitionsAll: ColumnDefinitionMap = {};
  columnDefinitionsAllArray: ColumnDefinitionInternal[] = [];

  dataSource: MatTableDataSource<any>;

  headerManager = new HeaderManager();

  IsPerformingBulkAction = false;

  // Bulk items selection
  selectionMultiple = new SelectionModel<any>(true, []);
  selectionSingle = new SelectionModel<any>(false, []);

  $onDestroyed = new Subject();
  isMobile: boolean;
  $setDisplayedColumnsTrigger = new Subject<string[]>();

  private logger: SimpleLogger;

  constructor() {}

  reInitializeVariables() {
    this.columnDefinitionsAll = {};
    this.columnDefinitionsAllArray = [];
    this.headerManager = new HeaderManager();
    this.selectionMultiple = new SelectionModel<any>(true, []);
    this.selectionSingle = new SelectionModel<any>(false, []);
    this.dataSource = undefined;
  }

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

  /** Whether the number of selected elements matches the total number of rows. */
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
        this.setDisplayedColumns(newHeaders);
      });

    this.reInitializeVariables();
    this.config.data$
      .pipe(
        debounceTime(100),
        filter(originalData => Array.isArray(originalData))
      )
      .pipe(takeUntil(this.$onDestroyed))
      .subscribe(originalData => {
        const alreadyInited =
          this.dataSource &&
          this.dataSource.data &&
          this.dataSource.data.length;
        this.logger.log('config.data$.subscribe: ', { originalData });
        this.dataSource = new MatTableDataSource(originalData);
        if (this.config.onDataUpdated) {
          this.config.onDataUpdated(originalData);
        }
        if (!alreadyInited) {
          const firstDataItem = originalData[0];
          this.initDisplayedColumns(firstDataItem);
          if (this.config.selectFirstOnInit) {
            this.selectionSingle.select(firstDataItem);
          }
        }
        this.initFilterPredicate(originalData);
      });

    this.initializeConfigTriggers();
  }

  ngOnDestroy() {
    this.$onDestroyed.next();
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

  refreshDefaultColumns() {
    const setMobile = this.isMobile && this.config.mobileFields;
    let columns: string[] = [];
    if (setMobile) {
      columns = this.config.mobileFields;
    } else {
      columns = this.getDisplayedDefault();
    }
    this.logger.log('refreshDefaultColumns()', {
      setMobile,
      columns,
      columnDefinitionsAllArray: this.columnDefinitionsAllArray
    });
    this.$setDisplayedColumnsTrigger.next(columns);
  }

  public applyFilterToDatasource(inputValue: string) {
    const parsedString = inputValue || '';
    this.dataSource.filter = parsedString.trim().toLowerCase();
    this.selectionSingle.clear();
  }

  initFilterPredicate(originalData: T[]) {
    if (!originalData.length) {
      return;
    }
    const firstRow = originalData[0];
    const firstRowKeys = Object.keys(firstRow);
    const firstRowKeysSet = new Set(firstRowKeys);
    const keysHeader = this.headerManager.HeadersDisplayedSet;
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
        const lower = JSON.stringify(data).toLowerCase();
        return lower.includes(filterText);
      }
      const keysHeader = this.headerManager.HeadersDisplayedSet;
      for (const key of Array.from(keysHeader)) {
        const dataVal = data[key];
        const str = JSON.stringify(dataVal) || '';
        const isFound = str.toLowerCase().includes(filterText);
        if (isFound) {
          return true;
        }
      }
    };
  }

  initDisplayedColumns(firstDataItem: T) {
    this.initColumnDefinitions(firstDataItem);
    this.headerManager.InitHeaderKeys(
      this.config.hideFields,
      this.columnDefinitionsAll
    );
    this.refreshDefaultColumns();
    // Set currently enabled items
  }

  getDisplayedDefault(): string[] {
    return this.columnDefinitionsAllArray
      .filter(def => !def.hide)
      .map(d => d.field);
  }

  initFromDefinitions() {
    // Set all column defintions, which were explicitly set in config
    const inputDefintionFields = Object.keys(this.columnDefinitions);
    this.logger.log('initFromDefinitions()', { inputDefintionFields });
    inputDefintionFields.forEach((field: string) => {
      const inputDefintion = this.columnDefinitions[field];
      this.columnDefinitionsAll[field] = {
        header: inputDefintion.header,
        template: inputDefintion.template,
        hide: inputDefintion.hide,
        forceWrap: inputDefintion.forceWrap
      };
    });
  }

  columnDefinitionMapToArray() {
    // Make array that template headers use
    this.columnDefinitionsAllArray = Object.keys(this.columnDefinitionsAll).map(
      k => {
        const columnDef = this.columnDefinitionsAll[k];
        return {
          ...columnDef,
          header_pretty: columnDef.header || formatPretty(k),
          field: k
        };
      }
    );
  }

  initColumnDefinitions(firstDataItem: T) {
    // Set all column defintions read from the "input data"
    const inputDataKeys = Object.keys(firstDataItem);
    inputDataKeys.forEach((field: string) => {
      if (!!this.columnDefinitionsAll[field]) {
        // skip if definition exists
        return;
      }
      this.columnDefinitionsAll[field] = {
        hide: true
      };
    });
    this.logger.log('initColumnDefinitions()', {
      firstDataItem
    });
  }

  // Sets the displayed columns from a set of fieldnames
  setDisplayedColumns(columnsToDisplay: string[]) {
    this.headerManager.SetDisplayed<T>(
      columnsToDisplay,
      this.config.actions,
      this.config.actionsBulk
    );
    this.initFromDefinitions();
    this.columnDefinitionMapToArray();
    this.logger.log('setDisplayedColumns()', {
      columnsToDisplay,
      columnDefinitionsAllArray: this.columnDefinitionsAllArray
    });
  }
}
