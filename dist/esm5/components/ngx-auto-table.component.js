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
var AutoTableComponent = /** @class */ (function () {
    function AutoTableComponent() {
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
    AutoTableComponent.prototype.ngOnInit = /**
     * @return {?}
     */
    function () {
        var _this = this;
        this.dataSourceSubscription = this.config.data$
            .pipe(filter((/**
         * @param {?} e
         * @return {?}
         */
        function (e) { return !!e; })))
            .subscribe((/**
         * @param {?} originalData
         * @return {?}
         */
        function (originalData) {
            console.log('ngx-auto-table, subscribed: ', { originalData: originalData });
            _this.dataSource = new MatTableDataSource(originalData);
            _this.dataSource.paginator = _this.paginator;
            _this.dataSource.sort = _this.sort;
            if (originalData && !originalData.length) {
                _this.hasNoItems = true;
                return;
            }
            else {
                _this.hasNoItems = false;
            }
            if (_this.config.pageSize) {
                _this.pageSize = _this.config.pageSize;
            }
            /** @type {?} */
            var firstDataItem = originalData[0];
            _this.initDisplayedColumns(firstDataItem);
            _this.initExport(originalData);
            _this.initFilter(originalData);
        }));
        if (this.config.clearSelected) {
            this.clearSelectedSubscription = this.config.clearSelected.subscribe((/**
             * @return {?}
             */
            function () {
                console.log('ngx-auto-table: clearSelected');
                _this.selectionMultiple.clear();
                _this.selectionSingle.clear();
            }));
        }
    };
    /**
     * @return {?}
     */
    AutoTableComponent.prototype.ngOnDestroy = /**
     * @return {?}
     */
    function () {
        if (this.dataSourceSubscription) {
            this.dataSourceSubscription.unsubscribe();
        }
        if (this.clearSelectedSubscription) {
            this.clearSelectedSubscription.unsubscribe();
        }
    };
    /**
     * @param {?} filterValue
     * @return {?}
     */
    AutoTableComponent.prototype.applyFilter = /**
     * @param {?} filterValue
     * @return {?}
     */
    function (filterValue) {
        this.dataSource.filter = filterValue.trim().toLowerCase();
        this.selectionMultiple.clear();
        this.selectionSingle.clear();
    };
    /**
     * @param {?} originalData
     * @return {?}
     */
    AutoTableComponent.prototype.initFilter = /**
     * @param {?} originalData
     * @return {?}
     */
    function (originalData) {
        if (!originalData.length) {
            return;
        }
        /** @type {?} */
        var firstRow = originalData[0];
        /** @type {?} */
        var keysData = new Set(Object.keys(firstRow));
        /** @type {?} */
        var keysHeader = new Set(this.headerKeysDisplayed);
        keysHeader.delete('__bulk');
        keysHeader.delete('__star');
        /** @type {?} */
        var allFieldsExist = Array.from(keysHeader).reduce((/**
         * @param {?} acc
         * @param {?} cur
         * @return {?}
         */
        function (acc, cur) {
            return keysData.has(cur) && acc;
        }), true);
        console.log('ngx-auto-table: initFilter()', {
            rowFields: keysData,
            allFieldsExist: allFieldsExist,
            headerKeysDisplayed: this.headerKeysDisplayed
        });
        this.dataSource.filterPredicate = (/**
         * @param {?} data
         * @param {?} filterText
         * @return {?}
         */
        function (data, filterText) {
            var e_1, _a;
            if (!filterText) {
                return true;
            }
            if (!allFieldsExist) {
                /** @type {?} */
                var lower = JSON.stringify(data).toLowerCase();
                return lower.includes(filterText);
            }
            try {
                for (var _b = tslib_1.__values(Array.from(keysHeader)), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var key = _c.value;
                    /** @type {?} */
                    var dataVal = data[key];
                    /** @type {?} */
                    var str = JSON.stringify(dataVal);
                    /** @type {?} */
                    var isFound = str.toLowerCase().includes(filterText);
                    if (isFound) {
                        return true;
                    }
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_1) throw e_1.error; }
            }
        });
    };
    /**
     * @param {?} originalData
     * @return {?}
     */
    AutoTableComponent.prototype.initExport = /**
     * @param {?} originalData
     * @return {?}
     */
    function (originalData) {
        var _this = this;
        this.exportFilename = this.config.exportFilename;
        if (!this.exportFilename) {
            return;
        }
        this.exportData = originalData.map((/**
         * @param {?} dataItem
         * @return {?}
         */
        function (dataItem) {
            if (!_this.config.exportRowFormat) {
                return dataItem;
            }
            return _this.config.exportRowFormat(dataItem);
        }));
    };
    /**
     * @param {?} key
     * @return {?}
     */
    AutoTableComponent.prototype.getKeyHeader = /**
     * @param {?} key
     * @return {?}
     */
    function (key) {
        /** @type {?} */
        var inputDef = this.columnDefinitions[key];
        if (inputDef && inputDef.header != null) {
            return inputDef.header;
        }
        return this.toTitleCase(key);
    };
    /**
     * @private
     * @param {?} str
     * @return {?}
     */
    AutoTableComponent.prototype.toTitleCase = /**
     * @private
     * @param {?} str
     * @return {?}
     */
    function (str) {
        return str.replace('_', ' ').replace(/\w\S*/g, (/**
         * @param {?} txt
         * @return {?}
         */
        function (txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        }));
    };
    /**
     * @param {?} firstDataItem
     * @return {?}
     */
    AutoTableComponent.prototype.initDisplayedColumns = /**
     * @param {?} firstDataItem
     * @return {?}
     */
    function (firstDataItem) {
        this.initColumnDefinitions(firstDataItem);
        this.headerKeysAll = Object.keys(this.columnDefinitionsAll);
        this.headerKeysAllVisible = this.headerKeysAll;
        if (this.config.hideFields) {
            // Hide fields if specified
            /** @type {?} */
            var hideFields_1 = new Set(this.config.hideFields);
            this.headerKeysAllVisible = this.headerKeysAll.filter((/**
             * @param {?} x
             * @return {?}
             */
            function (x) { return !hideFields_1.has(x); }));
        }
        /** @type {?} */
        var displayed = this.columnDefinitionsAllArray
            .filter((/**
         * @param {?} def
         * @return {?}
         */
        function (def) { return !def.hide; }))
            .map((/**
         * @param {?} d
         * @return {?}
         */
        function (d) { return d.field; }));
        this.setDisplayedColumns(displayed);
        // Set currently enabled items
        this.filterControl.setValue(this.headerKeysDisplayed);
    };
    /**
     * @param {?} firstDataItem
     * @return {?}
     */
    AutoTableComponent.prototype.initColumnDefinitions = /**
     * @param {?} firstDataItem
     * @return {?}
     */
    function (firstDataItem) {
        var _this = this;
        // Set all column defintions, which were explicitly set in config
        /** @type {?} */
        var inputDefintionFields = Object.keys(this.columnDefinitions);
        inputDefintionFields.forEach((/**
         * @param {?} field
         * @return {?}
         */
        function (field) {
            /** @type {?} */
            var inputDefintion = _this.columnDefinitions[field];
            _this.columnDefinitionsAll[field] = {
                header: _this.getKeyHeader(field),
                template: inputDefintion.template,
                hide: inputDefintion.hide,
                forceWrap: inputDefintion.forceWrap
            };
        }));
        // Set all column defintions read from the "input data"
        /** @type {?} */
        var inputDataKeys = Object.keys(firstDataItem);
        inputDataKeys.forEach((/**
         * @param {?} field
         * @return {?}
         */
        function (field) {
            if (!!_this.columnDefinitionsAll[field]) {
                // skip if definition exists
                return;
            }
            _this.columnDefinitionsAll[field] = {
                header: _this.toTitleCase(field),
                hide: true
            };
        }));
        this.columnDefinitionsAllArray = Object.keys(this.columnDefinitionsAll).map((/**
         * @param {?} k
         * @return {?}
         */
        function (k) {
            return tslib_1.__assign({}, _this.columnDefinitionsAll[k], { field: k });
        }));
        console.log('ngx-auto-table: initColumnDefinitions', {
            firstDataItem: firstDataItem,
            inputDefintionFields: inputDefintionFields
        });
    };
    // Sets the displayed columns from a set of fieldnames
    // Sets the displayed columns from a set of fieldnames
    /**
     * @param {?} selected
     * @return {?}
     */
    AutoTableComponent.prototype.setDisplayedColumns = 
    // Sets the displayed columns from a set of fieldnames
    /**
     * @param {?} selected
     * @return {?}
     */
    function (selected) {
        var _this = this;
        // Initialize all keys as false
        this.headerKeysAllVisible.forEach((/**
         * @param {?} k
         * @return {?}
         */
        function (k) { return (_this.headerKeysDisplayedMap[k] = false); }));
        // Set selected as true
        selected.forEach((/**
         * @param {?} c
         * @return {?}
         */
        function (c) { return (_this.headerKeysDisplayedMap[c] = true); }));
        this.headerKeysDisplayed = Object.keys(this.headerKeysDisplayedMap).filter((/**
         * @param {?} k
         * @return {?}
         */
        function (k) { return _this.headerKeysDisplayedMap[k]; }));
        // Add bulk select column at start
        if (this.config.actionsBulk) {
            this.headerKeysDisplayed.unshift('__bulk');
        }
        // Add actions column at end
        if (this.config.actions) {
            this.headerKeysDisplayed.push('__star');
        }
    };
    /** Whether the number of selected elements matches the total number of rows. */
    /**
     * Whether the number of selected elements matches the total number of rows.
     * @return {?}
     */
    AutoTableComponent.prototype.isAllSelected = /**
     * Whether the number of selected elements matches the total number of rows.
     * @return {?}
     */
    function () {
        /** @type {?} */
        var numSelected = this.selectionMultiple.selected.length;
        /** @type {?} */
        var numRows = this.config.bulkSelectMaxCount || this.dataSource.filteredData.length;
        return numSelected >= numRows;
    };
    /** Selects all rows if they are not all selected; otherwise clear selection. */
    /**
     * Selects all rows if they are not all selected; otherwise clear selection.
     * @return {?}
     */
    AutoTableComponent.prototype.masterToggle = /**
     * Selects all rows if they are not all selected; otherwise clear selection.
     * @return {?}
     */
    function () {
        this.isAllSelected()
            ? this.selectionMultiple.clear()
            : this.selectAll();
        this.selectedBulk.emit(this.selectionMultiple.selected);
    };
    /**
     * @private
     * @return {?}
     */
    AutoTableComponent.prototype.selectAll = /**
     * @private
     * @return {?}
     */
    function () {
        var _this = this;
        this.dataSource.sortData(this.dataSource.filteredData, this.dataSource.sort);
        /** @type {?} */
        var cutArray = this.dataSource.filteredData;
        if (this.config.bulkSelectMaxCount) {
            cutArray = this.dataSource.filteredData.slice(0, this.config.bulkSelectMaxCount);
        }
        cutArray.forEach((/**
         * @param {?} row
         * @return {?}
         */
        function (row) {
            _this.selectionMultiple.select(row);
        }));
    };
    /**
     * @return {?}
     */
    AutoTableComponent.prototype.isMaxReached = /**
     * @return {?}
     */
    function () {
        if (!this.config.bulkSelectMaxCount) {
            return false;
        }
        return (this.selectionMultiple.selected.length >= this.config.bulkSelectMaxCount);
    };
    /**
     * @param {?} $event
     * @return {?}
     */
    AutoTableComponent.prototype.onColumnFilterChange = /**
     * @param {?} $event
     * @return {?}
     */
    function ($event) {
        console.log({ $event: $event });
        /** @type {?} */
        var selectedValues = this.filterControl.value;
        this.setDisplayedColumns(selectedValues);
        this.initFilter(this.dataSource.data);
    };
    /**
     * @param {?} $event
     * @param {?} item
     * @return {?}
     */
    AutoTableComponent.prototype.onClickBulkItem = /**
     * @param {?} $event
     * @param {?} item
     * @return {?}
     */
    function ($event, item) {
        if ($event) {
            /** @type {?} */
            var isSelected = this.selectionMultiple.isSelected(item);
            if (!this.isMaxReached()) {
                this.selectionMultiple.toggle(item);
            }
            else {
                if (isSelected) {
                    this.selectionMultiple.deselect(item);
                }
                else {
                    this.warn("Max Selection of \"" + this.config.bulkSelectMaxCount + "\" Reached");
                }
            }
            this.selectedBulk.emit(this.selectionMultiple.selected);
        }
    };
    /**
     * @param {?} $event
     * @param {?} row
     * @return {?}
     */
    AutoTableComponent.prototype.onClickRow = /**
     * @param {?} $event
     * @param {?} row
     * @return {?}
     */
    function ($event, row) {
        console.log('ngx-auto-table: onClickRow()', { $event: $event, row: row });
        if (this.config.onSelectItem) {
            this.selectionSingle.select(row);
            this.config.onSelectItem(row);
        }
    };
    /**
     * @param {?} action
     * @return {?}
     */
    AutoTableComponent.prototype.onClickBulkAction = /**
     * @param {?} action
     * @return {?}
     */
    function (action) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, action.onClick(this.selectionMultiple.selected)];
                    case 1:
                        _a.sent();
                        this.selectionMultiple.clear();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * @param {?} msg
     * @return {?}
     */
    AutoTableComponent.prototype.warn = /**
     * @param {?} msg
     * @return {?}
     */
    function (msg) { };
    AutoTableComponent.decorators = [
        { type: Component, args: [{
                    selector: 'ngx-auto-table',
                    template: "<div\r\n  class=\"table-header auto-elevation overflow-hidden\"\r\n  [class.addRightPixel]=\"config.hideHeader\"\r\n  *ngIf=\"(!config.hideFilter || !config.hideChooseColumns) && !hasNoItems\"\r\n>\r\n  <div class=\"relative\">\r\n    <div class=\"filters-container flex-h align-center space-between\">\r\n      <mat-form-field class=\"filter\" *ngIf=\"!hasNoItems && !config.hideFilter\">\r\n        <mat-icon matPrefix>search</mat-icon>\r\n        <input\r\n          matInput\r\n          (keyup)=\"applyFilter($event.target.value)\"\r\n          placeholder=\"Search Rows...\"\r\n          #filterField\r\n        />\r\n        <mat-icon\r\n          class=\"has-pointer\"\r\n          matSuffix\r\n          (click)=\"filterField.value = ''; applyFilter(filterField.value)\"\r\n          >clear</mat-icon\r\n        >\r\n      </mat-form-field>\r\n      <mat-form-field\r\n        class=\"filter-columns overflow-hidden\"\r\n        *ngIf=\"!hasNoItems && !config.hideChooseColumns\"\r\n      >\r\n        <mat-icon matPrefix>view_column</mat-icon>\r\n        <mat-select\r\n          placeholder=\"Choose Columns...\"\r\n          [formControl]=\"filterControl\"\r\n          (selectionChange)=\"onColumnFilterChange($event)\"\r\n          multiple\r\n        >\r\n          <mat-option *ngFor=\"let key of headerKeysAllVisible\" [value]=\"key\">\r\n            {{ getKeyHeader(key) }}\r\n          </mat-option>\r\n        </mat-select>\r\n      </mat-form-field>\r\n    </div>\r\n    <div\r\n      class=\"bulk-actions flex-h align-center space-between\"\r\n      *ngIf=\"config.actionsBulk\"\r\n      [class.hidden]=\"!selectionMultiple.hasValue()\"\r\n    >\r\n      <span class=\"item-count\">\r\n        ({{ selectionMultiple.selected.length }} Items Selected)\r\n        {{ isMaxReached() ? ' Max Reached!' : '' }}\r\n      </span>\r\n      <span class=\"buttons flex-h align-center\">\r\n        <button\r\n          mat-raised-button\r\n          *ngFor=\"let action of config.actionsBulk\"\r\n          (click)=\"onClickBulkAction(action)\"\r\n        >\r\n          <mat-icon>{{ action.icon }}</mat-icon>\r\n          <span>{{ action.label }}</span>\r\n        </button>\r\n      </span>\r\n    </div>\r\n  </div>\r\n</div>\r\n<table\r\n  mat-table\r\n  #table\r\n  matSort\r\n  [matSortActive]=\"config.initialSort\"\r\n  [matSortDirection]=\"config.initialSortDir\"\r\n  [dataSource]=\"this.dataSource\"\r\n  style=\"width:100%;\"\r\n  class=\"mat-elevation-z8\"\r\n>\r\n  <ng-container\r\n    *ngFor=\"let def of columnDefinitionsAllArray\"\r\n    [matColumnDef]=\"def.field\"\r\n  >\r\n    <th mat-header-cell mat-sort-header *matHeaderCellDef>{{ def.header }}</th>\r\n    <td mat-cell *matCellDef=\"let row\">\r\n      <div *ngIf=\"!def.template\" [class.break-words]=\"def.forceWrap\">\r\n        {{ row[def.field] }}\r\n      </div>\r\n      <div *ngIf=\"def.template\">\r\n        <div\r\n          *ngTemplateOutlet=\"def.template; context: { $implicit: row }\"\r\n        ></div>\r\n      </div>\r\n    </td>\r\n  </ng-container>\r\n\r\n  <ng-container matColumnDef=\"__bulk\" stickyEnd>\r\n    <th mat-header-cell *matHeaderCellDef>\r\n      <mat-checkbox\r\n        (change)=\"$event ? masterToggle() : null\"\r\n        [checked]=\"selectionMultiple.hasValue() && isAllSelected()\"\r\n        [indeterminate]=\"selectionMultiple.hasValue() && !isAllSelected()\"\r\n      >\r\n      </mat-checkbox>\r\n    </th>\r\n    <td mat-cell *matCellDef=\"let row\">\r\n      <mat-checkbox\r\n        (click)=\"$event.stopPropagation()\"\r\n        (change)=\"onClickBulkItem($event, row)\"\r\n        [checked]=\"selectionMultiple.isSelected(row)\"\r\n      >\r\n      </mat-checkbox>\r\n    </td>\r\n  </ng-container>\r\n\r\n  <ng-container matColumnDef=\"__star\" stickyEnd>\r\n    <th mat-header-cell *matHeaderCellDef></th>\r\n    <td mat-cell *matCellDef=\"let row\">\r\n      <div *ngIf=\"config.actions\">\r\n        <mat-icon\r\n          mat-list-icon\r\n          class=\"more-icon has-pointer\"\r\n          [matMenuTriggerFor]=\"rowMenu\"\r\n          >more_vert</mat-icon\r\n        >\r\n        <mat-menu #rowMenu=\"matMenu\" class=\"row-menu\">\r\n          <div mat-menu-item *ngFor=\"let action of config.actions\">\r\n            <button\r\n              mat-menu-item\r\n              *ngIf=\"action.onClick\"\r\n              (click)=\"action.onClick(row)\"\r\n            >\r\n              <mat-icon>{{ action.icon }}</mat-icon>\r\n              <span>{{ action.label }}</span>\r\n            </button>\r\n            <a\r\n              mat-menu-item\r\n              *ngIf=\"action.onRouterLink && !action.routerLinkQuery\"\r\n              [routerLink]=\"['/' + action.onRouterLink(row)]\"\r\n            >\r\n              <mat-icon>{{ action.icon }}</mat-icon>\r\n              <span>{{ action.label }}</span>\r\n            </a>\r\n            <a\r\n              mat-menu-item\r\n              *ngIf=\"action.onRouterLink && action.routerLinkQuery\"\r\n              [routerLink]=\"['/' + action.onRouterLink(row)]\"\r\n              [queryParams]=\"action.routerLinkQuery(row)\"\r\n            >\r\n              <mat-icon>{{ action.icon }}</mat-icon>\r\n              <span>{{ action.label }}</span>\r\n            </a>\r\n          </div>\r\n        </mat-menu>\r\n      </div>\r\n    </td>\r\n  </ng-container>\r\n\r\n  <tr\r\n    mat-header-row\r\n    *matHeaderRowDef=\"headerKeysDisplayed\"\r\n    [hidden]=\"config.hideHeader\"\r\n  ></tr>\r\n  <tr\r\n    mat-row\r\n    *matRowDef=\"let row; columns: headerKeysDisplayed\"\r\n    (click)=\"onClickRow($event, row)\"\r\n    [class.selected-row-multiple]=\"selectionMultiple.isSelected(row)\"\r\n    [class.selected-row-single]=\"selectionSingle.isSelected(row)\"\r\n    [class.has-pointer]=\"config.onSelectItem\"\r\n  ></tr>\r\n</table>\r\n\r\n<mat-toolbar class=\"mat-elevation-z8 overflow-hidden\">\r\n  <mat-toolbar-row>\r\n    <app-toolbar-loader *ngIf=\"!dataSource\"></app-toolbar-loader>\r\n    <h1 *ngIf=\"hasNoItems\" class=\"no-items\">No items found</h1>\r\n  </mat-toolbar-row>\r\n  <mat-toolbar-row\r\n    style=\"display: flex; align-items: centered; justify-content: space-between;\"\r\n  >\r\n    <app-table-csv-export\r\n      *ngIf=\"exportFilename\"\r\n      [dataArray]=\"exportData\"\r\n      [filename]=\"exportFilename\"\r\n    ></app-table-csv-export>\r\n    <mat-paginator [pageSize]=\"pageSize\" [pageSizeOptions]=\"[5, 10, 25, 100]\">\r\n    </mat-paginator>\r\n  </mat-toolbar-row>\r\n</mat-toolbar>\r\n",
                    styles: [".no-items,app-toolbar-loader{text-align:center;padding:20px;width:100%}.no-items{color:#555}.addRightPixel{width:calc(100% - 1px)}.relative{position:relative}.overflow-hidden{overflow:hidden}.flex-h{display:flex;flex-direction:row}.space-between{justify-content:space-between}.align-center{align-items:center}.auto-elevation{box-shadow:0 5px 5px -3px rgba(0,0,0,.2),0 8px 10px 1px rgba(0,0,0,.14),0 3px 14px 2px rgba(0,0,0,.12)}.table-header{width:100%;background-color:#fff;margin-top:15px;height:70px}.table-header .filters-container .filter,.table-header .filters-container .filter-columns{margin:10px}.table-header .bulk-actions{position:absolute;top:0;transition:1.2s;height:70px;background-color:#c4efb3;width:100%}.table-header .bulk-actions .item-count{color:#006400;padding-left:10px}.table-header .bulk-actions .buttons button{margin-right:10px}.hidden{top:-70px!important;overflow:hidden!important}.selected-row-multiple{background-color:#eee}.selected-row-single{background-color:#b5deb6}.break-words{word-break:break-all}.more-icon:hover{background-color:#d3d3d3;border-radius:20px}"]
                }] }
    ];
    AutoTableComponent.propDecorators = {
        selectedBulk: [{ type: Output }],
        config: [{ type: Input }],
        columnDefinitions: [{ type: Input }],
        paginator: [{ type: ViewChild, args: [MatPaginator,] }],
        sort: [{ type: ViewChild, args: [MatSort,] }]
    };
    return AutoTableComponent;
}());
export { AutoTableComponent };
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LWF1dG8tdGFibGUuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vbmd4LWF1dG8tdGFibGUtbGliLyIsInNvdXJjZXMiOlsiY29tcG9uZW50cy9uZ3gtYXV0by10YWJsZS5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxPQUFPLEVBQ0wsU0FBUyxFQUVULEtBQUssRUFFTCxTQUFTLEVBQ1QsTUFBTSxFQUNOLFlBQVksRUFDYixNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQUUsa0JBQWtCLEVBQUUsWUFBWSxFQUFFLE9BQU8sRUFBRSxNQUFNLG1CQUFtQixDQUFDO0FBRTlFLE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUM3QyxPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sMEJBQTBCLENBQUM7QUFDMUQsT0FBTyxFQUFFLE1BQU0sRUFBRSxNQUFNLGdCQUFnQixDQUFDOzs7OztBQUV4QyxxQ0FpQkM7OztJQWhCQyxnQ0FBdUI7O0lBQ3ZCLG1DQUFrQjs7SUFDbEIsa0NBQWdDOztJQUNoQyxzQ0FBd0M7O0lBQ3hDLDZDQUE0Qjs7SUFDNUIsdUNBQWdDOztJQUNoQyx3Q0FBaUM7O0lBQ2pDLHNDQUFxQjs7SUFDckIseUNBQWdDOztJQUNoQyxtQ0FBa0I7O0lBQ2xCLHFDQUFzQjs7SUFDdEIscUNBQXFCOztJQUNyQixxQ0FBcUI7O0lBQ3JCLDRDQUE0Qjs7SUFDNUIseUNBQXdCOztJQUN4QiwwQ0FBbUM7Ozs7OztBQUdyQyxzQ0FNQzs7O0lBTEMsaUNBQWM7O0lBQ2QsZ0NBQWM7O0lBQ2QsbUNBQTJCOztJQUMzQix3Q0FBa0M7O0lBQ2xDLDJDQUFpQzs7Ozs7O0FBR25DLDBDQUlDOzs7SUFIQyxxQ0FBYzs7SUFDZCxvQ0FBYzs7SUFDZCx1Q0FBNkI7Ozs7O0FBRy9CLHNDQUtDOzs7SUFKQyxrQ0FBZ0I7O0lBQ2hCLG9DQUFlOztJQUNmLGdDQUFlOztJQUNmLHFDQUFvQjs7Ozs7QUFH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QUFnQjtvQkFDMUIsdTVNQUE4Qzs7aUJBRS9DOzs7K0JBRUUsTUFBTTt5QkFFTixLQUFLO29DQUVMLEtBQUs7NEJBZ0JMLFNBQVMsU0FBQyxZQUFZO3VCQUV0QixTQUFTLFNBQUMsT0FBTzs7SUE0UnBCLHlCQUFDO0NBQUEsQUF4VEQsSUF3VEM7U0FuVFksa0JBQWtCOzs7SUFDN0IsMENBQ3VDOztJQUN2QyxvQ0FDMkI7O0lBQzNCLCtDQUdPOztJQUNQLGtEQUVPOztJQUNQLHVEQUEyRDs7SUFFM0QsMkNBQW1COztJQUNuQixrREFBMEI7O0lBQzFCLGlEQUF5Qjs7SUFDekIsb0RBQTRCOztJQUU1Qix3Q0FBb0M7O0lBQ3BDLG9EQUFxQzs7SUFDckMsdUNBQWlEOztJQUNqRCxzQ0FBYzs7SUFDZCxrQ0FBa0M7O0lBRWxDLHdDQUFrQjs7SUFDbEIsNENBQXVCOztJQUV2Qix3Q0FBb0I7O0lBRXBCLDJDQUFrQzs7SUFFbEMsK0NBQXNEOztJQUN0RCw2Q0FBcUQ7O0lBQ3JELHVEQUF3QyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XHJcbiAgQ29tcG9uZW50LFxyXG4gIE9uSW5pdCxcclxuICBJbnB1dCxcclxuICBPbkRlc3Ryb3ksXHJcbiAgVmlld0NoaWxkLFxyXG4gIE91dHB1dCxcclxuICBFdmVudEVtaXR0ZXJcclxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgTWF0VGFibGVEYXRhU291cmNlLCBNYXRQYWdpbmF0b3IsIE1hdFNvcnQgfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbCc7XHJcbmltcG9ydCB7IFN1YnNjcmlwdGlvbiwgT2JzZXJ2YWJsZSB9IGZyb20gJ3J4anMnO1xyXG5pbXBvcnQgeyBGb3JtQ29udHJvbCB9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcclxuaW1wb3J0IHsgU2VsZWN0aW9uTW9kZWwgfSBmcm9tICdAYW5ndWxhci9jZGsvY29sbGVjdGlvbnMnO1xyXG5pbXBvcnQgeyBmaWx0ZXIgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIEF1dG9UYWJsZUNvbmZpZzxUPiB7XHJcbiAgZGF0YSQ6IE9ic2VydmFibGU8VFtdPjtcclxuICBmaWxlbmFtZT86IHN0cmluZztcclxuICBhY3Rpb25zPzogQWN0aW9uRGVmaW5pdGlvbjxUPltdO1xyXG4gIGFjdGlvbnNCdWxrPzogQWN0aW9uRGVmaW5pdGlvbkJ1bGs8VD5bXTtcclxuICBidWxrU2VsZWN0TWF4Q291bnQ/OiBudW1iZXI7XHJcbiAgb25TZWxlY3RJdGVtPzogKHJvdzogVCkgPT4gdm9pZDtcclxuICBjbGVhclNlbGVjdGVkPzogT2JzZXJ2YWJsZTx2b2lkPjtcclxuICBpbml0aWFsU29ydD86IHN0cmluZztcclxuICBpbml0aWFsU29ydERpcj86ICdhc2MnIHwgJ2Rlc2MnO1xyXG4gIHBhZ2VTaXplPzogbnVtYmVyO1xyXG4gIGhpZGVGaWVsZHM/OiBzdHJpbmdbXTtcclxuICBoaWRlRmlsdGVyPzogYm9vbGVhbjtcclxuICBoaWRlSGVhZGVyPzogYm9vbGVhbjtcclxuICBoaWRlQ2hvb3NlQ29sdW1ucz86IGJvb2xlYW47XHJcbiAgZXhwb3J0RmlsZW5hbWU/OiBzdHJpbmc7XHJcbiAgZXhwb3J0Um93Rm9ybWF0PzogKHJvdzogVCkgPT4gdm9pZDtcclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBBY3Rpb25EZWZpbml0aW9uPFQ+IHtcclxuICBsYWJlbDogc3RyaW5nO1xyXG4gIGljb24/OiBzdHJpbmc7XHJcbiAgb25DbGljaz86IChyb3c6IFQpID0+IHZvaWQ7XHJcbiAgb25Sb3V0ZXJMaW5rPzogKHJvdzogVCkgPT4gc3RyaW5nO1xyXG4gIHJvdXRlckxpbmtRdWVyeT86IChyb3c6IFQpID0+IHt9O1xyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIEFjdGlvbkRlZmluaXRpb25CdWxrPFQ+IHtcclxuICBsYWJlbDogc3RyaW5nO1xyXG4gIGljb24/OiBzdHJpbmc7XHJcbiAgb25DbGljaz86IChyb3c6IFRbXSkgPT4gdm9pZDtcclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBDb2x1bW5EZWZpbml0aW9uIHtcclxuICBoZWFkZXI/OiBzdHJpbmc7XHJcbiAgdGVtcGxhdGU/OiBhbnk7XHJcbiAgaGlkZT86IGJvb2xlYW47XHJcbiAgZm9yY2VXcmFwPzogYm9vbGVhbjtcclxufVxyXG5cclxuaW50ZXJmYWNlIENvbHVtbkRlZmluaXRpb25JbnRlcm5hbCBleHRlbmRzIENvbHVtbkRlZmluaXRpb24ge1xyXG4gIGZpZWxkOiBzdHJpbmc7XHJcbn1cclxuXHJcbkBDb21wb25lbnQoe1xyXG4gIHNlbGVjdG9yOiAnbmd4LWF1dG8tdGFibGUnLFxyXG4gIHRlbXBsYXRlVXJsOiAnLi9uZ3gtYXV0by10YWJsZS5jb21wb25lbnQuaHRtbCcsXHJcbiAgc3R5bGVVcmxzOiBbJy4vbmd4LWF1dG8tdGFibGUuY29tcG9uZW50LnNjc3MnXVxyXG59KVxyXG5leHBvcnQgY2xhc3MgQXV0b1RhYmxlQ29tcG9uZW50PFQ+IGltcGxlbWVudHMgT25Jbml0LCBPbkRlc3Ryb3kge1xyXG4gIEBPdXRwdXQoKVxyXG4gIHNlbGVjdGVkQnVsayA9IG5ldyBFdmVudEVtaXR0ZXI8VFtdPigpO1xyXG4gIEBJbnB1dCgpXHJcbiAgY29uZmlnOiBBdXRvVGFibGVDb25maWc8VD47XHJcbiAgQElucHV0KClcclxuICBjb2x1bW5EZWZpbml0aW9uczoge1xyXG4gICAgW2ZpZWxkOiBzdHJpbmddOiBDb2x1bW5EZWZpbml0aW9uO1xyXG4gIH0gPSB7fTtcclxuICBjb2x1bW5EZWZpbml0aW9uc0FsbDoge1xyXG4gICAgW2ZpZWxkOiBzdHJpbmddOiBDb2x1bW5EZWZpbml0aW9uO1xyXG4gIH0gPSB7fTtcclxuICBjb2x1bW5EZWZpbml0aW9uc0FsbEFycmF5OiBDb2x1bW5EZWZpbml0aW9uSW50ZXJuYWxbXSA9IFtdO1xyXG5cclxuICBoZWFkZXJLZXlzQWxsID0gW107XHJcbiAgaGVhZGVyS2V5c0FsbFZpc2libGUgPSBbXTtcclxuICBoZWFkZXJLZXlzRGlzcGxheWVkID0gW107XHJcbiAgaGVhZGVyS2V5c0Rpc3BsYXllZE1hcCA9IHt9O1xyXG5cclxuICBkYXRhU291cmNlOiBNYXRUYWJsZURhdGFTb3VyY2U8YW55PjtcclxuICBkYXRhU291cmNlU3Vic2NyaXB0aW9uOiBTdWJzY3JpcHRpb247XHJcbiAgQFZpZXdDaGlsZChNYXRQYWdpbmF0b3IpIHBhZ2luYXRvcjogTWF0UGFnaW5hdG9yO1xyXG4gIHBhZ2VTaXplID0gMjU7XHJcbiAgQFZpZXdDaGlsZChNYXRTb3J0KSBzb3J0OiBNYXRTb3J0O1xyXG5cclxuICBleHBvcnREYXRhOiBhbnlbXTtcclxuICBleHBvcnRGaWxlbmFtZTogc3RyaW5nO1xyXG5cclxuICBoYXNOb0l0ZW1zOiBib29sZWFuO1xyXG5cclxuICBmaWx0ZXJDb250cm9sID0gbmV3IEZvcm1Db250cm9sKCk7XHJcbiAgLy8gQnVsayBpdGVtcyBzZWxlY3Rpb25cclxuICBzZWxlY3Rpb25NdWx0aXBsZSA9IG5ldyBTZWxlY3Rpb25Nb2RlbDxhbnk+KHRydWUsIFtdKTtcclxuICBzZWxlY3Rpb25TaW5nbGUgPSBuZXcgU2VsZWN0aW9uTW9kZWw8YW55PihmYWxzZSwgW10pO1xyXG4gIGNsZWFyU2VsZWN0ZWRTdWJzY3JpcHRpb246IFN1YnNjcmlwdGlvbjtcclxuXHJcbiAgbmdPbkluaXQoKSB7XHJcbiAgICB0aGlzLmRhdGFTb3VyY2VTdWJzY3JpcHRpb24gPSB0aGlzLmNvbmZpZy5kYXRhJFxyXG4gICAgICAucGlwZShmaWx0ZXIoZSA9PiAhIWUpKVxyXG4gICAgICAuc3Vic2NyaWJlKG9yaWdpbmFsRGF0YSA9PiB7XHJcbiAgICAgICAgY29uc29sZS5sb2coJ25neC1hdXRvLXRhYmxlLCBzdWJzY3JpYmVkOiAnLCB7IG9yaWdpbmFsRGF0YSB9KTtcclxuICAgICAgICB0aGlzLmRhdGFTb3VyY2UgPSBuZXcgTWF0VGFibGVEYXRhU291cmNlKG9yaWdpbmFsRGF0YSk7XHJcbiAgICAgICAgdGhpcy5kYXRhU291cmNlLnBhZ2luYXRvciA9IHRoaXMucGFnaW5hdG9yO1xyXG4gICAgICAgIHRoaXMuZGF0YVNvdXJjZS5zb3J0ID0gdGhpcy5zb3J0O1xyXG4gICAgICAgIGlmIChvcmlnaW5hbERhdGEgJiYgIW9yaWdpbmFsRGF0YS5sZW5ndGgpIHtcclxuICAgICAgICAgIHRoaXMuaGFzTm9JdGVtcyA9IHRydWU7XHJcbiAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHRoaXMuaGFzTm9JdGVtcyA9IGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodGhpcy5jb25maWcucGFnZVNpemUpIHtcclxuICAgICAgICAgIHRoaXMucGFnZVNpemUgPSB0aGlzLmNvbmZpZy5wYWdlU2l6ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgY29uc3QgZmlyc3REYXRhSXRlbSA9IG9yaWdpbmFsRGF0YVswXTtcclxuICAgICAgICB0aGlzLmluaXREaXNwbGF5ZWRDb2x1bW5zKGZpcnN0RGF0YUl0ZW0pO1xyXG4gICAgICAgIHRoaXMuaW5pdEV4cG9ydChvcmlnaW5hbERhdGEpO1xyXG4gICAgICAgIHRoaXMuaW5pdEZpbHRlcihvcmlnaW5hbERhdGEpO1xyXG4gICAgICB9KTtcclxuXHJcbiAgICBpZiAodGhpcy5jb25maWcuY2xlYXJTZWxlY3RlZCkge1xyXG4gICAgICB0aGlzLmNsZWFyU2VsZWN0ZWRTdWJzY3JpcHRpb24gPSB0aGlzLmNvbmZpZy5jbGVhclNlbGVjdGVkLnN1YnNjcmliZShcclxuICAgICAgICAoKSA9PiB7XHJcbiAgICAgICAgICBjb25zb2xlLmxvZygnbmd4LWF1dG8tdGFibGU6IGNsZWFyU2VsZWN0ZWQnKTtcclxuICAgICAgICAgIHRoaXMuc2VsZWN0aW9uTXVsdGlwbGUuY2xlYXIoKTtcclxuICAgICAgICAgIHRoaXMuc2VsZWN0aW9uU2luZ2xlLmNsZWFyKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICApO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgbmdPbkRlc3Ryb3koKSB7XHJcbiAgICBpZiAodGhpcy5kYXRhU291cmNlU3Vic2NyaXB0aW9uKSB7XHJcbiAgICAgIHRoaXMuZGF0YVNvdXJjZVN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xyXG4gICAgfVxyXG4gICAgaWYgKHRoaXMuY2xlYXJTZWxlY3RlZFN1YnNjcmlwdGlvbikge1xyXG4gICAgICB0aGlzLmNsZWFyU2VsZWN0ZWRTdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGFwcGx5RmlsdGVyKGZpbHRlclZhbHVlOiBzdHJpbmcpIHtcclxuICAgIHRoaXMuZGF0YVNvdXJjZS5maWx0ZXIgPSBmaWx0ZXJWYWx1ZS50cmltKCkudG9Mb3dlckNhc2UoKTtcclxuICAgIHRoaXMuc2VsZWN0aW9uTXVsdGlwbGUuY2xlYXIoKTtcclxuICAgIHRoaXMuc2VsZWN0aW9uU2luZ2xlLmNsZWFyKCk7XHJcbiAgfVxyXG5cclxuICBpbml0RmlsdGVyKG9yaWdpbmFsRGF0YTogVFtdKSB7XHJcbiAgICBpZiAoIW9yaWdpbmFsRGF0YS5sZW5ndGgpIHtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG4gICAgY29uc3QgZmlyc3RSb3cgPSBvcmlnaW5hbERhdGFbMF07XHJcbiAgICBjb25zdCBrZXlzRGF0YSA9IG5ldyBTZXQoT2JqZWN0LmtleXMoZmlyc3RSb3cpKTtcclxuICAgIGNvbnN0IGtleXNIZWFkZXIgPSBuZXcgU2V0KHRoaXMuaGVhZGVyS2V5c0Rpc3BsYXllZCk7XHJcbiAgICBrZXlzSGVhZGVyLmRlbGV0ZSgnX19idWxrJyk7XHJcbiAgICBrZXlzSGVhZGVyLmRlbGV0ZSgnX19zdGFyJyk7XHJcbiAgICBjb25zdCBhbGxGaWVsZHNFeGlzdCA9IEFycmF5LmZyb20oa2V5c0hlYWRlcikucmVkdWNlKChhY2MsIGN1cikgPT4ge1xyXG4gICAgICByZXR1cm4ga2V5c0RhdGEuaGFzKGN1cikgJiYgYWNjO1xyXG4gICAgfSwgdHJ1ZSk7XHJcblxyXG4gICAgY29uc29sZS5sb2coJ25neC1hdXRvLXRhYmxlOiBpbml0RmlsdGVyKCknLCB7XHJcbiAgICAgIHJvd0ZpZWxkczoga2V5c0RhdGEsXHJcbiAgICAgIGFsbEZpZWxkc0V4aXN0LFxyXG4gICAgICBoZWFkZXJLZXlzRGlzcGxheWVkOiB0aGlzLmhlYWRlcktleXNEaXNwbGF5ZWRcclxuICAgIH0pO1xyXG4gICAgdGhpcy5kYXRhU291cmNlLmZpbHRlclByZWRpY2F0ZSA9IChkYXRhOiBULCBmaWx0ZXJUZXh0OiBzdHJpbmcpID0+IHtcclxuICAgICAgaWYgKCFmaWx0ZXJUZXh0KSB7XHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgIH1cclxuICAgICAgaWYgKCFhbGxGaWVsZHNFeGlzdCkge1xyXG4gICAgICAgIGNvbnN0IGxvd2VyID0gSlNPTi5zdHJpbmdpZnkoZGF0YSkudG9Mb3dlckNhc2UoKTtcclxuICAgICAgICByZXR1cm4gbG93ZXIuaW5jbHVkZXMoZmlsdGVyVGV4dCk7XHJcbiAgICAgIH1cclxuICAgICAgZm9yIChjb25zdCBrZXkgb2YgQXJyYXkuZnJvbShrZXlzSGVhZGVyKSkge1xyXG4gICAgICAgIGNvbnN0IGRhdGFWYWwgPSBkYXRhW2tleV07XHJcbiAgICAgICAgY29uc3Qgc3RyID0gSlNPTi5zdHJpbmdpZnkoZGF0YVZhbCk7XHJcbiAgICAgICAgY29uc3QgaXNGb3VuZCA9IHN0ci50b0xvd2VyQ2FzZSgpLmluY2x1ZGVzKGZpbHRlclRleHQpO1xyXG4gICAgICAgIGlmIChpc0ZvdW5kKSB7XHJcbiAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH07XHJcbiAgfVxyXG5cclxuICBpbml0RXhwb3J0KG9yaWdpbmFsRGF0YTogVFtdKSB7XHJcbiAgICB0aGlzLmV4cG9ydEZpbGVuYW1lID0gdGhpcy5jb25maWcuZXhwb3J0RmlsZW5hbWU7XHJcbiAgICBpZiAoIXRoaXMuZXhwb3J0RmlsZW5hbWUpIHtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG4gICAgdGhpcy5leHBvcnREYXRhID0gb3JpZ2luYWxEYXRhLm1hcChkYXRhSXRlbSA9PiB7XHJcbiAgICAgIGlmICghdGhpcy5jb25maWcuZXhwb3J0Um93Rm9ybWF0KSB7XHJcbiAgICAgICAgcmV0dXJuIGRhdGFJdGVtO1xyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiB0aGlzLmNvbmZpZy5leHBvcnRSb3dGb3JtYXQoZGF0YUl0ZW0pO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgZ2V0S2V5SGVhZGVyKGtleTogc3RyaW5nKSB7XHJcbiAgICBjb25zdCBpbnB1dERlZiA9IHRoaXMuY29sdW1uRGVmaW5pdGlvbnNba2V5XTtcclxuICAgIGlmIChpbnB1dERlZiAmJiBpbnB1dERlZi5oZWFkZXIgIT0gbnVsbCkge1xyXG4gICAgICByZXR1cm4gaW5wdXREZWYuaGVhZGVyO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHRoaXMudG9UaXRsZUNhc2Uoa2V5KTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgdG9UaXRsZUNhc2Uoc3RyKSB7XHJcbiAgICByZXR1cm4gc3RyLnJlcGxhY2UoJ18nLCAnICcpLnJlcGxhY2UoL1xcd1xcUyovZywgZnVuY3Rpb24odHh0KSB7XHJcbiAgICAgIHJldHVybiB0eHQuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyB0eHQuc3Vic3RyKDEpLnRvTG93ZXJDYXNlKCk7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIGluaXREaXNwbGF5ZWRDb2x1bW5zKGZpcnN0RGF0YUl0ZW06IFQpIHtcclxuICAgIHRoaXMuaW5pdENvbHVtbkRlZmluaXRpb25zKGZpcnN0RGF0YUl0ZW0pO1xyXG5cclxuICAgIHRoaXMuaGVhZGVyS2V5c0FsbCA9IE9iamVjdC5rZXlzKHRoaXMuY29sdW1uRGVmaW5pdGlvbnNBbGwpO1xyXG4gICAgdGhpcy5oZWFkZXJLZXlzQWxsVmlzaWJsZSA9IHRoaXMuaGVhZGVyS2V5c0FsbDtcclxuICAgIGlmICh0aGlzLmNvbmZpZy5oaWRlRmllbGRzKSB7XHJcbiAgICAgIC8vIEhpZGUgZmllbGRzIGlmIHNwZWNpZmllZFxyXG4gICAgICBjb25zdCBoaWRlRmllbGRzID0gbmV3IFNldCh0aGlzLmNvbmZpZy5oaWRlRmllbGRzKTtcclxuICAgICAgdGhpcy5oZWFkZXJLZXlzQWxsVmlzaWJsZSA9IHRoaXMuaGVhZGVyS2V5c0FsbC5maWx0ZXIoXHJcbiAgICAgICAgeCA9PiAhaGlkZUZpZWxkcy5oYXMoeClcclxuICAgICAgKTtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBkaXNwbGF5ZWQgPSB0aGlzLmNvbHVtbkRlZmluaXRpb25zQWxsQXJyYXlcclxuICAgICAgLmZpbHRlcihkZWYgPT4gIWRlZi5oaWRlKVxyXG4gICAgICAubWFwKGQgPT4gZC5maWVsZCk7XHJcblxyXG4gICAgdGhpcy5zZXREaXNwbGF5ZWRDb2x1bW5zKGRpc3BsYXllZCk7XHJcbiAgICAvLyBTZXQgY3VycmVudGx5IGVuYWJsZWQgaXRlbXNcclxuICAgIHRoaXMuZmlsdGVyQ29udHJvbC5zZXRWYWx1ZSh0aGlzLmhlYWRlcktleXNEaXNwbGF5ZWQpO1xyXG4gIH1cclxuXHJcbiAgaW5pdENvbHVtbkRlZmluaXRpb25zKGZpcnN0RGF0YUl0ZW06IFQpIHtcclxuICAgIC8vIFNldCBhbGwgY29sdW1uIGRlZmludGlvbnMsIHdoaWNoIHdlcmUgZXhwbGljaXRseSBzZXQgaW4gY29uZmlnXHJcbiAgICBjb25zdCBpbnB1dERlZmludGlvbkZpZWxkcyA9IE9iamVjdC5rZXlzKHRoaXMuY29sdW1uRGVmaW5pdGlvbnMpO1xyXG4gICAgaW5wdXREZWZpbnRpb25GaWVsZHMuZm9yRWFjaCgoZmllbGQ6IHN0cmluZykgPT4ge1xyXG4gICAgICBjb25zdCBpbnB1dERlZmludGlvbiA9IHRoaXMuY29sdW1uRGVmaW5pdGlvbnNbZmllbGRdO1xyXG4gICAgICB0aGlzLmNvbHVtbkRlZmluaXRpb25zQWxsW2ZpZWxkXSA9IHtcclxuICAgICAgICBoZWFkZXI6IHRoaXMuZ2V0S2V5SGVhZGVyKGZpZWxkKSxcclxuICAgICAgICB0ZW1wbGF0ZTogaW5wdXREZWZpbnRpb24udGVtcGxhdGUsXHJcbiAgICAgICAgaGlkZTogaW5wdXREZWZpbnRpb24uaGlkZSxcclxuICAgICAgICBmb3JjZVdyYXA6IGlucHV0RGVmaW50aW9uLmZvcmNlV3JhcFxyXG4gICAgICB9O1xyXG4gICAgfSk7XHJcblxyXG4gICAgLy8gU2V0IGFsbCBjb2x1bW4gZGVmaW50aW9ucyByZWFkIGZyb20gdGhlIFwiaW5wdXQgZGF0YVwiXHJcbiAgICBjb25zdCBpbnB1dERhdGFLZXlzID0gT2JqZWN0LmtleXMoZmlyc3REYXRhSXRlbSk7XHJcbiAgICBpbnB1dERhdGFLZXlzLmZvckVhY2goKGZpZWxkOiBzdHJpbmcpID0+IHtcclxuICAgICAgaWYgKCEhdGhpcy5jb2x1bW5EZWZpbml0aW9uc0FsbFtmaWVsZF0pIHtcclxuICAgICAgICAvLyBza2lwIGlmIGRlZmluaXRpb24gZXhpc3RzXHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICB9XHJcbiAgICAgIHRoaXMuY29sdW1uRGVmaW5pdGlvbnNBbGxbZmllbGRdID0ge1xyXG4gICAgICAgIGhlYWRlcjogdGhpcy50b1RpdGxlQ2FzZShmaWVsZCksXHJcbiAgICAgICAgaGlkZTogdHJ1ZVxyXG4gICAgICB9O1xyXG4gICAgfSk7XHJcblxyXG4gICAgdGhpcy5jb2x1bW5EZWZpbml0aW9uc0FsbEFycmF5ID0gT2JqZWN0LmtleXModGhpcy5jb2x1bW5EZWZpbml0aW9uc0FsbCkubWFwKFxyXG4gICAgICBrID0+IHtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgLi4udGhpcy5jb2x1bW5EZWZpbml0aW9uc0FsbFtrXSxcclxuICAgICAgICAgIGZpZWxkOiBrXHJcbiAgICAgICAgfTtcclxuICAgICAgfVxyXG4gICAgKTtcclxuICAgIGNvbnNvbGUubG9nKCduZ3gtYXV0by10YWJsZTogaW5pdENvbHVtbkRlZmluaXRpb25zJywge1xyXG4gICAgICBmaXJzdERhdGFJdGVtLFxyXG4gICAgICBpbnB1dERlZmludGlvbkZpZWxkc1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICAvLyBTZXRzIHRoZSBkaXNwbGF5ZWQgY29sdW1ucyBmcm9tIGEgc2V0IG9mIGZpZWxkbmFtZXNcclxuICBzZXREaXNwbGF5ZWRDb2x1bW5zKHNlbGVjdGVkOiBzdHJpbmdbXSkge1xyXG4gICAgLy8gSW5pdGlhbGl6ZSBhbGwga2V5cyBhcyBmYWxzZVxyXG4gICAgdGhpcy5oZWFkZXJLZXlzQWxsVmlzaWJsZS5mb3JFYWNoKFxyXG4gICAgICBrID0+ICh0aGlzLmhlYWRlcktleXNEaXNwbGF5ZWRNYXBba10gPSBmYWxzZSlcclxuICAgICk7XHJcbiAgICAvLyBTZXQgc2VsZWN0ZWQgYXMgdHJ1ZVxyXG4gICAgc2VsZWN0ZWQuZm9yRWFjaChjID0+ICh0aGlzLmhlYWRlcktleXNEaXNwbGF5ZWRNYXBbY10gPSB0cnVlKSk7XHJcbiAgICB0aGlzLmhlYWRlcktleXNEaXNwbGF5ZWQgPSBPYmplY3Qua2V5cyh0aGlzLmhlYWRlcktleXNEaXNwbGF5ZWRNYXApLmZpbHRlcihcclxuICAgICAgayA9PiB0aGlzLmhlYWRlcktleXNEaXNwbGF5ZWRNYXBba11cclxuICAgICk7XHJcbiAgICAvLyBBZGQgYnVsayBzZWxlY3QgY29sdW1uIGF0IHN0YXJ0XHJcbiAgICBpZiAodGhpcy5jb25maWcuYWN0aW9uc0J1bGspIHtcclxuICAgICAgdGhpcy5oZWFkZXJLZXlzRGlzcGxheWVkLnVuc2hpZnQoJ19fYnVsaycpO1xyXG4gICAgfVxyXG4gICAgLy8gQWRkIGFjdGlvbnMgY29sdW1uIGF0IGVuZFxyXG4gICAgaWYgKHRoaXMuY29uZmlnLmFjdGlvbnMpIHtcclxuICAgICAgdGhpcy5oZWFkZXJLZXlzRGlzcGxheWVkLnB1c2goJ19fc3RhcicpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLyoqIFdoZXRoZXIgdGhlIG51bWJlciBvZiBzZWxlY3RlZCBlbGVtZW50cyBtYXRjaGVzIHRoZSB0b3RhbCBudW1iZXIgb2Ygcm93cy4gKi9cclxuICBpc0FsbFNlbGVjdGVkKCkge1xyXG4gICAgY29uc3QgbnVtU2VsZWN0ZWQgPSB0aGlzLnNlbGVjdGlvbk11bHRpcGxlLnNlbGVjdGVkLmxlbmd0aDtcclxuICAgIGNvbnN0IG51bVJvd3MgPVxyXG4gICAgICB0aGlzLmNvbmZpZy5idWxrU2VsZWN0TWF4Q291bnQgfHwgdGhpcy5kYXRhU291cmNlLmZpbHRlcmVkRGF0YS5sZW5ndGg7XHJcbiAgICByZXR1cm4gbnVtU2VsZWN0ZWQgPj0gbnVtUm93cztcclxuICB9XHJcblxyXG4gIC8qKiBTZWxlY3RzIGFsbCByb3dzIGlmIHRoZXkgYXJlIG5vdCBhbGwgc2VsZWN0ZWQ7IG90aGVyd2lzZSBjbGVhciBzZWxlY3Rpb24uICovXHJcbiAgbWFzdGVyVG9nZ2xlKCkge1xyXG4gICAgdGhpcy5pc0FsbFNlbGVjdGVkKClcclxuICAgICAgPyB0aGlzLnNlbGVjdGlvbk11bHRpcGxlLmNsZWFyKClcclxuICAgICAgOiB0aGlzLnNlbGVjdEFsbCgpO1xyXG4gICAgdGhpcy5zZWxlY3RlZEJ1bGsuZW1pdCh0aGlzLnNlbGVjdGlvbk11bHRpcGxlLnNlbGVjdGVkKTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgc2VsZWN0QWxsKCkge1xyXG4gICAgdGhpcy5kYXRhU291cmNlLnNvcnREYXRhKHRoaXMuZGF0YVNvdXJjZS5maWx0ZXJlZERhdGEsIHRoaXMuZGF0YVNvdXJjZS5zb3J0KTtcclxuICAgIGxldCBjdXRBcnJheSA9IHRoaXMuZGF0YVNvdXJjZS5maWx0ZXJlZERhdGE7XHJcbiAgICBpZiAodGhpcy5jb25maWcuYnVsa1NlbGVjdE1heENvdW50KSB7XHJcbiAgICAgIGN1dEFycmF5ID0gdGhpcy5kYXRhU291cmNlLmZpbHRlcmVkRGF0YS5zbGljZSgwLCB0aGlzLmNvbmZpZy5idWxrU2VsZWN0TWF4Q291bnQpO1xyXG4gICAgfVxyXG4gICAgY3V0QXJyYXkuZm9yRWFjaChyb3cgPT4ge1xyXG4gICAgICB0aGlzLnNlbGVjdGlvbk11bHRpcGxlLnNlbGVjdChyb3cpO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBpc01heFJlYWNoZWQoKSB7XHJcbiAgICBpZiAoIXRoaXMuY29uZmlnLmJ1bGtTZWxlY3RNYXhDb3VudCkge1xyXG4gICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gKFxyXG4gICAgICB0aGlzLnNlbGVjdGlvbk11bHRpcGxlLnNlbGVjdGVkLmxlbmd0aCA+PSB0aGlzLmNvbmZpZy5idWxrU2VsZWN0TWF4Q291bnRcclxuICAgICk7XHJcbiAgfVxyXG5cclxuICBvbkNvbHVtbkZpbHRlckNoYW5nZSgkZXZlbnQpIHtcclxuICAgIGNvbnNvbGUubG9nKHsgJGV2ZW50IH0pO1xyXG4gICAgY29uc3Qgc2VsZWN0ZWRWYWx1ZXMgPSB0aGlzLmZpbHRlckNvbnRyb2wudmFsdWU7XHJcbiAgICB0aGlzLnNldERpc3BsYXllZENvbHVtbnMoc2VsZWN0ZWRWYWx1ZXMpO1xyXG4gICAgdGhpcy5pbml0RmlsdGVyKHRoaXMuZGF0YVNvdXJjZS5kYXRhKTtcclxuICB9XHJcblxyXG4gIG9uQ2xpY2tCdWxrSXRlbSgkZXZlbnQsIGl0ZW0pIHtcclxuICAgIGlmICgkZXZlbnQpIHtcclxuICAgICAgY29uc3QgaXNTZWxlY3RlZCA9IHRoaXMuc2VsZWN0aW9uTXVsdGlwbGUuaXNTZWxlY3RlZChpdGVtKTtcclxuICAgICAgaWYgKCF0aGlzLmlzTWF4UmVhY2hlZCgpKSB7XHJcbiAgICAgICAgdGhpcy5zZWxlY3Rpb25NdWx0aXBsZS50b2dnbGUoaXRlbSk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgaWYgKGlzU2VsZWN0ZWQpIHtcclxuICAgICAgICAgIHRoaXMuc2VsZWN0aW9uTXVsdGlwbGUuZGVzZWxlY3QoaXRlbSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHRoaXMud2FybihcclxuICAgICAgICAgICAgYE1heCBTZWxlY3Rpb24gb2YgXCIke3RoaXMuY29uZmlnLmJ1bGtTZWxlY3RNYXhDb3VudH1cIiBSZWFjaGVkYFxyXG4gICAgICAgICAgKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgICAgdGhpcy5zZWxlY3RlZEJ1bGsuZW1pdCh0aGlzLnNlbGVjdGlvbk11bHRpcGxlLnNlbGVjdGVkKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIG9uQ2xpY2tSb3coJGV2ZW50LCByb3c6IFQpIHtcclxuICAgIGNvbnNvbGUubG9nKCduZ3gtYXV0by10YWJsZTogb25DbGlja1JvdygpJywgeyAkZXZlbnQsIHJvdyB9KTtcclxuICAgIGlmICh0aGlzLmNvbmZpZy5vblNlbGVjdEl0ZW0pIHtcclxuICAgICAgdGhpcy5zZWxlY3Rpb25TaW5nbGUuc2VsZWN0KHJvdyk7XHJcbiAgICAgIHRoaXMuY29uZmlnLm9uU2VsZWN0SXRlbShyb3cpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgYXN5bmMgb25DbGlja0J1bGtBY3Rpb24oYWN0aW9uOiBBY3Rpb25EZWZpbml0aW9uQnVsazxUPikge1xyXG4gICAgYXdhaXQgYWN0aW9uLm9uQ2xpY2sodGhpcy5zZWxlY3Rpb25NdWx0aXBsZS5zZWxlY3RlZCk7XHJcbiAgICB0aGlzLnNlbGVjdGlvbk11bHRpcGxlLmNsZWFyKCk7XHJcbiAgfVxyXG5cclxuICB3YXJuKG1zZzogc3RyaW5nKSB7fVxyXG59XHJcbiJdfQ==