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
    AutoTableConfig.prototype.debug;
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
                this.log('clearSelected');
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
        this.log('initFilter()', {
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
        this.log('initColumnDefinitions', {
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
        if (this.config.onSelectItem) {
            this.log('onClickRow()', { $event, row });
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
            this.log('onDoubleClickRow()', { $event, row });
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
     * @param {?} str
     * @param {?=} obj
     * @return {?}
     */
    log(str, obj) {
        if (this.config.debug) {
            console.log('<ngx-auto-table> : ' + str, obj);
        }
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
                template: "<div\r\n  class=\"table-header auto-elevation overflow-hidden\"\r\n  [class.addRightPixel]=\"config.hideHeader\"\r\n  *ngIf=\"(!config.hideFilter || !config.hideChooseColumns) && !hasNoItems\"\r\n>\r\n  <div class=\"relative\">\r\n    <div class=\"filters-container flex-h align-center space-between\">\r\n      <mat-form-field class=\"filter\" *ngIf=\"!hasNoItems && !config.hideFilter\">\r\n        <mat-icon matPrefix>search</mat-icon>\r\n        <input\r\n          matInput\r\n          (keyup)=\"applyFilter($event.target.value)\"\r\n          [placeholder]=\"this.config.filterText || 'Search Rows...'\"\r\n          #filterField\r\n        />\r\n        <mat-icon\r\n          class=\"has-pointer\"\r\n          matSuffix\r\n          (click)=\"filterField.value = ''; applyFilter(filterField.value)\"\r\n          >clear</mat-icon\r\n        >\r\n      </mat-form-field>\r\n      <mat-form-field\r\n        class=\"filter-columns overflow-hidden\"\r\n        *ngIf=\"!hasNoItems && !config.hideChooseColumns\"\r\n      >\r\n        <mat-icon matPrefix>view_column</mat-icon>\r\n        <mat-select\r\n          placeholder=\"Choose Columns...\"\r\n          [formControl]=\"filterControl\"\r\n          (selectionChange)=\"onColumnFilterChange($event)\"\r\n          multiple\r\n        >\r\n          <mat-option *ngFor=\"let key of headerKeysAllVisible\" [value]=\"key\">\r\n            {{ getKeyHeader(key) }}\r\n          </mat-option>\r\n        </mat-select>\r\n      </mat-form-field>\r\n    </div>\r\n    <div\r\n      class=\"bulk-actions flex-h align-center space-between\"\r\n      *ngIf=\"config.actionsBulk\"\r\n      [class.hidden]=\"!selectionMultiple.hasValue()\"\r\n    >\r\n      <span class=\"item-count\">\r\n        ({{ selectionMultiple.selected.length }} Items Selected)\r\n        {{ isMaxReached() ? \" Max Reached!\" : \"\" }}\r\n      </span>\r\n      <span class=\"buttons flex-h align-center\">\r\n        <button\r\n          mat-raised-button\r\n          *ngFor=\"let action of config.actionsBulk\"\r\n          (click)=\"onClickBulkAction(action)\"\r\n        >\r\n          <mat-icon>{{ action.icon }}</mat-icon>\r\n          <span>{{ action.label }}</span>\r\n        </button>\r\n      </span>\r\n    </div>\r\n  </div>\r\n</div>\r\n<table\r\n  mat-table\r\n  #table\r\n  matSort\r\n  [matSortActive]=\"config.initialSort\"\r\n  [matSortDirection]=\"config.initialSortDir\"\r\n  [dataSource]=\"this.dataSource\"\r\n  style=\"width:100%;\"\r\n  class=\"mat-elevation-z8\"\r\n>\r\n  <ng-container\r\n    *ngFor=\"let def of columnDefinitionsAllArray\"\r\n    [matColumnDef]=\"def.field\"\r\n  >\r\n    <th mat-header-cell mat-sort-header *matHeaderCellDef>{{ def.header }}</th>\r\n    <td mat-cell *matCellDef=\"let row\">\r\n      <div *ngIf=\"!def.template\" [class.break-words]=\"def.forceWrap\">\r\n        {{ row[def.field] }}\r\n      </div>\r\n      <div *ngIf=\"def.template\">\r\n        <div\r\n          *ngTemplateOutlet=\"def.template; context: { $implicit: row }\"\r\n        ></div>\r\n      </div>\r\n    </td>\r\n  </ng-container>\r\n\r\n  <ng-container matColumnDef=\"__bulk\" stickyEnd>\r\n    <th mat-header-cell *matHeaderCellDef>\r\n      <mat-checkbox\r\n        (change)=\"$event ? masterToggle() : null\"\r\n        [checked]=\"selectionMultiple.hasValue() && isAllSelected()\"\r\n        [indeterminate]=\"selectionMultiple.hasValue() && !isAllSelected()\"\r\n      >\r\n      </mat-checkbox>\r\n    </th>\r\n    <td mat-cell *matCellDef=\"let row\">\r\n      <mat-checkbox\r\n        (click)=\"$event.stopPropagation()\"\r\n        (change)=\"onClickBulkItem($event, row)\"\r\n        [checked]=\"selectionMultiple.isSelected(row)\"\r\n      >\r\n      </mat-checkbox>\r\n    </td>\r\n  </ng-container>\r\n\r\n  <ng-container matColumnDef=\"__star\" stickyEnd>\r\n    <th mat-header-cell *matHeaderCellDef></th>\r\n    <td mat-cell *matCellDef=\"let row\">\r\n      <div *ngIf=\"config.actions\">\r\n        <mat-icon\r\n          mat-list-icon\r\n          class=\"more-icon has-pointer\"\r\n          [matMenuTriggerFor]=\"rowMenu\"\r\n          >more_vert</mat-icon\r\n        >\r\n        <mat-menu #rowMenu=\"matMenu\" class=\"row-menu\">\r\n          <div mat-menu-item *ngFor=\"let action of config.actions\">\r\n            <button\r\n              mat-menu-item\r\n              *ngIf=\"action.onClick\"\r\n              (click)=\"action.onClick(row)\"\r\n            >\r\n              <mat-icon>{{ action.icon }}</mat-icon>\r\n              <span>{{ action.label }}</span>\r\n            </button>\r\n            <a\r\n              mat-menu-item\r\n              *ngIf=\"action.onRouterLink && !action.routerLinkQuery\"\r\n              [routerLink]=\"['/' + action.onRouterLink(row)]\"\r\n            >\r\n              <mat-icon>{{ action.icon }}</mat-icon>\r\n              <span>{{ action.label }}</span>\r\n            </a>\r\n            <a\r\n              mat-menu-item\r\n              *ngIf=\"action.onRouterLink && action.routerLinkQuery\"\r\n              [routerLink]=\"['/' + action.onRouterLink(row)]\"\r\n              [queryParams]=\"action.routerLinkQuery(row)\"\r\n            >\r\n              <mat-icon>{{ action.icon }}</mat-icon>\r\n              <span>{{ action.label }}</span>\r\n            </a>\r\n          </div>\r\n        </mat-menu>\r\n      </div>\r\n    </td>\r\n  </ng-container>\r\n\r\n  <tr\r\n    mat-header-row\r\n    *matHeaderRowDef=\"headerKeysDisplayed\"\r\n    [hidden]=\"config.hideHeader\"\r\n  ></tr>\r\n  <tr\r\n    mat-row\r\n    *matRowDef=\"let row; columns: headerKeysDisplayed\"\r\n    (click)=\"onClickRow($event, row)\"\r\n    (dblclick)=\"onDoubleClickRow($event, row)\"\r\n    [class.selected-row-multiple]=\"selectionMultiple.isSelected(row)\"\r\n    [class.selected-row-single]=\"selectionSingle.isSelected(row)\"\r\n    [class.has-pointer]=\"config.onSelectItem\"\r\n  ></tr>\r\n</table>\r\n\r\n<mat-toolbar class=\"mat-elevation-z8 overflow-hidden\">\r\n  <mat-toolbar-row *ngIf=\"!dataSource || hasNoItems\">\r\n    <app-toolbar-loader *ngIf=\"!dataSource\"></app-toolbar-loader>\r\n    <h1 *ngIf=\"hasNoItems\" class=\"no-items\">No items found</h1>\r\n  </mat-toolbar-row>\r\n  <mat-toolbar-row\r\n    class=\"paginator-row\"\r\n  >\r\n    <app-table-csv-export\r\n      *ngIf=\"exportFilename\"\r\n      [dataArray]=\"exportData\"\r\n      [filename]=\"exportFilename\"\r\n    ></app-table-csv-export>\r\n    <mat-paginator [pageSize]=\"pageSize\" [pageSizeOptions]=\"[5, 10, 25, 100]\">\r\n    </mat-paginator>\r\n  </mat-toolbar-row>\r\n</mat-toolbar>\r\n",
                styles: [".no-items,app-toolbar-loader{text-align:center;padding:20px;width:100%}.no-items{color:#555}.addRightPixel{width:calc(100% - 1px)}.relative{position:relative}.overflow-hidden{overflow:hidden}.flex-h{display:flex;flex-direction:row}.space-between{justify-content:space-between}.align-center{align-items:center}.auto-elevation{box-shadow:0 5px 5px -3px rgba(0,0,0,.2),0 8px 10px 1px rgba(0,0,0,.14),0 3px 14px 2px rgba(0,0,0,.12)}.mat-paginator{background-color:transparent}.paginator-row{display:flex;align-items:centered;justify-content:space-between;height:unset}.table-header{width:100%;background-color:#fff;height:70px}.table-header .filters-container .filter,.table-header .filters-container .filter-columns{margin:10px}.table-header .bulk-actions{position:absolute;top:0;transition:.7s;height:70px;background-color:#c4efb3;width:100%}.table-header .bulk-actions .item-count{color:#006400;padding-left:10px}.table-header .bulk-actions .buttons button{margin-right:10px}.hidden{top:-70px!important;overflow:hidden!important}.selected-row-multiple{background-color:#eee}.selected-row-single{background-color:#b5deb6}.break-words{word-break:break-all}.more-icon:hover{background-color:#d3d3d3;border-radius:20px}"]
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LWF1dG8tdGFibGUuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vbmd4LWF1dG8tdGFibGUtbGliLyIsInNvdXJjZXMiOlsiY29tcG9uZW50cy9uZ3gtYXV0by10YWJsZS5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxPQUFPLEVBQ0wsU0FBUyxFQUVULEtBQUssRUFFTCxTQUFTLEVBQ1QsTUFBTSxFQUNOLFlBQVksRUFDYixNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQUUsa0JBQWtCLEVBQUUsWUFBWSxFQUFFLE9BQU8sRUFBRSxNQUFNLG1CQUFtQixDQUFDO0FBRTlFLE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUM3QyxPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sMEJBQTBCLENBQUM7QUFDMUQsT0FBTyxFQUFFLE1BQU0sRUFBRSxNQUFNLGdCQUFnQixDQUFDOzs7OztBQUV4QyxxQ0FvQkM7OztJQW5CQyxnQ0FBZTs7SUFDZixnQ0FBdUI7O0lBQ3ZCLG1DQUFrQjs7SUFDbEIsa0NBQWdDOztJQUNoQyxzQ0FBd0M7O0lBQ3hDLDZDQUE0Qjs7SUFDNUIsdUNBQWdDOztJQUNoQyxrREFBMkM7O0lBQzNDLHdDQUFpQzs7SUFDakMsc0NBQXFCOztJQUNyQix5Q0FBZ0M7O0lBQ2hDLG1DQUFrQjs7SUFDbEIscUNBQXNCOztJQUN0QixxQ0FBcUI7O0lBQ3JCLHFDQUFxQjs7SUFDckIsNENBQTRCOztJQUM1QixxQ0FBb0I7O0lBQ3BCLHlDQUF3Qjs7SUFDeEIsMENBQW1DOzs7Ozs7QUFHckMsc0NBTUM7OztJQUxDLGlDQUFjOztJQUNkLGdDQUFjOztJQUNkLG1DQUEyQjs7SUFDM0Isd0NBQWtDOztJQUNsQywyQ0FBaUM7Ozs7OztBQUduQywwQ0FJQzs7O0lBSEMscUNBQWM7O0lBQ2Qsb0NBQWM7O0lBQ2QsdUNBQTZCOzs7OztBQUcvQixzQ0FLQzs7O0lBSkMsa0NBQWdCOztJQUNo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QUMvQztJQUNILENBQUM7Ozs7O0lBRUQsSUFBSSxDQUFDLEdBQVcsSUFBRyxDQUFDOzs7WUFyVXJCLFNBQVMsU0FBQztnQkFDVCxRQUFRLEVBQUUsZ0JBQWdCO2dCQUMxQix5OU1BQThDOzthQUUvQzs7OzJCQUVFLE1BQU07cUJBRU4sS0FBSztnQ0FFTCxLQUFLO3dCQWdCTCxTQUFTLFNBQUMsWUFBWTttQkFFdEIsU0FBUyxTQUFDLE9BQU87Ozs7SUF0QmxCLDBDQUN1Qzs7SUFDdkMsb0NBQzJCOztJQUMzQiwrQ0FHTzs7SUFDUCxrREFFTzs7SUFDUCx1REFBMkQ7O0lBRTNELDJDQUFtQjs7SUFDbkIsa0RBQTBCOztJQUMxQixpREFBeUI7O0lBQ3pCLG9EQUE0Qjs7SUFFNUIsd0NBQW9DOztJQUNwQyxvREFBcUM7O0lBQ3JDLHVDQUFpRDs7SUFDakQsc0NBQWM7O0lBQ2Qsa0NBQWtDOztJQUVsQyx3Q0FBa0I7O0lBQ2xCLDRDQUF1Qjs7SUFFdkIsd0NBQW9COztJQUVwQiwyQ0FBa0M7O0lBRWxDLCtDQUFzRDs7SUFDdEQsNkNBQXFEOztJQUNyRCx1REFBd0MiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xyXG4gIENvbXBvbmVudCxcclxuICBPbkluaXQsXHJcbiAgSW5wdXQsXHJcbiAgT25EZXN0cm95LFxyXG4gIFZpZXdDaGlsZCxcclxuICBPdXRwdXQsXHJcbiAgRXZlbnRFbWl0dGVyXHJcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IE1hdFRhYmxlRGF0YVNvdXJjZSwgTWF0UGFnaW5hdG9yLCBNYXRTb3J0IH0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwnO1xyXG5pbXBvcnQgeyBTdWJzY3JpcHRpb24sIE9ic2VydmFibGUgfSBmcm9tICdyeGpzJztcclxuaW1wb3J0IHsgRm9ybUNvbnRyb2wgfSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XHJcbmltcG9ydCB7IFNlbGVjdGlvbk1vZGVsIH0gZnJvbSAnQGFuZ3VsYXIvY2RrL2NvbGxlY3Rpb25zJztcclxuaW1wb3J0IHsgZmlsdGVyIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xyXG5cclxuZXhwb3J0IGludGVyZmFjZSBBdXRvVGFibGVDb25maWc8VD4ge1xyXG4gIGRlYnVnOiBib29sZWFuO1xyXG4gIGRhdGEkOiBPYnNlcnZhYmxlPFRbXT47XHJcbiAgZmlsZW5hbWU/OiBzdHJpbmc7XHJcbiAgYWN0aW9ucz86IEFjdGlvbkRlZmluaXRpb248VD5bXTtcclxuICBhY3Rpb25zQnVsaz86IEFjdGlvbkRlZmluaXRpb25CdWxrPFQ+W107XHJcbiAgYnVsa1NlbGVjdE1heENvdW50PzogbnVtYmVyO1xyXG4gIG9uU2VsZWN0SXRlbT86IChyb3c6IFQpID0+IHZvaWQ7XHJcbiAgb25TZWxlY3RJdGVtRG91YmxlQ2xpY2s/OiAocm93OiBUKSA9PiB2b2lkO1xyXG4gIGNsZWFyU2VsZWN0ZWQ/OiBPYnNlcnZhYmxlPHZvaWQ+O1xyXG4gIGluaXRpYWxTb3J0Pzogc3RyaW5nO1xyXG4gIGluaXRpYWxTb3J0RGlyPzogJ2FzYycgfCAnZGVzYyc7XHJcbiAgcGFnZVNpemU/OiBudW1iZXI7XHJcbiAgaGlkZUZpZWxkcz86IHN0cmluZ1tdO1xyXG4gIGhpZGVGaWx0ZXI/OiBib29sZWFuO1xyXG4gIGhpZGVIZWFkZXI/OiBib29sZWFuO1xyXG4gIGhpZGVDaG9vc2VDb2x1bW5zPzogYm9vbGVhbjtcclxuICBmaWx0ZXJUZXh0Pzogc3RyaW5nO1xyXG4gIGV4cG9ydEZpbGVuYW1lPzogc3RyaW5nO1xyXG4gIGV4cG9ydFJvd0Zvcm1hdD86IChyb3c6IFQpID0+IHZvaWQ7XHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgQWN0aW9uRGVmaW5pdGlvbjxUPiB7XHJcbiAgbGFiZWw6IHN0cmluZztcclxuICBpY29uPzogc3RyaW5nO1xyXG4gIG9uQ2xpY2s/OiAocm93OiBUKSA9PiB2b2lkO1xyXG4gIG9uUm91dGVyTGluaz86IChyb3c6IFQpID0+IHN0cmluZztcclxuICByb3V0ZXJMaW5rUXVlcnk/OiAocm93OiBUKSA9PiB7fTtcclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBBY3Rpb25EZWZpbml0aW9uQnVsazxUPiB7XHJcbiAgbGFiZWw6IHN0cmluZztcclxuICBpY29uPzogc3RyaW5nO1xyXG4gIG9uQ2xpY2s/OiAocm93OiBUW10pID0+IHZvaWQ7XHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgQ29sdW1uRGVmaW5pdGlvbiB7XHJcbiAgaGVhZGVyPzogc3RyaW5nO1xyXG4gIHRlbXBsYXRlPzogYW55O1xyXG4gIGhpZGU/OiBib29sZWFuO1xyXG4gIGZvcmNlV3JhcD86IGJvb2xlYW47XHJcbn1cclxuXHJcbmludGVyZmFjZSBDb2x1bW5EZWZpbml0aW9uSW50ZXJuYWwgZXh0ZW5kcyBDb2x1bW5EZWZpbml0aW9uIHtcclxuICBmaWVsZDogc3RyaW5nO1xyXG59XHJcblxyXG5AQ29tcG9uZW50KHtcclxuICBzZWxlY3RvcjogJ25neC1hdXRvLXRhYmxlJyxcclxuICB0ZW1wbGF0ZVVybDogJy4vbmd4LWF1dG8tdGFibGUuY29tcG9uZW50Lmh0bWwnLFxyXG4gIHN0eWxlVXJsczogWycuL25neC1hdXRvLXRhYmxlLmNvbXBvbmVudC5zY3NzJ11cclxufSlcclxuZXhwb3J0IGNsYXNzIEF1dG9UYWJsZUNvbXBvbmVudDxUPiBpbXBsZW1lbnRzIE9uSW5pdCwgT25EZXN0cm95IHtcclxuICBAT3V0cHV0KClcclxuICBzZWxlY3RlZEJ1bGsgPSBuZXcgRXZlbnRFbWl0dGVyPFRbXT4oKTtcclxuICBASW5wdXQoKVxyXG4gIGNvbmZpZzogQXV0b1RhYmxlQ29uZmlnPFQ+O1xyXG4gIEBJbnB1dCgpXHJcbiAgY29sdW1uRGVmaW5pdGlvbnM6IHtcclxuICAgIFtmaWVsZDogc3RyaW5nXTogQ29sdW1uRGVmaW5pdGlvbjtcclxuICB9ID0ge307XHJcbiAgY29sdW1uRGVmaW5pdGlvbnNBbGw6IHtcclxuICAgIFtmaWVsZDogc3RyaW5nXTogQ29sdW1uRGVmaW5pdGlvbjtcclxuICB9ID0ge307XHJcbiAgY29sdW1uRGVmaW5pdGlvbnNBbGxBcnJheTogQ29sdW1uRGVmaW5pdGlvbkludGVybmFsW10gPSBbXTtcclxuXHJcbiAgaGVhZGVyS2V5c0FsbCA9IFtdO1xyXG4gIGhlYWRlcktleXNBbGxWaXNpYmxlID0gW107XHJcbiAgaGVhZGVyS2V5c0Rpc3BsYXllZCA9IFtdO1xyXG4gIGhlYWRlcktleXNEaXNwbGF5ZWRNYXAgPSB7fTtcclxuXHJcbiAgZGF0YVNvdXJjZTogTWF0VGFibGVEYXRhU291cmNlPGFueT47XHJcbiAgZGF0YVNvdXJjZVN1YnNjcmlwdGlvbjogU3Vic2NyaXB0aW9uO1xyXG4gIEBWaWV3Q2hpbGQoTWF0UGFnaW5hdG9yKSBwYWdpbmF0b3I6IE1hdFBhZ2luYXRvcjtcclxuICBwYWdlU2l6ZSA9IDI1O1xyXG4gIEBWaWV3Q2hpbGQoTWF0U29ydCkgc29ydDogTWF0U29ydDtcclxuXHJcbiAgZXhwb3J0RGF0YTogYW55W107XHJcbiAgZXhwb3J0RmlsZW5hbWU6IHN0cmluZztcclxuXHJcbiAgaGFzTm9JdGVtczogYm9vbGVhbjtcclxuXHJcbiAgZmlsdGVyQ29udHJvbCA9IG5ldyBGb3JtQ29udHJvbCgpO1xyXG4gIC8vIEJ1bGsgaXRlbXMgc2VsZWN0aW9uXHJcbiAgc2VsZWN0aW9uTXVsdGlwbGUgPSBuZXcgU2VsZWN0aW9uTW9kZWw8YW55Pih0cnVlLCBbXSk7XHJcbiAgc2VsZWN0aW9uU2luZ2xlID0gbmV3IFNlbGVjdGlvbk1vZGVsPGFueT4oZmFsc2UsIFtdKTtcclxuICBjbGVhclNlbGVjdGVkU3Vic2NyaXB0aW9uOiBTdWJzY3JpcHRpb247XHJcblxyXG4gIG5nT25Jbml0KCkge1xyXG4gICAgdGhpcy5kYXRhU291cmNlU3Vic2NyaXB0aW9uID0gdGhpcy5jb25maWcuZGF0YSRcclxuICAgICAgLnBpcGUoZmlsdGVyKGUgPT4gISFlKSlcclxuICAgICAgLnN1YnNjcmliZShvcmlnaW5hbERhdGEgPT4ge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKCduZ3gtYXV0by10YWJsZSwgc3Vic2NyaWJlZDogJywgeyBvcmlnaW5hbERhdGEgfSk7XHJcbiAgICAgICAgdGhpcy5kYXRhU291cmNlID0gbmV3IE1hdFRhYmxlRGF0YVNvdXJjZShvcmlnaW5hbERhdGEpO1xyXG4gICAgICAgIHRoaXMuZGF0YVNvdXJjZS5wYWdpbmF0b3IgPSB0aGlzLnBhZ2luYXRvcjtcclxuICAgICAgICB0aGlzLmRhdGFTb3VyY2Uuc29ydCA9IHRoaXMuc29ydDtcclxuICAgICAgICBpZiAob3JpZ2luYWxEYXRhICYmICFvcmlnaW5hbERhdGEubGVuZ3RoKSB7XHJcbiAgICAgICAgICB0aGlzLmhhc05vSXRlbXMgPSB0cnVlO1xyXG4gICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICB0aGlzLmhhc05vSXRlbXMgPSBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHRoaXMuY29uZmlnLnBhZ2VTaXplKSB7XHJcbiAgICAgICAgICB0aGlzLnBhZ2VTaXplID0gdGhpcy5jb25maWcucGFnZVNpemU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvbnN0IGZpcnN0RGF0YUl0ZW0gPSBvcmlnaW5hbERhdGFbMF07XHJcbiAgICAgICAgdGhpcy5pbml0RGlzcGxheWVkQ29sdW1ucyhmaXJzdERhdGFJdGVtKTtcclxuICAgICAgICB0aGlzLmluaXRFeHBvcnQob3JpZ2luYWxEYXRhKTtcclxuICAgICAgICB0aGlzLmluaXRGaWx0ZXIob3JpZ2luYWxEYXRhKTtcclxuICAgICAgfSk7XHJcblxyXG4gICAgaWYgKHRoaXMuY29uZmlnLmNsZWFyU2VsZWN0ZWQpIHtcclxuICAgICAgdGhpcy5jbGVhclNlbGVjdGVkU3Vic2NyaXB0aW9uID0gdGhpcy5jb25maWcuY2xlYXJTZWxlY3RlZC5zdWJzY3JpYmUoXHJcbiAgICAgICAgKCkgPT4ge1xyXG4gICAgICAgICAgdGhpcy5sb2coJ2NsZWFyU2VsZWN0ZWQnKTtcclxuICAgICAgICAgIHRoaXMuc2VsZWN0aW9uTXVsdGlwbGUuY2xlYXIoKTtcclxuICAgICAgICAgIHRoaXMuc2VsZWN0aW9uU2luZ2xlLmNsZWFyKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICApO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgbmdPbkRlc3Ryb3koKSB7XHJcbiAgICBpZiAodGhpcy5kYXRhU291cmNlU3Vic2NyaXB0aW9uKSB7XHJcbiAgICAgIHRoaXMuZGF0YVNvdXJjZVN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xyXG4gICAgfVxyXG4gICAgaWYgKHRoaXMuY2xlYXJTZWxlY3RlZFN1YnNjcmlwdGlvbikge1xyXG4gICAgICB0aGlzLmNsZWFyU2VsZWN0ZWRTdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGFwcGx5RmlsdGVyKGZpbHRlclZhbHVlOiBzdHJpbmcpIHtcclxuICAgIHRoaXMuZGF0YVNvdXJjZS5maWx0ZXIgPSBmaWx0ZXJWYWx1ZS50cmltKCkudG9Mb3dlckNhc2UoKTtcclxuICAgIHRoaXMuc2VsZWN0aW9uTXVsdGlwbGUuY2xlYXIoKTtcclxuICAgIHRoaXMuc2VsZWN0aW9uU2luZ2xlLmNsZWFyKCk7XHJcbiAgfVxyXG5cclxuICBpbml0RmlsdGVyKG9yaWdpbmFsRGF0YTogVFtdKSB7XHJcbiAgICBpZiAoIW9yaWdpbmFsRGF0YS5sZW5ndGgpIHtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG4gICAgY29uc3QgZmlyc3RSb3cgPSBvcmlnaW5hbERhdGFbMF07XHJcbiAgICBjb25zdCBrZXlzRGF0YSA9IG5ldyBTZXQoT2JqZWN0LmtleXMoZmlyc3RSb3cpKTtcclxuICAgIGNvbnN0IGtleXNIZWFkZXIgPSBuZXcgU2V0KHRoaXMuaGVhZGVyS2V5c0Rpc3BsYXllZCk7XHJcbiAgICBrZXlzSGVhZGVyLmRlbGV0ZSgnX19idWxrJyk7XHJcbiAgICBrZXlzSGVhZGVyLmRlbGV0ZSgnX19zdGFyJyk7XHJcbiAgICBjb25zdCBhbGxGaWVsZHNFeGlzdCA9IEFycmF5LmZyb20oa2V5c0hlYWRlcikucmVkdWNlKChhY2MsIGN1cikgPT4ge1xyXG4gICAgICByZXR1cm4ga2V5c0RhdGEuaGFzKGN1cikgJiYgYWNjO1xyXG4gICAgfSwgdHJ1ZSk7XHJcblxyXG4gICAgdGhpcy5sb2coJ2luaXRGaWx0ZXIoKScsIHtcclxuICAgICAgcm93RmllbGRzOiBrZXlzRGF0YSxcclxuICAgICAgYWxsRmllbGRzRXhpc3QsXHJcbiAgICAgIGhlYWRlcktleXNEaXNwbGF5ZWQ6IHRoaXMuaGVhZGVyS2V5c0Rpc3BsYXllZFxyXG4gICAgfSk7XHJcbiAgICB0aGlzLmRhdGFTb3VyY2UuZmlsdGVyUHJlZGljYXRlID0gKGRhdGE6IFQsIGZpbHRlclRleHQ6IHN0cmluZykgPT4ge1xyXG4gICAgICBpZiAoIWZpbHRlclRleHQpIHtcclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgfVxyXG4gICAgICBpZiAoIWFsbEZpZWxkc0V4aXN0KSB7XHJcbiAgICAgICAgY29uc3QgbG93ZXIgPSBKU09OLnN0cmluZ2lmeShkYXRhKS50b0xvd2VyQ2FzZSgpO1xyXG4gICAgICAgIHJldHVybiBsb3dlci5pbmNsdWRlcyhmaWx0ZXJUZXh0KTtcclxuICAgICAgfVxyXG4gICAgICBmb3IgKGNvbnN0IGtleSBvZiBBcnJheS5mcm9tKGtleXNIZWFkZXIpKSB7XHJcbiAgICAgICAgY29uc3QgZGF0YVZhbCA9IGRhdGFba2V5XTtcclxuICAgICAgICBjb25zdCBzdHIgPSBKU09OLnN0cmluZ2lmeShkYXRhVmFsKTtcclxuICAgICAgICBjb25zdCBpc0ZvdW5kID0gc3RyLnRvTG93ZXJDYXNlKCkuaW5jbHVkZXMoZmlsdGVyVGV4dCk7XHJcbiAgICAgICAgaWYgKGlzRm91bmQpIHtcclxuICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfTtcclxuICB9XHJcblxyXG4gIGluaXRFeHBvcnQob3JpZ2luYWxEYXRhOiBUW10pIHtcclxuICAgIHRoaXMuZXhwb3J0RmlsZW5hbWUgPSB0aGlzLmNvbmZpZy5leHBvcnRGaWxlbmFtZTtcclxuICAgIGlmICghdGhpcy5leHBvcnRGaWxlbmFtZSkge1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcbiAgICB0aGlzLmV4cG9ydERhdGEgPSBvcmlnaW5hbERhdGEubWFwKGRhdGFJdGVtID0+IHtcclxuICAgICAgaWYgKCF0aGlzLmNvbmZpZy5leHBvcnRSb3dGb3JtYXQpIHtcclxuICAgICAgICByZXR1cm4gZGF0YUl0ZW07XHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuIHRoaXMuY29uZmlnLmV4cG9ydFJvd0Zvcm1hdChkYXRhSXRlbSk7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBnZXRLZXlIZWFkZXIoa2V5OiBzdHJpbmcpIHtcclxuICAgIGNvbnN0IGlucHV0RGVmID0gdGhpcy5jb2x1bW5EZWZpbml0aW9uc1trZXldO1xyXG4gICAgaWYgKGlucHV0RGVmICYmIGlucHV0RGVmLmhlYWRlciAhPSBudWxsKSB7XHJcbiAgICAgIHJldHVybiBpbnB1dERlZi5oZWFkZXI7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gdGhpcy50b1RpdGxlQ2FzZShrZXkpO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSB0b1RpdGxlQ2FzZShzdHIpIHtcclxuICAgIHJldHVybiBzdHIucmVwbGFjZSgnXycsICcgJykucmVwbGFjZSgvXFx3XFxTKi9nLCBmdW5jdGlvbih0eHQpIHtcclxuICAgICAgcmV0dXJuIHR4dC5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIHR4dC5zdWJzdHIoMSkudG9Mb3dlckNhc2UoKTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgaW5pdERpc3BsYXllZENvbHVtbnMoZmlyc3REYXRhSXRlbTogVCkge1xyXG4gICAgdGhpcy5pbml0Q29sdW1uRGVmaW5pdGlvbnMoZmlyc3REYXRhSXRlbSk7XHJcblxyXG4gICAgdGhpcy5oZWFkZXJLZXlzQWxsID0gT2JqZWN0LmtleXModGhpcy5jb2x1bW5EZWZpbml0aW9uc0FsbCk7XHJcbiAgICB0aGlzLmhlYWRlcktleXNBbGxWaXNpYmxlID0gdGhpcy5oZWFkZXJLZXlzQWxsO1xyXG4gICAgaWYgKHRoaXMuY29uZmlnLmhpZGVGaWVsZHMpIHtcclxuICAgICAgLy8gSGlkZSBmaWVsZHMgaWYgc3BlY2lmaWVkXHJcbiAgICAgIGNvbnN0IGhpZGVGaWVsZHMgPSBuZXcgU2V0KHRoaXMuY29uZmlnLmhpZGVGaWVsZHMpO1xyXG4gICAgICB0aGlzLmhlYWRlcktleXNBbGxWaXNpYmxlID0gdGhpcy5oZWFkZXJLZXlzQWxsLmZpbHRlcihcclxuICAgICAgICB4ID0+ICFoaWRlRmllbGRzLmhhcyh4KVxyXG4gICAgICApO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IGRpc3BsYXllZCA9IHRoaXMuY29sdW1uRGVmaW5pdGlvbnNBbGxBcnJheVxyXG4gICAgICAuZmlsdGVyKGRlZiA9PiAhZGVmLmhpZGUpXHJcbiAgICAgIC5tYXAoZCA9PiBkLmZpZWxkKTtcclxuXHJcbiAgICB0aGlzLnNldERpc3BsYXllZENvbHVtbnMoZGlzcGxheWVkKTtcclxuICAgIC8vIFNldCBjdXJyZW50bHkgZW5hYmxlZCBpdGVtc1xyXG4gICAgdGhpcy5maWx0ZXJDb250cm9sLnNldFZhbHVlKHRoaXMuaGVhZGVyS2V5c0Rpc3BsYXllZCk7XHJcbiAgfVxyXG5cclxuICBpbml0Q29sdW1uRGVmaW5pdGlvbnMoZmlyc3REYXRhSXRlbTogVCkge1xyXG4gICAgLy8gU2V0IGFsbCBjb2x1bW4gZGVmaW50aW9ucywgd2hpY2ggd2VyZSBleHBsaWNpdGx5IHNldCBpbiBjb25maWdcclxuICAgIGNvbnN0IGlucHV0RGVmaW50aW9uRmllbGRzID0gT2JqZWN0LmtleXModGhpcy5jb2x1bW5EZWZpbml0aW9ucyk7XHJcbiAgICBpbnB1dERlZmludGlvbkZpZWxkcy5mb3JFYWNoKChmaWVsZDogc3RyaW5nKSA9PiB7XHJcbiAgICAgIGNvbnN0IGlucHV0RGVmaW50aW9uID0gdGhpcy5jb2x1bW5EZWZpbml0aW9uc1tmaWVsZF07XHJcbiAgICAgIHRoaXMuY29sdW1uRGVmaW5pdGlvbnNBbGxbZmllbGRdID0ge1xyXG4gICAgICAgIGhlYWRlcjogdGhpcy5nZXRLZXlIZWFkZXIoZmllbGQpLFxyXG4gICAgICAgIHRlbXBsYXRlOiBpbnB1dERlZmludGlvbi50ZW1wbGF0ZSxcclxuICAgICAgICBoaWRlOiBpbnB1dERlZmludGlvbi5oaWRlLFxyXG4gICAgICAgIGZvcmNlV3JhcDogaW5wdXREZWZpbnRpb24uZm9yY2VXcmFwXHJcbiAgICAgIH07XHJcbiAgICB9KTtcclxuXHJcbiAgICAvLyBTZXQgYWxsIGNvbHVtbiBkZWZpbnRpb25zIHJlYWQgZnJvbSB0aGUgXCJpbnB1dCBkYXRhXCJcclxuICAgIGNvbnN0IGlucHV0RGF0YUtleXMgPSBPYmplY3Qua2V5cyhmaXJzdERhdGFJdGVtKTtcclxuICAgIGlucHV0RGF0YUtleXMuZm9yRWFjaCgoZmllbGQ6IHN0cmluZykgPT4ge1xyXG4gICAgICBpZiAoISF0aGlzLmNvbHVtbkRlZmluaXRpb25zQWxsW2ZpZWxkXSkge1xyXG4gICAgICAgIC8vIHNraXAgaWYgZGVmaW5pdGlvbiBleGlzdHNcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIH1cclxuICAgICAgdGhpcy5jb2x1bW5EZWZpbml0aW9uc0FsbFtmaWVsZF0gPSB7XHJcbiAgICAgICAgaGVhZGVyOiB0aGlzLnRvVGl0bGVDYXNlKGZpZWxkKSxcclxuICAgICAgICBoaWRlOiB0cnVlXHJcbiAgICAgIH07XHJcbiAgICB9KTtcclxuXHJcbiAgICB0aGlzLmNvbHVtbkRlZmluaXRpb25zQWxsQXJyYXkgPSBPYmplY3Qua2V5cyh0aGlzLmNvbHVtbkRlZmluaXRpb25zQWxsKS5tYXAoXHJcbiAgICAgIGsgPT4ge1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAuLi50aGlzLmNvbHVtbkRlZmluaXRpb25zQWxsW2tdLFxyXG4gICAgICAgICAgZmllbGQ6IGtcclxuICAgICAgICB9O1xyXG4gICAgICB9XHJcbiAgICApO1xyXG4gICAgdGhpcy5sb2coJ2luaXRDb2x1bW5EZWZpbml0aW9ucycsIHtcclxuICAgICAgZmlyc3REYXRhSXRlbSxcclxuICAgICAgaW5wdXREZWZpbnRpb25GaWVsZHNcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgLy8gU2V0cyB0aGUgZGlzcGxheWVkIGNvbHVtbnMgZnJvbSBhIHNldCBvZiBmaWVsZG5hbWVzXHJcbiAgc2V0RGlzcGxheWVkQ29sdW1ucyhzZWxlY3RlZDogc3RyaW5nW10pIHtcclxuICAgIC8vIEluaXRpYWxpemUgYWxsIGtleXMgYXMgZmFsc2VcclxuICAgIHRoaXMuaGVhZGVyS2V5c0FsbFZpc2libGUuZm9yRWFjaChcclxuICAgICAgayA9PiAodGhpcy5oZWFkZXJLZXlzRGlzcGxheWVkTWFwW2tdID0gZmFsc2UpXHJcbiAgICApO1xyXG4gICAgLy8gU2V0IHNlbGVjdGVkIGFzIHRydWVcclxuICAgIHNlbGVjdGVkLmZvckVhY2goYyA9PiAodGhpcy5oZWFkZXJLZXlzRGlzcGxheWVkTWFwW2NdID0gdHJ1ZSkpO1xyXG4gICAgdGhpcy5oZWFkZXJLZXlzRGlzcGxheWVkID0gT2JqZWN0LmtleXModGhpcy5oZWFkZXJLZXlzRGlzcGxheWVkTWFwKS5maWx0ZXIoXHJcbiAgICAgIGsgPT4gdGhpcy5oZWFkZXJLZXlzRGlzcGxheWVkTWFwW2tdXHJcbiAgICApO1xyXG4gICAgLy8gQWRkIGJ1bGsgc2VsZWN0IGNvbHVtbiBhdCBzdGFydFxyXG4gICAgaWYgKHRoaXMuY29uZmlnLmFjdGlvbnNCdWxrKSB7XHJcbiAgICAgIHRoaXMuaGVhZGVyS2V5c0Rpc3BsYXllZC51bnNoaWZ0KCdfX2J1bGsnKTtcclxuICAgIH1cclxuICAgIC8vIEFkZCBhY3Rpb25zIGNvbHVtbiBhdCBlbmRcclxuICAgIGlmICh0aGlzLmNvbmZpZy5hY3Rpb25zKSB7XHJcbiAgICAgIHRoaXMuaGVhZGVyS2V5c0Rpc3BsYXllZC5wdXNoKCdfX3N0YXInKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8qKiBXaGV0aGVyIHRoZSBudW1iZXIgb2Ygc2VsZWN0ZWQgZWxlbWVudHMgbWF0Y2hlcyB0aGUgdG90YWwgbnVtYmVyIG9mIHJvd3MuICovXHJcbiAgaXNBbGxTZWxlY3RlZCgpIHtcclxuICAgIGNvbnN0IG51bVNlbGVjdGVkID0gdGhpcy5zZWxlY3Rpb25NdWx0aXBsZS5zZWxlY3RlZC5sZW5ndGg7XHJcbiAgICBjb25zdCBudW1Sb3dzID1cclxuICAgICAgdGhpcy5jb25maWcuYnVsa1NlbGVjdE1heENvdW50IHx8IHRoaXMuZGF0YVNvdXJjZS5maWx0ZXJlZERhdGEubGVuZ3RoO1xyXG4gICAgcmV0dXJuIG51bVNlbGVjdGVkID49IG51bVJvd3M7XHJcbiAgfVxyXG5cclxuICAvKiogU2VsZWN0cyBhbGwgcm93cyBpZiB0aGV5IGFyZSBub3QgYWxsIHNlbGVjdGVkOyBvdGhlcndpc2UgY2xlYXIgc2VsZWN0aW9uLiAqL1xyXG4gIG1hc3RlclRvZ2dsZSgpIHtcclxuICAgIHRoaXMuaXNBbGxTZWxlY3RlZCgpXHJcbiAgICAgID8gdGhpcy5zZWxlY3Rpb25NdWx0aXBsZS5jbGVhcigpXHJcbiAgICAgIDogdGhpcy5zZWxlY3RBbGwoKTtcclxuICAgIHRoaXMuc2VsZWN0ZWRCdWxrLmVtaXQodGhpcy5zZWxlY3Rpb25NdWx0aXBsZS5zZWxlY3RlZCk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIHNlbGVjdEFsbCgpIHtcclxuICAgIHRoaXMuZGF0YVNvdXJjZS5zb3J0RGF0YSh0aGlzLmRhdGFTb3VyY2UuZmlsdGVyZWREYXRhLCB0aGlzLmRhdGFTb3VyY2Uuc29ydCk7XHJcbiAgICBsZXQgY3V0QXJyYXkgPSB0aGlzLmRhdGFTb3VyY2UuZmlsdGVyZWREYXRhO1xyXG4gICAgaWYgKHRoaXMuY29uZmlnLmJ1bGtTZWxlY3RNYXhDb3VudCkge1xyXG4gICAgICBjdXRBcnJheSA9IHRoaXMuZGF0YVNvdXJjZS5maWx0ZXJlZERhdGEuc2xpY2UoMCwgdGhpcy5jb25maWcuYnVsa1NlbGVjdE1heENvdW50KTtcclxuICAgIH1cclxuICAgIGN1dEFycmF5LmZvckVhY2gocm93ID0+IHtcclxuICAgICAgdGhpcy5zZWxlY3Rpb25NdWx0aXBsZS5zZWxlY3Qocm93KTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgaXNNYXhSZWFjaGVkKCkge1xyXG4gICAgaWYgKCF0aGlzLmNvbmZpZy5idWxrU2VsZWN0TWF4Q291bnQpIHtcclxuICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIChcclxuICAgICAgdGhpcy5zZWxlY3Rpb25NdWx0aXBsZS5zZWxlY3RlZC5sZW5ndGggPj0gdGhpcy5jb25maWcuYnVsa1NlbGVjdE1heENvdW50XHJcbiAgICApO1xyXG4gIH1cclxuXHJcbiAgb25Db2x1bW5GaWx0ZXJDaGFuZ2UoJGV2ZW50KSB7XHJcbiAgICBjb25zb2xlLmxvZyh7ICRldmVudCB9KTtcclxuICAgIGNvbnN0IHNlbGVjdGVkVmFsdWVzID0gdGhpcy5maWx0ZXJDb250cm9sLnZhbHVlO1xyXG4gICAgdGhpcy5zZXREaXNwbGF5ZWRDb2x1bW5zKHNlbGVjdGVkVmFsdWVzKTtcclxuICAgIHRoaXMuaW5pdEZpbHRlcih0aGlzLmRhdGFTb3VyY2UuZGF0YSk7XHJcbiAgfVxyXG5cclxuICBvbkNsaWNrQnVsa0l0ZW0oJGV2ZW50LCBpdGVtKSB7XHJcbiAgICBpZiAoJGV2ZW50KSB7XHJcbiAgICAgIGNvbnN0IGlzU2VsZWN0ZWQgPSB0aGlzLnNlbGVjdGlvbk11bHRpcGxlLmlzU2VsZWN0ZWQoaXRlbSk7XHJcbiAgICAgIGlmICghdGhpcy5pc01heFJlYWNoZWQoKSkge1xyXG4gICAgICAgIHRoaXMuc2VsZWN0aW9uTXVsdGlwbGUudG9nZ2xlKGl0ZW0pO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGlmIChpc1NlbGVjdGVkKSB7XHJcbiAgICAgICAgICB0aGlzLnNlbGVjdGlvbk11bHRpcGxlLmRlc2VsZWN0KGl0ZW0pO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICB0aGlzLndhcm4oXHJcbiAgICAgICAgICAgIGBNYXggU2VsZWN0aW9uIG9mIFwiJHt0aGlzLmNvbmZpZy5idWxrU2VsZWN0TWF4Q291bnR9XCIgUmVhY2hlZGBcclxuICAgICAgICAgICk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICAgIHRoaXMuc2VsZWN0ZWRCdWxrLmVtaXQodGhpcy5zZWxlY3Rpb25NdWx0aXBsZS5zZWxlY3RlZCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBvbkNsaWNrUm93KCRldmVudCwgcm93OiBUKSB7XHJcbiAgICBpZiAodGhpcy5jb25maWcub25TZWxlY3RJdGVtKSB7XHJcbiAgICAgIHRoaXMubG9nKCdvbkNsaWNrUm93KCknLCB7ICRldmVudCwgcm93IH0pO1xyXG4gICAgICB0aGlzLnNlbGVjdGlvblNpbmdsZS5zZWxlY3Qocm93KTtcclxuICAgICAgdGhpcy5jb25maWcub25TZWxlY3RJdGVtKHJvdyk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBvbkRvdWJsZUNsaWNrUm93KCRldmVudCwgcm93OiBUKSB7XHJcbiAgICBpZiAodGhpcy5jb25maWcub25TZWxlY3RJdGVtRG91YmxlQ2xpY2spIHtcclxuICAgICAgdGhpcy5sb2coJ29uRG91YmxlQ2xpY2tSb3coKScsIHsgJGV2ZW50LCByb3cgfSk7XHJcbiAgICAgIHRoaXMuc2VsZWN0aW9uU2luZ2xlLnNlbGVjdChyb3cpO1xyXG4gICAgICB0aGlzLmNvbmZpZy5vblNlbGVjdEl0ZW1Eb3VibGVDbGljayhyb3cpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgYXN5bmMgb25DbGlja0J1bGtBY3Rpb24oYWN0aW9uOiBBY3Rpb25EZWZpbml0aW9uQnVsazxUPikge1xyXG4gICAgYXdhaXQgYWN0aW9uLm9uQ2xpY2sodGhpcy5zZWxlY3Rpb25NdWx0aXBsZS5zZWxlY3RlZCk7XHJcbiAgICB0aGlzLnNlbGVjdGlvbk11bHRpcGxlLmNsZWFyKCk7XHJcbiAgfVxyXG5cclxuICBsb2coc3RyOiBzdHJpbmcsIG9iaj86IGFueSkge1xyXG4gICAgaWYgKHRoaXMuY29uZmlnLmRlYnVnKSB7XHJcbiAgICAgIGNvbnNvbGUubG9nKCc8bmd4LWF1dG8tdGFibGU+IDogJyArIHN0ciwgb2JqKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHdhcm4obXNnOiBzdHJpbmcpIHt9XHJcbn1cclxuIl19