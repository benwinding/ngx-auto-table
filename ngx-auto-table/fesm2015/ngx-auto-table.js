import { CsvModule } from '@ctrl/ngx-csv';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { __awaiter } from 'tslib';
import { MatTableDataSource, MatPaginator, MatSort, MatAutocompleteModule, MatButtonModule, MatButtonToggleModule, MatPaginatorModule, MatCheckboxModule, MatFormFieldModule, MatIconModule, MatInputModule, MatProgressBarModule, MatProgressSpinnerModule, MatSelectModule, MatSortModule, MatTableModule, MatToolbarModule, MatMenuModule } from '@angular/material';
import { Subject } from 'rxjs';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { SelectionModel } from '@angular/cdk/collections';
import { filter, takeUntil } from 'rxjs/operators';
import { Component, Input, ViewChild, Output, EventEmitter, NgModule } from '@angular/core';

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class AppExportCsvExportComponent {
}
AppExportCsvExportComponent.decorators = [
    { type: Component, args: [{
                selector: 'app-table-csv-export',
                template: `
    <a
      *ngIf="dataArray"
      csvLink
      [data]="dataArray"
      [filename]="filename"
      mat-raised-button
    >
      <mat-icon title="Export as CSV">file_download</mat-icon>
      <span>Export CSV</span>
    </a>
  `,
                styles: [`
      a {
        color: black;
      }
      mat-icon {
        padding-right: 5px;
      }
    `]
            }] }
];
AppExportCsvExportComponent.propDecorators = {
    dataArray: [{ type: Input }],
    filename: [{ type: Input }]
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 * @template T
 */
class AutoTableComponent {
    constructor() {
        this.selectedBulk = new EventEmitter();
        this.columnDefinitions = {};
        this.columnDefinitionsAll = {};
        this.columnDefinitionsAllArray = [];
        this.headerKeysAll = [];
        this.headerKeysAllVisible = [];
        this.headerKeysDisplayed = [];
        this.headerKeysDisplayedMap = {};
        this.pageSize = 25;
        this.filterControl = new FormControl();
        // Bulk items selection
        this.selectionMultiple = new SelectionModel(true, []);
        this.selectionSingle = new SelectionModel(false, []);
        this.$onDestroyed = new Subject();
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        this.config.data$
            .pipe(filter((/**
         * @param {?} e
         * @return {?}
         */
        e => !!e)))
            .pipe(takeUntil(this.$onDestroyed))
            .subscribe((/**
         * @param {?} originalData
         * @return {?}
         */
        originalData => {
            console.log("ngx-auto-table, subscribed: ", { originalData });
            this.dataSource = new MatTableDataSource(originalData);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
            if (originalData && !originalData.length) {
                this.hasNoItems = true;
                return;
            }
            else {
                this.hasNoItems = false;
            }
            if (this.config.pageSize) {
                this.pageSize = this.config.pageSize;
            }
            /** @type {?} */
            const firstDataItem = originalData[0];
            this.initDisplayedColumns(firstDataItem);
            this.initExport(originalData);
            this.initFilter(originalData);
        }));
        if (this.config.$triggerSelectItem) {
            this.config.$triggerSelectItem
                .pipe(takeUntil(this.$onDestroyed))
                .subscribe((/**
             * @param {?} item
             * @return {?}
             */
            item => {
                this.log("$triggerSelectItem", item);
                /** @type {?} */
                const str = JSON.stringify(item);
                /** @type {?} */
                const foundItem = this.dataSource.data.find((/**
                 * @param {?} row
                 * @return {?}
                 */
                row => JSON.stringify(row) === str));
                if (foundItem) {
                    this.selectionSingle.select(foundItem);
                }
            }));
        }
        if (this.config.clearSelected) {
            this.config.clearSelected
                .pipe(takeUntil(this.$onDestroyed))
                .subscribe((/**
             * @return {?}
             */
            () => {
                this.log("clearSelected");
                this.selectionMultiple.clear();
                this.selectionSingle.clear();
            }));
        }
    }
    /**
     * @return {?}
     */
    ngOnDestroy() {
        this.$onDestroyed.next();
        this.$onDestroyed.complete();
    }
    /**
     * @param {?} filterValue
     * @return {?}
     */
    applyFilter(filterValue) {
        this.dataSource.filter = filterValue.trim().toLowerCase();
        this.selectionMultiple.clear();
        this.selectionSingle.clear();
    }
    /**
     * @param {?} originalData
     * @return {?}
     */
    initFilter(originalData) {
        if (!originalData.length) {
            return;
        }
        /** @type {?} */
        const firstRow = originalData[0];
        /** @type {?} */
        const keysData = new Set(Object.keys(firstRow));
        /** @type {?} */
        const keysHeader = new Set(this.headerKeysDisplayed);
        keysHeader.delete("__bulk");
        keysHeader.delete("__star");
        /** @type {?} */
        const allFieldsExist = Array.from(keysHeader).reduce((/**
         * @param {?} acc
         * @param {?} cur
         * @return {?}
         */
        (acc, cur) => {
            return keysData.has(cur) && acc;
        }), true);
        this.log("initFilter()", {
            rowFields: keysData,
            allFieldsExist,
            headerKeysDisplayed: this.headerKeysDisplayed
        });
        this.dataSource.filterPredicate = (/**
         * @param {?} data
         * @param {?} filterText
         * @return {?}
         */
        (data, filterText) => {
            if (!filterText) {
                return true;
            }
            if (!allFieldsExist) {
                /** @type {?} */
                const lower = JSON.stringify(data).toLowerCase();
                return lower.includes(filterText);
            }
            for (const key of Array.from(keysHeader)) {
                /** @type {?} */
                const dataVal = data[key];
                /** @type {?} */
                const str = JSON.stringify(dataVal);
                /** @type {?} */
                const isFound = str.toLowerCase().includes(filterText);
                if (isFound) {
                    return true;
                }
            }
        });
    }
    /**
     * @param {?} originalData
     * @return {?}
     */
    initExport(originalData) {
        this.exportFilename = this.config.exportFilename;
        if (!this.exportFilename) {
            return;
        }
        this.exportData = originalData.map((/**
         * @param {?} dataItem
         * @return {?}
         */
        dataItem => {
            if (!this.config.exportRowFormat) {
                return dataItem;
            }
            return this.config.exportRowFormat(dataItem);
        }));
    }
    /**
     * @param {?} key
     * @return {?}
     */
    getKeyHeader(key) {
        /** @type {?} */
        const inputDef = this.columnDefinitions[key];
        if (inputDef && inputDef.header != null) {
            return inputDef.header;
        }
        return this.toTitleCase(key);
    }
    /**
     * @private
     * @param {?} str
     * @return {?}
     */
    toTitleCase(str) {
        return str.replace("_", " ").replace(/\w\S*/g, (/**
         * @param {?} txt
         * @return {?}
         */
        function (txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        }));
    }
    /**
     * @param {?} firstDataItem
     * @return {?}
     */
    initDisplayedColumns(firstDataItem) {
        this.initColumnDefinitions(firstDataItem);
        this.headerKeysAll = Object.keys(this.columnDefinitionsAll);
        this.headerKeysAllVisible = this.headerKeysAll;
        if (this.config.hideFields) {
            // Hide fields if specified
            /** @type {?} */
            const hideFields = new Set(this.config.hideFields);
            this.headerKeysAllVisible = this.headerKeysAll.filter((/**
             * @param {?} x
             * @return {?}
             */
            x => !hideFields.has(x)));
        }
        /** @type {?} */
        const displayed = this.columnDefinitionsAllArray
            .filter((/**
         * @param {?} def
         * @return {?}
         */
        def => !def.hide))
            .map((/**
         * @param {?} d
         * @return {?}
         */
        d => d.field));
        this.setDisplayedColumns(displayed);
        // Set currently enabled items
        this.filterControl.setValue(this.headerKeysDisplayed);
    }
    /**
     * @param {?} firstDataItem
     * @return {?}
     */
    initColumnDefinitions(firstDataItem) {
        // Set all column defintions, which were explicitly set in config
        /** @type {?} */
        const inputDefintionFields = Object.keys(this.columnDefinitions);
        inputDefintionFields.forEach((/**
         * @param {?} field
         * @return {?}
         */
        (field) => {
            /** @type {?} */
            const inputDefintion = this.columnDefinitions[field];
            this.columnDefinitionsAll[field] = {
                header: this.getKeyHeader(field),
                template: inputDefintion.template,
                hide: inputDefintion.hide,
                forceWrap: inputDefintion.forceWrap
            };
        }));
        // Set all column defintions read from the "input data"
        /** @type {?} */
        const inputDataKeys = Object.keys(firstDataItem);
        inputDataKeys.forEach((/**
         * @param {?} field
         * @return {?}
         */
        (field) => {
            if (!!this.columnDefinitionsAll[field]) {
                // skip if definition exists
                return;
            }
            this.columnDefinitionsAll[field] = {
                header: this.toTitleCase(field),
                hide: true
            };
        }));
        this.columnDefinitionsAllArray = Object.keys(this.columnDefinitionsAll).map((/**
         * @param {?} k
         * @return {?}
         */
        k => {
            return Object.assign({}, this.columnDefinitionsAll[k], { field: k });
        }));
        this.log("initColumnDefinitions", {
            firstDataItem,
            inputDefintionFields
        });
    }
    // Sets the displayed columns from a set of fieldnames
    /**
     * @param {?} selected
     * @return {?}
     */
    setDisplayedColumns(selected) {
        // Initialize all keys as false
        this.headerKeysAllVisible.forEach((/**
         * @param {?} k
         * @return {?}
         */
        k => (this.headerKeysDisplayedMap[k] = false)));
        // Set selected as true
        selected.forEach((/**
         * @param {?} c
         * @return {?}
         */
        c => (this.headerKeysDisplayedMap[c] = true)));
        this.headerKeysDisplayed = Object.keys(this.headerKeysDisplayedMap).filter((/**
         * @param {?} k
         * @return {?}
         */
        k => this.headerKeysDisplayedMap[k]));
        // Add bulk select column at start
        if (this.config.actionsBulk) {
            this.headerKeysDisplayed.unshift("__bulk");
        }
        // Add actions column at end
        if (this.config.actions) {
            this.headerKeysDisplayed.push("__star");
        }
    }
    /**
     * Whether the number of selected elements matches the total number of rows.
     * @return {?}
     */
    isAllSelected() {
        /** @type {?} */
        const numSelected = this.selectionMultiple.selected.length;
        /** @type {?} */
        const numRows = this.config.bulkSelectMaxCount || this.dataSource.filteredData.length;
        return numSelected >= numRows;
    }
    /**
     * Selects all rows if they are not all selected; otherwise clear selection.
     * @return {?}
     */
    masterToggle() {
        this.isAllSelected() ? this.selectionMultiple.clear() : this.selectAll();
        this.selectedBulk.emit(this.selectionMultiple.selected);
    }
    /**
     * @private
     * @return {?}
     */
    selectAll() {
        this.dataSource.sortData(this.dataSource.filteredData, this.dataSource.sort);
        /** @type {?} */
        let cutArray = this.dataSource.filteredData;
        if (this.config.bulkSelectMaxCount) {
            cutArray = this.dataSource.filteredData.slice(0, this.config.bulkSelectMaxCount);
        }
        cutArray.forEach((/**
         * @param {?} row
         * @return {?}
         */
        row => {
            this.selectionMultiple.select(row);
        }));
    }
    /**
     * @return {?}
     */
    isMaxReached() {
        if (!this.config.bulkSelectMaxCount) {
            return false;
        }
        return (this.selectionMultiple.selected.length >= this.config.bulkSelectMaxCount);
    }
    /**
     * @param {?} $event
     * @return {?}
     */
    onColumnFilterChange($event) {
        console.log({ $event });
        /** @type {?} */
        const selectedValues = this.filterControl.value;
        this.setDisplayedColumns(selectedValues);
        this.initFilter(this.dataSource.data);
    }
    /**
     * @param {?} $event
     * @param {?} item
     * @return {?}
     */
    onClickBulkItem($event, item) {
        if ($event) {
            /** @type {?} */
            const isSelected = this.selectionMultiple.isSelected(item);
            if (!this.isMaxReached()) {
                this.selectionMultiple.toggle(item);
            }
            else {
                if (isSelected) {
                    this.selectionMultiple.deselect(item);
                }
                else {
                    this.warn();
                }
            }
            this.selectedBulk.emit(this.selectionMultiple.selected);
        }
    }
    /**
     * @param {?} $event
     * @param {?} row
     * @return {?}
     */
    onClickRow($event, row) {
        if (this.config.onSelectItem) {
            this.log("onClickRow()", { $event, row });
            this.selectionSingle.select(row);
            this.config.onSelectItem(row);
        }
    }
    /**
     * @param {?} $event
     * @param {?} row
     * @return {?}
     */
    onDoubleClickRow($event, row) {
        if (this.config.onSelectItemDoubleClick) {
            this.log("onDoubleClickRow()", { $event, row });
            this.selectionSingle.select(row);
            this.config.onSelectItemDoubleClick(row);
        }
    }
    /**
     * @param {?} action
     * @return {?}
     */
    onClickBulkAction(action) {
        return __awaiter(this, void 0, void 0, function* () {
            yield action.onClick(this.selectionMultiple.selected);
            this.selectionMultiple.clear();
        });
    }
    /**
     * @param {?} str
     * @param {?=} obj
     * @return {?}
     */
    log(str, obj) {
        if (this.config.debug) {
            console.log("<ngx-auto-table> : " + str, obj);
        }
    }
    /**
     * @return {?}
     */
    warn() { }
}
AutoTableComponent.decorators = [
    { type: Component, args: [{
                selector: "ngx-auto-table",
                template: "<div\r\n  class=\"table-header auto-elevation overflow-hidden\"\r\n  [class.addRightPixel]=\"config.hideHeader\"\r\n  *ngIf=\"(!config.hideFilter || !config.hideChooseColumns) && !hasNoItems\"\r\n>\r\n  <div class=\"relative\">\r\n    <mat-toolbar class=\"mat-elevation-z8\">\r\n      <mat-toolbar-row class=\"flex-h align-center space-between\">\r\n        <mat-form-field\r\n          class=\"filter-search\"\r\n          *ngIf=\"!hasNoItems && !config.hideFilter\"\r\n        >\r\n          <mat-icon matPrefix>search</mat-icon>\r\n          <input\r\n            matInput\r\n            (keyup)=\"applyFilter($event.target.value)\"\r\n            [placeholder]=\"this.config.filterText || 'Search Rows...'\"\r\n            #filterField\r\n          />\r\n          <mat-icon\r\n            class=\"has-pointer\"\r\n            matSuffix\r\n            (click)=\"filterField.value = ''; applyFilter(filterField.value)\"\r\n            >clear</mat-icon\r\n          >\r\n        </mat-form-field>\r\n        <mat-form-field\r\n          class=\"filter-columns overflow-hidden\"\r\n          *ngIf=\"!hasNoItems && !config.hideChooseColumns\"\r\n        >\r\n          <mat-icon matPrefix>view_column</mat-icon>\r\n          <mat-select\r\n            placeholder=\"Choose Columns...\"\r\n            [formControl]=\"filterControl\"\r\n            (selectionChange)=\"onColumnFilterChange($event)\"\r\n            multiple\r\n          >\r\n            <mat-option *ngFor=\"let key of headerKeysAllVisible\" [value]=\"key\">\r\n              {{ getKeyHeader(key) }}\r\n            </mat-option>\r\n          </mat-select>\r\n        </mat-form-field>\r\n      </mat-toolbar-row>\r\n    </mat-toolbar>\r\n    <mat-toolbar\r\n      class=\"bulk-actions flex-h align-center mat-primary\"\r\n      *ngIf=\"config.actionsBulk\"\r\n      [class.hidden]=\"!selectionMultiple.hasValue()\"\r\n    >\r\n      <mat-toolbar-row class=\"flex-h align-center space-between\">\r\n        <span class=\"item-count\">\r\n          ({{ selectionMultiple.selected.length }} Items Selected)\r\n          {{ isMaxReached() ? \" Max Reached!\" : \"\" }}\r\n        </span>\r\n        <span class=\"buttons flex-h align-center\">\r\n          <button\r\n            mat-raised-button\r\n            *ngFor=\"let action of config.actionsBulk\"\r\n            (click)=\"onClickBulkAction(action)\"\r\n          >\r\n            <mat-icon>{{ action.icon }}</mat-icon>\r\n            <span>{{ action.label }}</span>\r\n          </button>\r\n        </span>\r\n      </mat-toolbar-row>\r\n    </mat-toolbar>\r\n  </div>\r\n</div>\r\n<table\r\n  mat-table\r\n  #table\r\n  matSort\r\n  [matSortActive]=\"config.initialSort\"\r\n  [matSortDirection]=\"config.initialSortDir\"\r\n  [dataSource]=\"this.dataSource\"\r\n  style=\"width:100%;\"\r\n  class=\"mat-elevation-z8\"\r\n>\r\n  <ng-container\r\n    *ngFor=\"let def of columnDefinitionsAllArray\"\r\n    [matColumnDef]=\"def.field\"\r\n  >\r\n    <th mat-header-cell mat-sort-header *matHeaderCellDef>{{ def.header }}</th>\r\n    <td mat-cell *matCellDef=\"let row\">\r\n      <div *ngIf=\"!def.template\" [class.break-words]=\"def.forceWrap\">\r\n        {{ row[def.field] }}\r\n      </div>\r\n      <div *ngIf=\"def.template\">\r\n        <div\r\n          *ngTemplateOutlet=\"def.template; context: { $implicit: row }\"\r\n        ></div>\r\n      </div>\r\n    </td>\r\n  </ng-container>\r\n\r\n  <ng-container matColumnDef=\"__bulk\" stickyEnd>\r\n    <th mat-header-cell *matHeaderCellDef>\r\n      <mat-checkbox\r\n        (change)=\"$event ? masterToggle() : null\"\r\n        [checked]=\"selectionMultiple.hasValue() && isAllSelected()\"\r\n        [indeterminate]=\"selectionMultiple.hasValue() && !isAllSelected()\"\r\n      >\r\n      </mat-checkbox>\r\n    </th>\r\n    <td mat-cell *matCellDef=\"let row\">\r\n      <mat-checkbox\r\n        (click)=\"$event.stopPropagation()\"\r\n        (change)=\"onClickBulkItem($event, row)\"\r\n        [checked]=\"selectionMultiple.isSelected(row)\"\r\n      >\r\n      </mat-checkbox>\r\n    </td>\r\n  </ng-container>\r\n\r\n  <ng-container matColumnDef=\"__star\" stickyEnd>\r\n    <th mat-header-cell *matHeaderCellDef></th>\r\n    <td mat-cell *matCellDef=\"let row\">\r\n      <div *ngIf=\"config.actions\">\r\n        <mat-icon\r\n          mat-list-icon\r\n          class=\"more-icon has-pointer\"\r\n          [matMenuTriggerFor]=\"rowMenu\"\r\n          >more_vert</mat-icon\r\n        >\r\n        <mat-menu #rowMenu=\"matMenu\" class=\"row-menu\">\r\n          <div mat-menu-item *ngFor=\"let action of config.actions\">\r\n            <button\r\n              mat-menu-item\r\n              *ngIf=\"action.onClick\"\r\n              (click)=\"action.onClick(row)\"\r\n            >\r\n              <mat-icon>{{ action.icon }}</mat-icon>\r\n              <span>{{ action.label }}</span>\r\n            </button>\r\n            <a\r\n              mat-menu-item\r\n              *ngIf=\"action.onRouterLink && !action.routerLinkQuery\"\r\n              [routerLink]=\"['/' + action.onRouterLink(row)]\"\r\n            >\r\n              <mat-icon>{{ action.icon }}</mat-icon>\r\n              <span>{{ action.label }}</span>\r\n            </a>\r\n            <a\r\n              mat-menu-item\r\n              *ngIf=\"action.onRouterLink && action.routerLinkQuery\"\r\n              [routerLink]=\"['/' + action.onRouterLink(row)]\"\r\n              [queryParams]=\"action.routerLinkQuery(row)\"\r\n            >\r\n              <mat-icon>{{ action.icon }}</mat-icon>\r\n              <span>{{ action.label }}</span>\r\n            </a>\r\n          </div>\r\n        </mat-menu>\r\n      </div>\r\n    </td>\r\n  </ng-container>\r\n\r\n  <tr\r\n    mat-header-row\r\n    *matHeaderRowDef=\"headerKeysDisplayed\"\r\n    [hidden]=\"config.hideHeader\"\r\n  ></tr>\r\n  <tr\r\n    mat-row\r\n    *matRowDef=\"let row; columns: headerKeysDisplayed\"\r\n    (click)=\"onClickRow($event, row)\"\r\n    (dblclick)=\"onDoubleClickRow($event, row)\"\r\n    [class.selected-row-multiple]=\"selectionMultiple.isSelected(row)\"\r\n    [class.selected-row-single]=\"selectionSingle.isSelected(row)\"\r\n    [class.has-pointer]=\"config.onSelectItem\"\r\n  ></tr>\r\n</table>\r\n\r\n<mat-toolbar class=\"mat-elevation-z8 overflow-hidden\">\r\n  <mat-toolbar-row *ngIf=\"!dataSource || hasNoItems\">\r\n    <app-toolbar-loader *ngIf=\"!dataSource\"></app-toolbar-loader>\r\n    <h1 *ngIf=\"hasNoItems\" class=\"no-items\">No items found</h1>\r\n  </mat-toolbar-row>\r\n  <mat-toolbar-row class=\"paginator-row\">\r\n    <app-table-csv-export\r\n      *ngIf=\"exportFilename\"\r\n      [dataArray]=\"exportData\"\r\n      [filename]=\"exportFilename\"\r\n    ></app-table-csv-export>\r\n    <mat-paginator [pageSize]=\"pageSize\" [pageSizeOptions]=\"[5, 10, 25, 100]\">\r\n    </mat-paginator>\r\n  </mat-toolbar-row>\r\n</mat-toolbar>\r\n",
                styles: [".no-items,app-toolbar-loader{text-align:center;padding:20px;width:100%}.no-items{color:#555}.addRightPixel{width:calc(100% - 1px)}.relative{position:relative}.overflow-hidden{overflow:hidden}.flex-h{display:flex;flex-direction:row}.space-between{justify-content:space-between}.align-center{align-items:center}.auto-elevation{box-shadow:0 5px 5px -3px rgba(0,0,0,.2),0 8px 10px 1px rgba(0,0,0,.14),0 3px 14px 2px rgba(0,0,0,.12)}.mat-paginator{background-color:transparent}.paginator-row{display:flex;align-items:centered;justify-content:space-between;height:unset}mat-toolbar-row{height:unset}.filter-search{margin-top:11px;margin-bottom:-9px;margin-right:20px}.filter-columns{margin-top:11px;margin-bottom:-9px}.bulk-actions{position:absolute;top:0;transition:.7s;width:100%;height:100%}.item-count{padding-left:10px}button{margin-right:10px}.table-header{width:100%}.hidden{top:-70px!important;overflow:hidden!important;height:0}.selected-row-multiple{background-color:#eee9}td{background:unset}.selected-row-single{background-color:#b5deb6bb}.break-words{word-break:break-all}.more-icon:hover{background-color:#d3d3d3;border-radius:20px}"]
            }] }
];
AutoTableComponent.propDecorators = {
    selectedBulk: [{ type: Output }],
    config: [{ type: Input }],
    columnDefinitions: [{ type: Input }],
    paginator: [{ type: ViewChild, args: [MatPaginator,] }],
    sort: [{ type: ViewChild, args: [MatSort,] }]
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class AppTableLoaderComponent {
}
AppTableLoaderComponent.decorators = [
    { type: Component, args: [{
                selector: 'app-toolbar-loader',
                template: `
    <mat-toolbar-row>
      <div class="loader-container is-button-icon">
        <div class="loader-div">
          <mat-spinner [diameter]="40"></mat-spinner>
        </div>
      </div>
    </mat-toolbar-row>
  `,
                styles: [`
      .loader-container {
        width: 100% !important;
        display: flex !important;
        padding: 0px 0px;
        z-index: 100000000;
      }
      .loader-div {
        margin: auto;
      }
      .loader-container,
      .is-button-icon {
        display: inline-block;
        margin: 0;
        margin-bottom: -4px;
        margin-right: 5px;
      }
    `]
            }] }
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/** @type {?} */
const sharedComponents = [AutoTableComponent, AppTableLoaderComponent];
class AutoTableModule {
}
AutoTableModule.decorators = [
    { type: NgModule, args: [{
                declarations: [...sharedComponents, AppExportCsvExportComponent],
                exports: sharedComponents,
                imports: [
                    CsvModule,
                    ReactiveFormsModule,
                    MatAutocompleteModule,
                    MatButtonModule,
                    MatButtonToggleModule,
                    MatCheckboxModule,
                    MatFormFieldModule,
                    MatIconModule,
                    MatInputModule,
                    MatMenuModule,
                    MatPaginatorModule,
                    MatProgressBarModule,
                    MatProgressSpinnerModule,
                    MatSelectModule,
                    MatSortModule,
                    MatTableModule,
                    MatToolbarModule,
                    CommonModule,
                    RouterModule,
                ]
            },] }
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

export { AutoTableModule, AutoTableComponent, AppExportCsvExportComponent as ɵb, AppTableLoaderComponent as ɵa };

//# sourceMappingURL=ngx-auto-table.js.map