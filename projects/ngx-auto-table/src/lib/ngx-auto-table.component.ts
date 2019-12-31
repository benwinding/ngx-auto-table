import { Component, OnInit, Input, OnDestroy, ViewChild } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort, MatCheckboxChange } from '@angular/material';
import { Subject } from 'rxjs';
import { FormControl } from '@angular/forms';
import { SelectionModel } from '@angular/cdk/collections';
import {
  filter,
  takeUntil,
  throttleTime,
  distinctUntilChanged,
  debounceTime,
  map,
  tap,
  auditTime
} from 'rxjs/operators';
import {
  AutoTableConfig,
  ColumnDefinition,
  ActionDefinitionBulk,
  ColumnDefinitionMap
} from './AutoTableConfig';

import { v4 as uuidv4 } from 'uuid';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { HeaderManager } from './header-manager';
import { SimpleLogger } from './SimpleLogger';

function blankConfig<T>(): AutoTableConfig<T> {
  return {
    data$: new Subject<T[]>()
  };
}

interface ColumnDefinitionInternal extends ColumnDefinition {
  field: string;
}

@Component({
  selector: 'ngx-auto-table',
  templateUrl: './ngx-auto-table.component.html',
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
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;

  exportData: any[];
  exportFilename: string;

  HasNoItems: boolean;

  headerManager = new HeaderManager();

  defaultPageSize = 25;

  isPerformingBulkAction = false;

  autoCompleteObscureName = uuidv4();
  chooseColumnsControl = new FormControl();
  searchControl = new FormControl();
  // Bulk items selection
  selectionMultiple = new SelectionModel<any>(true, []);
  selectionSingle = new SelectionModel<any>(false, []);

  $onDestroyed = new Subject();
  isMobile: boolean;
  IsLoaded: boolean;
  $setDisplayedColumnsTrigger = new Subject<string[]>();

  private logger: SimpleLogger;

  constructor(private breakpointObserver: BreakpointObserver) {}

  reInitializeVariables() {
    this.columnDefinitionsAll = {};
    this.columnDefinitionsAllArray = [];
    this.headerManager = new HeaderManager();
    this.chooseColumnsControl = new FormControl();
    this.selectionMultiple = new SelectionModel<any>(true, []);
    this.selectionSingle = new SelectionModel<any>(false, []);
    this.dataSource = undefined;
  }

  ngOnInit() {
    this.logger = new SimpleLogger(this.config.debug);
    this.breakpointObserver
      .observe([Breakpoints.HandsetLandscape, Breakpoints.HandsetPortrait])
      .pipe(
        tap(val => this.logger.log(val)),
        takeUntil(this.$onDestroyed),
        map(result => result.matches),
        debounceTime(200),
        distinctUntilChanged()
      )
      .subscribe(isMobile => {
        this.logger.log('this.breakpointObserver', { isMobile });
        this.isMobile = isMobile;
        this.refreshDefaultColumns();
      });
    this.$setDisplayedColumnsTrigger
      .pipe(takeUntil(this.$onDestroyed), auditTime(100))
      .subscribe(newHeaders => {
        this.setDisplayedColumns(newHeaders);
      });

    if (!this.config) {
      this.logger.log('no [config] set on auto-table component');
      return;
    }
    this.reInitializeVariables();
    this.config.data$
      .pipe(
        filter(originalData => {
          const isArray = Array.isArray(originalData);
          if (!isArray) {
            this.IsLoaded = false;
          }
          return isArray;
        })
      )
      .pipe(takeUntil(this.$onDestroyed))
      .subscribe(originalData => {
        const hasBeenInitedBefore =
          this.dataSource &&
          this.dataSource.data &&
          this.dataSource.data.length;
        setTimeout(() => {
          this.IsLoaded = true;
        }, 200);
        this.logger.log('ngx-auto-table, subscribed: ', { originalData });
        this.dataSource = new MatTableDataSource(originalData);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.HasNoItems = !originalData.length;
        if (this.HasNoItems) {
          return;
        }
        if (this.config.onDataUpdated) {
          this.config.onDataUpdated(originalData);
        }
        if (!hasBeenInitedBefore) {
          const firstDataItem = originalData[0];
          this.initDisplayedColumns(firstDataItem);
          if (this.config.selectFirstOnInit) {
            this.selectionSingle.select(firstDataItem);
          }
        }
        this.initExport(originalData);
        this.initFilterPredicate(originalData);
      });

    if (this.config.$triggerSelectItem) {
      this.config.$triggerSelectItem
        .pipe(throttleTime(300))
        .pipe(takeUntil(this.$onDestroyed))
        .subscribe(item => {
          this.logger.log('$triggerSelectItem: selecting item', { item });
          const str = JSON.stringify(item);
          const foundItem = this.dataSource.data.find(
            row => JSON.stringify(row) === str
          );
          this.logger.log('$triggerSelectItem: found item:', { foundItem });
          if (foundItem) {
            this.selectionSingle.select(foundItem);
          }
        });
    }

    if (this.config.$triggerClearSelected) {
      this.config.$triggerClearSelected
        .pipe(takeUntil(this.$onDestroyed))
        .subscribe(() => {
          this.logger.log('$triggerClearSelected: clearing selection');
          this.selectionMultiple.clear();
          this.selectionSingle.clear();
        });
    }
    this.searchControl.valueChanges
      .pipe(takeUntil(this.$onDestroyed), debounceTime(200))
      .subscribe(searchString => {
        this.applyFilter(searchString);
      });
  }

  ngOnDestroy() {
    this.$onDestroyed.next();
  }

  refreshDefaultColumns() {
    if (this.isMobile && this.config.mobileFields) {
      this.$setDisplayedColumnsTrigger.next(this.config.mobileFields);
    } else {
      this.$setDisplayedColumnsTrigger.next(this.getDisplayedDefault());
    }
  }

  private applyFilter(inputValue: string) {
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

  initExport(originalData: T[]) {
    this.exportFilename = this.config.exportFilename;
    if (!this.exportFilename) {
      return;
    }
    this.exportData = originalData.map(dataItem => {
      if (!this.config.exportRowFormat) {
        return dataItem;
      }
      return this.config.exportRowFormat(dataItem);
    });
  }

  public getKeyHeader(key: string) {
    const inputDef = this.columnDefinitions[key];
    if (inputDef && inputDef.header != null) {
      return inputDef.header;
    }
    return this.toTitleCase(key);
  }

  private toTitleCase(str: string) {
    const spacedStr = str.replace(new RegExp('_', 'g'), ' ');
    return spacedStr.replace(/\w\S*/g, function(txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  }

  initDisplayedColumns(firstDataItem: T) {
    this.initColumnDefinitions(firstDataItem);
    this.headerManager.InitHeaderKeys(
      this.config.hideFields,
      this.columnDefinitionsAll
    );
    this.refreshDefaultColumns();
    // Set currently enabled items
    this.chooseColumnsControl.setValue(this.headerManager.HeadersDisplayed);
    if (this.config.cacheId) {
      this.columnsCacheSetFromCache();
    }
  }

  getDisplayedDefault(): string[] {
    return this.columnDefinitionsAllArray
      .filter(def => !def.hide)
      .map(d => d.field);
  }

  initFromDefinitions() {
    // Set all column defintions, which were explicitly set in config
    const inputDefintionFields = Object.keys(this.columnDefinitions);
    this.logger.log('initFromDefinitions', { inputDefintionFields });
    inputDefintionFields.forEach((field: string) => {
      const inputDefintion = this.columnDefinitions[field];
      this.columnDefinitionsAll[field] = {
        header: this.getKeyHeader(field),
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
        return {
          ...this.columnDefinitionsAll[k],
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
        header: this.toTitleCase(field),
        hide: true
      };
    });
    this.logger.log('initColumnDefinitions', {
      firstDataItem
    });
  }

  // Sets the displayed columns from a set of fieldnames
  setDisplayedColumns(selected: string[]) {
    this.headerManager.SetDisplayed<T>(
      selected,
      this.config.actions,
      this.config.actionsBulk
    );
    this.initFromDefinitions();
    this.columnDefinitionMapToArray();
    this.logger.log('setDisplayedColumns', {
      selected,
      columnDefinitionsAllArray: this.columnDefinitionsAllArray
    });
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selectionMultiple.selected.length;
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

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    if (this.isAllSelected()) {
      this.selectionMultiple.clear();
    } else {
      this.selectAll();
    }
    if (this.config.onSelectedBulk) {
      this.config.onSelectedBulk(this.selectionMultiple.selected);
    }
  }

  private selectAll() {
    this.dataSource.sortData(this.dataSource.filteredData, this.sort);
    let cutArray = this.dataSource.filteredData;
    if (this.config.bulkSelectMaxCount) {
      cutArray = this.dataSource.filteredData.slice(
        0,
        this.config.bulkSelectMaxCount
      );
    }
    this.selectionMultiple.select(...cutArray);
  }

  isMaxReached() {
    if (!this.config.bulkSelectMaxCount) {
      return false;
    }
    const maxReached =
      this.selectionMultiple.selected.length >= this.config.bulkSelectMaxCount;
    return maxReached;
  }

  private columnsCacheSetFromCache() {
    const cacheKey = this.config.cacheId + '-columns';
    const selectedValsString = localStorage.getItem(cacheKey);
    if (!selectedValsString) {
      return;
    }
    try {
      const vals = JSON.parse(selectedValsString);
      this.logger.log('getting cached columns', { vals, cacheKey });
      this.chooseColumnsControl.setValue(vals);
      this.$setDisplayedColumnsTrigger.next(vals);
    } catch (error) {
      console.warn('error parsing JSON in columns cache');
    }
  }

  private columnsCacheSetToCache() {
    const cacheKey = this.config.cacheId + '-columns';
    const selectedValues = this.chooseColumnsControl.value;
    localStorage.setItem(cacheKey, JSON.stringify(selectedValues));
    this.logger.log('setting cached columns', { cacheKey, selectedValues });
  }

  onColumnFilterChange($event) {
    this.logger.log('onColumnFilterChange: ', { $event });
    const selectedValues = this.chooseColumnsControl.value;
    if (this.config.cacheId) {
      this.columnsCacheSetToCache();
    }
    this.$setDisplayedColumnsTrigger.next(selectedValues);
    this.initFilterPredicate(this.dataSource.data);
  }

  onClickCancelBulk() {
    this.selectionMultiple.clear();
  }

  onClickBulkItem($event: MatCheckboxChange, item) {
    if (!$event) {
      return;
    }
    const isSelected = this.selectionMultiple.isSelected(item);
    const maxReached = this.isMaxReached();
    if (maxReached) {
      $event.source.writeValue(false);
    }
    console.log('onClickBulkItem()', { isSelected, maxReached, $event });
    if (!maxReached) {
      this.selectionMultiple.toggle(item);
    }
    if (maxReached && isSelected) {
      this.selectionMultiple.deselect(item);
    }
    if (this.config.onSelectedBulk) {
      this.config.onSelectedBulk(this.selectionMultiple.selected);
    }
  }

  onClickRow($event, row: T) {
    this.logger.log('onClickRow()', { $event, row });
    this.selectionSingle.select(row);
    if (this.config.onSelectItem) {
      this.config.onSelectItem(row);
    }
  }

  onDoubleClickRow($event, row: T) {
    if (this.config.onSelectItemDoubleClick) {
      this.logger.log('onDoubleClickRow()', { $event, row });
      this.selectionSingle.select(row);
      this.config.onSelectItemDoubleClick(row);
    }
  }

  async onClickedAction(action, row) {
    await action.onClick(row);
  }

  async onClickBulkAction(action: ActionDefinitionBulk<T>, btnBulkAction) {
    this.isPerformingBulkAction = true;
    if (btnBulkAction) {
      btnBulkAction.disabled = false;
    }
    // const nativeRef = btnBulkAction._elementRef.nativeElement;
    // nativeRef.style.filter = 'brightness(0.8) hue-rotate(15deg);';
    await action.onClick(this.selectionMultiple.selected);
    this.selectionMultiple.clear();
    // nativeRef.style.filter = '';
    if (btnBulkAction) {
      btnBulkAction.disabled = true;
    }
    this.isPerformingBulkAction = false;
  }
}
