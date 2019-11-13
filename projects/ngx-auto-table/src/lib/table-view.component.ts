import { Component, Input, ViewChild, OnDestroy } from '@angular/core';
import { ColumnDefinitionInternal } from './AutoTableInternal';
import {
  ActionDefinition,
  ActionDefinitionBulk,
  AutoTableConfig
} from './AutoTableConfig';
import { MatSort, MatTableDataSource, MatPaginator } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';

import { v4 as uuidv4 } from 'uuid';
import { SimpleLogger } from './SimpleLogger';
import { throttleTime, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { FormControl } from '@angular/forms';
import { ColumnsManager } from './columns-manager';

@Component({
  selector: 'ngx-table-viewer',
  template: `
    <div
      *ngIf="false"
      [class.isMobile]="config.disableMobileScroll"
      class="table-container mat-elevation-z8"
    >
      <div
        class="table-header auto-elevation overflow-hidden"
        [class.addRightPixel]="config.hideHeader"
        *ngIf="(!config.hideFilter || !config.hideChooseColumns) && !hasNoItems"
      >
        <div class="relative">
          <mat-toolbar class="mat-elevation-z8">
            <mat-toolbar-row class="flex-h align-center space-between">
              <mat-form-field
                class="filter-search"
                *ngIf="!hasNoItems && !config.hideFilter"
              >
                <mat-icon matPrefix>search</mat-icon>
                <input
                  matInput
                  (keyup)="applyFilter($event.target.value)"
                  [placeholder]="config.filterText || 'Search Rows...'"
                  [name]="autoCompleteObscureName"
                  autocomplete="dontcompleteme"
                  #filterField
                />
                <mat-icon
                  class="has-pointer"
                  matSuffix
                  (click)="
                    filterField.value = ''; applyFilter(filterField.value)
                  "
                  >clear</mat-icon
                >
              </mat-form-field>
              <mat-form-field
                class="filter-columns overflow-hidden"
                *ngIf="!hasNoItems && !config.hideChooseColumns"
              >
                <mat-icon matPrefix>view_column</mat-icon>
                <mat-select
                  placeholder="Choose Columns..."
                  [formControl]="filterControl"
                  (selectionChange)="onColumnFilterChange($event)"
                  multiple
                >
                  <mat-option
                    *ngFor="let option of this.HeaderKeyOptions"
                    [value]="option.value"
                  >
                    {{ option.label }}
                  </mat-option>
                </mat-select>
              </mat-form-field>
            </mat-toolbar-row>
          </mat-toolbar>
          <mat-toolbar
            class="bulk-actions flex-h align-center mat-primary overflow-x-auto"
            *ngIf="config.actionsBulk"
            [class.hidden]="!selectionMultiple.hasValue()"
          >
            <mat-toolbar-row class="flex-h align-center space-between">
              <span class="item-count">
                ({{ selectionMultiple.selected.length }} Selected)
              </span>
              <span *ngIf="!isPerformingBulkAction" class="item-count">
                {{ IsMaxReached ? ' Max Reached!' : '' }}
              </span>
              <span *ngIf="isPerformingBulkAction" class="item-count">
                Performing action...
              </span>
              <span class="buttons flex-h align-center">
                <button
                  mat-raised-button
                  color="secondary"
                  [disabled]="isPerformingBulkAction"
                  *ngFor="let action of config.actionsBulk"
                  (click)="onClickBulkAction(action, btnBulkLoader)"
                >
                  <ngx-auto-table-btn-loader
                    [disabled]="true"
                    #btnBulkLoader
                  ></ngx-auto-table-btn-loader>
                  <mat-icon>{{ action.icon }}</mat-icon>
                  <span>{{ action.label }}</span>
                </button>
              </span>
            </mat-toolbar-row>
          </mat-toolbar>
        </div>
      </div>
      <table
        mat-table
        #table
        matSort
        [matSortActive]="config.initialSort"
        [matSortDirection]="config.initialSortDir"
        [dataSource]="this.dataSource"
        style="width:100%;"
        class="mat-elevation-z8"
      >
        <ng-container
          *ngFor="let def of this.AllColumnsVisible"
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
              [disabled]="isPerformingBulkAction || HasNoItems"
              (change)="onClickMasterToggle()"
              [checked]="selectionMultiple.hasValue() && IsAllSelected"
              [indeterminate]="selectionMultiple.hasValue() && !IsAllSelected"
            >
            </mat-checkbox>
          </th>
          <td mat-cell *matCellDef="let row">
            <mat-checkbox
              [disabled]="isPerformingBulkAction"
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
            <div
              *ngIf="config.actions"
              class="flex flex-row-reverse items-center content-start"
            >
              <button
                *ngIf="
                  (config?.actionsVisibleCount || 0) < config.actions.length
                "
                mat-mini-fab
                color="secondary"
                [disabled]="isPerformingBulkAction"
                [matMenuTriggerFor]="rowMenu"
              >
                <mat-icon color="dark">more_vert</mat-icon>
              </button>
              <mat-menu #rowMenu="matMenu" class="row-menu">
                <div mat-menu-item *ngFor="let action of config.actions">
                  <!-- <div
              mat-menu-item
              *ngFor="
                let action of config.actions
                  | slice
                    : config?.actionsVisibleCount || 0
                    : config.actions.length
              "
            > -->
                  <button
                    mat-menu-item
                    *ngIf="action.onClick"
                    (click)="onClickedAction(action, row)"
                  >
                    <mat-icon>{{ action.icon }}</mat-icon>
                    <span>{{ action.label }}</span>
                  </button>
                  <a
                    mat-menu-item
                    *ngIf="action.onRouterLink && !action.routerLinkQuery"
                    [routerLink]="['/' + action.onRouterLink(row)]"
                  >
                    <mat-icon>{{ action.icon }}</mat-icon>
                    <span>{{ action.label }}</span>
                  </a>
                  <a
                    mat-menu-item
                    *ngIf="action.onRouterLink && action.routerLinkQuery"
                    [routerLink]="['/' + action.onRouterLink(row)]"
                    [queryParams]="action.routerLinkQuery(row)"
                  >
                    <mat-icon>{{ action.icon }}</mat-icon>
                    <span>{{ action.label }}</span>
                  </a>
                </div>
              </mat-menu>
              <div *ngIf="config?.actionsVisibleCount as visibleCount">
                <div *ngFor="let action of config.actions">
                  <!-- <div *ngFor="let action of config.actions | slice: 0:visibleCount"> -->
                  <button
                    mat-mini-fab
                    *ngIf="action.onClick"
                    (click)="onClickedAction(action, row)"
                    [matTooltip]="action.label"
                  >
                    <mat-icon>{{ action.icon }}</mat-icon>
                  </button>
                  <a
                    mat-mini-fab
                    *ngIf="action.onRouterLink && !action.routerLinkQuery"
                    [routerLink]="['/' + action.onRouterLink(row)]"
                    [matTooltip]="action.label"
                  >
                    <mat-icon>{{ action.icon }}</mat-icon>
                  </a>
                  <a
                    mat-mini-fab
                    *ngIf="action.onRouterLink && action.routerLinkQuery"
                    [routerLink]="['/' + action.onRouterLink(row)]"
                    [queryParams]="action.routerLinkQuery(row)"
                    [matTooltip]="action.label"
                  >
                    <mat-icon>{{ action.icon }}</mat-icon>
                  </a>
                </div>
              </div>
            </div>
          </td>
        </ng-container>

        <tr
          mat-header-row
          *matHeaderRowDef="this.HeaderKeysDisplayed"
          [hidden]="config.hideHeader"
        ></tr>
        <tr
          mat-row
          *matRowDef="let row; columns: this.HeaderKeysDisplayed"
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

      <mat-toolbar class="mat-elevation-z8 overflow-hidden expansion-joint">
        <mat-toolbar-row> </mat-toolbar-row>
      </mat-toolbar>
      <mat-toolbar class="mat-elevation-z8 overflow-hidden">
        <mat-toolbar-row *ngIf="!dataSource">
          <ngx-auto-app-toolbar-loader
            class="full-width"
          ></ngx-auto-app-toolbar-loader>
        </mat-toolbar-row>
        <mat-toolbar-row *ngIf="!dataSource">
          <h1 class="no-items">Loading...</h1>
        </mat-toolbar-row>
        <mat-toolbar-row *ngIf="HasNoItems">
          <h1 class="no-items">No items found</h1>
        </mat-toolbar-row>
        <mat-toolbar-row class="paginator-row">
          <app-table-csv-export
            *ngIf="config.exportFilename"
            [dataArray]="exportData"
            [filename]="config.exportFilename"
          ></app-table-csv-export>
          <mat-paginator
            *ngIf="!config.hidePaginator"
            [pageSize]="config.pageSize || defaultPageSize"
            [pageSizeOptions]="[5, 10, 25, 100]"
          >
          </mat-paginator>
        </mat-toolbar-row>
      </mat-toolbar>
    </div>
  `,
  styleUrls: ['./table-view.component.scss']
})
export class NgxTableViewComponent implements OnDestroy {
  @Input()
  isMobile: boolean;
  @Input()
  desktopColumns: ColumnDefinitionInternal[];
  @Input()
  mobileColumns: ColumnDefinitionInternal[];
  @Input()
  actions: ActionDefinition<any>;
  @Input()
  actionsBulk: ActionDefinitionBulk<any>;
  @Input()
  set data(newData: any[]) {
    this.$onDestroyed.next();
    setTimeout(() => {
      this.initTable(newData);
    });
  }
  @Input()
  config: AutoTableConfig<any>;

  exportData: any[];

  defaultPageSize = 25;

  logger: SimpleLogger;

  // Table components
  dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;

  // Bulk items selection
  selectionMultiple = new SelectionModel<any>(true, []);
  selectionSingle = new SelectionModel<any>(false, []);

  filterControl = new FormControl();

  isPerformingBulkAction = false;

  autoCompleteObscureName = uuidv4();
  $onDestroyed = new Subject();

  columnsManager: ColumnsManager<any>;

  get HasNoItems() {
    return !this.HasItems;
  }
  get HasItems() {
    return (
      !!this.dataSource &&
      !!Array.isArray(this.dataSource.data) &&
      !!this.dataSource.data.length
    );
  }
  get AllColumnsVisible() {
    return this.columnsManager.CurrentColumns;
  }
  get HeaderKeysDisplayed() {
    return this.columnsManager.GetDisplayed();
  }
  get HeaderKeyOptions() {
    return this.columnsManager.AllFilterOptions();
  }
  get IsMaxReached() {
    if (!this.config.bulkSelectMaxCount) {
      return false;
    }
    return (
      this.selectionMultiple.selected.length >= this.config.bulkSelectMaxCount
    );
  }
  get IsAllSelected() {
    const numSelected = this.selectionMultiple.selected.length;
    const numInData = this.dataSource.filteredData.length;
    if (numSelected >= numInData) {
      return true;
    }
    if (numSelected >= this.config.bulkSelectMaxCount) {
      return true;
    }
    return false;
  }

  ngOnDestroy() {
    this.$onDestroyed.next();
  }

  initTable(newData: any[]) {
    if (!this.dataSource) {
      this.dataSource = new MatTableDataSource();
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
    this.dataSource.data = newData;
    this.filterControl = new FormControl();
    this.initExport(newData);
    this.initFilterPredicate(newData);
    this.columnsManager = new ColumnsManager(this.config);
    this.logger = new SimpleLogger(this.config.debug, 'table-view');
    this.initSelectionTriggers();
  }

  private initExport(originalData: any[]) {
    if (this.config.exportFilename) {
      return;
    }
    this.exportData = originalData.map(dataItem => {
      if (!this.config.exportRowFormat) {
        return dataItem;
      }
      return this.config.exportRowFormat(dataItem);
    });
  }

  initSelectionTriggers() {
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
  }

  private initFilterPredicate(originalData: any[]) {
    if (!originalData.length) {
      return;
    }
    const firstRow = originalData[0];
    const keysFromData = new Set(Object.keys(firstRow));
    const keysHeader = new Set(this.HeaderKeysDisplayed);
    keysHeader.delete('__bulk');
    keysHeader.delete('__star');
    const allFieldsExist = Array.from(keysHeader).reduce((acc, cur) => {
      return keysFromData.has(cur) && acc;
    }, true);

    this.logger.log('initFilter()', {
      rowFields: keysFromData,
      allFieldsExist,
      headerKeysDisplayed: keysHeader
    });
    this.dataSource.filterPredicate = (data: any, filterText: string) => {
      if (!filterText) {
        return true;
      }
      if (!allFieldsExist) {
        const lower = JSON.stringify(data).toLowerCase();
        return lower.includes(filterText);
      }
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

  public applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    this.selectionMultiple.clear();
    this.selectionSingle.clear();
  }

  private columnsCacheSetToCache() {
    const cacheKey = this.config.cacheId + '-columns';
    const selectedValues = this.filterControl.value;
    localStorage.setItem(cacheKey, JSON.stringify(selectedValues));
    this.logger.log('setting cached columns', { cacheKey, selectedValues });
  }

  public onColumnFilterChange($event) {
    this.logger.log('onColumnFilterChange: ', { $event });
    const selectedValues = this.filterControl.value;
    if (this.config.cacheId) {
      this.columnsCacheSetToCache();
    }
    this.columnsManager.SetDisplayed(selectedValues);
    this.initFilterPredicate(this.dataSource.data);
  }

  public onClickBulkItem($event, item) {
    if ($event) {
      const isSelected = this.selectionMultiple.isSelected(item);
      if (!this.IsMaxReached) {
        this.selectionMultiple.toggle(item);
      } else {
        if (isSelected) {
          this.selectionMultiple.deselect(item);
        } else {
          this.logger.warn('');
        }
      }
      if (this.config.onSelectedBulk) {
        this.config.onSelectedBulk(this.selectionMultiple.selected);
      }
    }
  }

  public onClickRow($event, row: any) {
    this.logger.log('onClickRow()', { $event, row });
    this.selectionSingle.select(row);
    if (this.config.onSelectItem) {
      this.config.onSelectItem(row);
    }
  }

  public onDoubleClickRow($event, row: any) {
    if (this.config.onSelectItemDoubleClick) {
      this.logger.log('onDoubleClickRow()', { $event, row });
      this.selectionSingle.select(row);
      this.config.onSelectItemDoubleClick(row);
    }
  }

  public async onClickedAction(action, row) {
    try {
      await action.onClick(row);
    } catch (error) {
      this.logger.error('error executing action.onClick', error, {
        row,
        action
      });
    }
  }

  public async onClickBulkAction(
    action: ActionDefinitionBulk<any>,
    btnBulkAction
  ) {
    this.isPerformingBulkAction = true;
    if (btnBulkAction) {
      btnBulkAction.disabled = false;
    }
    try {
      await action.onClick(this.selectionMultiple.selected);
    } catch (error) {
      this.logger.error('error executing actionBulk.onClick', error, {
        btnBulkAction,
        action
      });
    }
    // const nativeRef = btnBulkAction._elementRef.nativeElement;
    // nativeRef.style.filter = 'brightness(0.8) hue-rotate(15deg);';
    this.selectionMultiple.clear();
    // nativeRef.style.filter = '';
    if (btnBulkAction) {
      btnBulkAction.disabled = true;
    }
    this.isPerformingBulkAction = false;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  public onClickMasterToggle() {
    if (this.IsAllSelected) {
      this.selectionMultiple.clear();
    } else {
      this.selectAllItems();
    }
    if (this.config.onSelectedBulk) {
      this.config.onSelectedBulk(this.selectionMultiple.selected);
    }
  }

  private selectAllItems() {
    this.dataSource.sortData(
      this.dataSource.filteredData,
      this.dataSource.sort
    );
    let cutArray = this.dataSource.filteredData;
    if (this.config.bulkSelectMaxCount) {
      cutArray = this.dataSource.filteredData.slice(
        0,
        this.config.bulkSelectMaxCount
      );
    }
    cutArray.forEach(row => {
      this.selectionMultiple.select(row);
    });
  }
}
