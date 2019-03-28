/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import * as tslib_1 from "tslib";
import { Component, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { FormControl } from '@angular/forms';
import { SelectionModel } from '@angular/cdk/collections';
import { filter } from 'rxjs/operators';
/**
 * @record
 * @template T
 */
export function AutoTableConfig() { }
if (false) {
    /** @type {?} */
    AutoTableConfig.prototype.data$;
    /** @type {?|undefined} */
    AutoTableConfig.prototype.filename;
    /** @type {?|undefined} */
    AutoTableConfig.prototype.actions;
    /** @type {?|undefined} */
    AutoTableConfig.prototype.actionsBulk;
    /** @type {?|undefined} */
    AutoTableConfig.prototype.bulkSelectMaxCount;
    /** @type {?|undefined} */
    AutoTableConfig.prototype.onSelectItem;
    /** @type {?|undefined} */
    AutoTableConfig.prototype.onSelectItemDoubleClick;
    /** @type {?|undefined} */
    AutoTableConfig.prototype.clearSelected;
    /** @type {?|undefined} */
    AutoTableConfig.prototype.initialSort;
    /** @type {?|undefined} */
    AutoTableConfig.prototype.initialSortDir;
    /** @type {?|undefined} */
    AutoTableConfig.prototype.pageSize;
    /** @type {?|undefined} */
    AutoTableConfig.prototype.hideFields;
    /** @type {?|undefined} */
    AutoTableConfig.prototype.hideFilter;
    /** @type {?|undefined} */
    AutoTableConfig.prototype.hideHeader;
    /** @type {?|undefined} */
    AutoTableConfig.prototype.hideChooseColumns;
    /** @type {?|undefined} */
    AutoTableConfig.prototype.filterText;
    /** @type {?|undefined} */
    AutoTableConfig.prototype.exportFilename;
    /** @type {?|undefined} */
    AutoTableConfig.prototype.exportRowFormat;
}
/**
 * @record
 * @template T
 */
export function ActionDefinition() { }
if (false) {
    /** @type {?} */
    ActionDefinition.prototype.label;
    /** @type {?|undefined} */
    ActionDefinition.prototype.icon;
    /** @type {?|undefined} */
    ActionDefinition.prototype.onClick;
    /** @type {?|undefined} */
    ActionDefinition.prototype.onRouterLink;
    /** @type {?|undefined} */
    ActionDefinition.prototype.routerLinkQuery;
}
/**
 * @record
 * @template T
 */
export function ActionDefinitionBulk() { }
if (false) {
    /** @type {?} */
    ActionDefinitionBulk.prototype.label;
    /** @type {?|undefined} */
    ActionDefinitionBulk.prototype.icon;
    /** @type {?|undefined} */
    ActionDefinitionBulk.prototype.onClick;
}
/**
 * @record
 */
export function ColumnDefinition() { }
if (false) {
    /** @type {?|undefined} */
    ColumnDefinition.prototype.header;
    /** @type {?|undefined} */
    ColumnDefinition.prototype.template;
    /** @type {?|undefined} */
    ColumnDefinition.prototype.hide;
    /** @type {?|undefined} */
    ColumnDefinition.prototype.forceWrap;
}
/**
 * @record
 */
function ColumnDefinitionInternal() { }
if (false) {
    /** @type {?} */
    ColumnDefinitionInternal.prototype.field;
}
/**
 * @template T
 */
export class AutoTableComponent {
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
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        this.dataSourceSubscription = this.config.data$
            .pipe(filter((/**
         * @param {?} e
         * @return {?}
         */
        e => !!e)))
            .subscribe((/**
         * @param {?} originalData
         * @return {?}
         */
        originalData => {
            console.log('ngx-auto-table, subscribed: ', { originalData });
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
        if (this.config.clearSelected) {
            this.clearSelectedSubscription = this.config.clearSelected.subscribe((/**
             * @return {?}
             */
            () => {
                console.log('ngx-auto-table: clearSelected');
                this.selectionMultiple.clear();
                this.selectionSingle.clear();
            }));
        }
    }
    /**
     * @return {?}
     */
    ngOnDestroy() {
        if (this.dataSourceSubscription) {
            this.dataSourceSubscription.unsubscribe();
        }
        if (this.clearSelectedSubscription) {
            this.clearSelectedSubscription.unsubscribe();
        }
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
        keysHeader.delete('__bulk');
        keysHeader.delete('__star');
        /** @type {?} */
        const allFieldsExist = Array.from(keysHeader).reduce((/**
         * @param {?} acc
         * @param {?} cur
         * @return {?}
         */
        (acc, cur) => {
            return keysData.has(cur) && acc;
        }), true);
        console.log('ngx-auto-table: initFilter()', {
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
        return str.replace('_', ' ').replace(/\w\S*/g, (/**
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
        console.log('ngx-auto-table: initColumnDefinitions', {
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
            this.headerKeysDisplayed.unshift('__bulk');
        }
        // Add actions column at end
        if (this.config.actions) {
            this.headerKeysDisplayed.push('__star');
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
        this.isAllSelected()
            ? this.selectionMultiple.clear()
            : this.selectAll();
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
                    this.warn(`Max Selection of "${this.config.bulkSelectMaxCount}" Reached`);
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
        console.log('ngx-auto-table: onClickRow()', { $event, row });
        if (this.config.onSelectItem) {
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
        console.log('ngx-auto-table: onClickRow()', { $event, row });
        if (this.config.onSelectItemDoubleClick) {
            this.selectionSingle.select(row);
            this.config.onSelectItemDoubleClick(row);
        }
    }
    /**
     * @param {?} action
     * @return {?}
     */
    onClickBulkAction(action) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield action.onClick(this.selectionMultiple.selected);
            this.selectionMultiple.clear();
        });
    }
    /**
     * @param {?} msg
     * @return {?}
     */
    warn(msg) { }
}
AutoTableComponent.decorators = [
    { type: Component, args: [{
                selector: 'ngx-auto-table',
                template: "<div\r\n  class=\"table-header auto-elevation overflow-hidden\"\r\n  [class.addRightPixel]=\"config.hideHeader\"\r\n  *ngIf=\"(!config.hideFilter || !config.hideChooseColumns) && !hasNoItems\"\r\n>\r\n  <div class=\"relative\">\r\n    <div class=\"filters-container flex-h align-center space-between\">\r\n      <mat-form-field class=\"filter\" *ngIf=\"!hasNoItems && !config.hideFilter\">\r\n        <mat-icon matPrefix>search</mat-icon>\r\n        <input\r\n          matInput\r\n          (keyup)=\"applyFilter($event.target.value)\"\r\n          placeholder=\"Search Rows...\"\r\n          #filterField\r\n        />\r\n        <mat-icon\r\n          class=\"has-pointer\"\r\n          matSuffix\r\n          (click)=\"filterField.value = ''; applyFilter(filterField.value)\"\r\n          >clear</mat-icon\r\n        >\r\n      </mat-form-field>\r\n      <mat-form-field\r\n        class=\"filter-columns overflow-hidden\"\r\n        *ngIf=\"!hasNoItems && !config.hideChooseColumns\"\r\n      >\r\n        <mat-icon matPrefix>view_column</mat-icon>\r\n        <mat-select\r\n          placeholder=\"Choose Columns...\"\r\n          [formControl]=\"filterControl\"\r\n          (selectionChange)=\"onColumnFilterChange($event)\"\r\n          multiple\r\n        >\r\n          <mat-option *ngFor=\"let key of headerKeysAllVisible\" [value]=\"key\">\r\n            {{ getKeyHeader(key) }}\r\n          </mat-option>\r\n        </mat-select>\r\n      </mat-form-field>\r\n    </div>\r\n    <div\r\n      class=\"bulk-actions flex-h align-center space-between\"\r\n      *ngIf=\"config.actionsBulk\"\r\n      [class.hidden]=\"!selectionMultiple.hasValue()\"\r\n    >\r\n      <span class=\"item-count\">\r\n        ({{ selectionMultiple.selected.length }} Items Selected)\r\n        {{ isMaxReached() ? \" Max Reached!\" : \"\" }}\r\n      </span>\r\n      <span class=\"buttons flex-h align-center\">\r\n        <button\r\n          mat-raised-button\r\n          *ngFor=\"let action of config.actionsBulk\"\r\n          (click)=\"onClickBulkAction(action)\"\r\n        >\r\n          <mat-icon>{{ action.icon }}</mat-icon>\r\n          <span>{{ action.label }}</span>\r\n        </button>\r\n      </span>\r\n    </div>\r\n  </div>\r\n</div>\r\n<table\r\n  mat-table\r\n  #table\r\n  matSort\r\n  [matSortActive]=\"config.initialSort\"\r\n  [matSortDirection]=\"config.initialSortDir\"\r\n  [dataSource]=\"this.dataSource\"\r\n  style=\"width:100%;\"\r\n  class=\"mat-elevation-z8\"\r\n>\r\n  <ng-container\r\n    *ngFor=\"let def of columnDefinitionsAllArray\"\r\n    [matColumnDef]=\"def.field\"\r\n  >\r\n    <th mat-header-cell mat-sort-header *matHeaderCellDef>{{ def.header }}</th>\r\n    <td mat-cell *matCellDef=\"let row\">\r\n      <div *ngIf=\"!def.template\" [class.break-words]=\"def.forceWrap\">\r\n        {{ row[def.field] }}\r\n      </div>\r\n      <div *ngIf=\"def.template\">\r\n        <div\r\n          *ngTemplateOutlet=\"def.template; context: { $implicit: row }\"\r\n        ></div>\r\n      </div>\r\n    </td>\r\n  </ng-container>\r\n\r\n  <ng-container matColumnDef=\"__bulk\" stickyEnd>\r\n    <th mat-header-cell *matHeaderCellDef>\r\n      <mat-checkbox\r\n        (change)=\"$event ? masterToggle() : null\"\r\n        [checked]=\"selectionMultiple.hasValue() && isAllSelected()\"\r\n        [indeterminate]=\"selectionMultiple.hasValue() && !isAllSelected()\"\r\n      >\r\n      </mat-checkbox>\r\n    </th>\r\n    <td mat-cell *matCellDef=\"let row\">\r\n      <mat-checkbox\r\n        (click)=\"$event.stopPropagation()\"\r\n        (change)=\"onClickBulkItem($event, row)\"\r\n        [checked]=\"selectionMultiple.isSelected(row)\"\r\n      >\r\n      </mat-checkbox>\r\n    </td>\r\n  </ng-container>\r\n\r\n  <ng-container matColumnDef=\"__star\" stickyEnd>\r\n    <th mat-header-cell *matHeaderCellDef></th>\r\n    <td mat-cell *matCellDef=\"let row\">\r\n      <div *ngIf=\"config.actions\">\r\n        <mat-icon\r\n          mat-list-icon\r\n          class=\"more-icon has-pointer\"\r\n          [matMenuTriggerFor]=\"rowMenu\"\r\n          >more_vert</mat-icon\r\n        >\r\n        <mat-menu #rowMenu=\"matMenu\" class=\"row-menu\">\r\n          <div mat-menu-item *ngFor=\"let action of config.actions\">\r\n            <button\r\n              mat-menu-item\r\n              *ngIf=\"action.onClick\"\r\n              (click)=\"action.onClick(row)\"\r\n            >\r\n              <mat-icon>{{ action.icon }}</mat-icon>\r\n              <span>{{ action.label }}</span>\r\n            </button>\r\n            <a\r\n              mat-menu-item\r\n              *ngIf=\"action.onRouterLink && !action.routerLinkQuery\"\r\n              [routerLink]=\"['/' + action.onRouterLink(row)]\"\r\n            >\r\n              <mat-icon>{{ action.icon }}</mat-icon>\r\n              <span>{{ action.label }}</span>\r\n            </a>\r\n            <a\r\n              mat-menu-item\r\n              *ngIf=\"action.onRouterLink && action.routerLinkQuery\"\r\n              [routerLink]=\"['/' + action.onRouterLink(row)]\"\r\n              [queryParams]=\"action.routerLinkQuery(row)\"\r\n            >\r\n              <mat-icon>{{ action.icon }}</mat-icon>\r\n              <span>{{ action.label }}</span>\r\n            </a>\r\n          </div>\r\n        </mat-menu>\r\n      </div>\r\n    </td>\r\n  </ng-container>\r\n\r\n  <tr\r\n    mat-header-row\r\n    *matHeaderRowDef=\"headerKeysDisplayed\"\r\n    [hidden]=\"config.hideHeader\"\r\n  ></tr>\r\n  <tr\r\n    mat-row\r\n    *matRowDef=\"let row; columns: headerKeysDisplayed\"\r\n    (click)=\"onClickRow($event, row)\"\r\n    (dblclick)=\"onDoubleClickRow($event, row)\"\r\n    [class.selected-row-multiple]=\"selectionMultiple.isSelected(row)\"\r\n    [class.selected-row-single]=\"selectionSingle.isSelected(row)\"\r\n    [class.has-pointer]=\"config.onSelectItem\"\r\n  ></tr>\r\n</table>\r\n\r\n<mat-toolbar class=\"mat-elevation-z8 overflow-hidden\">\r\n  <mat-toolbar-row>\r\n    <app-toolbar-loader *ngIf=\"!dataSource\"></app-toolbar-loader>\r\n    <h1 *ngIf=\"hasNoItems\" class=\"no-items\">No items found</h1>\r\n  </mat-toolbar-row>\r\n  <mat-toolbar-row\r\n    style=\"display: flex; align-items: centered; justify-content: space-between;\"\r\n  >\r\n    <app-table-csv-export\r\n      *ngIf=\"exportFilename\"\r\n      [dataArray]=\"exportData\"\r\n      [filename]=\"exportFilename\"\r\n    ></app-table-csv-export>\r\n    <mat-paginator [pageSize]=\"pageSize\" [pageSizeOptions]=\"[5, 10, 25, 100]\">\r\n    </mat-paginator>\r\n  </mat-toolbar-row>\r\n</mat-toolbar>\r\n",
                styles: [".no-items,app-toolbar-loader{text-align:center;padding:20px;width:100%}.no-items{color:#555}.addRightPixel{width:calc(100% - 1px)}.relative{position:relative}.overflow-hidden{overflow:hidden}.flex-h{display:flex;flex-direction:row}.space-between{justify-content:space-between}.align-center{align-items:center}.auto-elevation{box-shadow:0 5px 5px -3px rgba(0,0,0,.2),0 8px 10px 1px rgba(0,0,0,.14),0 3px 14px 2px rgba(0,0,0,.12)}.table-header{width:100%;background-color:#fff;margin-top:15px;height:70px}.table-header .filters-container .filter,.table-header .filters-container .filter-columns{margin:10px}.table-header .bulk-actions{position:absolute;top:0;transition:.7s;height:70px;background-color:#c4efb3;width:100%}.table-header .bulk-actions .item-count{color:#006400;padding-left:10px}.table-header .bulk-actions .buttons button{margin-right:10px}.hidden{top:-70px!important;overflow:hidden!important}.selected-row-multiple{background-color:#eee}.selected-row-single{background-color:#b5deb6}.break-words{word-break:break-all}.more-icon:hover{background-color:#d3d3d3;border-radius:20px}"]
            }] }
];
AutoTableComponent.propDecorators = {
    selectedBulk: [{ type: Output }],
    config: [{ type: Input }],
    columnDefinitions: [{ type: Input }],
    paginator: [{ type: ViewChild, args: [MatPaginator,] }],
    sort: [{ type: ViewChild, args: [MatSort,] }]
};
if (false) {
    /** @type {?} */
    AutoTableComponent.prototype.selectedBulk;
    /** @type {?} */
    AutoTableComponent.prototype.config;
    /** @type {?} */
    AutoTableComponent.prototype.columnDefinitions;
    /** @type {?} */
    AutoTableComponent.prototype.columnDefinitionsAll;
    /** @type {?} */
    AutoTableComponent.prototype.columnDefinitionsAllArray;
    /** @type {?} */
    AutoTableComponent.prototype.headerKeysAll;
    /** @type {?} */
    AutoTableComponent.prototype.headerKeysAllVisible;
    /** @type {?} */
    AutoTableComponent.prototype.headerKeysDisplayed;
    /** @type {?} */
    AutoTableComponent.prototype.headerKeysDisplayedMap;
    /** @type {?} */
    AutoTableComponent.prototype.dataSource;
    /** @type {?} */
    AutoTableComponent.prototype.dataSourceSubscription;
    /** @type {?} */
    AutoTableComponent.prototype.paginator;
    /** @type {?} */
    AutoTableComponent.prototype.pageSize;
    /** @type {?} */
    AutoTableComponent.prototype.sort;
    /** @type {?} */
    AutoTableComponent.prototype.exportData;
    /** @type {?} */
    AutoTableComponent.prototype.exportFilename;
    /** @type {?} */
    AutoTableComponent.prototype.hasNoItems;
    /** @type {?} */
    AutoTableComponent.prototype.filterControl;
    /** @type {?} */
    AutoTableComponent.prototype.selectionMultiple;
    /** @type {?} */
    AutoTableComponent.prototype.selectionSingle;
    /** @type {?} */
    AutoTableComponent.prototype.clearSelectedSubscription;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LWF1dG8tdGFibGUuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vbmd4LWF1dG8tdGFibGUtbGliLyIsInNvdXJjZXMiOlsiY29tcG9uZW50cy9uZ3gtYXV0by10YWJsZS5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxPQUFPLEVBQ0wsU0FBUyxFQUVULEtBQUssRUFFTCxTQUFTLEVBQ1QsTUFBTSxFQUNOLFlBQVksRUFDYixNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQUUsa0JBQWtCLEVBQUUsWUFBWSxFQUFFLE9BQU8sRUFBRSxNQUFNLG1CQUFtQixDQUFDO0FBRTlFLE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUM3QyxPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sMEJBQTBCLENBQUM7QUFDMUQsT0FBTyxFQUFFLE1BQU0sRUFBRSxNQUFNLGdCQUFnQixDQUFDOzs7OztBQUV4QyxxQ0FtQkM7OztJQWxCQyxnQ0FBdUI7O0lBQ3ZCLG1DQUFrQjs7SUFDbEIsa0NBQWdDOztJQUNoQyxzQ0FBd0M7O0lBQ3hDLDZDQUE0Qjs7SUFDNUIsdUNBQWdDOztJQUNoQyxrREFBMkM7O0lBQzNDLHdDQUFpQzs7SUFDakMsc0NBQXFCOztJQUNyQix5Q0FBZ0M7O0lBQ2hDLG1DQUFrQjs7SUFDbEIscUNBQXNCOztJQUN0QixxQ0FBcUI7O0lBQ3JCLHFDQUFxQjs7SUFDckIsNENBQTRCOztJQUM1QixxQ0FBb0I7O0lBQ3BCLHlDQUF3Qjs7SUFDeEIsMENBQW1DOzs7Ozs7QUFHckMsc0NBTUM7OztJQUxDLGlDQUFjOztJQUNkLGdDQUFjOztJQUNkLG1DQUEyQjs7SUFDM0Isd0NBQWtDOztJQUNsQywyQ0FBaUM7Ozs7OztBQUduQywwQ0FJQzs7O0lBSEMscUNBQWM7O0lBQ2Qsb0NBQWM7O0lBQ2QsdUNBQTZCOzs7OztBQUcvQixzQ0FLQzs7O0lBSkMsa0NBQWdCOztJQUNoQixvQ0FBZTs7SUFD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QUFDLFlBQVk7bUJBRXRCLFNBQVMsU0FBQyxPQUFPOzs7O0lBdEJsQiwwQ0FDdUM7O0lBQ3ZDLG9DQUMyQjs7SUFDM0IsK0NBR087O0lBQ1Asa0RBRU87O0lBQ1AsdURBQTJEOztJQUUzRCwyQ0FBbUI7O0lBQ25CLGtEQUEwQjs7SUFDMUIsaURBQXlCOztJQUN6QixvREFBNEI7O0lBRTVCLHdDQUFvQzs7SUFDcEMsb0RBQXFDOztJQUNyQyx1Q0FBaUQ7O0lBQ2pELHNDQUFjOztJQUNkLGtDQUFrQzs7SUFFbEMsd0NBQWtCOztJQUNsQiw0Q0FBdUI7O0lBRXZCLHdDQUFvQjs7SUFFcEIsMkNBQWtDOztJQUVsQywrQ0FBc0Q7O0lBQ3RELDZDQUFxRDs7SUFDckQsdURBQXdDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcclxuICBDb21wb25lbnQsXHJcbiAgT25Jbml0LFxyXG4gIElucHV0LFxyXG4gIE9uRGVzdHJveSxcclxuICBWaWV3Q2hpbGQsXHJcbiAgT3V0cHV0LFxyXG4gIEV2ZW50RW1pdHRlclxyXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBNYXRUYWJsZURhdGFTb3VyY2UsIE1hdFBhZ2luYXRvciwgTWF0U29ydCB9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsJztcclxuaW1wb3J0IHsgU3Vic2NyaXB0aW9uLCBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcyc7XHJcbmltcG9ydCB7IEZvcm1Db250cm9sIH0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xyXG5pbXBvcnQgeyBTZWxlY3Rpb25Nb2RlbCB9IGZyb20gJ0Bhbmd1bGFyL2Nkay9jb2xsZWN0aW9ucyc7XHJcbmltcG9ydCB7IGZpbHRlciB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgQXV0b1RhYmxlQ29uZmlnPFQ+IHtcclxuICBkYXRhJDogT2JzZXJ2YWJsZTxUW10+O1xyXG4gIGZpbGVuYW1lPzogc3RyaW5nO1xyXG4gIGFjdGlvbnM/OiBBY3Rpb25EZWZpbml0aW9uPFQ+W107XHJcbiAgYWN0aW9uc0J1bGs/OiBBY3Rpb25EZWZpbml0aW9uQnVsazxUPltdO1xyXG4gIGJ1bGtTZWxlY3RNYXhDb3VudD86IG51bWJlcjtcclxuICBvblNlbGVjdEl0ZW0/OiAocm93OiBUKSA9PiB2b2lkO1xyXG4gIG9uU2VsZWN0SXRlbURvdWJsZUNsaWNrPzogKHJvdzogVCkgPT4gdm9pZDtcclxuICBjbGVhclNlbGVjdGVkPzogT2JzZXJ2YWJsZTx2b2lkPjtcclxuICBpbml0aWFsU29ydD86IHN0cmluZztcclxuICBpbml0aWFsU29ydERpcj86ICdhc2MnIHwgJ2Rlc2MnO1xyXG4gIHBhZ2VTaXplPzogbnVtYmVyO1xyXG4gIGhpZGVGaWVsZHM/OiBzdHJpbmdbXTtcclxuICBoaWRlRmlsdGVyPzogYm9vbGVhbjtcclxuICBoaWRlSGVhZGVyPzogYm9vbGVhbjtcclxuICBoaWRlQ2hvb3NlQ29sdW1ucz86IGJvb2xlYW47XHJcbiAgZmlsdGVyVGV4dD86IHN0cmluZztcclxuICBleHBvcnRGaWxlbmFtZT86IHN0cmluZztcclxuICBleHBvcnRSb3dGb3JtYXQ/OiAocm93OiBUKSA9PiB2b2lkO1xyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIEFjdGlvbkRlZmluaXRpb248VD4ge1xyXG4gIGxhYmVsOiBzdHJpbmc7XHJcbiAgaWNvbj86IHN0cmluZztcclxuICBvbkNsaWNrPzogKHJvdzogVCkgPT4gdm9pZDtcclxuICBvblJvdXRlckxpbms/OiAocm93OiBUKSA9PiBzdHJpbmc7XHJcbiAgcm91dGVyTGlua1F1ZXJ5PzogKHJvdzogVCkgPT4ge307XHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgQWN0aW9uRGVmaW5pdGlvbkJ1bGs8VD4ge1xyXG4gIGxhYmVsOiBzdHJpbmc7XHJcbiAgaWNvbj86IHN0cmluZztcclxuICBvbkNsaWNrPzogKHJvdzogVFtdKSA9PiB2b2lkO1xyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIENvbHVtbkRlZmluaXRpb24ge1xyXG4gIGhlYWRlcj86IHN0cmluZztcclxuICB0ZW1wbGF0ZT86IGFueTtcclxuICBoaWRlPzogYm9vbGVhbjtcclxuICBmb3JjZVdyYXA/OiBib29sZWFuO1xyXG59XHJcblxyXG5pbnRlcmZhY2UgQ29sdW1uRGVmaW5pdGlvbkludGVybmFsIGV4dGVuZHMgQ29sdW1uRGVmaW5pdGlvbiB7XHJcbiAgZmllbGQ6IHN0cmluZztcclxufVxyXG5cclxuQENvbXBvbmVudCh7XHJcbiAgc2VsZWN0b3I6ICduZ3gtYXV0by10YWJsZScsXHJcbiAgdGVtcGxhdGVVcmw6ICcuL25neC1hdXRvLXRhYmxlLmNvbXBvbmVudC5odG1sJyxcclxuICBzdHlsZVVybHM6IFsnLi9uZ3gtYXV0by10YWJsZS5jb21wb25lbnQuc2NzcyddXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBBdXRvVGFibGVDb21wb25lbnQ8VD4gaW1wbGVtZW50cyBPbkluaXQsIE9uRGVzdHJveSB7XHJcbiAgQE91dHB1dCgpXHJcbiAgc2VsZWN0ZWRCdWxrID0gbmV3IEV2ZW50RW1pdHRlcjxUW10+KCk7XHJcbiAgQElucHV0KClcclxuICBjb25maWc6IEF1dG9UYWJsZUNvbmZpZzxUPjtcclxuICBASW5wdXQoKVxyXG4gIGNvbHVtbkRlZmluaXRpb25zOiB7XHJcbiAgICBbZmllbGQ6IHN0cmluZ106IENvbHVtbkRlZmluaXRpb247XHJcbiAgfSA9IHt9O1xyXG4gIGNvbHVtbkRlZmluaXRpb25zQWxsOiB7XHJcbiAgICBbZmllbGQ6IHN0cmluZ106IENvbHVtbkRlZmluaXRpb247XHJcbiAgfSA9IHt9O1xyXG4gIGNvbHVtbkRlZmluaXRpb25zQWxsQXJyYXk6IENvbHVtbkRlZmluaXRpb25JbnRlcm5hbFtdID0gW107XHJcblxyXG4gIGhlYWRlcktleXNBbGwgPSBbXTtcclxuICBoZWFkZXJLZXlzQWxsVmlzaWJsZSA9IFtdO1xyXG4gIGhlYWRlcktleXNEaXNwbGF5ZWQgPSBbXTtcclxuICBoZWFkZXJLZXlzRGlzcGxheWVkTWFwID0ge307XHJcblxyXG4gIGRhdGFTb3VyY2U6IE1hdFRhYmxlRGF0YVNvdXJjZTxhbnk+O1xyXG4gIGRhdGFTb3VyY2VTdWJzY3JpcHRpb246IFN1YnNjcmlwdGlvbjtcclxuICBAVmlld0NoaWxkKE1hdFBhZ2luYXRvcikgcGFnaW5hdG9yOiBNYXRQYWdpbmF0b3I7XHJcbiAgcGFnZVNpemUgPSAyNTtcclxuICBAVmlld0NoaWxkKE1hdFNvcnQpIHNvcnQ6IE1hdFNvcnQ7XHJcblxyXG4gIGV4cG9ydERhdGE6IGFueVtdO1xyXG4gIGV4cG9ydEZpbGVuYW1lOiBzdHJpbmc7XHJcblxyXG4gIGhhc05vSXRlbXM6IGJvb2xlYW47XHJcblxyXG4gIGZpbHRlckNvbnRyb2wgPSBuZXcgRm9ybUNvbnRyb2woKTtcclxuICAvLyBCdWxrIGl0ZW1zIHNlbGVjdGlvblxyXG4gIHNlbGVjdGlvbk11bHRpcGxlID0gbmV3IFNlbGVjdGlvbk1vZGVsPGFueT4odHJ1ZSwgW10pO1xyXG4gIHNlbGVjdGlvblNpbmdsZSA9IG5ldyBTZWxlY3Rpb25Nb2RlbDxhbnk+KGZhbHNlLCBbXSk7XHJcbiAgY2xlYXJTZWxlY3RlZFN1YnNjcmlwdGlvbjogU3Vic2NyaXB0aW9uO1xyXG5cclxuICBuZ09uSW5pdCgpIHtcclxuICAgIHRoaXMuZGF0YVNvdXJjZVN1YnNjcmlwdGlvbiA9IHRoaXMuY29uZmlnLmRhdGEkXHJcbiAgICAgIC5waXBlKGZpbHRlcihlID0+ICEhZSkpXHJcbiAgICAgIC5zdWJzY3JpYmUob3JpZ2luYWxEYXRhID0+IHtcclxuICAgICAgICBjb25zb2xlLmxvZygnbmd4LWF1dG8tdGFibGUsIHN1YnNjcmliZWQ6ICcsIHsgb3JpZ2luYWxEYXRhIH0pO1xyXG4gICAgICAgIHRoaXMuZGF0YVNvdXJjZSA9IG5ldyBNYXRUYWJsZURhdGFTb3VyY2Uob3JpZ2luYWxEYXRhKTtcclxuICAgICAgICB0aGlzLmRhdGFTb3VyY2UucGFnaW5hdG9yID0gdGhpcy5wYWdpbmF0b3I7XHJcbiAgICAgICAgdGhpcy5kYXRhU291cmNlLnNvcnQgPSB0aGlzLnNvcnQ7XHJcbiAgICAgICAgaWYgKG9yaWdpbmFsRGF0YSAmJiAhb3JpZ2luYWxEYXRhLmxlbmd0aCkge1xyXG4gICAgICAgICAgdGhpcy5oYXNOb0l0ZW1zID0gdHJ1ZTtcclxuICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgdGhpcy5oYXNOb0l0ZW1zID0gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0aGlzLmNvbmZpZy5wYWdlU2l6ZSkge1xyXG4gICAgICAgICAgdGhpcy5wYWdlU2l6ZSA9IHRoaXMuY29uZmlnLnBhZ2VTaXplO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjb25zdCBmaXJzdERhdGFJdGVtID0gb3JpZ2luYWxEYXRhWzBdO1xyXG4gICAgICAgIHRoaXMuaW5pdERpc3BsYXllZENvbHVtbnMoZmlyc3REYXRhSXRlbSk7XHJcbiAgICAgICAgdGhpcy5pbml0RXhwb3J0KG9yaWdpbmFsRGF0YSk7XHJcbiAgICAgICAgdGhpcy5pbml0RmlsdGVyKG9yaWdpbmFsRGF0YSk7XHJcbiAgICAgIH0pO1xyXG5cclxuICAgIGlmICh0aGlzLmNvbmZpZy5jbGVhclNlbGVjdGVkKSB7XHJcbiAgICAgIHRoaXMuY2xlYXJTZWxlY3RlZFN1YnNjcmlwdGlvbiA9IHRoaXMuY29uZmlnLmNsZWFyU2VsZWN0ZWQuc3Vic2NyaWJlKFxyXG4gICAgICAgICgpID0+IHtcclxuICAgICAgICAgIGNvbnNvbGUubG9nKCduZ3gtYXV0by10YWJsZTogY2xlYXJTZWxlY3RlZCcpO1xyXG4gICAgICAgICAgdGhpcy5zZWxlY3Rpb25NdWx0aXBsZS5jbGVhcigpO1xyXG4gICAgICAgICAgdGhpcy5zZWxlY3Rpb25TaW5nbGUuY2xlYXIoKTtcclxuICAgICAgICB9XHJcbiAgICAgICk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBuZ09uRGVzdHJveSgpIHtcclxuICAgIGlmICh0aGlzLmRhdGFTb3VyY2VTdWJzY3JpcHRpb24pIHtcclxuICAgICAgdGhpcy5kYXRhU291cmNlU3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XHJcbiAgICB9XHJcbiAgICBpZiAodGhpcy5jbGVhclNlbGVjdGVkU3Vic2NyaXB0aW9uKSB7XHJcbiAgICAgIHRoaXMuY2xlYXJTZWxlY3RlZFN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgYXBwbHlGaWx0ZXIoZmlsdGVyVmFsdWU6IHN0cmluZykge1xyXG4gICAgdGhpcy5kYXRhU291cmNlLmZpbHRlciA9IGZpbHRlclZhbHVlLnRyaW0oKS50b0xvd2VyQ2FzZSgpO1xyXG4gICAgdGhpcy5zZWxlY3Rpb25NdWx0aXBsZS5jbGVhcigpO1xyXG4gICAgdGhpcy5zZWxlY3Rpb25TaW5nbGUuY2xlYXIoKTtcclxuICB9XHJcblxyXG4gIGluaXRGaWx0ZXIob3JpZ2luYWxEYXRhOiBUW10pIHtcclxuICAgIGlmICghb3JpZ2luYWxEYXRhLmxlbmd0aCkge1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcbiAgICBjb25zdCBmaXJzdFJvdyA9IG9yaWdpbmFsRGF0YVswXTtcclxuICAgIGNvbnN0IGtleXNEYXRhID0gbmV3IFNldChPYmplY3Qua2V5cyhmaXJzdFJvdykpO1xyXG4gICAgY29uc3Qga2V5c0hlYWRlciA9IG5ldyBTZXQodGhpcy5oZWFkZXJLZXlzRGlzcGxheWVkKTtcclxuICAgIGtleXNIZWFkZXIuZGVsZXRlKCdfX2J1bGsnKTtcclxuICAgIGtleXNIZWFkZXIuZGVsZXRlKCdfX3N0YXInKTtcclxuICAgIGNvbnN0IGFsbEZpZWxkc0V4aXN0ID0gQXJyYXkuZnJvbShrZXlzSGVhZGVyKS5yZWR1Y2UoKGFjYywgY3VyKSA9PiB7XHJcbiAgICAgIHJldHVybiBrZXlzRGF0YS5oYXMoY3VyKSAmJiBhY2M7XHJcbiAgICB9LCB0cnVlKTtcclxuXHJcbiAgICBjb25zb2xlLmxvZygnbmd4LWF1dG8tdGFibGU6IGluaXRGaWx0ZXIoKScsIHtcclxuICAgICAgcm93RmllbGRzOiBrZXlzRGF0YSxcclxuICAgICAgYWxsRmllbGRzRXhpc3QsXHJcbiAgICAgIGhlYWRlcktleXNEaXNwbGF5ZWQ6IHRoaXMuaGVhZGVyS2V5c0Rpc3BsYXllZFxyXG4gICAgfSk7XHJcbiAgICB0aGlzLmRhdGFTb3VyY2UuZmlsdGVyUHJlZGljYXRlID0gKGRhdGE6IFQsIGZpbHRlclRleHQ6IHN0cmluZykgPT4ge1xyXG4gICAgICBpZiAoIWZpbHRlclRleHQpIHtcclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgfVxyXG4gICAgICBpZiAoIWFsbEZpZWxkc0V4aXN0KSB7XHJcbiAgICAgICAgY29uc3QgbG93ZXIgPSBKU09OLnN0cmluZ2lmeShkYXRhKS50b0xvd2VyQ2FzZSgpO1xyXG4gICAgICAgIHJldHVybiBsb3dlci5pbmNsdWRlcyhmaWx0ZXJUZXh0KTtcclxuICAgICAgfVxyXG4gICAgICBmb3IgKGNvbnN0IGtleSBvZiBBcnJheS5mcm9tKGtleXNIZWFkZXIpKSB7XHJcbiAgICAgICAgY29uc3QgZGF0YVZhbCA9IGRhdGFba2V5XTtcclxuICAgICAgICBjb25zdCBzdHIgPSBKU09OLnN0cmluZ2lmeShkYXRhVmFsKTtcclxuICAgICAgICBjb25zdCBpc0ZvdW5kID0gc3RyLnRvTG93ZXJDYXNlKCkuaW5jbHVkZXMoZmlsdGVyVGV4dCk7XHJcbiAgICAgICAgaWYgKGlzRm91bmQpIHtcclxuICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfTtcclxuICB9XHJcblxyXG4gIGluaXRFeHBvcnQob3JpZ2luYWxEYXRhOiBUW10pIHtcclxuICAgIHRoaXMuZXhwb3J0RmlsZW5hbWUgPSB0aGlzLmNvbmZpZy5leHBvcnRGaWxlbmFtZTtcclxuICAgIGlmICghdGhpcy5leHBvcnRGaWxlbmFtZSkge1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcbiAgICB0aGlzLmV4cG9ydERhdGEgPSBvcmlnaW5hbERhdGEubWFwKGRhdGFJdGVtID0+IHtcclxuICAgICAgaWYgKCF0aGlzLmNvbmZpZy5leHBvcnRSb3dGb3JtYXQpIHtcclxuICAgICAgICByZXR1cm4gZGF0YUl0ZW07XHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuIHRoaXMuY29uZmlnLmV4cG9ydFJvd0Zvcm1hdChkYXRhSXRlbSk7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBnZXRLZXlIZWFkZXIoa2V5OiBzdHJpbmcpIHtcclxuICAgIGNvbnN0IGlucHV0RGVmID0gdGhpcy5jb2x1bW5EZWZpbml0aW9uc1trZXldO1xyXG4gICAgaWYgKGlucHV0RGVmICYmIGlucHV0RGVmLmhlYWRlciAhPSBudWxsKSB7XHJcbiAgICAgIHJldHVybiBpbnB1dERlZi5oZWFkZXI7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gdGhpcy50b1RpdGxlQ2FzZShrZXkpO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSB0b1RpdGxlQ2FzZShzdHIpIHtcclxuICAgIHJldHVybiBzdHIucmVwbGFjZSgnXycsICcgJykucmVwbGFjZSgvXFx3XFxTKi9nLCBmdW5jdGlvbih0eHQpIHtcclxuICAgICAgcmV0dXJuIHR4dC5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIHR4dC5zdWJzdHIoMSkudG9Mb3dlckNhc2UoKTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgaW5pdERpc3BsYXllZENvbHVtbnMoZmlyc3REYXRhSXRlbTogVCkge1xyXG4gICAgdGhpcy5pbml0Q29sdW1uRGVmaW5pdGlvbnMoZmlyc3REYXRhSXRlbSk7XHJcblxyXG4gICAgdGhpcy5oZWFkZXJLZXlzQWxsID0gT2JqZWN0LmtleXModGhpcy5jb2x1bW5EZWZpbml0aW9uc0FsbCk7XHJcbiAgICB0aGlzLmhlYWRlcktleXNBbGxWaXNpYmxlID0gdGhpcy5oZWFkZXJLZXlzQWxsO1xyXG4gICAgaWYgKHRoaXMuY29uZmlnLmhpZGVGaWVsZHMpIHtcclxuICAgICAgLy8gSGlkZSBmaWVsZHMgaWYgc3BlY2lmaWVkXHJcbiAgICAgIGNvbnN0IGhpZGVGaWVsZHMgPSBuZXcgU2V0KHRoaXMuY29uZmlnLmhpZGVGaWVsZHMpO1xyXG4gICAgICB0aGlzLmhlYWRlcktleXNBbGxWaXNpYmxlID0gdGhpcy5oZWFkZXJLZXlzQWxsLmZpbHRlcihcclxuICAgICAgICB4ID0+ICFoaWRlRmllbGRzLmhhcyh4KVxyXG4gICAgICApO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IGRpc3BsYXllZCA9IHRoaXMuY29sdW1uRGVmaW5pdGlvbnNBbGxBcnJheVxyXG4gICAgICAuZmlsdGVyKGRlZiA9PiAhZGVmLmhpZGUpXHJcbiAgICAgIC5tYXAoZCA9PiBkLmZpZWxkKTtcclxuXHJcbiAgICB0aGlzLnNldERpc3BsYXllZENvbHVtbnMoZGlzcGxheWVkKTtcclxuICAgIC8vIFNldCBjdXJyZW50bHkgZW5hYmxlZCBpdGVtc1xyXG4gICAgdGhpcy5maWx0ZXJDb250cm9sLnNldFZhbHVlKHRoaXMuaGVhZGVyS2V5c0Rpc3BsYXllZCk7XHJcbiAgfVxyXG5cclxuICBpbml0Q29sdW1uRGVmaW5pdGlvbnMoZmlyc3REYXRhSXRlbTogVCkge1xyXG4gICAgLy8gU2V0IGFsbCBjb2x1bW4gZGVmaW50aW9ucywgd2hpY2ggd2VyZSBleHBsaWNpdGx5IHNldCBpbiBjb25maWdcclxuICAgIGNvbnN0IGlucHV0RGVmaW50aW9uRmllbGRzID0gT2JqZWN0LmtleXModGhpcy5jb2x1bW5EZWZpbml0aW9ucyk7XHJcbiAgICBpbnB1dERlZmludGlvbkZpZWxkcy5mb3JFYWNoKChmaWVsZDogc3RyaW5nKSA9PiB7XHJcbiAgICAgIGNvbnN0IGlucHV0RGVmaW50aW9uID0gdGhpcy5jb2x1bW5EZWZpbml0aW9uc1tmaWVsZF07XHJcbiAgICAgIHRoaXMuY29sdW1uRGVmaW5pdGlvbnNBbGxbZmllbGRdID0ge1xyXG4gICAgICAgIGhlYWRlcjogdGhpcy5nZXRLZXlIZWFkZXIoZmllbGQpLFxyXG4gICAgICAgIHRlbXBsYXRlOiBpbnB1dERlZmludGlvbi50ZW1wbGF0ZSxcclxuICAgICAgICBoaWRlOiBpbnB1dERlZmludGlvbi5oaWRlLFxyXG4gICAgICAgIGZvcmNlV3JhcDogaW5wdXREZWZpbnRpb24uZm9yY2VXcmFwXHJcbiAgICAgIH07XHJcbiAgICB9KTtcclxuXHJcbiAgICAvLyBTZXQgYWxsIGNvbHVtbiBkZWZpbnRpb25zIHJlYWQgZnJvbSB0aGUgXCJpbnB1dCBkYXRhXCJcclxuICAgIGNvbnN0IGlucHV0RGF0YUtleXMgPSBPYmplY3Qua2V5cyhmaXJzdERhdGFJdGVtKTtcclxuICAgIGlucHV0RGF0YUtleXMuZm9yRWFjaCgoZmllbGQ6IHN0cmluZykgPT4ge1xyXG4gICAgICBpZiAoISF0aGlzLmNvbHVtbkRlZmluaXRpb25zQWxsW2ZpZWxkXSkge1xyXG4gICAgICAgIC8vIHNraXAgaWYgZGVmaW5pdGlvbiBleGlzdHNcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIH1cclxuICAgICAgdGhpcy5jb2x1bW5EZWZpbml0aW9uc0FsbFtmaWVsZF0gPSB7XHJcbiAgICAgICAgaGVhZGVyOiB0aGlzLnRvVGl0bGVDYXNlKGZpZWxkKSxcclxuICAgICAgICBoaWRlOiB0cnVlXHJcbiAgICAgIH07XHJcbiAgICB9KTtcclxuXHJcbiAgICB0aGlzLmNvbHVtbkRlZmluaXRpb25zQWxsQXJyYXkgPSBPYmplY3Qua2V5cyh0aGlzLmNvbHVtbkRlZmluaXRpb25zQWxsKS5tYXAoXHJcbiAgICAgIGsgPT4ge1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAuLi50aGlzLmNvbHVtbkRlZmluaXRpb25zQWxsW2tdLFxyXG4gICAgICAgICAgZmllbGQ6IGtcclxuICAgICAgICB9O1xyXG4gICAgICB9XHJcbiAgICApO1xyXG4gICAgY29uc29sZS5sb2coJ25neC1hdXRvLXRhYmxlOiBpbml0Q29sdW1uRGVmaW5pdGlvbnMnLCB7XHJcbiAgICAgIGZpcnN0RGF0YUl0ZW0sXHJcbiAgICAgIGlucHV0RGVmaW50aW9uRmllbGRzXHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIC8vIFNldHMgdGhlIGRpc3BsYXllZCBjb2x1bW5zIGZyb20gYSBzZXQgb2YgZmllbGRuYW1lc1xyXG4gIHNldERpc3BsYXllZENvbHVtbnMoc2VsZWN0ZWQ6IHN0cmluZ1tdKSB7XHJcbiAgICAvLyBJbml0aWFsaXplIGFsbCBrZXlzIGFzIGZhbHNlXHJcbiAgICB0aGlzLmhlYWRlcktleXNBbGxWaXNpYmxlLmZvckVhY2goXHJcbiAgICAgIGsgPT4gKHRoaXMuaGVhZGVyS2V5c0Rpc3BsYXllZE1hcFtrXSA9IGZhbHNlKVxyXG4gICAgKTtcclxuICAgIC8vIFNldCBzZWxlY3RlZCBhcyB0cnVlXHJcbiAgICBzZWxlY3RlZC5mb3JFYWNoKGMgPT4gKHRoaXMuaGVhZGVyS2V5c0Rpc3BsYXllZE1hcFtjXSA9IHRydWUpKTtcclxuICAgIHRoaXMuaGVhZGVyS2V5c0Rpc3BsYXllZCA9IE9iamVjdC5rZXlzKHRoaXMuaGVhZGVyS2V5c0Rpc3BsYXllZE1hcCkuZmlsdGVyKFxyXG4gICAgICBrID0+IHRoaXMuaGVhZGVyS2V5c0Rpc3BsYXllZE1hcFtrXVxyXG4gICAgKTtcclxuICAgIC8vIEFkZCBidWxrIHNlbGVjdCBjb2x1bW4gYXQgc3RhcnRcclxuICAgIGlmICh0aGlzLmNvbmZpZy5hY3Rpb25zQnVsaykge1xyXG4gICAgICB0aGlzLmhlYWRlcktleXNEaXNwbGF5ZWQudW5zaGlmdCgnX19idWxrJyk7XHJcbiAgICB9XHJcbiAgICAvLyBBZGQgYWN0aW9ucyBjb2x1bW4gYXQgZW5kXHJcbiAgICBpZiAodGhpcy5jb25maWcuYWN0aW9ucykge1xyXG4gICAgICB0aGlzLmhlYWRlcktleXNEaXNwbGF5ZWQucHVzaCgnX19zdGFyJyk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvKiogV2hldGhlciB0aGUgbnVtYmVyIG9mIHNlbGVjdGVkIGVsZW1lbnRzIG1hdGNoZXMgdGhlIHRvdGFsIG51bWJlciBvZiByb3dzLiAqL1xyXG4gIGlzQWxsU2VsZWN0ZWQoKSB7XHJcbiAgICBjb25zdCBudW1TZWxlY3RlZCA9IHRoaXMuc2VsZWN0aW9uTXVsdGlwbGUuc2VsZWN0ZWQubGVuZ3RoO1xyXG4gICAgY29uc3QgbnVtUm93cyA9XHJcbiAgICAgIHRoaXMuY29uZmlnLmJ1bGtTZWxlY3RNYXhDb3VudCB8fCB0aGlzLmRhdGFTb3VyY2UuZmlsdGVyZWREYXRhLmxlbmd0aDtcclxuICAgIHJldHVybiBudW1TZWxlY3RlZCA+PSBudW1Sb3dzO1xyXG4gIH1cclxuXHJcbiAgLyoqIFNlbGVjdHMgYWxsIHJvd3MgaWYgdGhleSBhcmUgbm90IGFsbCBzZWxlY3RlZDsgb3RoZXJ3aXNlIGNsZWFyIHNlbGVjdGlvbi4gKi9cclxuICBtYXN0ZXJUb2dnbGUoKSB7XHJcbiAgICB0aGlzLmlzQWxsU2VsZWN0ZWQoKVxyXG4gICAgICA/IHRoaXMuc2VsZWN0aW9uTXVsdGlwbGUuY2xlYXIoKVxyXG4gICAgICA6IHRoaXMuc2VsZWN0QWxsKCk7XHJcbiAgICB0aGlzLnNlbGVjdGVkQnVsay5lbWl0KHRoaXMuc2VsZWN0aW9uTXVsdGlwbGUuc2VsZWN0ZWQpO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBzZWxlY3RBbGwoKSB7XHJcbiAgICB0aGlzLmRhdGFTb3VyY2Uuc29ydERhdGEodGhpcy5kYXRhU291cmNlLmZpbHRlcmVkRGF0YSwgdGhpcy5kYXRhU291cmNlLnNvcnQpO1xyXG4gICAgbGV0IGN1dEFycmF5ID0gdGhpcy5kYXRhU291cmNlLmZpbHRlcmVkRGF0YTtcclxuICAgIGlmICh0aGlzLmNvbmZpZy5idWxrU2VsZWN0TWF4Q291bnQpIHtcclxuICAgICAgY3V0QXJyYXkgPSB0aGlzLmRhdGFTb3VyY2UuZmlsdGVyZWREYXRhLnNsaWNlKDAsIHRoaXMuY29uZmlnLmJ1bGtTZWxlY3RNYXhDb3VudCk7XHJcbiAgICB9XHJcbiAgICBjdXRBcnJheS5mb3JFYWNoKHJvdyA9PiB7XHJcbiAgICAgIHRoaXMuc2VsZWN0aW9uTXVsdGlwbGUuc2VsZWN0KHJvdyk7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIGlzTWF4UmVhY2hlZCgpIHtcclxuICAgIGlmICghdGhpcy5jb25maWcuYnVsa1NlbGVjdE1heENvdW50KSB7XHJcbiAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuICAgIHJldHVybiAoXHJcbiAgICAgIHRoaXMuc2VsZWN0aW9uTXVsdGlwbGUuc2VsZWN0ZWQubGVuZ3RoID49IHRoaXMuY29uZmlnLmJ1bGtTZWxlY3RNYXhDb3VudFxyXG4gICAgKTtcclxuICB9XHJcblxyXG4gIG9uQ29sdW1uRmlsdGVyQ2hhbmdlKCRldmVudCkge1xyXG4gICAgY29uc29sZS5sb2coeyAkZXZlbnQgfSk7XHJcbiAgICBjb25zdCBzZWxlY3RlZFZhbHVlcyA9IHRoaXMuZmlsdGVyQ29udHJvbC52YWx1ZTtcclxuICAgIHRoaXMuc2V0RGlzcGxheWVkQ29sdW1ucyhzZWxlY3RlZFZhbHVlcyk7XHJcbiAgICB0aGlzLmluaXRGaWx0ZXIodGhpcy5kYXRhU291cmNlLmRhdGEpO1xyXG4gIH1cclxuXHJcbiAgb25DbGlja0J1bGtJdGVtKCRldmVudCwgaXRlbSkge1xyXG4gICAgaWYgKCRldmVudCkge1xyXG4gICAgICBjb25zdCBpc1NlbGVjdGVkID0gdGhpcy5zZWxlY3Rpb25NdWx0aXBsZS5pc1NlbGVjdGVkKGl0ZW0pO1xyXG4gICAgICBpZiAoIXRoaXMuaXNNYXhSZWFjaGVkKCkpIHtcclxuICAgICAgICB0aGlzLnNlbGVjdGlvbk11bHRpcGxlLnRvZ2dsZShpdGVtKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBpZiAoaXNTZWxlY3RlZCkge1xyXG4gICAgICAgICAgdGhpcy5zZWxlY3Rpb25NdWx0aXBsZS5kZXNlbGVjdChpdGVtKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgdGhpcy53YXJuKFxyXG4gICAgICAgICAgICBgTWF4IFNlbGVjdGlvbiBvZiBcIiR7dGhpcy5jb25maWcuYnVsa1NlbGVjdE1heENvdW50fVwiIFJlYWNoZWRgXHJcbiAgICAgICAgICApO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgICB0aGlzLnNlbGVjdGVkQnVsay5lbWl0KHRoaXMuc2VsZWN0aW9uTXVsdGlwbGUuc2VsZWN0ZWQpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgb25DbGlja1JvdygkZXZlbnQsIHJvdzogVCkge1xyXG4gICAgY29uc29sZS5sb2coJ25neC1hdXRvLXRhYmxlOiBvbkNsaWNrUm93KCknLCB7ICRldmVudCwgcm93IH0pO1xyXG4gICAgaWYgKHRoaXMuY29uZmlnLm9uU2VsZWN0SXRlbSkge1xyXG4gICAgICB0aGlzLnNlbGVjdGlvblNpbmdsZS5zZWxlY3Qocm93KTtcclxuICAgICAgdGhpcy5jb25maWcub25TZWxlY3RJdGVtKHJvdyk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBvbkRvdWJsZUNsaWNrUm93KCRldmVudCwgcm93OiBUKSB7XHJcbiAgICBjb25zb2xlLmxvZygnbmd4LWF1dG8tdGFibGU6IG9uQ2xpY2tSb3coKScsIHsgJGV2ZW50LCByb3cgfSk7XHJcbiAgICBpZiAodGhpcy5jb25maWcub25TZWxlY3RJdGVtRG91YmxlQ2xpY2spIHtcclxuICAgICAgdGhpcy5zZWxlY3Rpb25TaW5nbGUuc2VsZWN0KHJvdyk7XHJcbiAgICAgIHRoaXMuY29uZmlnLm9uU2VsZWN0SXRlbURvdWJsZUNsaWNrKHJvdyk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBhc3luYyBvbkNsaWNrQnVsa0FjdGlvbihhY3Rpb246IEFjdGlvbkRlZmluaXRpb25CdWxrPFQ+KSB7XHJcbiAgICBhd2FpdCBhY3Rpb24ub25DbGljayh0aGlzLnNlbGVjdGlvbk11bHRpcGxlLnNlbGVjdGVkKTtcclxuICAgIHRoaXMuc2VsZWN0aW9uTXVsdGlwbGUuY2xlYXIoKTtcclxuICB9XHJcblxyXG4gIHdhcm4obXNnOiBzdHJpbmcpIHt9XHJcbn1cclxuIl19