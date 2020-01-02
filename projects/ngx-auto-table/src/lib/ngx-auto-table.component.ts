import { Component, OnInit, Input, OnDestroy, ViewChild } from '@angular/core';
import {
  MatTableDataSource,
  MatPaginator,
  MatSort,
  MatCheckboxChange
} from '@angular/material';
import { Subject } from 'rxjs';
import { SelectionModel } from '@angular/cdk/collections';
import {
  filter,
  takeUntil,
  distinctUntilChanged,
  debounceTime,
  map,
  tap
} from 'rxjs/operators';
import {
  AutoTableConfig,
  ColumnDefinition,
  ColumnDefinitionMap
} from './AutoTableConfig';

import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { HeaderManager } from './header-manager';
import { SimpleLogger } from '../utils/SimpleLogger';
import { TableNotifyService } from './table-notify.service';
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
        (searchChanged)="applyFilter($event)"
        (bulkActionStatus)="IsPerformingBulkAction = $event"
      ></ngx-auto-table-header>
      <table
        mat-table
        #table
        matSort
        *ngIf="this.dataSource?.data"
        [matSortActive]="config.initialSort"
        [matSortDirection]="config.initialSortDir"
        [dataSource]="this.dataSource"
        style="width:100%;"
        class="mat-elevation-z8"
      >
        <!-- All header definitions given to ngx-auto-table -->
        <ng-container
          *ngFor="let def of columnDefinitionsAllArray"
          [matColumnDef]="def.field"
        >
          <th mat-header-cell mat-sort-header *matHeaderCellDef>
            {{ def.header }}
          </th>
          <td mat-cell *matCellDef="let row">
            <div *ngIf="!def.template" [class.break-words]="def.forceWrap">
              {{ row[def.field] }}
            </div>
            <div *ngIf="def.template">
              <div
                *ngTemplateOutlet="def.template; context: { $implicit: row }"
              ></div>
            </div>
          </td>
        </ng-container>

        <ng-container matColumnDef="__bulk" stickyEnd>
          <th mat-header-cell *matHeaderCellDef>
            <mat-checkbox
              [disabled]="IsPerformingBulkAction || HasNoItems"
              (change)="masterToggle()"
              [checked]="selectionMultiple.hasValue() && isAllSelected()"
              [indeterminate]="selectionMultiple.hasValue() && !isAllSelected()"
            >
            </mat-checkbox>
          </th>
          <td mat-cell *matCellDef="let row">
            <mat-checkbox
              [disabled]="IsPerformingBulkAction"
              (click)="$event.stopPropagation()"
              (change)="onClickBulkItem($event, row)"
              [checked]="selectionMultiple.isSelected(row)"
            >
            </mat-checkbox>
          </td>
        </ng-container>

        <ng-container matColumnDef="__star" stickyEnd>
          <th mat-header-cell *matHeaderCellDef></th>
          <td mat-cell *matCellDef="let row">
            <ngx-auto-table-actions-menu
              [row]="row"
              [actions]="config?.actions"
              [actionsVisibleCount]="config?.actionsVisibleCount"
              [isPerformingBulkAction]="IsPerformingBulkAction"
            ></ngx-auto-table-actions-menu>
          </td>
        </ng-container>

        <!-- Show only visible definitions -->
        <tr
          mat-header-row
          *matHeaderRowDef="this.headerManager.HeadersDisplayed"
          [hidden]="config.hideHeader"
        ></tr>
        <tr
          mat-row
          *matRowDef="let row; columns: this.headerManager.HeadersDisplayed"
          (click)="onClickRow($event, row)"
          (dblclick)="onDoubleClickRow($event, row)"
          [class.selected-row-multiple]="
            !config.disableSelect && selectionMultiple.isSelected(row)
          "
          [class.selected-row-single]="
            !config.disableSelect && selectionSingle.isSelected(row)
          "
          [class.has-pointer]="!config.disableSelect && config.onSelectItem"
          [class.hover-row]="
            !(config.disableSelect && config.disableHoverEffect)
          "
        ></tr>
      </table>

      <ngx-auto-table-footer
        [HasNoItems]="HasNoItems"
        [IsLoading]="!dataSource?.data"
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

  constructor(
    private breakpointObserver: BreakpointObserver,
    private notify: TableNotifyService
  ) {}

  reInitializeVariables() {
    this.columnDefinitionsAll = {};
    this.columnDefinitionsAllArray = [];
    this.headerManager = new HeaderManager();
    this.selectionMultiple = new SelectionModel<any>(true, []);
    this.selectionSingle = new SelectionModel<any>(false, []);
    this.dataSource = undefined;
  }

  ngOnInit() {
    this.logger = new SimpleLogger(this.config.debug);

    if (!this.config) {
      this.logger.log('ngOnInit(), no [config] set on auto-table component');
      return;
    }

    this.breakpointObserver
      .observe([Breakpoints.HandsetLandscape, Breakpoints.HandsetPortrait])
      .pipe(
        takeUntil(this.$onDestroyed),
        map(result => result.matches),
        distinctUntilChanged(),
        debounceTime(100),
        tap(isMobile =>
          this.logger.log('this.breakpointObserver$', { isMobile })
        )
      )
      .subscribe(() => {
        // this.isMobile = isMobile;
        // this.refreshDefaultColumns();
      });

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

  ngOnDestroy() {
    this.$onDestroyed.next();
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

  public applyFilter(inputValue: string) {
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
    this.dataSource.sortData(this.dataSource.filteredData, this.dataSource.sort);
    let cutArray = this.dataSource.filteredData;
    if (this.config.bulkSelectMaxCount) {
      cutArray = this.dataSource.filteredData.slice(
        0,
        this.config.bulkSelectMaxCount
      );
    }
    this.selectionMultiple.select(...cutArray);
  }

  get HasNoItems(): boolean {
    return (
      !this.dataSource || !this.dataSource.data || !this.dataSource.data.length
    );
  }

  get IsMaxReached(): boolean {
    if (!this.config.bulkSelectMaxCount) {
      return false;
    }
    const maxReached =
      this.selectionMultiple.selected.length >= this.config.bulkSelectMaxCount;
    return maxReached;
  }

  onClickCancelBulk() {
    this.selectionMultiple.clear();
  }

  onClickBulkItem($event: MatCheckboxChange, item) {
    if (!$event) {
      return;
    }
    const isSelected = this.selectionMultiple.isSelected(item);
    const maxReached = this.IsMaxReached;
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
    if (maxReached && !isSelected) {
      this.notify.warn(
        `Cannot select! (maxium of ${this.config.bulkSelectMaxCount} items)`
      );
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
}
