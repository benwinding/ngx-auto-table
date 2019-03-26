import {
  Component,
  OnInit,
  Input,
  OnDestroy,
  ViewChild,
  Output,
  EventEmitter
} from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { Subscription, Observable } from 'rxjs';
import { FormControl } from '@angular/forms';
import { SelectionModel } from '@angular/cdk/collections';
import { filter } from 'rxjs/operators';

export interface AutoTableConfig<T> {
  data$: Observable<T[]>;
  filename?: string;
  actions?: ActionDefinition<T>[];
  actionsBulk?: ActionDefinitionBulk<T>[];
  bulkSelectMaxCount?: number;
  onSelectItem?: (row: T) => void;
  clearSelected?: Observable<void>;
  initialSort?: string;
  initialSortDir?: 'asc' | 'desc';
  pageSize?: number;
  hideFields?: string[];
  hideFilter?: boolean;
  hideHeader?: boolean;
  hideChooseColumns?: boolean;
  exportFilename?: string;
  exportRowFormat?: (row: T) => void;
}

export interface ActionDefinition<T> {
  label: string;
  icon?: string;
  onClick?: (row: T) => void;
  onRouterLink?: (row: T) => string;
  routerLinkQuery?: (row: T) => {};
}

export interface ActionDefinitionBulk<T> {
  label: string;
  icon?: string;
  onClick?: (row: T[]) => void;
}

export interface ColumnDefinition {
  header?: string;
  template?: any;
  hide?: boolean;
  forceWrap?: boolean;
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
  @Output()
  selectedBulk = new EventEmitter<T[]>();
  @Input()
  config: AutoTableConfig<T>;
  @Input()
  columnDefinitions: {
    [field: string]: ColumnDefinition;
  } = {};
  columnDefinitionsAll: {
    [field: string]: ColumnDefinition;
  } = {};
  columnDefinitionsAllArray: ColumnDefinitionInternal[] = [];

  headerKeysAll = [];
  headerKeysAllVisible = [];
  headerKeysDisplayed = [];
  headerKeysDisplayedMap = {};

  dataSource: MatTableDataSource<any>;
  dataSourceSubscription: Subscription;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  pageSize = 25;
  @ViewChild(MatSort) sort: MatSort;

  exportData: any[];
  exportFilename: string;

  hasNoItems: boolean;

  filterControl = new FormControl();
  // Bulk items selection
  selectionMultiple = new SelectionModel<any>(true, []);
  selectionSingle = new SelectionModel<any>(false, []);
  clearSelectedSubscription: Subscription;

  ngOnInit() {
    this.dataSourceSubscription = this.config.data$
      .pipe(filter(e => !!e))
      .subscribe(originalData => {
        console.log('ngx-auto-table, subscribed: ', { originalData });
        this.dataSource = new MatTableDataSource(originalData);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        if (originalData && !originalData.length) {
          this.hasNoItems = true;
          return;
        } else {
          this.hasNoItems = false;
        }
        if (this.config.pageSize) {
          this.pageSize = this.config.pageSize;
        }
        const firstDataItem = originalData[0];
        this.initDisplayedColumns(firstDataItem);
        this.initExport(originalData);
        this.initFilter(originalData);
      });

    if (this.config.clearSelected) {
      this.clearSelectedSubscription = this.config.clearSelected.subscribe(
        () => {
          console.log('ngx-auto-table: clearSelected');
          this.selectionMultiple.clear();
          this.selectionSingle.clear();
        }
      );
    }
  }

  ngOnDestroy() {
    if (this.dataSourceSubscription) {
      this.dataSourceSubscription.unsubscribe();
    }
    if (this.clearSelectedSubscription) {
      this.clearSelectedSubscription.unsubscribe();
    }
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    this.selectionMultiple.clear();
    this.selectionSingle.clear();
  }

  initFilter(originalData: T[]) {
    if (!originalData.length) {
      return;
    }
    const firstRow = originalData[0];
    const keysData = new Set(Object.keys(firstRow));
    const keysHeader = new Set(this.headerKeysDisplayed);
    keysHeader.delete('__bulk');
    keysHeader.delete('__star');
    const allFieldsExist = Array.from(keysHeader).reduce((acc, cur) => {
      return keysData.has(cur) && acc;
    }, true);

    console.log('ngx-auto-table: initFilter()', {
      rowFields: keysData,
      allFieldsExist,
      headerKeysDisplayed: this.headerKeysDisplayed
    });
    this.dataSource.filterPredicate = (data: T, filterText: string) => {
      if (!filterText) {
        return true;
      }
      if (!allFieldsExist) {
        const lower = JSON.stringify(data).toLowerCase();
        return lower.includes(filterText);
      }
      for (const key of Array.from(keysHeader)) {
        const dataVal = data[key];
        const str = JSON.stringify(dataVal);
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

  private toTitleCase(str) {
    return str.replace('_', ' ').replace(/\w\S*/g, function(txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  }

  initDisplayedColumns(firstDataItem: T) {
    this.initColumnDefinitions(firstDataItem);

    this.headerKeysAll = Object.keys(this.columnDefinitionsAll);
    this.headerKeysAllVisible = this.headerKeysAll;
    if (this.config.hideFields) {
      // Hide fields if specified
      const hideFields = new Set(this.config.hideFields);
      this.headerKeysAllVisible = this.headerKeysAll.filter(
        x => !hideFields.has(x)
      );
    }

    const displayed = this.columnDefinitionsAllArray
      .filter(def => !def.hide)
      .map(d => d.field);

    this.setDisplayedColumns(displayed);
    // Set currently enabled items
    this.filterControl.setValue(this.headerKeysDisplayed);
  }

  initColumnDefinitions(firstDataItem: T) {
    // Set all column defintions, which were explicitly set in config
    const inputDefintionFields = Object.keys(this.columnDefinitions);
    inputDefintionFields.forEach((field: string) => {
      const inputDefintion = this.columnDefinitions[field];
      this.columnDefinitionsAll[field] = {
        header: this.getKeyHeader(field),
        template: inputDefintion.template,
        hide: inputDefintion.hide,
        forceWrap: inputDefintion.forceWrap
      };
    });

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

    this.columnDefinitionsAllArray = Object.keys(this.columnDefinitionsAll).map(
      k => {
        return {
          ...this.columnDefinitionsAll[k],
          field: k
        };
      }
    );
    console.log('ngx-auto-table: initColumnDefinitions', {
      firstDataItem,
      inputDefintionFields
    });
  }

  // Sets the displayed columns from a set of fieldnames
  setDisplayedColumns(selected: string[]) {
    // Initialize all keys as false
    this.headerKeysAllVisible.forEach(
      k => (this.headerKeysDisplayedMap[k] = false)
    );
    // Set selected as true
    selected.forEach(c => (this.headerKeysDisplayedMap[c] = true));
    this.headerKeysDisplayed = Object.keys(this.headerKeysDisplayedMap).filter(
      k => this.headerKeysDisplayedMap[k]
    );
    // Add bulk select column at start
    if (this.config.actionsBulk) {
      this.headerKeysDisplayed.unshift('__bulk');
    }
    // Add actions column at end
    if (this.config.actions) {
      this.headerKeysDisplayed.push('__star');
    }
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selectionMultiple.selected.length;
    const numRows =
      this.config.bulkSelectMaxCount || this.dataSource.filteredData.length;
    return numSelected >= numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected()
      ? this.selectionMultiple.clear()
      : this.selectAll();
    this.selectedBulk.emit(this.selectionMultiple.selected);
  }

  private selectAll() {
    this.dataSource.sortData(this.dataSource.filteredData, this.dataSource.sort);
    let cutArray = this.dataSource.filteredData;
    if (this.config.bulkSelectMaxCount) {
      cutArray = this.dataSource.filteredData.slice(0, this.config.bulkSelectMaxCount);
    }
    cutArray.forEach(row => {
      this.selectionMultiple.select(row);
    });
  }

  isMaxReached() {
    if (!this.config.bulkSelectMaxCount) {
      return false;
    }
    return (
      this.selectionMultiple.selected.length >= this.config.bulkSelectMaxCount
    );
  }

  onColumnFilterChange($event) {
    console.log({ $event });
    const selectedValues = this.filterControl.value;
    this.setDisplayedColumns(selectedValues);
    this.initFilter(this.dataSource.data);
  }

  onClickBulkItem($event, item) {
    if ($event) {
      const isSelected = this.selectionMultiple.isSelected(item);
      if (!this.isMaxReached()) {
        this.selectionMultiple.toggle(item);
      } else {
        if (isSelected) {
          this.selectionMultiple.deselect(item);
        } else {
          this.warn(
            `Max Selection of "${this.config.bulkSelectMaxCount}" Reached`
          );
        }
      }
      this.selectedBulk.emit(this.selectionMultiple.selected);
    }
  }

  onClickRow($event, row: T) {
    console.log('ngx-auto-table: onClickRow()', { $event, row });
    if (this.config.onSelectItem) {
      this.selectionSingle.select(row);
      this.config.onSelectItem(row);
    }
  }

  async onClickBulkAction(action: ActionDefinitionBulk<T>) {
    await action.onClick(this.selectionMultiple.selected);
    this.selectionMultiple.clear();
  }

  warn(msg: string) {}
}
