/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import * as tslib_1 from "tslib";
import { Component, Input, ViewChild, Output, EventEmitter } from "@angular/core";
import { MatTableDataSource, MatPaginator, MatSort } from "@angular/material";
import { Subject } from "rxjs";
import { FormControl } from "@angular/forms";
import { SelectionModel } from "@angular/cdk/collections";
import { filter, takeUntil } from "rxjs/operators";
/**
 * @record
 * @template T
 */
export function AutoTableConfig() { }
if (false) {
    /** @type {?} */
    AutoTableConfig.prototype.data$;
    /** @type {?|undefined} */
    AutoTableConfig.prototype.debug;
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
    /** @type {?|undefined} */
    AutoTableConfig.prototype.$triggerSelectItem;
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
                template: "<div\r\n  class=\"table-header auto-elevation overflow-hidden\"\r\n  [class.addRightPixel]=\"config.hideHeader\"\r\n  *ngIf=\"(!config.hideFilter || !config.hideChooseColumns) && !hasNoItems\"\r\n>\r\n  <div class=\"relative\">\r\n    <mat-toolbar class=\"mat-elevation-z8\">\r\n      <mat-toolbar-row class=\"flex-h align-center space-between\">\r\n        <mat-form-field\r\n          class=\"filter-search\"\r\n          *ngIf=\"!hasNoItems && !config.hideFilter\"\r\n        >\r\n          <mat-icon matPrefix>search</mat-icon>\r\n          <input\r\n            matInput\r\n            (keyup)=\"applyFilter($event.target.value)\"\r\n            [placeholder]=\"this.config.filterText || 'Search Rows...'\"\r\n            #filterField\r\n          />\r\n          <mat-icon\r\n            class=\"has-pointer\"\r\n            matSuffix\r\n            (click)=\"filterField.value = ''; applyFilter(filterField.value)\"\r\n            >clear</mat-icon\r\n          >\r\n        </mat-form-field>\r\n        <mat-form-field\r\n          class=\"filter-columns overflow-hidden\"\r\n          *ngIf=\"!hasNoItems && !config.hideChooseColumns\"\r\n        >\r\n          <mat-icon matPrefix>view_column</mat-icon>\r\n          <mat-select\r\n            placeholder=\"Choose Columns...\"\r\n            [formControl]=\"filterControl\"\r\n            (selectionChange)=\"onColumnFilterChange($event)\"\r\n            multiple\r\n          >\r\n            <mat-option *ngFor=\"let key of headerKeysAllVisible\" [value]=\"key\">\r\n              {{ getKeyHeader(key) }}\r\n            </mat-option>\r\n          </mat-select>\r\n        </mat-form-field>\r\n      </mat-toolbar-row>\r\n    </mat-toolbar>\r\n    <div\r\n      class=\"bulk-actions flex-h align-center space-between\"\r\n      *ngIf=\"config.actionsBulk\"\r\n      [class.hidden]=\"!selectionMultiple.hasValue()\"\r\n    >\r\n      <span class=\"item-count\">\r\n        ({{ selectionMultiple.selected.length }} Items Selected)\r\n        {{ isMaxReached() ? \" Max Reached!\" : \"\" }}\r\n      </span>\r\n      <span class=\"buttons flex-h align-center\">\r\n        <button\r\n          mat-raised-button\r\n          *ngFor=\"let action of config.actionsBulk\"\r\n          (click)=\"onClickBulkAction(action)\"\r\n        >\r\n          <mat-icon>{{ action.icon }}</mat-icon>\r\n          <span>{{ action.label }}</span>\r\n        </button>\r\n      </span>\r\n    </div>\r\n  </div>\r\n</div>\r\n<table\r\n  mat-table\r\n  #table\r\n  matSort\r\n  [matSortActive]=\"config.initialSort\"\r\n  [matSortDirection]=\"config.initialSortDir\"\r\n  [dataSource]=\"this.dataSource\"\r\n  style=\"width:100%;\"\r\n  class=\"mat-elevation-z8\"\r\n>\r\n  <ng-container\r\n    *ngFor=\"let def of columnDefinitionsAllArray\"\r\n    [matColumnDef]=\"def.field\"\r\n  >\r\n    <th mat-header-cell mat-sort-header *matHeaderCellDef>{{ def.header }}</th>\r\n    <td mat-cell *matCellDef=\"let row\">\r\n      <div *ngIf=\"!def.template\" [class.break-words]=\"def.forceWrap\">\r\n        {{ row[def.field] }}\r\n      </div>\r\n      <div *ngIf=\"def.template\">\r\n        <div\r\n          *ngTemplateOutlet=\"def.template; context: { $implicit: row }\"\r\n        ></div>\r\n      </div>\r\n    </td>\r\n  </ng-container>\r\n\r\n  <ng-container matColumnDef=\"__bulk\" stickyEnd>\r\n    <th mat-header-cell *matHeaderCellDef>\r\n      <mat-checkbox\r\n        (change)=\"$event ? masterToggle() : null\"\r\n        [checked]=\"selectionMultiple.hasValue() && isAllSelected()\"\r\n        [indeterminate]=\"selectionMultiple.hasValue() && !isAllSelected()\"\r\n      >\r\n      </mat-checkbox>\r\n    </th>\r\n    <td mat-cell *matCellDef=\"let row\">\r\n      <mat-checkbox\r\n        (click)=\"$event.stopPropagation()\"\r\n        (change)=\"onClickBulkItem($event, row)\"\r\n        [checked]=\"selectionMultiple.isSelected(row)\"\r\n      >\r\n      </mat-checkbox>\r\n    </td>\r\n  </ng-container>\r\n\r\n  <ng-container matColumnDef=\"__star\" stickyEnd>\r\n    <th mat-header-cell *matHeaderCellDef></th>\r\n    <td mat-cell *matCellDef=\"let row\">\r\n      <div *ngIf=\"config.actions\">\r\n        <mat-icon\r\n          mat-list-icon\r\n          class=\"more-icon has-pointer\"\r\n          [matMenuTriggerFor]=\"rowMenu\"\r\n          >more_vert</mat-icon\r\n        >\r\n        <mat-menu #rowMenu=\"matMenu\" class=\"row-menu\">\r\n          <div mat-menu-item *ngFor=\"let action of config.actions\">\r\n            <button\r\n              mat-menu-item\r\n              *ngIf=\"action.onClick\"\r\n              (click)=\"action.onClick(row)\"\r\n            >\r\n              <mat-icon>{{ action.icon }}</mat-icon>\r\n              <span>{{ action.label }}</span>\r\n            </button>\r\n            <a\r\n              mat-menu-item\r\n              *ngIf=\"action.onRouterLink && !action.routerLinkQuery\"\r\n              [routerLink]=\"['/' + action.onRouterLink(row)]\"\r\n            >\r\n              <mat-icon>{{ action.icon }}</mat-icon>\r\n              <span>{{ action.label }}</span>\r\n            </a>\r\n            <a\r\n              mat-menu-item\r\n              *ngIf=\"action.onRouterLink && action.routerLinkQuery\"\r\n              [routerLink]=\"['/' + action.onRouterLink(row)]\"\r\n              [queryParams]=\"action.routerLinkQuery(row)\"\r\n            >\r\n              <mat-icon>{{ action.icon }}</mat-icon>\r\n              <span>{{ action.label }}</span>\r\n            </a>\r\n          </div>\r\n        </mat-menu>\r\n      </div>\r\n    </td>\r\n  </ng-container>\r\n\r\n  <tr\r\n    mat-header-row\r\n    *matHeaderRowDef=\"headerKeysDisplayed\"\r\n    [hidden]=\"config.hideHeader\"\r\n  ></tr>\r\n  <tr\r\n    mat-row\r\n    *matRowDef=\"let row; columns: headerKeysDisplayed\"\r\n    (click)=\"onClickRow($event, row)\"\r\n    (dblclick)=\"onDoubleClickRow($event, row)\"\r\n    [class.selected-row-multiple]=\"selectionMultiple.isSelected(row)\"\r\n    [class.selected-row-single]=\"selectionSingle.isSelected(row)\"\r\n    [class.has-pointer]=\"config.onSelectItem\"\r\n  ></tr>\r\n</table>\r\n\r\n<mat-toolbar class=\"mat-elevation-z8 overflow-hidden\">\r\n  <mat-toolbar-row *ngIf=\"!dataSource || hasNoItems\">\r\n    <app-toolbar-loader *ngIf=\"!dataSource\"></app-toolbar-loader>\r\n    <h1 *ngIf=\"hasNoItems\" class=\"no-items\">No items found</h1>\r\n  </mat-toolbar-row>\r\n  <mat-toolbar-row class=\"paginator-row\">\r\n    <app-table-csv-export\r\n      *ngIf=\"exportFilename\"\r\n      [dataArray]=\"exportData\"\r\n      [filename]=\"exportFilename\"\r\n    ></app-table-csv-export>\r\n    <mat-paginator [pageSize]=\"pageSize\" [pageSizeOptions]=\"[5, 10, 25, 100]\">\r\n    </mat-paginator>\r\n  </mat-toolbar-row>\r\n</mat-toolbar>\r\n",
                styles: [".no-items,app-toolbar-loader{text-align:center;padding:20px;width:100%}.no-items{color:#555}.addRightPixel{width:calc(100% - 1px)}.relative{position:relative}.overflow-hidden{overflow:hidden}.flex-h{display:flex;flex-direction:row}.space-between{justify-content:space-between}.align-center{align-items:center}.auto-elevation{box-shadow:0 5px 5px -3px rgba(0,0,0,.2),0 8px 10px 1px rgba(0,0,0,.14),0 3px 14px 2px rgba(0,0,0,.12)}.mat-paginator{background-color:transparent}.paginator-row{display:flex;align-items:centered;justify-content:space-between;height:unset}mat-toolbar-row{height:unset}.filter-search{margin-top:11px;margin-bottom:-9px;margin-right:20px}.filter-columns{margin-top:11px;margin-bottom:-9px}.table-header{width:100%}.table-header .bulk-actions{position:absolute;top:0;transition:.7s;width:100%}.table-header .bulk-actions .item-count{color:#006400;padding-left:10px}.table-header .bulk-actions .buttons button{margin-right:10px}.hidden{top:-70px!important;overflow:hidden!important}.selected-row-multiple{background-color:#eee}.selected-row-single{background-color:#b5deb6}.break-words{word-break:break-all}.more-icon:hover{background-color:#d3d3d3;border-radius:20px}"]
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
    AutoTableComponent.prototype.$onDestroyed;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LWF1dG8tdGFibGUuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vbmd4LWF1dG8tdGFibGUtbGliLyIsInNvdXJjZXMiOlsiY29tcG9uZW50cy9uZ3gtYXV0by10YWJsZS5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxPQUFPLEVBQ0wsU0FBUyxFQUVULEtBQUssRUFFTCxTQUFTLEVBQ1QsTUFBTSxFQUNOLFlBQVksRUFDYixNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQUUsa0JBQWtCLEVBQUUsWUFBWSxFQUFFLE9BQU8sRUFBRSxNQUFNLG1CQUFtQixDQUFDO0FBQzlFLE9BQU8sRUFBYyxPQUFPLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFDM0MsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBQzdDLE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSwwQkFBMEIsQ0FBQztBQUMxRCxPQUFPLEVBQUUsTUFBTSxFQUFFLFNBQVMsRUFBRSxNQUFNLGdCQUFnQixDQUFDOzs7OztBQUVuRCxxQ0FxQkM7OztJQXBCQyxnQ0FBdUI7O0lBQ3ZCLGdDQUFnQjs7SUFDaEIsbUNBQWtCOztJQUNsQixrQ0FBZ0M7O0lBQ2hDLHNDQUF3Qzs7SUFDeEMsNkNBQTRCOztJQUM1Qix1Q0FBZ0M7O0lBQ2hDLGtEQUEyQzs7SUFDM0Msd0NBQWlDOztJQUNqQyxzQ0FBcUI7O0lBQ3JCLHlDQUFnQzs7SUFDaEMsbUNBQWtCOztJQUNsQixxQ0FBc0I7O0lBQ3RCLHFDQUFxQjs7SUFDckIscUNBQXFCOztJQUNyQiw0Q0FBNEI7O0lBQzVCLHFDQUFvQjs7SUFDcEIseUNBQXdCOztJQUN4QiwwQ0FBbUM7O0lBQ25DLDZDQUFtQzs7Ozs7O0FBR3JDLHNDQU1DOzs7SUFMQyxpQ0FBYzs7SUFDZCxnQ0FBYzs7SUFDZCxtQ0FBMkI7O0lBQzNCLHdDQUFrQzs7SUFDbEMsMkNBQWlDOzs7Ozs7QUFHbkMsMENBSUM7OztJQUhD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LHdDQUFrQjs7SUFDbEIsNENBQXVCOztJQUV2Qix3Q0FBb0I7O0lBRXBCLDJDQUFrQzs7SUFFbEMsK0NBQXNEOztJQUN0RCw2Q0FBcUQ7O0lBRXJELDBDQUE2QiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XHJcbiAgQ29tcG9uZW50LFxyXG4gIE9uSW5pdCxcclxuICBJbnB1dCxcclxuICBPbkRlc3Ryb3ksXHJcbiAgVmlld0NoaWxkLFxyXG4gIE91dHB1dCxcclxuICBFdmVudEVtaXR0ZXJcclxufSBmcm9tIFwiQGFuZ3VsYXIvY29yZVwiO1xyXG5pbXBvcnQgeyBNYXRUYWJsZURhdGFTb3VyY2UsIE1hdFBhZ2luYXRvciwgTWF0U29ydCB9IGZyb20gXCJAYW5ndWxhci9tYXRlcmlhbFwiO1xyXG5pbXBvcnQgeyBPYnNlcnZhYmxlLCBTdWJqZWN0IH0gZnJvbSBcInJ4anNcIjtcclxuaW1wb3J0IHsgRm9ybUNvbnRyb2wgfSBmcm9tIFwiQGFuZ3VsYXIvZm9ybXNcIjtcclxuaW1wb3J0IHsgU2VsZWN0aW9uTW9kZWwgfSBmcm9tIFwiQGFuZ3VsYXIvY2RrL2NvbGxlY3Rpb25zXCI7XHJcbmltcG9ydCB7IGZpbHRlciwgdGFrZVVudGlsIH0gZnJvbSBcInJ4anMvb3BlcmF0b3JzXCI7XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIEF1dG9UYWJsZUNvbmZpZzxUPiB7XHJcbiAgZGF0YSQ6IE9ic2VydmFibGU8VFtdPjtcclxuICBkZWJ1Zz86IGJvb2xlYW47XHJcbiAgZmlsZW5hbWU/OiBzdHJpbmc7XHJcbiAgYWN0aW9ucz86IEFjdGlvbkRlZmluaXRpb248VD5bXTtcclxuICBhY3Rpb25zQnVsaz86IEFjdGlvbkRlZmluaXRpb25CdWxrPFQ+W107XHJcbiAgYnVsa1NlbGVjdE1heENvdW50PzogbnVtYmVyO1xyXG4gIG9uU2VsZWN0SXRlbT86IChyb3c6IFQpID0+IHZvaWQ7XHJcbiAgb25TZWxlY3RJdGVtRG91YmxlQ2xpY2s/OiAocm93OiBUKSA9PiB2b2lkO1xyXG4gIGNsZWFyU2VsZWN0ZWQ/OiBPYnNlcnZhYmxlPHZvaWQ+O1xyXG4gIGluaXRpYWxTb3J0Pzogc3RyaW5nO1xyXG4gIGluaXRpYWxTb3J0RGlyPzogXCJhc2NcIiB8IFwiZGVzY1wiO1xyXG4gIHBhZ2VTaXplPzogbnVtYmVyO1xyXG4gIGhpZGVGaWVsZHM/OiBzdHJpbmdbXTtcclxuICBoaWRlRmlsdGVyPzogYm9vbGVhbjtcclxuICBoaWRlSGVhZGVyPzogYm9vbGVhbjtcclxuICBoaWRlQ2hvb3NlQ29sdW1ucz86IGJvb2xlYW47XHJcbiAgZmlsdGVyVGV4dD86IHN0cmluZztcclxuICBleHBvcnRGaWxlbmFtZT86IHN0cmluZztcclxuICBleHBvcnRSb3dGb3JtYXQ/OiAocm93OiBUKSA9PiB2b2lkO1xyXG4gICR0cmlnZ2VyU2VsZWN0SXRlbT86IE9ic2VydmFibGU8VD47XHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgQWN0aW9uRGVmaW5pdGlvbjxUPiB7XHJcbiAgbGFiZWw6IHN0cmluZztcclxuICBpY29uPzogc3RyaW5nO1xyXG4gIG9uQ2xpY2s/OiAocm93OiBUKSA9PiB2b2lkO1xyXG4gIG9uUm91dGVyTGluaz86IChyb3c6IFQpID0+IHN0cmluZztcclxuICByb3V0ZXJMaW5rUXVlcnk/OiAocm93OiBUKSA9PiB7fTtcclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBBY3Rpb25EZWZpbml0aW9uQnVsazxUPiB7XHJcbiAgbGFiZWw6IHN0cmluZztcclxuICBpY29uPzogc3RyaW5nO1xyXG4gIG9uQ2xpY2s/OiAocm93OiBUW10pID0+IHZvaWQ7XHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgQ29sdW1uRGVmaW5pdGlvbiB7XHJcbiAgaGVhZGVyPzogc3RyaW5nO1xyXG4gIHRlbXBsYXRlPzogYW55O1xyXG4gIGhpZGU/OiBib29sZWFuO1xyXG4gIGZvcmNlV3JhcD86IGJvb2xlYW47XHJcbn1cclxuXHJcbmludGVyZmFjZSBDb2x1bW5EZWZpbml0aW9uSW50ZXJuYWwgZXh0ZW5kcyBDb2x1bW5EZWZpbml0aW9uIHtcclxuICBmaWVsZDogc3RyaW5nO1xyXG59XHJcblxyXG5AQ29tcG9uZW50KHtcclxuICBzZWxlY3RvcjogXCJuZ3gtYXV0by10YWJsZVwiLFxyXG4gIHRlbXBsYXRlVXJsOiBcIi4vbmd4LWF1dG8tdGFibGUuY29tcG9uZW50Lmh0bWxcIixcclxuICBzdHlsZVVybHM6IFtcIi4vbmd4LWF1dG8tdGFibGUuY29tcG9uZW50LnNjc3NcIl1cclxufSlcclxuZXhwb3J0IGNsYXNzIEF1dG9UYWJsZUNvbXBvbmVudDxUPiBpbXBsZW1lbnRzIE9uSW5pdCwgT25EZXN0cm95IHtcclxuICBAT3V0cHV0KClcclxuICBzZWxlY3RlZEJ1bGsgPSBuZXcgRXZlbnRFbWl0dGVyPFRbXT4oKTtcclxuICBASW5wdXQoKVxyXG4gIGNvbmZpZzogQXV0b1RhYmxlQ29uZmlnPFQ+O1xyXG4gIEBJbnB1dCgpXHJcbiAgY29sdW1uRGVmaW5pdGlvbnM6IHtcclxuICAgIFtmaWVsZDogc3RyaW5nXTogQ29sdW1uRGVmaW5pdGlvbjtcclxuICB9ID0ge307XHJcbiAgY29sdW1uRGVmaW5pdGlvbnNBbGw6IHtcclxuICAgIFtmaWVsZDogc3RyaW5nXTogQ29sdW1uRGVmaW5pdGlvbjtcclxuICB9ID0ge307XHJcbiAgY29sdW1uRGVmaW5pdGlvbnNBbGxBcnJheTogQ29sdW1uRGVmaW5pdGlvbkludGVybmFsW10gPSBbXTtcclxuXHJcbiAgaGVhZGVyS2V5c0FsbCA9IFtdO1xyXG4gIGhlYWRlcktleXNBbGxWaXNpYmxlID0gW107XHJcbiAgaGVhZGVyS2V5c0Rpc3BsYXllZCA9IFtdO1xyXG4gIGhlYWRlcktleXNEaXNwbGF5ZWRNYXAgPSB7fTtcclxuXHJcbiAgZGF0YVNvdXJjZTogTWF0VGFibGVEYXRhU291cmNlPGFueT47XHJcbiAgQFZpZXdDaGlsZChNYXRQYWdpbmF0b3IpIHBhZ2luYXRvcjogTWF0UGFnaW5hdG9yO1xyXG4gIHBhZ2VTaXplID0gMjU7XHJcbiAgQFZpZXdDaGlsZChNYXRTb3J0KSBzb3J0OiBNYXRTb3J0O1xyXG5cclxuICBleHBvcnREYXRhOiBhbnlbXTtcclxuICBleHBvcnRGaWxlbmFtZTogc3RyaW5nO1xyXG5cclxuICBoYXNOb0l0ZW1zOiBib29sZWFuO1xyXG5cclxuICBmaWx0ZXJDb250cm9sID0gbmV3IEZvcm1Db250cm9sKCk7XHJcbiAgLy8gQnVsayBpdGVtcyBzZWxlY3Rpb25cclxuICBzZWxlY3Rpb25NdWx0aXBsZSA9IG5ldyBTZWxlY3Rpb25Nb2RlbDxhbnk+KHRydWUsIFtdKTtcclxuICBzZWxlY3Rpb25TaW5nbGUgPSBuZXcgU2VsZWN0aW9uTW9kZWw8YW55PihmYWxzZSwgW10pO1xyXG5cclxuICAkb25EZXN0cm95ZWQgPSBuZXcgU3ViamVjdCgpO1xyXG5cclxuICBuZ09uSW5pdCgpIHtcclxuICAgIHRoaXMuY29uZmlnLmRhdGEkXHJcbiAgICAgIC5waXBlKGZpbHRlcihlID0+ICEhZSkpXHJcbiAgICAgIC5waXBlKHRha2VVbnRpbCh0aGlzLiRvbkRlc3Ryb3llZCkpXHJcbiAgICAgIC5zdWJzY3JpYmUob3JpZ2luYWxEYXRhID0+IHtcclxuICAgICAgICBjb25zb2xlLmxvZyhcIm5neC1hdXRvLXRhYmxlLCBzdWJzY3JpYmVkOiBcIiwgeyBvcmlnaW5hbERhdGEgfSk7XHJcbiAgICAgICAgdGhpcy5kYXRhU291cmNlID0gbmV3IE1hdFRhYmxlRGF0YVNvdXJjZShvcmlnaW5hbERhdGEpO1xyXG4gICAgICAgIHRoaXMuZGF0YVNvdXJjZS5wYWdpbmF0b3IgPSB0aGlzLnBhZ2luYXRvcjtcclxuICAgICAgICB0aGlzLmRhdGFTb3VyY2Uuc29ydCA9IHRoaXMuc29ydDtcclxuICAgICAgICBpZiAob3JpZ2luYWxEYXRhICYmICFvcmlnaW5hbERhdGEubGVuZ3RoKSB7XHJcbiAgICAgICAgICB0aGlzLmhhc05vSXRlbXMgPSB0cnVlO1xyXG4gICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICB0aGlzLmhhc05vSXRlbXMgPSBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHRoaXMuY29uZmlnLnBhZ2VTaXplKSB7XHJcbiAgICAgICAgICB0aGlzLnBhZ2VTaXplID0gdGhpcy5jb25maWcucGFnZVNpemU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvbnN0IGZpcnN0RGF0YUl0ZW0gPSBvcmlnaW5hbERhdGFbMF07XHJcbiAgICAgICAgdGhpcy5pbml0RGlzcGxheWVkQ29sdW1ucyhmaXJzdERhdGFJdGVtKTtcclxuICAgICAgICB0aGlzLmluaXRFeHBvcnQob3JpZ2luYWxEYXRhKTtcclxuICAgICAgICB0aGlzLmluaXRGaWx0ZXIob3JpZ2luYWxEYXRhKTtcclxuICAgICAgfSk7XHJcblxyXG4gICAgaWYgKHRoaXMuY29uZmlnLiR0cmlnZ2VyU2VsZWN0SXRlbSkge1xyXG4gICAgICB0aGlzLmNvbmZpZy4kdHJpZ2dlclNlbGVjdEl0ZW1cclxuICAgICAgICAucGlwZSh0YWtlVW50aWwodGhpcy4kb25EZXN0cm95ZWQpKVxyXG4gICAgICAgIC5zdWJzY3JpYmUoaXRlbSA9PiB7XHJcbiAgICAgICAgICB0aGlzLmxvZyhcIiR0cmlnZ2VyU2VsZWN0SXRlbVwiLCBpdGVtKTtcclxuICAgICAgICAgIGNvbnN0IHN0ciA9IEpTT04uc3RyaW5naWZ5KGl0ZW0pO1xyXG4gICAgICAgICAgY29uc3QgZm91bmRJdGVtID0gdGhpcy5kYXRhU291cmNlLmRhdGEuZmluZChcclxuICAgICAgICAgICAgcm93ID0+IEpTT04uc3RyaW5naWZ5KHJvdykgPT09IHN0clxyXG4gICAgICAgICAgKTtcclxuICAgICAgICAgIGlmIChmb3VuZEl0ZW0pIHtcclxuICAgICAgICAgICAgdGhpcy5zZWxlY3Rpb25TaW5nbGUuc2VsZWN0KGZvdW5kSXRlbSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHRoaXMuY29uZmlnLmNsZWFyU2VsZWN0ZWQpIHtcclxuICAgICAgdGhpcy5jb25maWcuY2xlYXJTZWxlY3RlZFxyXG4gICAgICAgIC5waXBlKHRha2VVbnRpbCh0aGlzLiRvbkRlc3Ryb3llZCkpXHJcbiAgICAgICAgLnN1YnNjcmliZSgoKSA9PiB7XHJcbiAgICAgICAgICB0aGlzLmxvZyhcImNsZWFyU2VsZWN0ZWRcIik7XHJcbiAgICAgICAgICB0aGlzLnNlbGVjdGlvbk11bHRpcGxlLmNsZWFyKCk7XHJcbiAgICAgICAgICB0aGlzLnNlbGVjdGlvblNpbmdsZS5jbGVhcigpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgbmdPbkRlc3Ryb3koKSB7XHJcbiAgICB0aGlzLiRvbkRlc3Ryb3llZC5uZXh0KCk7XHJcbiAgICB0aGlzLiRvbkRlc3Ryb3llZC5jb21wbGV0ZSgpO1xyXG4gIH1cclxuXHJcbiAgYXBwbHlGaWx0ZXIoZmlsdGVyVmFsdWU6IHN0cmluZykge1xyXG4gICAgdGhpcy5kYXRhU291cmNlLmZpbHRlciA9IGZpbHRlclZhbHVlLnRyaW0oKS50b0xvd2VyQ2FzZSgpO1xyXG4gICAgdGhpcy5zZWxlY3Rpb25NdWx0aXBsZS5jbGVhcigpO1xyXG4gICAgdGhpcy5zZWxlY3Rpb25TaW5nbGUuY2xlYXIoKTtcclxuICB9XHJcblxyXG4gIGluaXRGaWx0ZXIob3JpZ2luYWxEYXRhOiBUW10pIHtcclxuICAgIGlmICghb3JpZ2luYWxEYXRhLmxlbmd0aCkge1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcbiAgICBjb25zdCBmaXJzdFJvdyA9IG9yaWdpbmFsRGF0YVswXTtcclxuICAgIGNvbnN0IGtleXNEYXRhID0gbmV3IFNldChPYmplY3Qua2V5cyhmaXJzdFJvdykpO1xyXG4gICAgY29uc3Qga2V5c0hlYWRlciA9IG5ldyBTZXQodGhpcy5oZWFkZXJLZXlzRGlzcGxheWVkKTtcclxuICAgIGtleXNIZWFkZXIuZGVsZXRlKFwiX19idWxrXCIpO1xyXG4gICAga2V5c0hlYWRlci5kZWxldGUoXCJfX3N0YXJcIik7XHJcbiAgICBjb25zdCBhbGxGaWVsZHNFeGlzdCA9IEFycmF5LmZyb20oa2V5c0hlYWRlcikucmVkdWNlKChhY2MsIGN1cikgPT4ge1xyXG4gICAgICByZXR1cm4ga2V5c0RhdGEuaGFzKGN1cikgJiYgYWNjO1xyXG4gICAgfSwgdHJ1ZSk7XHJcblxyXG4gICAgdGhpcy5sb2coXCJpbml0RmlsdGVyKClcIiwge1xyXG4gICAgICByb3dGaWVsZHM6IGtleXNEYXRhLFxyXG4gICAgICBhbGxGaWVsZHNFeGlzdCxcclxuICAgICAgaGVhZGVyS2V5c0Rpc3BsYXllZDogdGhpcy5oZWFkZXJLZXlzRGlzcGxheWVkXHJcbiAgICB9KTtcclxuICAgIHRoaXMuZGF0YVNvdXJjZS5maWx0ZXJQcmVkaWNhdGUgPSAoZGF0YTogVCwgZmlsdGVyVGV4dDogc3RyaW5nKSA9PiB7XHJcbiAgICAgIGlmICghZmlsdGVyVGV4dCkge1xyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICB9XHJcbiAgICAgIGlmICghYWxsRmllbGRzRXhpc3QpIHtcclxuICAgICAgICBjb25zdCBsb3dlciA9IEpTT04uc3RyaW5naWZ5KGRhdGEpLnRvTG93ZXJDYXNlKCk7XHJcbiAgICAgICAgcmV0dXJuIGxvd2VyLmluY2x1ZGVzKGZpbHRlclRleHQpO1xyXG4gICAgICB9XHJcbiAgICAgIGZvciAoY29uc3Qga2V5IG9mIEFycmF5LmZyb20oa2V5c0hlYWRlcikpIHtcclxuICAgICAgICBjb25zdCBkYXRhVmFsID0gZGF0YVtrZXldO1xyXG4gICAgICAgIGNvbnN0IHN0ciA9IEpTT04uc3RyaW5naWZ5KGRhdGFWYWwpO1xyXG4gICAgICAgIGNvbnN0IGlzRm91bmQgPSBzdHIudG9Mb3dlckNhc2UoKS5pbmNsdWRlcyhmaWx0ZXJUZXh0KTtcclxuICAgICAgICBpZiAoaXNGb3VuZCkge1xyXG4gICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9O1xyXG4gIH1cclxuXHJcbiAgaW5pdEV4cG9ydChvcmlnaW5hbERhdGE6IFRbXSkge1xyXG4gICAgdGhpcy5leHBvcnRGaWxlbmFtZSA9IHRoaXMuY29uZmlnLmV4cG9ydEZpbGVuYW1lO1xyXG4gICAgaWYgKCF0aGlzLmV4cG9ydEZpbGVuYW1lKSB7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuICAgIHRoaXMuZXhwb3J0RGF0YSA9IG9yaWdpbmFsRGF0YS5tYXAoZGF0YUl0ZW0gPT4ge1xyXG4gICAgICBpZiAoIXRoaXMuY29uZmlnLmV4cG9ydFJvd0Zvcm1hdCkge1xyXG4gICAgICAgIHJldHVybiBkYXRhSXRlbTtcclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gdGhpcy5jb25maWcuZXhwb3J0Um93Rm9ybWF0KGRhdGFJdGVtKTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIGdldEtleUhlYWRlcihrZXk6IHN0cmluZykge1xyXG4gICAgY29uc3QgaW5wdXREZWYgPSB0aGlzLmNvbHVtbkRlZmluaXRpb25zW2tleV07XHJcbiAgICBpZiAoaW5wdXREZWYgJiYgaW5wdXREZWYuaGVhZGVyICE9IG51bGwpIHtcclxuICAgICAgcmV0dXJuIGlucHV0RGVmLmhlYWRlcjtcclxuICAgIH1cclxuICAgIHJldHVybiB0aGlzLnRvVGl0bGVDYXNlKGtleSk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIHRvVGl0bGVDYXNlKHN0cikge1xyXG4gICAgcmV0dXJuIHN0ci5yZXBsYWNlKFwiX1wiLCBcIiBcIikucmVwbGFjZSgvXFx3XFxTKi9nLCBmdW5jdGlvbih0eHQpIHtcclxuICAgICAgcmV0dXJuIHR4dC5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIHR4dC5zdWJzdHIoMSkudG9Mb3dlckNhc2UoKTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgaW5pdERpc3BsYXllZENvbHVtbnMoZmlyc3REYXRhSXRlbTogVCkge1xyXG4gICAgdGhpcy5pbml0Q29sdW1uRGVmaW5pdGlvbnMoZmlyc3REYXRhSXRlbSk7XHJcblxyXG4gICAgdGhpcy5oZWFkZXJLZXlzQWxsID0gT2JqZWN0LmtleXModGhpcy5jb2x1bW5EZWZpbml0aW9uc0FsbCk7XHJcbiAgICB0aGlzLmhlYWRlcktleXNBbGxWaXNpYmxlID0gdGhpcy5oZWFkZXJLZXlzQWxsO1xyXG4gICAgaWYgKHRoaXMuY29uZmlnLmhpZGVGaWVsZHMpIHtcclxuICAgICAgLy8gSGlkZSBmaWVsZHMgaWYgc3BlY2lmaWVkXHJcbiAgICAgIGNvbnN0IGhpZGVGaWVsZHMgPSBuZXcgU2V0KHRoaXMuY29uZmlnLmhpZGVGaWVsZHMpO1xyXG4gICAgICB0aGlzLmhlYWRlcktleXNBbGxWaXNpYmxlID0gdGhpcy5oZWFkZXJLZXlzQWxsLmZpbHRlcihcclxuICAgICAgICB4ID0+ICFoaWRlRmllbGRzLmhhcyh4KVxyXG4gICAgICApO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IGRpc3BsYXllZCA9IHRoaXMuY29sdW1uRGVmaW5pdGlvbnNBbGxBcnJheVxyXG4gICAgICAuZmlsdGVyKGRlZiA9PiAhZGVmLmhpZGUpXHJcbiAgICAgIC5tYXAoZCA9PiBkLmZpZWxkKTtcclxuXHJcbiAgICB0aGlzLnNldERpc3BsYXllZENvbHVtbnMoZGlzcGxheWVkKTtcclxuICAgIC8vIFNldCBjdXJyZW50bHkgZW5hYmxlZCBpdGVtc1xyXG4gICAgdGhpcy5maWx0ZXJDb250cm9sLnNldFZhbHVlKHRoaXMuaGVhZGVyS2V5c0Rpc3BsYXllZCk7XHJcbiAgfVxyXG5cclxuICBpbml0Q29sdW1uRGVmaW5pdGlvbnMoZmlyc3REYXRhSXRlbTogVCkge1xyXG4gICAgLy8gU2V0IGFsbCBjb2x1bW4gZGVmaW50aW9ucywgd2hpY2ggd2VyZSBleHBsaWNpdGx5IHNldCBpbiBjb25maWdcclxuICAgIGNvbnN0IGlucHV0RGVmaW50aW9uRmllbGRzID0gT2JqZWN0LmtleXModGhpcy5jb2x1bW5EZWZpbml0aW9ucyk7XHJcbiAgICBpbnB1dERlZmludGlvbkZpZWxkcy5mb3JFYWNoKChmaWVsZDogc3RyaW5nKSA9PiB7XHJcbiAgICAgIGNvbnN0IGlucHV0RGVmaW50aW9uID0gdGhpcy5jb2x1bW5EZWZpbml0aW9uc1tmaWVsZF07XHJcbiAgICAgIHRoaXMuY29sdW1uRGVmaW5pdGlvbnNBbGxbZmllbGRdID0ge1xyXG4gICAgICAgIGhlYWRlcjogdGhpcy5nZXRLZXlIZWFkZXIoZmllbGQpLFxyXG4gICAgICAgIHRlbXBsYXRlOiBpbnB1dERlZmludGlvbi50ZW1wbGF0ZSxcclxuICAgICAgICBoaWRlOiBpbnB1dERlZmludGlvbi5oaWRlLFxyXG4gICAgICAgIGZvcmNlV3JhcDogaW5wdXREZWZpbnRpb24uZm9yY2VXcmFwXHJcbiAgICAgIH07XHJcbiAgICB9KTtcclxuXHJcbiAgICAvLyBTZXQgYWxsIGNvbHVtbiBkZWZpbnRpb25zIHJlYWQgZnJvbSB0aGUgXCJpbnB1dCBkYXRhXCJcclxuICAgIGNvbnN0IGlucHV0RGF0YUtleXMgPSBPYmplY3Qua2V5cyhmaXJzdERhdGFJdGVtKTtcclxuICAgIGlucHV0RGF0YUtleXMuZm9yRWFjaCgoZmllbGQ6IHN0cmluZykgPT4ge1xyXG4gICAgICBpZiAoISF0aGlzLmNvbHVtbkRlZmluaXRpb25zQWxsW2ZpZWxkXSkge1xyXG4gICAgICAgIC8vIHNraXAgaWYgZGVmaW5pdGlvbiBleGlzdHNcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIH1cclxuICAgICAgdGhpcy5jb2x1bW5EZWZpbml0aW9uc0FsbFtmaWVsZF0gPSB7XHJcbiAgICAgICAgaGVhZGVyOiB0aGlzLnRvVGl0bGVDYXNlKGZpZWxkKSxcclxuICAgICAgICBoaWRlOiB0cnVlXHJcbiAgICAgIH07XHJcbiAgICB9KTtcclxuXHJcbiAgICB0aGlzLmNvbHVtbkRlZmluaXRpb25zQWxsQXJyYXkgPSBPYmplY3Qua2V5cyh0aGlzLmNvbHVtbkRlZmluaXRpb25zQWxsKS5tYXAoXHJcbiAgICAgIGsgPT4ge1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAuLi50aGlzLmNvbHVtbkRlZmluaXRpb25zQWxsW2tdLFxyXG4gICAgICAgICAgZmllbGQ6IGtcclxuICAgICAgICB9O1xyXG4gICAgICB9XHJcbiAgICApO1xyXG4gICAgdGhpcy5sb2coXCJpbml0Q29sdW1uRGVmaW5pdGlvbnNcIiwge1xyXG4gICAgICBmaXJzdERhdGFJdGVtLFxyXG4gICAgICBpbnB1dERlZmludGlvbkZpZWxkc1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICAvLyBTZXRzIHRoZSBkaXNwbGF5ZWQgY29sdW1ucyBmcm9tIGEgc2V0IG9mIGZpZWxkbmFtZXNcclxuICBzZXREaXNwbGF5ZWRDb2x1bW5zKHNlbGVjdGVkOiBzdHJpbmdbXSkge1xyXG4gICAgLy8gSW5pdGlhbGl6ZSBhbGwga2V5cyBhcyBmYWxzZVxyXG4gICAgdGhpcy5oZWFkZXJLZXlzQWxsVmlzaWJsZS5mb3JFYWNoKFxyXG4gICAgICBrID0+ICh0aGlzLmhlYWRlcktleXNEaXNwbGF5ZWRNYXBba10gPSBmYWxzZSlcclxuICAgICk7XHJcbiAgICAvLyBTZXQgc2VsZWN0ZWQgYXMgdHJ1ZVxyXG4gICAgc2VsZWN0ZWQuZm9yRWFjaChjID0+ICh0aGlzLmhlYWRlcktleXNEaXNwbGF5ZWRNYXBbY10gPSB0cnVlKSk7XHJcbiAgICB0aGlzLmhlYWRlcktleXNEaXNwbGF5ZWQgPSBPYmplY3Qua2V5cyh0aGlzLmhlYWRlcktleXNEaXNwbGF5ZWRNYXApLmZpbHRlcihcclxuICAgICAgayA9PiB0aGlzLmhlYWRlcktleXNEaXNwbGF5ZWRNYXBba11cclxuICAgICk7XHJcbiAgICAvLyBBZGQgYnVsayBzZWxlY3QgY29sdW1uIGF0IHN0YXJ0XHJcbiAgICBpZiAodGhpcy5jb25maWcuYWN0aW9uc0J1bGspIHtcclxuICAgICAgdGhpcy5oZWFkZXJLZXlzRGlzcGxheWVkLnVuc2hpZnQoXCJfX2J1bGtcIik7XHJcbiAgICB9XHJcbiAgICAvLyBBZGQgYWN0aW9ucyBjb2x1bW4gYXQgZW5kXHJcbiAgICBpZiAodGhpcy5jb25maWcuYWN0aW9ucykge1xyXG4gICAgICB0aGlzLmhlYWRlcktleXNEaXNwbGF5ZWQucHVzaChcIl9fc3RhclwiKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8qKiBXaGV0aGVyIHRoZSBudW1iZXIgb2Ygc2VsZWN0ZWQgZWxlbWVudHMgbWF0Y2hlcyB0aGUgdG90YWwgbnVtYmVyIG9mIHJvd3MuICovXHJcbiAgaXNBbGxTZWxlY3RlZCgpIHtcclxuICAgIGNvbnN0IG51bVNlbGVjdGVkID0gdGhpcy5zZWxlY3Rpb25NdWx0aXBsZS5zZWxlY3RlZC5sZW5ndGg7XHJcbiAgICBjb25zdCBudW1Sb3dzID1cclxuICAgICAgdGhpcy5jb25maWcuYnVsa1NlbGVjdE1heENvdW50IHx8IHRoaXMuZGF0YVNvdXJjZS5maWx0ZXJlZERhdGEubGVuZ3RoO1xyXG4gICAgcmV0dXJuIG51bVNlbGVjdGVkID49IG51bVJvd3M7XHJcbiAgfVxyXG5cclxuICAvKiogU2VsZWN0cyBhbGwgcm93cyBpZiB0aGV5IGFyZSBub3QgYWxsIHNlbGVjdGVkOyBvdGhlcndpc2UgY2xlYXIgc2VsZWN0aW9uLiAqL1xyXG4gIG1hc3RlclRvZ2dsZSgpIHtcclxuICAgIHRoaXMuaXNBbGxTZWxlY3RlZCgpID8gdGhpcy5zZWxlY3Rpb25NdWx0aXBsZS5jbGVhcigpIDogdGhpcy5zZWxlY3RBbGwoKTtcclxuICAgIHRoaXMuc2VsZWN0ZWRCdWxrLmVtaXQodGhpcy5zZWxlY3Rpb25NdWx0aXBsZS5zZWxlY3RlZCk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIHNlbGVjdEFsbCgpIHtcclxuICAgIHRoaXMuZGF0YVNvdXJjZS5zb3J0RGF0YShcclxuICAgICAgdGhpcy5kYXRhU291cmNlLmZpbHRlcmVkRGF0YSxcclxuICAgICAgdGhpcy5kYXRhU291cmNlLnNvcnRcclxuICAgICk7XHJcbiAgICBsZXQgY3V0QXJyYXkgPSB0aGlzLmRhdGFTb3VyY2UuZmlsdGVyZWREYXRhO1xyXG4gICAgaWYgKHRoaXMuY29uZmlnLmJ1bGtTZWxlY3RNYXhDb3VudCkge1xyXG4gICAgICBjdXRBcnJheSA9IHRoaXMuZGF0YVNvdXJjZS5maWx0ZXJlZERhdGEuc2xpY2UoXHJcbiAgICAgICAgMCxcclxuICAgICAgICB0aGlzLmNvbmZpZy5idWxrU2VsZWN0TWF4Q291bnRcclxuICAgICAgKTtcclxuICAgIH1cclxuICAgIGN1dEFycmF5LmZvckVhY2gocm93ID0+IHtcclxuICAgICAgdGhpcy5zZWxlY3Rpb25NdWx0aXBsZS5zZWxlY3Qocm93KTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgaXNNYXhSZWFjaGVkKCkge1xyXG4gICAgaWYgKCF0aGlzLmNvbmZpZy5idWxrU2VsZWN0TWF4Q291bnQpIHtcclxuICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIChcclxuICAgICAgdGhpcy5zZWxlY3Rpb25NdWx0aXBsZS5zZWxlY3RlZC5sZW5ndGggPj0gdGhpcy5jb25maWcuYnVsa1NlbGVjdE1heENvdW50XHJcbiAgICApO1xyXG4gIH1cclxuXHJcbiAgb25Db2x1bW5GaWx0ZXJDaGFuZ2UoJGV2ZW50KSB7XHJcbiAgICBjb25zb2xlLmxvZyh7ICRldmVudCB9KTtcclxuICAgIGNvbnN0IHNlbGVjdGVkVmFsdWVzID0gdGhpcy5maWx0ZXJDb250cm9sLnZhbHVlO1xyXG4gICAgdGhpcy5zZXREaXNwbGF5ZWRDb2x1bW5zKHNlbGVjdGVkVmFsdWVzKTtcclxuICAgIHRoaXMuaW5pdEZpbHRlcih0aGlzLmRhdGFTb3VyY2UuZGF0YSk7XHJcbiAgfVxyXG5cclxuICBvbkNsaWNrQnVsa0l0ZW0oJGV2ZW50LCBpdGVtKSB7XHJcbiAgICBpZiAoJGV2ZW50KSB7XHJcbiAgICAgIGNvbnN0IGlzU2VsZWN0ZWQgPSB0aGlzLnNlbGVjdGlvbk11bHRpcGxlLmlzU2VsZWN0ZWQoaXRlbSk7XHJcbiAgICAgIGlmICghdGhpcy5pc01heFJlYWNoZWQoKSkge1xyXG4gICAgICAgIHRoaXMuc2VsZWN0aW9uTXVsdGlwbGUudG9nZ2xlKGl0ZW0pO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGlmIChpc1NlbGVjdGVkKSB7XHJcbiAgICAgICAgICB0aGlzLnNlbGVjdGlvbk11bHRpcGxlLmRlc2VsZWN0KGl0ZW0pO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICB0aGlzLndhcm4oKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgICAgdGhpcy5zZWxlY3RlZEJ1bGsuZW1pdCh0aGlzLnNlbGVjdGlvbk11bHRpcGxlLnNlbGVjdGVkKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIG9uQ2xpY2tSb3coJGV2ZW50LCByb3c6IFQpIHtcclxuICAgIGlmICh0aGlzLmNvbmZpZy5vblNlbGVjdEl0ZW0pIHtcclxuICAgICAgdGhpcy5sb2coXCJvbkNsaWNrUm93KClcIiwgeyAkZXZlbnQsIHJvdyB9KTtcclxuICAgICAgdGhpcy5zZWxlY3Rpb25TaW5nbGUuc2VsZWN0KHJvdyk7XHJcbiAgICAgIHRoaXMuY29uZmlnLm9uU2VsZWN0SXRlbShyb3cpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgb25Eb3VibGVDbGlja1JvdygkZXZlbnQsIHJvdzogVCkge1xyXG4gICAgaWYgKHRoaXMuY29uZmlnLm9uU2VsZWN0SXRlbURvdWJsZUNsaWNrKSB7XHJcbiAgICAgIHRoaXMubG9nKFwib25Eb3VibGVDbGlja1JvdygpXCIsIHsgJGV2ZW50LCByb3cgfSk7XHJcbiAgICAgIHRoaXMuc2VsZWN0aW9uU2luZ2xlLnNlbGVjdChyb3cpO1xyXG4gICAgICB0aGlzLmNvbmZpZy5vblNlbGVjdEl0ZW1Eb3VibGVDbGljayhyb3cpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgYXN5bmMgb25DbGlja0J1bGtBY3Rpb24oYWN0aW9uOiBBY3Rpb25EZWZpbml0aW9uQnVsazxUPikge1xyXG4gICAgYXdhaXQgYWN0aW9uLm9uQ2xpY2sodGhpcy5zZWxlY3Rpb25NdWx0aXBsZS5zZWxlY3RlZCk7XHJcbiAgICB0aGlzLnNlbGVjdGlvbk11bHRpcGxlLmNsZWFyKCk7XHJcbiAgfVxyXG5cclxuICBsb2coc3RyOiBzdHJpbmcsIG9iaj86IGFueSkge1xyXG4gICAgaWYgKHRoaXMuY29uZmlnLmRlYnVnKSB7XHJcbiAgICAgIGNvbnNvbGUubG9nKFwiPG5neC1hdXRvLXRhYmxlPiA6IFwiICsgc3RyLCBvYmopO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgd2FybigpIHt9XHJcbn1cclxuIl19