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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LWF1dG8tdGFibGUuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vbmd4LWF1dG8tdGFibGUvIiwic291cmNlcyI6WyJsaWIvbmd4LWF1dG8tdGFibGUuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsT0FBTyxFQUNMLFNBQVMsRUFFVCxLQUFLLEVBRUwsU0FBUyxFQUNULE1BQU0sRUFDTixZQUFZLEVBQ2IsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFFLGtCQUFrQixFQUFFLFlBQVksRUFBRSxPQUFPLEVBQUUsTUFBTSxtQkFBbUIsQ0FBQztBQUM5RSxPQUFPLEVBQWMsT0FBTyxFQUFFLE1BQU0sTUFBTSxDQUFDO0FBQzNDLE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUM3QyxPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sMEJBQTBCLENBQUM7QUFDMUQsT0FBTyxFQUFFLE1BQU0sRUFBRSxTQUFTLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQzs7Ozs7QUFFbkQscUNBcUJDOzs7SUFwQkMsZ0NBQXVCOztJQUN2QixnQ0FBZ0I7O0lBQ2hCLG1DQUFrQjs7SUFDbEIsa0NBQWdDOztJQUNoQyxzQ0FBd0M7O0lBQ3hDLDZDQUE0Qjs7SUFDNUIsdUNBQWdDOztJQUNoQyxrREFBMkM7O0lBQzNDLHdDQUFpQzs7SUFDakMsc0NBQXFCOztJQUNyQix5Q0FBZ0M7O0lBQ2hDLG1DQUFrQjs7SUFDbEIscUNBQXNCOztJQUN0QixxQ0FBcUI7O0lBQ3JCLHFDQUFxQjs7SUFDckIsNENBQTRCOztJQUM1QixxQ0FBb0I7O0lBQ3BCLHlDQUF3Qjs7SUFDeEIsMENBQW1DOztJQUNuQyw2Q0FBbUM7Ozs7OztBQUdyQyxzQ0FNQzs7O0lBTEMsaUNBQWM7O0lBQ2QsZ0NBQWM7O0lBQ2QsbUNBQTJCOztJQUMzQix3Q0FBa0M7O0lBQ2xDLDJDQUFpQzs7Ozs7O0FBR25DLDBDQUlDOzs7SUFIQyxxQ0FBYzs7SUFD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Q2xCLDRDQUF1Qjs7SUFFdkIsd0NBQW9COztJQUVwQiwyQ0FBa0M7O0lBRWxDLCtDQUFzRDs7SUFDdEQsNkNBQXFEOztJQUVyRCwwQ0FBNkIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xyXG4gIENvbXBvbmVudCxcclxuICBPbkluaXQsXHJcbiAgSW5wdXQsXHJcbiAgT25EZXN0cm95LFxyXG4gIFZpZXdDaGlsZCxcclxuICBPdXRwdXQsXHJcbiAgRXZlbnRFbWl0dGVyXHJcbn0gZnJvbSBcIkBhbmd1bGFyL2NvcmVcIjtcclxuaW1wb3J0IHsgTWF0VGFibGVEYXRhU291cmNlLCBNYXRQYWdpbmF0b3IsIE1hdFNvcnQgfSBmcm9tIFwiQGFuZ3VsYXIvbWF0ZXJpYWxcIjtcclxuaW1wb3J0IHsgT2JzZXJ2YWJsZSwgU3ViamVjdCB9IGZyb20gXCJyeGpzXCI7XHJcbmltcG9ydCB7IEZvcm1Db250cm9sIH0gZnJvbSBcIkBhbmd1bGFyL2Zvcm1zXCI7XHJcbmltcG9ydCB7IFNlbGVjdGlvbk1vZGVsIH0gZnJvbSBcIkBhbmd1bGFyL2Nkay9jb2xsZWN0aW9uc1wiO1xyXG5pbXBvcnQgeyBmaWx0ZXIsIHRha2VVbnRpbCB9IGZyb20gXCJyeGpzL29wZXJhdG9yc1wiO1xyXG5cclxuZXhwb3J0IGludGVyZmFjZSBBdXRvVGFibGVDb25maWc8VD4ge1xyXG4gIGRhdGEkOiBPYnNlcnZhYmxlPFRbXT47XHJcbiAgZGVidWc/OiBib29sZWFuO1xyXG4gIGZpbGVuYW1lPzogc3RyaW5nO1xyXG4gIGFjdGlvbnM/OiBBY3Rpb25EZWZpbml0aW9uPFQ+W107XHJcbiAgYWN0aW9uc0J1bGs/OiBBY3Rpb25EZWZpbml0aW9uQnVsazxUPltdO1xyXG4gIGJ1bGtTZWxlY3RNYXhDb3VudD86IG51bWJlcjtcclxuICBvblNlbGVjdEl0ZW0/OiAocm93OiBUKSA9PiB2b2lkO1xyXG4gIG9uU2VsZWN0SXRlbURvdWJsZUNsaWNrPzogKHJvdzogVCkgPT4gdm9pZDtcclxuICBjbGVhclNlbGVjdGVkPzogT2JzZXJ2YWJsZTx2b2lkPjtcclxuICBpbml0aWFsU29ydD86IHN0cmluZztcclxuICBpbml0aWFsU29ydERpcj86IFwiYXNjXCIgfCBcImRlc2NcIjtcclxuICBwYWdlU2l6ZT86IG51bWJlcjtcclxuICBoaWRlRmllbGRzPzogc3RyaW5nW107XHJcbiAgaGlkZUZpbHRlcj86IGJvb2xlYW47XHJcbiAgaGlkZUhlYWRlcj86IGJvb2xlYW47XHJcbiAgaGlkZUNob29zZUNvbHVtbnM/OiBib29sZWFuO1xyXG4gIGZpbHRlclRleHQ/OiBzdHJpbmc7XHJcbiAgZXhwb3J0RmlsZW5hbWU/OiBzdHJpbmc7XHJcbiAgZXhwb3J0Um93Rm9ybWF0PzogKHJvdzogVCkgPT4gdm9pZDtcclxuICAkdHJpZ2dlclNlbGVjdEl0ZW0/OiBPYnNlcnZhYmxlPFQ+O1xyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIEFjdGlvbkRlZmluaXRpb248VD4ge1xyXG4gIGxhYmVsOiBzdHJpbmc7XHJcbiAgaWNvbj86IHN0cmluZztcclxuICBvbkNsaWNrPzogKHJvdzogVCkgPT4gdm9pZDtcclxuICBvblJvdXRlckxpbms/OiAocm93OiBUKSA9PiBzdHJpbmc7XHJcbiAgcm91dGVyTGlua1F1ZXJ5PzogKHJvdzogVCkgPT4ge307XHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgQWN0aW9uRGVmaW5pdGlvbkJ1bGs8VD4ge1xyXG4gIGxhYmVsOiBzdHJpbmc7XHJcbiAgaWNvbj86IHN0cmluZztcclxuICBvbkNsaWNrPzogKHJvdzogVFtdKSA9PiB2b2lkO1xyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIENvbHVtbkRlZmluaXRpb24ge1xyXG4gIGhlYWRlcj86IHN0cmluZztcclxuICB0ZW1wbGF0ZT86IGFueTtcclxuICBoaWRlPzogYm9vbGVhbjtcclxuICBmb3JjZVdyYXA/OiBib29sZWFuO1xyXG59XHJcblxyXG5pbnRlcmZhY2UgQ29sdW1uRGVmaW5pdGlvbkludGVybmFsIGV4dGVuZHMgQ29sdW1uRGVmaW5pdGlvbiB7XHJcbiAgZmllbGQ6IHN0cmluZztcclxufVxyXG5cclxuQENvbXBvbmVudCh7XHJcbiAgc2VsZWN0b3I6IFwibmd4LWF1dG8tdGFibGVcIixcclxuICB0ZW1wbGF0ZVVybDogXCIuL25neC1hdXRvLXRhYmxlLmNvbXBvbmVudC5odG1sXCIsXHJcbiAgc3R5bGVVcmxzOiBbXCIuL25neC1hdXRvLXRhYmxlLmNvbXBvbmVudC5zY3NzXCJdXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBBdXRvVGFibGVDb21wb25lbnQ8VD4gaW1wbGVtZW50cyBPbkluaXQsIE9uRGVzdHJveSB7XHJcbiAgQE91dHB1dCgpXHJcbiAgc2VsZWN0ZWRCdWxrID0gbmV3IEV2ZW50RW1pdHRlcjxUW10+KCk7XHJcbiAgQElucHV0KClcclxuICBjb25maWc6IEF1dG9UYWJsZUNvbmZpZzxUPjtcclxuICBASW5wdXQoKVxyXG4gIGNvbHVtbkRlZmluaXRpb25zOiB7XHJcbiAgICBbZmllbGQ6IHN0cmluZ106IENvbHVtbkRlZmluaXRpb247XHJcbiAgfSA9IHt9O1xyXG4gIGNvbHVtbkRlZmluaXRpb25zQWxsOiB7XHJcbiAgICBbZmllbGQ6IHN0cmluZ106IENvbHVtbkRlZmluaXRpb247XHJcbiAgfSA9IHt9O1xyXG4gIGNvbHVtbkRlZmluaXRpb25zQWxsQXJyYXk6IENvbHVtbkRlZmluaXRpb25JbnRlcm5hbFtdID0gW107XHJcblxyXG4gIGhlYWRlcktleXNBbGwgPSBbXTtcclxuICBoZWFkZXJLZXlzQWxsVmlzaWJsZSA9IFtdO1xyXG4gIGhlYWRlcktleXNEaXNwbGF5ZWQgPSBbXTtcclxuICBoZWFkZXJLZXlzRGlzcGxheWVkTWFwID0ge307XHJcblxyXG4gIGRhdGFTb3VyY2U6IE1hdFRhYmxlRGF0YVNvdXJjZTxhbnk+O1xyXG4gIEBWaWV3Q2hpbGQoTWF0UGFnaW5hdG9yKSBwYWdpbmF0b3I6IE1hdFBhZ2luYXRvcjtcclxuICBwYWdlU2l6ZSA9IDI1O1xyXG4gIEBWaWV3Q2hpbGQoTWF0U29ydCkgc29ydDogTWF0U29ydDtcclxuXHJcbiAgZXhwb3J0RGF0YTogYW55W107XHJcbiAgZXhwb3J0RmlsZW5hbWU6IHN0cmluZztcclxuXHJcbiAgaGFzTm9JdGVtczogYm9vbGVhbjtcclxuXHJcbiAgZmlsdGVyQ29udHJvbCA9IG5ldyBGb3JtQ29udHJvbCgpO1xyXG4gIC8vIEJ1bGsgaXRlbXMgc2VsZWN0aW9uXHJcbiAgc2VsZWN0aW9uTXVsdGlwbGUgPSBuZXcgU2VsZWN0aW9uTW9kZWw8YW55Pih0cnVlLCBbXSk7XHJcbiAgc2VsZWN0aW9uU2luZ2xlID0gbmV3IFNlbGVjdGlvbk1vZGVsPGFueT4oZmFsc2UsIFtdKTtcclxuXHJcbiAgJG9uRGVzdHJveWVkID0gbmV3IFN1YmplY3QoKTtcclxuXHJcbiAgbmdPbkluaXQoKSB7XHJcbiAgICB0aGlzLmNvbmZpZy5kYXRhJFxyXG4gICAgICAucGlwZShmaWx0ZXIoZSA9PiAhIWUpKVxyXG4gICAgICAucGlwZSh0YWtlVW50aWwodGhpcy4kb25EZXN0cm95ZWQpKVxyXG4gICAgICAuc3Vic2NyaWJlKG9yaWdpbmFsRGF0YSA9PiB7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJuZ3gtYXV0by10YWJsZSwgc3Vic2NyaWJlZDogXCIsIHsgb3JpZ2luYWxEYXRhIH0pO1xyXG4gICAgICAgIHRoaXMuZGF0YVNvdXJjZSA9IG5ldyBNYXRUYWJsZURhdGFTb3VyY2Uob3JpZ2luYWxEYXRhKTtcclxuICAgICAgICB0aGlzLmRhdGFTb3VyY2UucGFnaW5hdG9yID0gdGhpcy5wYWdpbmF0b3I7XHJcbiAgICAgICAgdGhpcy5kYXRhU291cmNlLnNvcnQgPSB0aGlzLnNvcnQ7XHJcbiAgICAgICAgaWYgKG9yaWdpbmFsRGF0YSAmJiAhb3JpZ2luYWxEYXRhLmxlbmd0aCkge1xyXG4gICAgICAgICAgdGhpcy5oYXNOb0l0ZW1zID0gdHJ1ZTtcclxuICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgdGhpcy5oYXNOb0l0ZW1zID0gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0aGlzLmNvbmZpZy5wYWdlU2l6ZSkge1xyXG4gICAgICAgICAgdGhpcy5wYWdlU2l6ZSA9IHRoaXMuY29uZmlnLnBhZ2VTaXplO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjb25zdCBmaXJzdERhdGFJdGVtID0gb3JpZ2luYWxEYXRhWzBdO1xyXG4gICAgICAgIHRoaXMuaW5pdERpc3BsYXllZENvbHVtbnMoZmlyc3REYXRhSXRlbSk7XHJcbiAgICAgICAgdGhpcy5pbml0RXhwb3J0KG9yaWdpbmFsRGF0YSk7XHJcbiAgICAgICAgdGhpcy5pbml0RmlsdGVyKG9yaWdpbmFsRGF0YSk7XHJcbiAgICAgIH0pO1xyXG5cclxuICAgIGlmICh0aGlzLmNvbmZpZy4kdHJpZ2dlclNlbGVjdEl0ZW0pIHtcclxuICAgICAgdGhpcy5jb25maWcuJHRyaWdnZXJTZWxlY3RJdGVtXHJcbiAgICAgICAgLnBpcGUodGFrZVVudGlsKHRoaXMuJG9uRGVzdHJveWVkKSlcclxuICAgICAgICAuc3Vic2NyaWJlKGl0ZW0gPT4ge1xyXG4gICAgICAgICAgdGhpcy5sb2coXCIkdHJpZ2dlclNlbGVjdEl0ZW1cIiwgaXRlbSk7XHJcbiAgICAgICAgICBjb25zdCBzdHIgPSBKU09OLnN0cmluZ2lmeShpdGVtKTtcclxuICAgICAgICAgIGNvbnN0IGZvdW5kSXRlbSA9IHRoaXMuZGF0YVNvdXJjZS5kYXRhLmZpbmQoXHJcbiAgICAgICAgICAgIHJvdyA9PiBKU09OLnN0cmluZ2lmeShyb3cpID09PSBzdHJcclxuICAgICAgICAgICk7XHJcbiAgICAgICAgICBpZiAoZm91bmRJdGVtKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc2VsZWN0aW9uU2luZ2xlLnNlbGVjdChmb3VuZEl0ZW0pO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICh0aGlzLmNvbmZpZy5jbGVhclNlbGVjdGVkKSB7XHJcbiAgICAgIHRoaXMuY29uZmlnLmNsZWFyU2VsZWN0ZWRcclxuICAgICAgICAucGlwZSh0YWtlVW50aWwodGhpcy4kb25EZXN0cm95ZWQpKVxyXG4gICAgICAgIC5zdWJzY3JpYmUoKCkgPT4ge1xyXG4gICAgICAgICAgdGhpcy5sb2coXCJjbGVhclNlbGVjdGVkXCIpO1xyXG4gICAgICAgICAgdGhpcy5zZWxlY3Rpb25NdWx0aXBsZS5jbGVhcigpO1xyXG4gICAgICAgICAgdGhpcy5zZWxlY3Rpb25TaW5nbGUuY2xlYXIoKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIG5nT25EZXN0cm95KCkge1xyXG4gICAgdGhpcy4kb25EZXN0cm95ZWQubmV4dCgpO1xyXG4gICAgdGhpcy4kb25EZXN0cm95ZWQuY29tcGxldGUoKTtcclxuICB9XHJcblxyXG4gIGFwcGx5RmlsdGVyKGZpbHRlclZhbHVlOiBzdHJpbmcpIHtcclxuICAgIHRoaXMuZGF0YVNvdXJjZS5maWx0ZXIgPSBmaWx0ZXJWYWx1ZS50cmltKCkudG9Mb3dlckNhc2UoKTtcclxuICAgIHRoaXMuc2VsZWN0aW9uTXVsdGlwbGUuY2xlYXIoKTtcclxuICAgIHRoaXMuc2VsZWN0aW9uU2luZ2xlLmNsZWFyKCk7XHJcbiAgfVxyXG5cclxuICBpbml0RmlsdGVyKG9yaWdpbmFsRGF0YTogVFtdKSB7XHJcbiAgICBpZiAoIW9yaWdpbmFsRGF0YS5sZW5ndGgpIHtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG4gICAgY29uc3QgZmlyc3RSb3cgPSBvcmlnaW5hbERhdGFbMF07XHJcbiAgICBjb25zdCBrZXlzRGF0YSA9IG5ldyBTZXQoT2JqZWN0LmtleXMoZmlyc3RSb3cpKTtcclxuICAgIGNvbnN0IGtleXNIZWFkZXIgPSBuZXcgU2V0KHRoaXMuaGVhZGVyS2V5c0Rpc3BsYXllZCk7XHJcbiAgICBrZXlzSGVhZGVyLmRlbGV0ZShcIl9fYnVsa1wiKTtcclxuICAgIGtleXNIZWFkZXIuZGVsZXRlKFwiX19zdGFyXCIpO1xyXG4gICAgY29uc3QgYWxsRmllbGRzRXhpc3QgPSBBcnJheS5mcm9tKGtleXNIZWFkZXIpLnJlZHVjZSgoYWNjLCBjdXIpID0+IHtcclxuICAgICAgcmV0dXJuIGtleXNEYXRhLmhhcyhjdXIpICYmIGFjYztcclxuICAgIH0sIHRydWUpO1xyXG5cclxuICAgIHRoaXMubG9nKFwiaW5pdEZpbHRlcigpXCIsIHtcclxuICAgICAgcm93RmllbGRzOiBrZXlzRGF0YSxcclxuICAgICAgYWxsRmllbGRzRXhpc3QsXHJcbiAgICAgIGhlYWRlcktleXNEaXNwbGF5ZWQ6IHRoaXMuaGVhZGVyS2V5c0Rpc3BsYXllZFxyXG4gICAgfSk7XHJcbiAgICB0aGlzLmRhdGFTb3VyY2UuZmlsdGVyUHJlZGljYXRlID0gKGRhdGE6IFQsIGZpbHRlclRleHQ6IHN0cmluZykgPT4ge1xyXG4gICAgICBpZiAoIWZpbHRlclRleHQpIHtcclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgfVxyXG4gICAgICBpZiAoIWFsbEZpZWxkc0V4aXN0KSB7XHJcbiAgICAgICAgY29uc3QgbG93ZXIgPSBKU09OLnN0cmluZ2lmeShkYXRhKS50b0xvd2VyQ2FzZSgpO1xyXG4gICAgICAgIHJldHVybiBsb3dlci5pbmNsdWRlcyhmaWx0ZXJUZXh0KTtcclxuICAgICAgfVxyXG4gICAgICBmb3IgKGNvbnN0IGtleSBvZiBBcnJheS5mcm9tKGtleXNIZWFkZXIpKSB7XHJcbiAgICAgICAgY29uc3QgZGF0YVZhbCA9IGRhdGFba2V5XTtcclxuICAgICAgICBjb25zdCBzdHIgPSBKU09OLnN0cmluZ2lmeShkYXRhVmFsKTtcclxuICAgICAgICBjb25zdCBpc0ZvdW5kID0gc3RyLnRvTG93ZXJDYXNlKCkuaW5jbHVkZXMoZmlsdGVyVGV4dCk7XHJcbiAgICAgICAgaWYgKGlzRm91bmQpIHtcclxuICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfTtcclxuICB9XHJcblxyXG4gIGluaXRFeHBvcnQob3JpZ2luYWxEYXRhOiBUW10pIHtcclxuICAgIHRoaXMuZXhwb3J0RmlsZW5hbWUgPSB0aGlzLmNvbmZpZy5leHBvcnRGaWxlbmFtZTtcclxuICAgIGlmICghdGhpcy5leHBvcnRGaWxlbmFtZSkge1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcbiAgICB0aGlzLmV4cG9ydERhdGEgPSBvcmlnaW5hbERhdGEubWFwKGRhdGFJdGVtID0+IHtcclxuICAgICAgaWYgKCF0aGlzLmNvbmZpZy5leHBvcnRSb3dGb3JtYXQpIHtcclxuICAgICAgICByZXR1cm4gZGF0YUl0ZW07XHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuIHRoaXMuY29uZmlnLmV4cG9ydFJvd0Zvcm1hdChkYXRhSXRlbSk7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBnZXRLZXlIZWFkZXIoa2V5OiBzdHJpbmcpIHtcclxuICAgIGNvbnN0IGlucHV0RGVmID0gdGhpcy5jb2x1bW5EZWZpbml0aW9uc1trZXldO1xyXG4gICAgaWYgKGlucHV0RGVmICYmIGlucHV0RGVmLmhlYWRlciAhPSBudWxsKSB7XHJcbiAgICAgIHJldHVybiBpbnB1dERlZi5oZWFkZXI7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gdGhpcy50b1RpdGxlQ2FzZShrZXkpO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSB0b1RpdGxlQ2FzZShzdHIpIHtcclxuICAgIHJldHVybiBzdHIucmVwbGFjZShcIl9cIiwgXCIgXCIpLnJlcGxhY2UoL1xcd1xcUyovZywgZnVuY3Rpb24odHh0KSB7XHJcbiAgICAgIHJldHVybiB0eHQuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyB0eHQuc3Vic3RyKDEpLnRvTG93ZXJDYXNlKCk7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIGluaXREaXNwbGF5ZWRDb2x1bW5zKGZpcnN0RGF0YUl0ZW06IFQpIHtcclxuICAgIHRoaXMuaW5pdENvbHVtbkRlZmluaXRpb25zKGZpcnN0RGF0YUl0ZW0pO1xyXG5cclxuICAgIHRoaXMuaGVhZGVyS2V5c0FsbCA9IE9iamVjdC5rZXlzKHRoaXMuY29sdW1uRGVmaW5pdGlvbnNBbGwpO1xyXG4gICAgdGhpcy5oZWFkZXJLZXlzQWxsVmlzaWJsZSA9IHRoaXMuaGVhZGVyS2V5c0FsbDtcclxuICAgIGlmICh0aGlzLmNvbmZpZy5oaWRlRmllbGRzKSB7XHJcbiAgICAgIC8vIEhpZGUgZmllbGRzIGlmIHNwZWNpZmllZFxyXG4gICAgICBjb25zdCBoaWRlRmllbGRzID0gbmV3IFNldCh0aGlzLmNvbmZpZy5oaWRlRmllbGRzKTtcclxuICAgICAgdGhpcy5oZWFkZXJLZXlzQWxsVmlzaWJsZSA9IHRoaXMuaGVhZGVyS2V5c0FsbC5maWx0ZXIoXHJcbiAgICAgICAgeCA9PiAhaGlkZUZpZWxkcy5oYXMoeClcclxuICAgICAgKTtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBkaXNwbGF5ZWQgPSB0aGlzLmNvbHVtbkRlZmluaXRpb25zQWxsQXJyYXlcclxuICAgICAgLmZpbHRlcihkZWYgPT4gIWRlZi5oaWRlKVxyXG4gICAgICAubWFwKGQgPT4gZC5maWVsZCk7XHJcblxyXG4gICAgdGhpcy5zZXREaXNwbGF5ZWRDb2x1bW5zKGRpc3BsYXllZCk7XHJcbiAgICAvLyBTZXQgY3VycmVudGx5IGVuYWJsZWQgaXRlbXNcclxuICAgIHRoaXMuZmlsdGVyQ29udHJvbC5zZXRWYWx1ZSh0aGlzLmhlYWRlcktleXNEaXNwbGF5ZWQpO1xyXG4gIH1cclxuXHJcbiAgaW5pdENvbHVtbkRlZmluaXRpb25zKGZpcnN0RGF0YUl0ZW06IFQpIHtcclxuICAgIC8vIFNldCBhbGwgY29sdW1uIGRlZmludGlvbnMsIHdoaWNoIHdlcmUgZXhwbGljaXRseSBzZXQgaW4gY29uZmlnXHJcbiAgICBjb25zdCBpbnB1dERlZmludGlvbkZpZWxkcyA9IE9iamVjdC5rZXlzKHRoaXMuY29sdW1uRGVmaW5pdGlvbnMpO1xyXG4gICAgaW5wdXREZWZpbnRpb25GaWVsZHMuZm9yRWFjaCgoZmllbGQ6IHN0cmluZykgPT4ge1xyXG4gICAgICBjb25zdCBpbnB1dERlZmludGlvbiA9IHRoaXMuY29sdW1uRGVmaW5pdGlvbnNbZmllbGRdO1xyXG4gICAgICB0aGlzLmNvbHVtbkRlZmluaXRpb25zQWxsW2ZpZWxkXSA9IHtcclxuICAgICAgICBoZWFkZXI6IHRoaXMuZ2V0S2V5SGVhZGVyKGZpZWxkKSxcclxuICAgICAgICB0ZW1wbGF0ZTogaW5wdXREZWZpbnRpb24udGVtcGxhdGUsXHJcbiAgICAgICAgaGlkZTogaW5wdXREZWZpbnRpb24uaGlkZSxcclxuICAgICAgICBmb3JjZVdyYXA6IGlucHV0RGVmaW50aW9uLmZvcmNlV3JhcFxyXG4gICAgICB9O1xyXG4gICAgfSk7XHJcblxyXG4gICAgLy8gU2V0IGFsbCBjb2x1bW4gZGVmaW50aW9ucyByZWFkIGZyb20gdGhlIFwiaW5wdXQgZGF0YVwiXHJcbiAgICBjb25zdCBpbnB1dERhdGFLZXlzID0gT2JqZWN0LmtleXMoZmlyc3REYXRhSXRlbSk7XHJcbiAgICBpbnB1dERhdGFLZXlzLmZvckVhY2goKGZpZWxkOiBzdHJpbmcpID0+IHtcclxuICAgICAgaWYgKCEhdGhpcy5jb2x1bW5EZWZpbml0aW9uc0FsbFtmaWVsZF0pIHtcclxuICAgICAgICAvLyBza2lwIGlmIGRlZmluaXRpb24gZXhpc3RzXHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICB9XHJcbiAgICAgIHRoaXMuY29sdW1uRGVmaW5pdGlvbnNBbGxbZmllbGRdID0ge1xyXG4gICAgICAgIGhlYWRlcjogdGhpcy50b1RpdGxlQ2FzZShmaWVsZCksXHJcbiAgICAgICAgaGlkZTogdHJ1ZVxyXG4gICAgICB9O1xyXG4gICAgfSk7XHJcblxyXG4gICAgdGhpcy5jb2x1bW5EZWZpbml0aW9uc0FsbEFycmF5ID0gT2JqZWN0LmtleXModGhpcy5jb2x1bW5EZWZpbml0aW9uc0FsbCkubWFwKFxyXG4gICAgICBrID0+IHtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgLi4udGhpcy5jb2x1bW5EZWZpbml0aW9uc0FsbFtrXSxcclxuICAgICAgICAgIGZpZWxkOiBrXHJcbiAgICAgICAgfTtcclxuICAgICAgfVxyXG4gICAgKTtcclxuICAgIHRoaXMubG9nKFwiaW5pdENvbHVtbkRlZmluaXRpb25zXCIsIHtcclxuICAgICAgZmlyc3REYXRhSXRlbSxcclxuICAgICAgaW5wdXREZWZpbnRpb25GaWVsZHNcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgLy8gU2V0cyB0aGUgZGlzcGxheWVkIGNvbHVtbnMgZnJvbSBhIHNldCBvZiBmaWVsZG5hbWVzXHJcbiAgc2V0RGlzcGxheWVkQ29sdW1ucyhzZWxlY3RlZDogc3RyaW5nW10pIHtcclxuICAgIC8vIEluaXRpYWxpemUgYWxsIGtleXMgYXMgZmFsc2VcclxuICAgIHRoaXMuaGVhZGVyS2V5c0FsbFZpc2libGUuZm9yRWFjaChcclxuICAgICAgayA9PiAodGhpcy5oZWFkZXJLZXlzRGlzcGxheWVkTWFwW2tdID0gZmFsc2UpXHJcbiAgICApO1xyXG4gICAgLy8gU2V0IHNlbGVjdGVkIGFzIHRydWVcclxuICAgIHNlbGVjdGVkLmZvckVhY2goYyA9PiAodGhpcy5oZWFkZXJLZXlzRGlzcGxheWVkTWFwW2NdID0gdHJ1ZSkpO1xyXG4gICAgdGhpcy5oZWFkZXJLZXlzRGlzcGxheWVkID0gT2JqZWN0LmtleXModGhpcy5oZWFkZXJLZXlzRGlzcGxheWVkTWFwKS5maWx0ZXIoXHJcbiAgICAgIGsgPT4gdGhpcy5oZWFkZXJLZXlzRGlzcGxheWVkTWFwW2tdXHJcbiAgICApO1xyXG4gICAgLy8gQWRkIGJ1bGsgc2VsZWN0IGNvbHVtbiBhdCBzdGFydFxyXG4gICAgaWYgKHRoaXMuY29uZmlnLmFjdGlvbnNCdWxrKSB7XHJcbiAgICAgIHRoaXMuaGVhZGVyS2V5c0Rpc3BsYXllZC51bnNoaWZ0KFwiX19idWxrXCIpO1xyXG4gICAgfVxyXG4gICAgLy8gQWRkIGFjdGlvbnMgY29sdW1uIGF0IGVuZFxyXG4gICAgaWYgKHRoaXMuY29uZmlnLmFjdGlvbnMpIHtcclxuICAgICAgdGhpcy5oZWFkZXJLZXlzRGlzcGxheWVkLnB1c2goXCJfX3N0YXJcIik7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvKiogV2hldGhlciB0aGUgbnVtYmVyIG9mIHNlbGVjdGVkIGVsZW1lbnRzIG1hdGNoZXMgdGhlIHRvdGFsIG51bWJlciBvZiByb3dzLiAqL1xyXG4gIGlzQWxsU2VsZWN0ZWQoKSB7XHJcbiAgICBjb25zdCBudW1TZWxlY3RlZCA9IHRoaXMuc2VsZWN0aW9uTXVsdGlwbGUuc2VsZWN0ZWQubGVuZ3RoO1xyXG4gICAgY29uc3QgbnVtUm93cyA9XHJcbiAgICAgIHRoaXMuY29uZmlnLmJ1bGtTZWxlY3RNYXhDb3VudCB8fCB0aGlzLmRhdGFTb3VyY2UuZmlsdGVyZWREYXRhLmxlbmd0aDtcclxuICAgIHJldHVybiBudW1TZWxlY3RlZCA+PSBudW1Sb3dzO1xyXG4gIH1cclxuXHJcbiAgLyoqIFNlbGVjdHMgYWxsIHJvd3MgaWYgdGhleSBhcmUgbm90IGFsbCBzZWxlY3RlZDsgb3RoZXJ3aXNlIGNsZWFyIHNlbGVjdGlvbi4gKi9cclxuICBtYXN0ZXJUb2dnbGUoKSB7XHJcbiAgICB0aGlzLmlzQWxsU2VsZWN0ZWQoKSA/IHRoaXMuc2VsZWN0aW9uTXVsdGlwbGUuY2xlYXIoKSA6IHRoaXMuc2VsZWN0QWxsKCk7XHJcbiAgICB0aGlzLnNlbGVjdGVkQnVsay5lbWl0KHRoaXMuc2VsZWN0aW9uTXVsdGlwbGUuc2VsZWN0ZWQpO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBzZWxlY3RBbGwoKSB7XHJcbiAgICB0aGlzLmRhdGFTb3VyY2Uuc29ydERhdGEoXHJcbiAgICAgIHRoaXMuZGF0YVNvdXJjZS5maWx0ZXJlZERhdGEsXHJcbiAgICAgIHRoaXMuZGF0YVNvdXJjZS5zb3J0XHJcbiAgICApO1xyXG4gICAgbGV0IGN1dEFycmF5ID0gdGhpcy5kYXRhU291cmNlLmZpbHRlcmVkRGF0YTtcclxuICAgIGlmICh0aGlzLmNvbmZpZy5idWxrU2VsZWN0TWF4Q291bnQpIHtcclxuICAgICAgY3V0QXJyYXkgPSB0aGlzLmRhdGFTb3VyY2UuZmlsdGVyZWREYXRhLnNsaWNlKFxyXG4gICAgICAgIDAsXHJcbiAgICAgICAgdGhpcy5jb25maWcuYnVsa1NlbGVjdE1heENvdW50XHJcbiAgICAgICk7XHJcbiAgICB9XHJcbiAgICBjdXRBcnJheS5mb3JFYWNoKHJvdyA9PiB7XHJcbiAgICAgIHRoaXMuc2VsZWN0aW9uTXVsdGlwbGUuc2VsZWN0KHJvdyk7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIGlzTWF4UmVhY2hlZCgpIHtcclxuICAgIGlmICghdGhpcy5jb25maWcuYnVsa1NlbGVjdE1heENvdW50KSB7XHJcbiAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuICAgIHJldHVybiAoXHJcbiAgICAgIHRoaXMuc2VsZWN0aW9uTXVsdGlwbGUuc2VsZWN0ZWQubGVuZ3RoID49IHRoaXMuY29uZmlnLmJ1bGtTZWxlY3RNYXhDb3VudFxyXG4gICAgKTtcclxuICB9XHJcblxyXG4gIG9uQ29sdW1uRmlsdGVyQ2hhbmdlKCRldmVudCkge1xyXG4gICAgY29uc29sZS5sb2coeyAkZXZlbnQgfSk7XHJcbiAgICBjb25zdCBzZWxlY3RlZFZhbHVlcyA9IHRoaXMuZmlsdGVyQ29udHJvbC52YWx1ZTtcclxuICAgIHRoaXMuc2V0RGlzcGxheWVkQ29sdW1ucyhzZWxlY3RlZFZhbHVlcyk7XHJcbiAgICB0aGlzLmluaXRGaWx0ZXIodGhpcy5kYXRhU291cmNlLmRhdGEpO1xyXG4gIH1cclxuXHJcbiAgb25DbGlja0J1bGtJdGVtKCRldmVudCwgaXRlbSkge1xyXG4gICAgaWYgKCRldmVudCkge1xyXG4gICAgICBjb25zdCBpc1NlbGVjdGVkID0gdGhpcy5zZWxlY3Rpb25NdWx0aXBsZS5pc1NlbGVjdGVkKGl0ZW0pO1xyXG4gICAgICBpZiAoIXRoaXMuaXNNYXhSZWFjaGVkKCkpIHtcclxuICAgICAgICB0aGlzLnNlbGVjdGlvbk11bHRpcGxlLnRvZ2dsZShpdGVtKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBpZiAoaXNTZWxlY3RlZCkge1xyXG4gICAgICAgICAgdGhpcy5zZWxlY3Rpb25NdWx0aXBsZS5kZXNlbGVjdChpdGVtKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgdGhpcy53YXJuKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICAgIHRoaXMuc2VsZWN0ZWRCdWxrLmVtaXQodGhpcy5zZWxlY3Rpb25NdWx0aXBsZS5zZWxlY3RlZCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBvbkNsaWNrUm93KCRldmVudCwgcm93OiBUKSB7XHJcbiAgICBpZiAodGhpcy5jb25maWcub25TZWxlY3RJdGVtKSB7XHJcbiAgICAgIHRoaXMubG9nKFwib25DbGlja1JvdygpXCIsIHsgJGV2ZW50LCByb3cgfSk7XHJcbiAgICAgIHRoaXMuc2VsZWN0aW9uU2luZ2xlLnNlbGVjdChyb3cpO1xyXG4gICAgICB0aGlzLmNvbmZpZy5vblNlbGVjdEl0ZW0ocm93KTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIG9uRG91YmxlQ2xpY2tSb3coJGV2ZW50LCByb3c6IFQpIHtcclxuICAgIGlmICh0aGlzLmNvbmZpZy5vblNlbGVjdEl0ZW1Eb3VibGVDbGljaykge1xyXG4gICAgICB0aGlzLmxvZyhcIm9uRG91YmxlQ2xpY2tSb3coKVwiLCB7ICRldmVudCwgcm93IH0pO1xyXG4gICAgICB0aGlzLnNlbGVjdGlvblNpbmdsZS5zZWxlY3Qocm93KTtcclxuICAgICAgdGhpcy5jb25maWcub25TZWxlY3RJdGVtRG91YmxlQ2xpY2socm93KTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGFzeW5jIG9uQ2xpY2tCdWxrQWN0aW9uKGFjdGlvbjogQWN0aW9uRGVmaW5pdGlvbkJ1bGs8VD4pIHtcclxuICAgIGF3YWl0IGFjdGlvbi5vbkNsaWNrKHRoaXMuc2VsZWN0aW9uTXVsdGlwbGUuc2VsZWN0ZWQpO1xyXG4gICAgdGhpcy5zZWxlY3Rpb25NdWx0aXBsZS5jbGVhcigpO1xyXG4gIH1cclxuXHJcbiAgbG9nKHN0cjogc3RyaW5nLCBvYmo/OiBhbnkpIHtcclxuICAgIGlmICh0aGlzLmNvbmZpZy5kZWJ1Zykge1xyXG4gICAgICBjb25zb2xlLmxvZyhcIjxuZ3gtYXV0by10YWJsZT4gOiBcIiArIHN0ciwgb2JqKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHdhcm4oKSB7fVxyXG59XHJcbiJdfQ==