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
        if (this.config.onSelectItem) {
            console.log('ngx-auto-table: onClickRow()', { $event: $event, row: row });
            this.selectionSingle.select(row);
            this.config.onSelectItem(row);
        }
    };
    /**
     * @param {?} $event
     * @param {?} row
     * @return {?}
     */
    AutoTableComponent.prototype.onDoubleClickRow = /**
     * @param {?} $event
     * @param {?} row
     * @return {?}
     */
    function ($event, row) {
        if (this.config.onSelectItemDoubleClick) {
            console.log('ngx-auto-table: onDoubleClickRow()', { $event: $event, row: row });
            this.selectionSingle.select(row);
            this.config.onSelectItemDoubleClick(row);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LWF1dG8tdGFibGUuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vbmd4LWF1dG8tdGFibGUtbGliLyIsInNvdXJjZXMiOlsiY29tcG9uZW50cy9uZ3gtYXV0by10YWJsZS5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxPQUFPLEVBQ0wsU0FBUyxFQUVULEtBQUssRUFFTCxTQUFTLEVBQ1QsTUFBTSxFQUNOLFlBQVksRUFDYixNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQUUsa0JBQWtCLEVBQUUsWUFBWSxFQUFFLE9BQU8sRUFBRSxNQUFNLG1CQUFtQixDQUFDO0FBRTlFLE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUM3QyxPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sMEJBQTBCLENBQUM7QUFDMUQsT0FBTyxFQUFFLE1BQU0sRUFBRSxNQUFNLGdCQUFnQixDQUFDOzs7OztBQUV4QyxxQ0FtQkM7OztJQWxCQyxnQ0FBdUI7O0lBQ3ZCLG1DQUFrQjs7SUFDbEIsa0NBQWdDOztJQUNoQyxzQ0FBd0M7O0lBQ3hDLDZDQUE0Qjs7SUFDNUIsdUNBQWdDOztJQUNoQyxrREFBMkM7O0lBQzNDLHdDQUFpQzs7SUFDakMsc0NBQXFCOztJQUNyQix5Q0FBZ0M7O0lBQ2hDLG1DQUFrQjs7SUFDbEIscUNBQXNCOztJQUN0QixxQ0FBcUI7O0lBQ3JCLHFDQUFxQjs7SUFDckIsNENBQTRCOztJQUM1QixxQ0FBb0I7O0lBQ3BCLHlDQUF3Qjs7SUFDeEIsMENBQW1DOzs7Ozs7QUFHckMsc0NBTUM7OztJQUxDLGlDQUFjOztJQUNkLGdDQUFjOztJQUNkLG1DQUEyQjs7SUFDM0Isd0NBQWtDOztJQUNsQywyQ0FBaUM7Ozs7OztBQUduQywwQ0FJQzs7O0lBSEMscUNBQWM7O0lBQ2Qsb0NBQWM7O0lBQ2QsdUNBQTZCOzs7OztBQUcvQixzQ0FLQzs7O0lBSkMsa0NBQWdCOztJQUNoQixvQ0FBZTs7SUFDZixnQ0FBZTs7SUFDZixxQ0FBb0I7Ozs7O0FBR3RCLHVDQUVDOzs7SUFEQyx5Q0FBYzs7Ozs7QUFHaEI7SUFBQTtRQU9FLGlCQUFZLEdBQUcsSUFBSSxZQUFZLEVBQU8sQ0FBQztRQUl2QyxzQkFBaUIsR0FFYixFQUFFLENBQUM7UUFDUCx5QkFBb0IsR0FFaEIsRUFBRSxDQUFDO1FBQ1AsOEJBQXlCLEdBQStCLEVBQUUsQ0FBQztRQUUzRCxrQkFBYSxHQUFHLEVBQUUsQ0FBQztRQUNuQix5QkFBb0IsR0FBRyxFQUFFLENBQUM7UUFDMUIsd0JBQW1CLEdBQUcsRUFBRSxDQUFDO1FBQ3pCLDJCQUFzQixHQUFHLEVBQUUsQ0FBQztRQUs1QixhQUFRLEdBQUcsRUFBRSxDQUFDO1FBUWQsa0JBQWEsR0FBRyxJQUFJLFdBQVcsRUFBRSxDQUFDOztRQUVsQyxzQkFBaUIsR0FBRyxJQUFJLGNBQWMsQ0FBTSxJQUFJLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFDdEQsb0JBQWUsR0FBRyxJQUFJLGNBQWMsQ0FBTSxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUM7SUEwUnZELENBQUM7Ozs7SUF2UkMscUNBQVE7OztJQUFSO1FBQUEsaUJBZ0NDO1FBL0JDLElBQUksQ0FBQyxzQkFBc0IsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUs7YUFDNUMsSUFBSSxDQUFDLE1BQU07Ozs7UUFBQyxVQUFBLENBQUMsSUFBSSxPQUFBLENBQUMsQ0FBQyxDQUFDLEVBQUgsQ0FBRyxFQUFDLENBQUM7YUFDdEIsU0FBUzs7OztRQUFDLFVBQUEsWUFBWTtZQUNyQixPQUFPLENBQUMsR0FBRyxDQUFDLDhCQUE4QixFQUFFLEVBQUUsWUFBWSxjQUFBLEVBQUUsQ0FBQyxDQUFDO1lBQzlELEtBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxrQkFBa0IsQ0FBQyxZQUFZLENBQUMsQ0FBQztZQUN2RCxLQUFJLENBQUMsVUFBVSxDQUFDLFNBQVMsR0FBRyxLQUFJLENBQUMsU0FBUyxDQUFDO1lBQzNDLEtBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxHQUFHLEtBQUksQ0FBQyxJQUFJLENBQUM7WUFDakMsSUFBSSxZQUFZLElBQUksQ0FBQyxZQUFZLENBQUMsTUFBTSxFQUFFO2dCQUN4QyxLQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQztnQkFDdkIsT0FBTzthQUNSO2lCQUFNO2dCQUNMLEtBQUksQ0FBQyxVQUFVLEdBQUcsS0FBSyxDQUFDO2FBQ3pCO1lBQ0QsSUFBSSxLQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsRUFBRTtnQkFDeEIsS0FBSSxDQUFDLFFBQVEsR0FBRyxLQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQzthQUN0Qzs7Z0JBQ0ssYUFBYSxHQUFHLFlBQVksQ0FBQyxDQUFDLENBQUM7WUFDckMsS0FBSSxDQUFDLG9CQUFvQixDQUFDLGFBQWEsQ0FBQyxDQUFDO1lBQ3pDLEtBQUksQ0FBQyxVQUFVLENBQUMsWUFBWSxDQUFDLENBQUM7WUFDOUIsS0FBSSxDQUFDLFVBQVUsQ0FBQyxZQUFZLENBQUMsQ0FBQztRQUNoQyxDQUFDLEVBQUMsQ0FBQztRQUVMLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxhQUFhLEVBQUU7WUFDN0IsSUFBSSxDQUFDLHlCQUF5QixHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsYUFBYSxDQUFDLFNBQVM7OztZQUNsRTtnQkFDRSxPQUFPLENBQUMsR0FBRyxDQUFDLCtCQUErQixDQUFDLENBQUM7Z0JBQzdDLEtBQUksQ0FBQyxpQkFBaUIsQ0FBQyxLQUFLLEVBQUUsQ0FBQztnQkFDL0IsS0FBSSxDQUFDLGVBQWUsQ0FBQyxLQUFLLEVBQUUsQ0FBQztZQUMvQixDQUFDLEVBQ0YsQ0FBQztTQUNIO0lBQ0gsQ0FBQzs7OztJQUVELHdDQUFXOzs7SUFBWDtRQUNFLElBQUksSUFBSSxDQUFDLHNCQUFzQixFQUFFO1lBQy9CLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxXQUFXLEVBQUUsQ0FBQztTQUMzQztRQUNELElBQUksSUFBSSxDQUFDLHlCQUF5QixFQUFFO1lBQ2xDLElBQUksQ0FBQyx5QkFBeUIsQ0FBQyxXQUFXLEVBQUUsQ0FBQztTQUM5QztJQUNILENBQUM7Ozs7O0lBRUQsd0NBQVc7Ozs7SUFBWCxVQUFZLFdBQW1CO1FBQzdCLElBQUksQ0FBQyxVQUFVLENBQUMsTUFBTSxHQUFHLFdBQVcsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxXQUFXLEVBQUUsQ0FBQztRQUMxRCxJQUFJLENBQUMsaUJBQWlCLENBQUMsS0FBSyxFQUFFLENBQUM7UUFDL0IsSUFBSSxDQUFDLGVBQWUsQ0FBQyxLQUFLLEVBQUUsQ0FBQztJQUMvQixDQUFDOzs7OztJQUVELHVDQUFVOzs7O0lBQVYsVUFBVyxZQUFpQjtRQUMxQixJQUFJLENBQUMsWUFBWSxDQUFDLE1BQU0sRUFBRTtZQUN4QixPQUFPO1NBQ1I7O1lBQ0ssUUFBUSxHQUFHLFlBQVksQ0FBQyxDQUFDLENBQUM7O1lBQzFCLFFBQVEsR0FBRyxJQUFJLEdBQUcsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDOztZQUN6QyxVQUFVLEdBQUcsSUFBSSxHQUFHLENBQUMsSUFBSSxDQUFDLG1CQUFtQixDQUFDO1FBQ3BELFVBQVUsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDNUIsVUFBVSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQzs7WUFDdEIsY0FBYyxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsTUFBTTs7Ozs7UUFBQyxVQUFDLEdBQUcsRUFBRSxHQUFHO1lBQzVELE9BQU8sUUFBUSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsSUFBSSxHQUFHLENBQUM7UUFDbEMsQ0FBQyxHQUFFLElBQUksQ0FBQztRQUVSLE9BQU8sQ0FBQyxHQUFHLENBQUMsOEJBQThCLEVBQUU7WUFDMUMsU0FBUyxFQUFFLFFBQVE7WUFDbkIsY0FBYyxnQkFBQTtZQUNkLG1CQUFtQixFQUFFLElBQUksQ0FBQyxtQkFBbUI7U0FDOUMsQ0FBQyxDQUFDO1FBQ0gsSUFBSSxDQUFDLFVBQVUsQ0FBQyxlQUFlOzs7OztRQUFHLFVBQUMsSUFBTyxFQUFFLFVBQWtCOztZQUM1RCxJQUFJLENBQUMsVUFBVSxFQUFFO2dCQUNmLE9BQU8sSUFBSSxDQUFDO2FBQ2I7WUFDRCxJQUFJLENBQUMsY0FBYyxFQUFFOztvQkFDYixLQUFLLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxXQUFXLEVBQUU7Z0JBQ2hELE9BQU8sS0FBSyxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsQ0FBQzthQUNuQzs7Z0JBQ0QsS0FBa0IsSUFBQSxLQUFBLGlCQUFBLEtBQUssQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUEsZ0JBQUEsNEJBQUU7b0JBQXJDLElBQU0sR0FBRyxXQUFBOzt3QkFDTixPQUFPLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQzs7d0JBQ25CLEdBQUcsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQzs7d0JBQzdCLE9BQU8sR0FBRyxHQUFHLENBQUMsV0FBVyxFQUFFLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQztvQkFDdEQsSUFBSSxPQUFPLEVBQUU7d0JBQ1gsT0FBTyxJQUFJLENBQUM7cUJBQ2I7aUJBQ0Y7Ozs7Ozs7OztRQUNILENBQUMsQ0FBQSxDQUFDO0lBQ0osQ0FBQzs7Ozs7SUFFRCx1Q0FBVTs7OztJQUFWLFVBQVcsWUFBaUI7UUFBNUIsaUJBV0M7UUFWQyxJQUFJLENBQUMsY0FBYyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsY0FBYyxDQUFDO1FBQ2pELElBQUksQ0FBQyxJQUFJLENBQUMsY0FBYyxFQUFFO1lBQ3hCLE9BQU87U0FDUjtRQUNELElBQUksQ0FBQyxVQUFVLEdBQUcsWUFBWSxDQUFDLEdBQUc7Ozs7UUFBQyxVQUFBLFFBQVE7WUFDekMsSUFBSSxDQUFDLEtBQUksQ0FBQyxNQUFNLENBQUMsZUFBZSxFQUFFO2dCQUNoQyxPQUFPLFFBQVEsQ0FBQzthQUNqQjtZQUNELE9BQU8sS0FBSSxDQUFDLE1BQU0sQ0FBQyxlQUFlLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDL0MsQ0FBQyxFQUFDLENBQUM7SUFDTCxDQUFDOzs7OztJQUVNLHlDQUFZOzs7O0lBQW5CLFVBQW9CLEdBQVc7O1lBQ3ZCLFFBQVEsR0FBRyxJQUFJLENBQUMsaUJBQWlCLENBQUMsR0FBRyxDQUFDO1FBQzVDLElBQUksUUFBUSxJQUFJLFFBQVEsQ0FBQyxNQUFNLElBQUksSUFBSSxFQUFFO1lBQ3ZDLE9BQU8sUUFBUSxDQUFDLE1BQU0sQ0FBQztTQUN4QjtRQUNELE9BQU8sSUFBSSxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUMvQixDQUFDOzs7Ozs7SUFFTyx3Q0FBVzs7Ozs7SUFBbkIsVUFBb0IsR0FBRztRQUNyQixPQUFPLEdBQUcsQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxRQUFROzs7O1FBQUUsVUFBUyxHQUFHO1lBQ3pELE9BQU8sR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFXLEVBQUUsR0FBRyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsRUFBRSxDQUFDO1FBQ25FLENBQUMsRUFBQyxDQUFDO0lBQ0wsQ0FBQzs7Ozs7SUFFRCxpREFBb0I7Ozs7SUFBcEIsVUFBcUIsYUFBZ0I7UUFDbkMsSUFBSSxDQUFDLHFCQUFxQixDQUFDLGFBQWEsQ0FBQyxDQUFDO1FBRTFDLElBQUksQ0FBQyxhQUFhLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsb0JBQW9CLENBQUMsQ0FBQztRQUM1RCxJQUFJLENBQUMsb0JBQW9CLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQztRQUMvQyxJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsVUFBVSxFQUFFOzs7Z0JBRXBCLFlBQVUsR0FBRyxJQUFJLEdBQUcsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQztZQUNsRCxJQUFJLENBQUMsb0JBQW9CLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxNQUFNOzs7O1lBQ25ELFVBQUEsQ0FBQyxJQUFJLE9BQUEsQ0FBQyxZQUFVLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFsQixDQUFrQixFQUN4QixDQUFDO1NBQ0g7O1lBRUssU0FBUyxHQUFHLElBQUksQ0FBQyx5QkFBeUI7YUFDN0MsTUFBTTs7OztRQUFDLFVBQUEsR0FBRyxJQUFJLE9BQUEsQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFULENBQVMsRUFBQzthQUN4QixHQUFHOzs7O1FBQUMsVUFBQSxDQUFDLElBQUksT0FBQSxDQUFDLENBQUMsS0FBSyxFQUFQLENBQU8sRUFBQztRQUVwQixJQUFJLENBQUMsbUJBQW1CLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDcEMsOEJBQThCO1FBQzlCLElBQUksQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO0lBQ3hELENBQUM7Ozs7O0lBRUQsa0RBQXFCOzs7O0lBQXJCLFVBQXNCLGFBQWdCO1FBQXRDLGlCQXNDQzs7O1lBcENPLG9CQUFvQixHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLGlCQUFpQixDQUFDO1FBQ2hFLG9CQUFvQixDQUFDLE9BQU87Ozs7UUFBQyxVQUFDLEtBQWE7O2dCQUNuQyxjQUFjLEdBQUcsS0FBSSxDQUFDLGlCQUFpQixDQUFDLEtBQUssQ0FBQztZQUNwRCxLQUFJLENBQUMsb0JBQW9CLENBQUMsS0FBSyxDQUFDLEdBQUc7Z0JBQ2pDLE1BQU0sRUFBRSxLQUFJLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQztnQkFDaEMsUUFBUSxFQUFFLGNBQWMsQ0FBQyxRQUFRO2dCQUNqQyxJQUFJLEVBQUUsY0FBYyxDQUFDLElBQUk7Z0JBQ3pCLFNBQVMsRUFBRSxjQUFjLENBQUMsU0FBUzthQUNwQyxDQUFDO1FBQ0osQ0FBQyxFQUFDLENBQUM7OztZQUdHLGFBQWEsR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQztRQUNoRCxhQUFhLENBQUMsT0FBTzs7OztRQUFDLFVBQUMsS0FBYTtZQUNsQyxJQUFJLENBQUMsQ0FBQyxLQUFJLENBQUMsb0JBQW9CLENBQUMsS0FBSyxDQUFDLEVBQUU7Z0JBQ3RDLDRCQUE0QjtnQkFDNUIsT0FBTzthQUNSO1lBQ0QsS0FBSSxDQUFDLG9CQUFvQixDQUFDLEtBQUssQ0FBQyxHQUFHO2dCQUNqQyxNQUFNLEVBQUUsS0FBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUM7Z0JBQy9CLElBQUksRUFBRSxJQUFJO2FBQ1gsQ0FBQztRQUNKLENBQUMsRUFBQyxDQUFDO1FBRUgsSUFBSSxDQUFDLHlCQUF5QixHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLG9CQUFvQixDQUFDLENBQUMsR0FBRzs7OztRQUN6RSxVQUFBLENBQUM7WUFDQyw0QkFDSyxLQUFJLENBQUMsb0JBQW9CLENBQUMsQ0FBQyxDQUFDLElBQy9CLEtBQUssRUFBRSxDQUFDLElBQ1I7UUFDSixDQUFDLEVBQ0YsQ0FBQztRQUNGLE9BQU8sQ0FBQyxHQUFHLENBQUMsdUNBQXVDLEVBQUU7WUFDbkQsYUFBYSxlQUFBO1lBQ2Isb0JBQW9CLHNCQUFBO1NBQ3JCLENBQUMsQ0FBQztJQUNMLENBQUM7SUFFRCxzREFBc0Q7Ozs7OztJQUN0RCxnREFBbUI7Ozs7OztJQUFuQixVQUFvQixRQUFrQjtRQUF0QyxpQkFrQkM7UUFqQkMsK0JBQStCO1FBQy9CLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxPQUFPOzs7O1FBQy9CLFVBQUEsQ0FBQyxJQUFJLE9BQUEsQ0FBQyxLQUFJLENBQUMsc0JBQXNCLENBQUMsQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDLEVBQXhDLENBQXdDLEVBQzlDLENBQUM7UUFDRix1QkFBdUI7UUFDdkIsUUFBUSxDQUFDLE9BQU87Ozs7UUFBQyxVQUFBLENBQUMsSUFBSSxPQUFBLENBQUMsS0FBSSxDQUFDLHNCQUFzQixDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxFQUF2QyxDQUF1QyxFQUFDLENBQUM7UUFDL0QsSUFBSSxDQUFDLG1CQUFtQixHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLHNCQUFzQixDQUFDLENBQUMsTUFBTTs7OztRQUN4RSxVQUFBLENBQUMsSUFBSSxPQUFBLEtBQUksQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDLENBQUMsRUFBOUIsQ0FBOEIsRUFDcEMsQ0FBQztRQUNGLGtDQUFrQztRQUNsQyxJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsV0FBVyxFQUFFO1lBQzNCLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7U0FDNUM7UUFDRCw0QkFBNEI7UUFDNUIsSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sRUFBRTtZQUN2QixJQUFJLENBQUMsbUJBQW1CLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1NBQ3pDO0lBQ0gsQ0FBQztJQUVELGdGQUFnRjs7Ozs7SUFDaEYsMENBQWE7Ozs7SUFBYjs7WUFDUSxXQUFXLEdBQUcsSUFBSSxDQUFDLGlCQUFpQixDQUFDLFFBQVEsQ0FBQyxNQUFNOztZQUNwRCxPQUFPLEdBQ1gsSUFBSSxDQUFDLE1BQU0sQ0FBQyxrQkFBa0IsSUFBSSxJQUFJLENBQUMsVUFBVSxDQUFDLFlBQVksQ0FBQyxNQUFNO1FBQ3ZFLE9BQU8sV0FBVyxJQUFJLE9BQU8sQ0FBQztJQUNoQyxDQUFDO0lBRUQsZ0ZBQWdGOzs7OztJQUNoRix5Q0FBWTs7OztJQUFaO1FBQ0UsSUFBSSxDQUFDLGFBQWEsRUFBRTtZQUNsQixDQUFDLENBQUMsSUFBSSxDQUFDLGlCQUFpQixDQUFDLEtBQUssRUFBRTtZQUNoQyxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDO1FBQ3JCLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUMxRCxDQUFDOzs7OztJQUVPLHNDQUFTOzs7O0lBQWpCO1FBQUEsaUJBU0M7UUFSQyxJQUFJLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLFlBQVksRUFBRSxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDOztZQUN6RSxRQUFRLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxZQUFZO1FBQzNDLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxrQkFBa0IsRUFBRTtZQUNsQyxRQUFRLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxZQUFZLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLGtCQUFrQixDQUFDLENBQUM7U0FDbEY7UUFDRCxRQUFRLENBQUMsT0FBTzs7OztRQUFDLFVBQUEsR0FBRztZQUNsQixLQUFJLENBQUMsaUJBQWlCLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ3JDLENBQUMsRUFBQyxDQUFDO0lBQ0wsQ0FBQzs7OztJQUVELHlDQUFZOzs7SUFBWjtRQUNFLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLGtCQUFrQixFQUFFO1lBQ25DLE9BQU8sS0FBSyxDQUFDO1NBQ2Q7UUFDRCxPQUFPLENBQ0wsSUFBSSxDQUFDLGlCQUFpQixDQUFDLFFBQVEsQ0FBQyxNQUFNLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxrQkFBa0IsQ0FDekUsQ0FBQztJQUNKLENBQUM7Ozs7O0lBRUQsaURBQW9COzs7O0lBQXBCLFVBQXFCLE1BQU07UUFDekIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxFQUFFLE1BQU0sUUFBQSxFQUFFLENBQUMsQ0FBQzs7WUFDbEIsY0FBYyxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsS0FBSztRQUMvQyxJQUFJLENBQUMsbUJBQW1CLENBQUMsY0FBYyxDQUFDLENBQUM7UUFDekMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ3hDLENBQUM7Ozs7OztJQUVELDRDQUFlOzs7OztJQUFmLFVBQWdCLE1BQU0sRUFBRSxJQUFJO1FBQzFCLElBQUksTUFBTSxFQUFFOztnQkFDSixVQUFVLEdBQUcsSUFBSSxDQUFDLGlCQUFpQixDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUM7WUFDMUQsSUFBSSxDQUFDLElBQUksQ0FBQyxZQUFZLEVBQUUsRUFBRTtnQkFDeEIsSUFBSSxDQUFDLGlCQUFpQixDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQzthQUNyQztpQkFBTTtnQkFDTCxJQUFJLFVBQVUsRUFBRTtvQkFDZCxJQUFJLENBQUMsaUJBQWlCLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO2lCQUN2QztxQkFBTTtvQkFDTCxJQUFJLENBQUMsSUFBSSxDQUNQLHdCQUFxQixJQUFJLENBQUMsTUFBTSxDQUFDLGtCQUFrQixlQUFXLENBQy9ELENBQUM7aUJBQ0g7YUFDRjtZQUNELElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxRQUFRLENBQUMsQ0FBQztTQUN6RDtJQUNILENBQUM7Ozs7OztJQUVELHVDQUFVOzs7OztJQUFWLFVBQVcsTUFBTSxFQUFFLEdBQU07UUFDdkIsSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLFlBQVksRUFBRTtZQUM1QixPQUFPLENBQUMsR0FBRyxDQUFDLDhCQUE4QixFQUFFLEVBQUUsTUFBTSxRQUFBLEVBQUUsR0FBRyxLQUFBLEVBQUUsQ0FBQyxDQUFDO1lBQzdELElBQUksQ0FBQyxlQUFlLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ2pDLElBQUksQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1NBQy9CO0lBQ0gsQ0FBQzs7Ozs7O0lBRUQsNkNBQWdCOzs7OztJQUFoQixVQUFpQixNQUFNLEVBQUUsR0FBTTtRQUM3QixJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsdUJBQXVCLEVBQUU7WUFDdkMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxvQ0FBb0MsRUFBRSxFQUFFLE1BQU0sUUFBQSxFQUFFLEdBQUcsS0FBQSxFQUFFLENBQUMsQ0FBQztZQUNuRSxJQUFJLENBQUMsZUFBZSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUNqQyxJQUFJLENBQUMsTUFBTSxDQUFDLHVCQUF1QixDQUFDLEdBQUcsQ0FBQyxDQUFDO1NBQzFDO0lBQ0gsQ0FBQzs7Ozs7SUFFSyw4Q0FBaUI7Ozs7SUFBdkIsVUFBd0IsTUFBK0I7Ozs7NEJBQ3JELHFCQUFNLE1BQU0sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLGlCQUFpQixDQUFDLFFBQVEsQ0FBQyxFQUFBOzt3QkFBckQsU0FBcUQsQ0FBQzt3QkFDdEQsSUFBSSxDQUFDLGlCQUFpQixDQUFDLEtBQUssRUFBRSxDQUFDOzs7OztLQUNoQzs7Ozs7SUFFRCxpQ0FBSTs7OztJQUFKLFVBQUssR0FBVyxJQUFHLENBQUM7O2dCQS9UckIsU0FBUyxTQUFDO29CQUNULFFBQVEsRUFBRSxnQkFBZ0I7b0JBQzFCLCs4TUFBOEM7O2lCQUUvQzs7OytCQUVFLE1BQU07eUJBRU4sS0FBSztvQ0FFTCxLQUFLOzRCQWdCTCxTQUFTLFNBQUMsWUFBWTt1QkFFdEIsU0FBUyxTQUFDLE9BQU87O0lBb1NwQix5QkFBQztDQUFBLEFBaFVELElBZ1VDO1NBM1RZLGtCQUFrQjs7O0lBQzdCLDBDQUN1Qzs7SUFDdkMsb0NBQzJCOztJQUMzQiwrQ0FHTzs7SUFDUCxrREFFTzs7SUFDUCx1REFBMkQ7O0lBRTNELDJDQUFtQjs7SUFDbkIsa0RBQTBCOztJQUMxQixpREFBeUI7O0lBQ3pCLG9EQUE0Qjs7SUFFNUIsd0NBQW9DOztJQUNwQyxvREFBcUM7O0lBQ3JDLHVDQUFpRDs7SUFDakQsc0NBQWM7O0lBQ2Qsa0NBQWtDOztJQUVsQyx3Q0FBa0I7O0lBQ2xCLDRDQUF1Qjs7SUFFdkIsd0NBQW9COztJQUVwQiwyQ0FBa0M7O0lBRWxDLCtDQUFzRDs7SUFDdEQsNkNBQXFEOztJQUNyRCx1REFBd0MiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xyXG4gIENvbXBvbmVudCxcclxuICBPbkluaXQsXHJcbiAgSW5wdXQsXHJcbiAgT25EZXN0cm95LFxyXG4gIFZpZXdDaGlsZCxcclxuICBPdXRwdXQsXHJcbiAgRXZlbnRFbWl0dGVyXHJcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IE1hdFRhYmxlRGF0YVNvdXJjZSwgTWF0UGFnaW5hdG9yLCBNYXRTb3J0IH0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwnO1xyXG5pbXBvcnQgeyBTdWJzY3JpcHRpb24sIE9ic2VydmFibGUgfSBmcm9tICdyeGpzJztcclxuaW1wb3J0IHsgRm9ybUNvbnRyb2wgfSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XHJcbmltcG9ydCB7IFNlbGVjdGlvbk1vZGVsIH0gZnJvbSAnQGFuZ3VsYXIvY2RrL2NvbGxlY3Rpb25zJztcclxuaW1wb3J0IHsgZmlsdGVyIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xyXG5cclxuZXhwb3J0IGludGVyZmFjZSBBdXRvVGFibGVDb25maWc8VD4ge1xyXG4gIGRhdGEkOiBPYnNlcnZhYmxlPFRbXT47XHJcbiAgZmlsZW5hbWU/OiBzdHJpbmc7XHJcbiAgYWN0aW9ucz86IEFjdGlvbkRlZmluaXRpb248VD5bXTtcclxuICBhY3Rpb25zQnVsaz86IEFjdGlvbkRlZmluaXRpb25CdWxrPFQ+W107XHJcbiAgYnVsa1NlbGVjdE1heENvdW50PzogbnVtYmVyO1xyXG4gIG9uU2VsZWN0SXRlbT86IChyb3c6IFQpID0+IHZvaWQ7XHJcbiAgb25TZWxlY3RJdGVtRG91YmxlQ2xpY2s/OiAocm93OiBUKSA9PiB2b2lkO1xyXG4gIGNsZWFyU2VsZWN0ZWQ/OiBPYnNlcnZhYmxlPHZvaWQ+O1xyXG4gIGluaXRpYWxTb3J0Pzogc3RyaW5nO1xyXG4gIGluaXRpYWxTb3J0RGlyPzogJ2FzYycgfCAnZGVzYyc7XHJcbiAgcGFnZVNpemU/OiBudW1iZXI7XHJcbiAgaGlkZUZpZWxkcz86IHN0cmluZ1tdO1xyXG4gIGhpZGVGaWx0ZXI/OiBib29sZWFuO1xyXG4gIGhpZGVIZWFkZXI/OiBib29sZWFuO1xyXG4gIGhpZGVDaG9vc2VDb2x1bW5zPzogYm9vbGVhbjtcclxuICBmaWx0ZXJUZXh0Pzogc3RyaW5nO1xyXG4gIGV4cG9ydEZpbGVuYW1lPzogc3RyaW5nO1xyXG4gIGV4cG9ydFJvd0Zvcm1hdD86IChyb3c6IFQpID0+IHZvaWQ7XHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgQWN0aW9uRGVmaW5pdGlvbjxUPiB7XHJcbiAgbGFiZWw6IHN0cmluZztcclxuICBpY29uPzogc3RyaW5nO1xyXG4gIG9uQ2xpY2s/OiAocm93OiBUKSA9PiB2b2lkO1xyXG4gIG9uUm91dGVyTGluaz86IChyb3c6IFQpID0+IHN0cmluZztcclxuICByb3V0ZXJMaW5rUXVlcnk/OiAocm93OiBUKSA9PiB7fTtcclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBBY3Rpb25EZWZpbml0aW9uQnVsazxUPiB7XHJcbiAgbGFiZWw6IHN0cmluZztcclxuICBpY29uPzogc3RyaW5nO1xyXG4gIG9uQ2xpY2s/OiAocm93OiBUW10pID0+IHZvaWQ7XHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgQ29sdW1uRGVmaW5pdGlvbiB7XHJcbiAgaGVhZGVyPzogc3RyaW5nO1xyXG4gIHRlbXBsYXRlPzogYW55O1xyXG4gIGhpZGU/OiBib29sZWFuO1xyXG4gIGZvcmNlV3JhcD86IGJvb2xlYW47XHJcbn1cclxuXHJcbmludGVyZmFjZSBDb2x1bW5EZWZpbml0aW9uSW50ZXJuYWwgZXh0ZW5kcyBDb2x1bW5EZWZpbml0aW9uIHtcclxuICBmaWVsZDogc3RyaW5nO1xyXG59XHJcblxyXG5AQ29tcG9uZW50KHtcclxuICBzZWxlY3RvcjogJ25neC1hdXRvLXRhYmxlJyxcclxuICB0ZW1wbGF0ZVVybDogJy4vbmd4LWF1dG8tdGFibGUuY29tcG9uZW50Lmh0bWwnLFxyXG4gIHN0eWxlVXJsczogWycuL25neC1hdXRvLXRhYmxlLmNvbXBvbmVudC5zY3NzJ11cclxufSlcclxuZXhwb3J0IGNsYXNzIEF1dG9UYWJsZUNvbXBvbmVudDxUPiBpbXBsZW1lbnRzIE9uSW5pdCwgT25EZXN0cm95IHtcclxuICBAT3V0cHV0KClcclxuICBzZWxlY3RlZEJ1bGsgPSBuZXcgRXZlbnRFbWl0dGVyPFRbXT4oKTtcclxuICBASW5wdXQoKVxyXG4gIGNvbmZpZzogQXV0b1RhYmxlQ29uZmlnPFQ+O1xyXG4gIEBJbnB1dCgpXHJcbiAgY29sdW1uRGVmaW5pdGlvbnM6IHtcclxuICAgIFtmaWVsZDogc3RyaW5nXTogQ29sdW1uRGVmaW5pdGlvbjtcclxuICB9ID0ge307XHJcbiAgY29sdW1uRGVmaW5pdGlvbnNBbGw6IHtcclxuICAgIFtmaWVsZDogc3RyaW5nXTogQ29sdW1uRGVmaW5pdGlvbjtcclxuICB9ID0ge307XHJcbiAgY29sdW1uRGVmaW5pdGlvbnNBbGxBcnJheTogQ29sdW1uRGVmaW5pdGlvbkludGVybmFsW10gPSBbXTtcclxuXHJcbiAgaGVhZGVyS2V5c0FsbCA9IFtdO1xyXG4gIGhlYWRlcktleXNBbGxWaXNpYmxlID0gW107XHJcbiAgaGVhZGVyS2V5c0Rpc3BsYXllZCA9IFtdO1xyXG4gIGhlYWRlcktleXNEaXNwbGF5ZWRNYXAgPSB7fTtcclxuXHJcbiAgZGF0YVNvdXJjZTogTWF0VGFibGVEYXRhU291cmNlPGFueT47XHJcbiAgZGF0YVNvdXJjZVN1YnNjcmlwdGlvbjogU3Vic2NyaXB0aW9uO1xyXG4gIEBWaWV3Q2hpbGQoTWF0UGFnaW5hdG9yKSBwYWdpbmF0b3I6IE1hdFBhZ2luYXRvcjtcclxuICBwYWdlU2l6ZSA9IDI1O1xyXG4gIEBWaWV3Q2hpbGQoTWF0U29ydCkgc29ydDogTWF0U29ydDtcclxuXHJcbiAgZXhwb3J0RGF0YTogYW55W107XHJcbiAgZXhwb3J0RmlsZW5hbWU6IHN0cmluZztcclxuXHJcbiAgaGFzTm9JdGVtczogYm9vbGVhbjtcclxuXHJcbiAgZmlsdGVyQ29udHJvbCA9IG5ldyBGb3JtQ29udHJvbCgpO1xyXG4gIC8vIEJ1bGsgaXRlbXMgc2VsZWN0aW9uXHJcbiAgc2VsZWN0aW9uTXVsdGlwbGUgPSBuZXcgU2VsZWN0aW9uTW9kZWw8YW55Pih0cnVlLCBbXSk7XHJcbiAgc2VsZWN0aW9uU2luZ2xlID0gbmV3IFNlbGVjdGlvbk1vZGVsPGFueT4oZmFsc2UsIFtdKTtcclxuICBjbGVhclNlbGVjdGVkU3Vic2NyaXB0aW9uOiBTdWJzY3JpcHRpb247XHJcblxyXG4gIG5nT25Jbml0KCkge1xyXG4gICAgdGhpcy5kYXRhU291cmNlU3Vic2NyaXB0aW9uID0gdGhpcy5jb25maWcuZGF0YSRcclxuICAgICAgLnBpcGUoZmlsdGVyKGUgPT4gISFlKSlcclxuICAgICAgLnN1YnNjcmliZShvcmlnaW5hbERhdGEgPT4ge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKCduZ3gtYXV0by10YWJsZSwgc3Vic2NyaWJlZDogJywgeyBvcmlnaW5hbERhdGEgfSk7XHJcbiAgICAgICAgdGhpcy5kYXRhU291cmNlID0gbmV3IE1hdFRhYmxlRGF0YVNvdXJjZShvcmlnaW5hbERhdGEpO1xyXG4gICAgICAgIHRoaXMuZGF0YVNvdXJjZS5wYWdpbmF0b3IgPSB0aGlzLnBhZ2luYXRvcjtcclxuICAgICAgICB0aGlzLmRhdGFTb3VyY2Uuc29ydCA9IHRoaXMuc29ydDtcclxuICAgICAgICBpZiAob3JpZ2luYWxEYXRhICYmICFvcmlnaW5hbERhdGEubGVuZ3RoKSB7XHJcbiAgICAgICAgICB0aGlzLmhhc05vSXRlbXMgPSB0cnVlO1xyXG4gICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICB0aGlzLmhhc05vSXRlbXMgPSBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHRoaXMuY29uZmlnLnBhZ2VTaXplKSB7XHJcbiAgICAgICAgICB0aGlzLnBhZ2VTaXplID0gdGhpcy5jb25maWcucGFnZVNpemU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvbnN0IGZpcnN0RGF0YUl0ZW0gPSBvcmlnaW5hbERhdGFbMF07XHJcbiAgICAgICAgdGhpcy5pbml0RGlzcGxheWVkQ29sdW1ucyhmaXJzdERhdGFJdGVtKTtcclxuICAgICAgICB0aGlzLmluaXRFeHBvcnQob3JpZ2luYWxEYXRhKTtcclxuICAgICAgICB0aGlzLmluaXRGaWx0ZXIob3JpZ2luYWxEYXRhKTtcclxuICAgICAgfSk7XHJcblxyXG4gICAgaWYgKHRoaXMuY29uZmlnLmNsZWFyU2VsZWN0ZWQpIHtcclxuICAgICAgdGhpcy5jbGVhclNlbGVjdGVkU3Vic2NyaXB0aW9uID0gdGhpcy5jb25maWcuY2xlYXJTZWxlY3RlZC5zdWJzY3JpYmUoXHJcbiAgICAgICAgKCkgPT4ge1xyXG4gICAgICAgICAgY29uc29sZS5sb2coJ25neC1hdXRvLXRhYmxlOiBjbGVhclNlbGVjdGVkJyk7XHJcbiAgICAgICAgICB0aGlzLnNlbGVjdGlvbk11bHRpcGxlLmNsZWFyKCk7XHJcbiAgICAgICAgICB0aGlzLnNlbGVjdGlvblNpbmdsZS5jbGVhcigpO1xyXG4gICAgICAgIH1cclxuICAgICAgKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIG5nT25EZXN0cm95KCkge1xyXG4gICAgaWYgKHRoaXMuZGF0YVNvdXJjZVN1YnNjcmlwdGlvbikge1xyXG4gICAgICB0aGlzLmRhdGFTb3VyY2VTdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcclxuICAgIH1cclxuICAgIGlmICh0aGlzLmNsZWFyU2VsZWN0ZWRTdWJzY3JpcHRpb24pIHtcclxuICAgICAgdGhpcy5jbGVhclNlbGVjdGVkU3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBhcHBseUZpbHRlcihmaWx0ZXJWYWx1ZTogc3RyaW5nKSB7XHJcbiAgICB0aGlzLmRhdGFTb3VyY2UuZmlsdGVyID0gZmlsdGVyVmFsdWUudHJpbSgpLnRvTG93ZXJDYXNlKCk7XHJcbiAgICB0aGlzLnNlbGVjdGlvbk11bHRpcGxlLmNsZWFyKCk7XHJcbiAgICB0aGlzLnNlbGVjdGlvblNpbmdsZS5jbGVhcigpO1xyXG4gIH1cclxuXHJcbiAgaW5pdEZpbHRlcihvcmlnaW5hbERhdGE6IFRbXSkge1xyXG4gICAgaWYgKCFvcmlnaW5hbERhdGEubGVuZ3RoKSB7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuICAgIGNvbnN0IGZpcnN0Um93ID0gb3JpZ2luYWxEYXRhWzBdO1xyXG4gICAgY29uc3Qga2V5c0RhdGEgPSBuZXcgU2V0KE9iamVjdC5rZXlzKGZpcnN0Um93KSk7XHJcbiAgICBjb25zdCBrZXlzSGVhZGVyID0gbmV3IFNldCh0aGlzLmhlYWRlcktleXNEaXNwbGF5ZWQpO1xyXG4gICAga2V5c0hlYWRlci5kZWxldGUoJ19fYnVsaycpO1xyXG4gICAga2V5c0hlYWRlci5kZWxldGUoJ19fc3RhcicpO1xyXG4gICAgY29uc3QgYWxsRmllbGRzRXhpc3QgPSBBcnJheS5mcm9tKGtleXNIZWFkZXIpLnJlZHVjZSgoYWNjLCBjdXIpID0+IHtcclxuICAgICAgcmV0dXJuIGtleXNEYXRhLmhhcyhjdXIpICYmIGFjYztcclxuICAgIH0sIHRydWUpO1xyXG5cclxuICAgIGNvbnNvbGUubG9nKCduZ3gtYXV0by10YWJsZTogaW5pdEZpbHRlcigpJywge1xyXG4gICAgICByb3dGaWVsZHM6IGtleXNEYXRhLFxyXG4gICAgICBhbGxGaWVsZHNFeGlzdCxcclxuICAgICAgaGVhZGVyS2V5c0Rpc3BsYXllZDogdGhpcy5oZWFkZXJLZXlzRGlzcGxheWVkXHJcbiAgICB9KTtcclxuICAgIHRoaXMuZGF0YVNvdXJjZS5maWx0ZXJQcmVkaWNhdGUgPSAoZGF0YTogVCwgZmlsdGVyVGV4dDogc3RyaW5nKSA9PiB7XHJcbiAgICAgIGlmICghZmlsdGVyVGV4dCkge1xyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICB9XHJcbiAgICAgIGlmICghYWxsRmllbGRzRXhpc3QpIHtcclxuICAgICAgICBjb25zdCBsb3dlciA9IEpTT04uc3RyaW5naWZ5KGRhdGEpLnRvTG93ZXJDYXNlKCk7XHJcbiAgICAgICAgcmV0dXJuIGxvd2VyLmluY2x1ZGVzKGZpbHRlclRleHQpO1xyXG4gICAgICB9XHJcbiAgICAgIGZvciAoY29uc3Qga2V5IG9mIEFycmF5LmZyb20oa2V5c0hlYWRlcikpIHtcclxuICAgICAgICBjb25zdCBkYXRhVmFsID0gZGF0YVtrZXldO1xyXG4gICAgICAgIGNvbnN0IHN0ciA9IEpTT04uc3RyaW5naWZ5KGRhdGFWYWwpO1xyXG4gICAgICAgIGNvbnN0IGlzRm91bmQgPSBzdHIudG9Mb3dlckNhc2UoKS5pbmNsdWRlcyhmaWx0ZXJUZXh0KTtcclxuICAgICAgICBpZiAoaXNGb3VuZCkge1xyXG4gICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9O1xyXG4gIH1cclxuXHJcbiAgaW5pdEV4cG9ydChvcmlnaW5hbERhdGE6IFRbXSkge1xyXG4gICAgdGhpcy5leHBvcnRGaWxlbmFtZSA9IHRoaXMuY29uZmlnLmV4cG9ydEZpbGVuYW1lO1xyXG4gICAgaWYgKCF0aGlzLmV4cG9ydEZpbGVuYW1lKSB7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuICAgIHRoaXMuZXhwb3J0RGF0YSA9IG9yaWdpbmFsRGF0YS5tYXAoZGF0YUl0ZW0gPT4ge1xyXG4gICAgICBpZiAoIXRoaXMuY29uZmlnLmV4cG9ydFJvd0Zvcm1hdCkge1xyXG4gICAgICAgIHJldHVybiBkYXRhSXRlbTtcclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gdGhpcy5jb25maWcuZXhwb3J0Um93Rm9ybWF0KGRhdGFJdGVtKTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIGdldEtleUhlYWRlcihrZXk6IHN0cmluZykge1xyXG4gICAgY29uc3QgaW5wdXREZWYgPSB0aGlzLmNvbHVtbkRlZmluaXRpb25zW2tleV07XHJcbiAgICBpZiAoaW5wdXREZWYgJiYgaW5wdXREZWYuaGVhZGVyICE9IG51bGwpIHtcclxuICAgICAgcmV0dXJuIGlucHV0RGVmLmhlYWRlcjtcclxuICAgIH1cclxuICAgIHJldHVybiB0aGlzLnRvVGl0bGVDYXNlKGtleSk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIHRvVGl0bGVDYXNlKHN0cikge1xyXG4gICAgcmV0dXJuIHN0ci5yZXBsYWNlKCdfJywgJyAnKS5yZXBsYWNlKC9cXHdcXFMqL2csIGZ1bmN0aW9uKHR4dCkge1xyXG4gICAgICByZXR1cm4gdHh0LmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgdHh0LnN1YnN0cigxKS50b0xvd2VyQ2FzZSgpO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBpbml0RGlzcGxheWVkQ29sdW1ucyhmaXJzdERhdGFJdGVtOiBUKSB7XHJcbiAgICB0aGlzLmluaXRDb2x1bW5EZWZpbml0aW9ucyhmaXJzdERhdGFJdGVtKTtcclxuXHJcbiAgICB0aGlzLmhlYWRlcktleXNBbGwgPSBPYmplY3Qua2V5cyh0aGlzLmNvbHVtbkRlZmluaXRpb25zQWxsKTtcclxuICAgIHRoaXMuaGVhZGVyS2V5c0FsbFZpc2libGUgPSB0aGlzLmhlYWRlcktleXNBbGw7XHJcbiAgICBpZiAodGhpcy5jb25maWcuaGlkZUZpZWxkcykge1xyXG4gICAgICAvLyBIaWRlIGZpZWxkcyBpZiBzcGVjaWZpZWRcclxuICAgICAgY29uc3QgaGlkZUZpZWxkcyA9IG5ldyBTZXQodGhpcy5jb25maWcuaGlkZUZpZWxkcyk7XHJcbiAgICAgIHRoaXMuaGVhZGVyS2V5c0FsbFZpc2libGUgPSB0aGlzLmhlYWRlcktleXNBbGwuZmlsdGVyKFxyXG4gICAgICAgIHggPT4gIWhpZGVGaWVsZHMuaGFzKHgpXHJcbiAgICAgICk7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgZGlzcGxheWVkID0gdGhpcy5jb2x1bW5EZWZpbml0aW9uc0FsbEFycmF5XHJcbiAgICAgIC5maWx0ZXIoZGVmID0+ICFkZWYuaGlkZSlcclxuICAgICAgLm1hcChkID0+IGQuZmllbGQpO1xyXG5cclxuICAgIHRoaXMuc2V0RGlzcGxheWVkQ29sdW1ucyhkaXNwbGF5ZWQpO1xyXG4gICAgLy8gU2V0IGN1cnJlbnRseSBlbmFibGVkIGl0ZW1zXHJcbiAgICB0aGlzLmZpbHRlckNvbnRyb2wuc2V0VmFsdWUodGhpcy5oZWFkZXJLZXlzRGlzcGxheWVkKTtcclxuICB9XHJcblxyXG4gIGluaXRDb2x1bW5EZWZpbml0aW9ucyhmaXJzdERhdGFJdGVtOiBUKSB7XHJcbiAgICAvLyBTZXQgYWxsIGNvbHVtbiBkZWZpbnRpb25zLCB3aGljaCB3ZXJlIGV4cGxpY2l0bHkgc2V0IGluIGNvbmZpZ1xyXG4gICAgY29uc3QgaW5wdXREZWZpbnRpb25GaWVsZHMgPSBPYmplY3Qua2V5cyh0aGlzLmNvbHVtbkRlZmluaXRpb25zKTtcclxuICAgIGlucHV0RGVmaW50aW9uRmllbGRzLmZvckVhY2goKGZpZWxkOiBzdHJpbmcpID0+IHtcclxuICAgICAgY29uc3QgaW5wdXREZWZpbnRpb24gPSB0aGlzLmNvbHVtbkRlZmluaXRpb25zW2ZpZWxkXTtcclxuICAgICAgdGhpcy5jb2x1bW5EZWZpbml0aW9uc0FsbFtmaWVsZF0gPSB7XHJcbiAgICAgICAgaGVhZGVyOiB0aGlzLmdldEtleUhlYWRlcihmaWVsZCksXHJcbiAgICAgICAgdGVtcGxhdGU6IGlucHV0RGVmaW50aW9uLnRlbXBsYXRlLFxyXG4gICAgICAgIGhpZGU6IGlucHV0RGVmaW50aW9uLmhpZGUsXHJcbiAgICAgICAgZm9yY2VXcmFwOiBpbnB1dERlZmludGlvbi5mb3JjZVdyYXBcclxuICAgICAgfTtcclxuICAgIH0pO1xyXG5cclxuICAgIC8vIFNldCBhbGwgY29sdW1uIGRlZmludGlvbnMgcmVhZCBmcm9tIHRoZSBcImlucHV0IGRhdGFcIlxyXG4gICAgY29uc3QgaW5wdXREYXRhS2V5cyA9IE9iamVjdC5rZXlzKGZpcnN0RGF0YUl0ZW0pO1xyXG4gICAgaW5wdXREYXRhS2V5cy5mb3JFYWNoKChmaWVsZDogc3RyaW5nKSA9PiB7XHJcbiAgICAgIGlmICghIXRoaXMuY29sdW1uRGVmaW5pdGlvbnNBbGxbZmllbGRdKSB7XHJcbiAgICAgICAgLy8gc2tpcCBpZiBkZWZpbml0aW9uIGV4aXN0c1xyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgfVxyXG4gICAgICB0aGlzLmNvbHVtbkRlZmluaXRpb25zQWxsW2ZpZWxkXSA9IHtcclxuICAgICAgICBoZWFkZXI6IHRoaXMudG9UaXRsZUNhc2UoZmllbGQpLFxyXG4gICAgICAgIGhpZGU6IHRydWVcclxuICAgICAgfTtcclxuICAgIH0pO1xyXG5cclxuICAgIHRoaXMuY29sdW1uRGVmaW5pdGlvbnNBbGxBcnJheSA9IE9iamVjdC5rZXlzKHRoaXMuY29sdW1uRGVmaW5pdGlvbnNBbGwpLm1hcChcclxuICAgICAgayA9PiB7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgIC4uLnRoaXMuY29sdW1uRGVmaW5pdGlvbnNBbGxba10sXHJcbiAgICAgICAgICBmaWVsZDoga1xyXG4gICAgICAgIH07XHJcbiAgICAgIH1cclxuICAgICk7XHJcbiAgICBjb25zb2xlLmxvZygnbmd4LWF1dG8tdGFibGU6IGluaXRDb2x1bW5EZWZpbml0aW9ucycsIHtcclxuICAgICAgZmlyc3REYXRhSXRlbSxcclxuICAgICAgaW5wdXREZWZpbnRpb25GaWVsZHNcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgLy8gU2V0cyB0aGUgZGlzcGxheWVkIGNvbHVtbnMgZnJvbSBhIHNldCBvZiBmaWVsZG5hbWVzXHJcbiAgc2V0RGlzcGxheWVkQ29sdW1ucyhzZWxlY3RlZDogc3RyaW5nW10pIHtcclxuICAgIC8vIEluaXRpYWxpemUgYWxsIGtleXMgYXMgZmFsc2VcclxuICAgIHRoaXMuaGVhZGVyS2V5c0FsbFZpc2libGUuZm9yRWFjaChcclxuICAgICAgayA9PiAodGhpcy5oZWFkZXJLZXlzRGlzcGxheWVkTWFwW2tdID0gZmFsc2UpXHJcbiAgICApO1xyXG4gICAgLy8gU2V0IHNlbGVjdGVkIGFzIHRydWVcclxuICAgIHNlbGVjdGVkLmZvckVhY2goYyA9PiAodGhpcy5oZWFkZXJLZXlzRGlzcGxheWVkTWFwW2NdID0gdHJ1ZSkpO1xyXG4gICAgdGhpcy5oZWFkZXJLZXlzRGlzcGxheWVkID0gT2JqZWN0LmtleXModGhpcy5oZWFkZXJLZXlzRGlzcGxheWVkTWFwKS5maWx0ZXIoXHJcbiAgICAgIGsgPT4gdGhpcy5oZWFkZXJLZXlzRGlzcGxheWVkTWFwW2tdXHJcbiAgICApO1xyXG4gICAgLy8gQWRkIGJ1bGsgc2VsZWN0IGNvbHVtbiBhdCBzdGFydFxyXG4gICAgaWYgKHRoaXMuY29uZmlnLmFjdGlvbnNCdWxrKSB7XHJcbiAgICAgIHRoaXMuaGVhZGVyS2V5c0Rpc3BsYXllZC51bnNoaWZ0KCdfX2J1bGsnKTtcclxuICAgIH1cclxuICAgIC8vIEFkZCBhY3Rpb25zIGNvbHVtbiBhdCBlbmRcclxuICAgIGlmICh0aGlzLmNvbmZpZy5hY3Rpb25zKSB7XHJcbiAgICAgIHRoaXMuaGVhZGVyS2V5c0Rpc3BsYXllZC5wdXNoKCdfX3N0YXInKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8qKiBXaGV0aGVyIHRoZSBudW1iZXIgb2Ygc2VsZWN0ZWQgZWxlbWVudHMgbWF0Y2hlcyB0aGUgdG90YWwgbnVtYmVyIG9mIHJvd3MuICovXHJcbiAgaXNBbGxTZWxlY3RlZCgpIHtcclxuICAgIGNvbnN0IG51bVNlbGVjdGVkID0gdGhpcy5zZWxlY3Rpb25NdWx0aXBsZS5zZWxlY3RlZC5sZW5ndGg7XHJcbiAgICBjb25zdCBudW1Sb3dzID1cclxuICAgICAgdGhpcy5jb25maWcuYnVsa1NlbGVjdE1heENvdW50IHx8IHRoaXMuZGF0YVNvdXJjZS5maWx0ZXJlZERhdGEubGVuZ3RoO1xyXG4gICAgcmV0dXJuIG51bVNlbGVjdGVkID49IG51bVJvd3M7XHJcbiAgfVxyXG5cclxuICAvKiogU2VsZWN0cyBhbGwgcm93cyBpZiB0aGV5IGFyZSBub3QgYWxsIHNlbGVjdGVkOyBvdGhlcndpc2UgY2xlYXIgc2VsZWN0aW9uLiAqL1xyXG4gIG1hc3RlclRvZ2dsZSgpIHtcclxuICAgIHRoaXMuaXNBbGxTZWxlY3RlZCgpXHJcbiAgICAgID8gdGhpcy5zZWxlY3Rpb25NdWx0aXBsZS5jbGVhcigpXHJcbiAgICAgIDogdGhpcy5zZWxlY3RBbGwoKTtcclxuICAgIHRoaXMuc2VsZWN0ZWRCdWxrLmVtaXQodGhpcy5zZWxlY3Rpb25NdWx0aXBsZS5zZWxlY3RlZCk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIHNlbGVjdEFsbCgpIHtcclxuICAgIHRoaXMuZGF0YVNvdXJjZS5zb3J0RGF0YSh0aGlzLmRhdGFTb3VyY2UuZmlsdGVyZWREYXRhLCB0aGlzLmRhdGFTb3VyY2Uuc29ydCk7XHJcbiAgICBsZXQgY3V0QXJyYXkgPSB0aGlzLmRhdGFTb3VyY2UuZmlsdGVyZWREYXRhO1xyXG4gICAgaWYgKHRoaXMuY29uZmlnLmJ1bGtTZWxlY3RNYXhDb3VudCkge1xyXG4gICAgICBjdXRBcnJheSA9IHRoaXMuZGF0YVNvdXJjZS5maWx0ZXJlZERhdGEuc2xpY2UoMCwgdGhpcy5jb25maWcuYnVsa1NlbGVjdE1heENvdW50KTtcclxuICAgIH1cclxuICAgIGN1dEFycmF5LmZvckVhY2gocm93ID0+IHtcclxuICAgICAgdGhpcy5zZWxlY3Rpb25NdWx0aXBsZS5zZWxlY3Qocm93KTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgaXNNYXhSZWFjaGVkKCkge1xyXG4gICAgaWYgKCF0aGlzLmNvbmZpZy5idWxrU2VsZWN0TWF4Q291bnQpIHtcclxuICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIChcclxuICAgICAgdGhpcy5zZWxlY3Rpb25NdWx0aXBsZS5zZWxlY3RlZC5sZW5ndGggPj0gdGhpcy5jb25maWcuYnVsa1NlbGVjdE1heENvdW50XHJcbiAgICApO1xyXG4gIH1cclxuXHJcbiAgb25Db2x1bW5GaWx0ZXJDaGFuZ2UoJGV2ZW50KSB7XHJcbiAgICBjb25zb2xlLmxvZyh7ICRldmVudCB9KTtcclxuICAgIGNvbnN0IHNlbGVjdGVkVmFsdWVzID0gdGhpcy5maWx0ZXJDb250cm9sLnZhbHVlO1xyXG4gICAgdGhpcy5zZXREaXNwbGF5ZWRDb2x1bW5zKHNlbGVjdGVkVmFsdWVzKTtcclxuICAgIHRoaXMuaW5pdEZpbHRlcih0aGlzLmRhdGFTb3VyY2UuZGF0YSk7XHJcbiAgfVxyXG5cclxuICBvbkNsaWNrQnVsa0l0ZW0oJGV2ZW50LCBpdGVtKSB7XHJcbiAgICBpZiAoJGV2ZW50KSB7XHJcbiAgICAgIGNvbnN0IGlzU2VsZWN0ZWQgPSB0aGlzLnNlbGVjdGlvbk11bHRpcGxlLmlzU2VsZWN0ZWQoaXRlbSk7XHJcbiAgICAgIGlmICghdGhpcy5pc01heFJlYWNoZWQoKSkge1xyXG4gICAgICAgIHRoaXMuc2VsZWN0aW9uTXVsdGlwbGUudG9nZ2xlKGl0ZW0pO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGlmIChpc1NlbGVjdGVkKSB7XHJcbiAgICAgICAgICB0aGlzLnNlbGVjdGlvbk11bHRpcGxlLmRlc2VsZWN0KGl0ZW0pO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICB0aGlzLndhcm4oXHJcbiAgICAgICAgICAgIGBNYXggU2VsZWN0aW9uIG9mIFwiJHt0aGlzLmNvbmZpZy5idWxrU2VsZWN0TWF4Q291bnR9XCIgUmVhY2hlZGBcclxuICAgICAgICAgICk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICAgIHRoaXMuc2VsZWN0ZWRCdWxrLmVtaXQodGhpcy5zZWxlY3Rpb25NdWx0aXBsZS5zZWxlY3RlZCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBvbkNsaWNrUm93KCRldmVudCwgcm93OiBUKSB7XHJcbiAgICBpZiAodGhpcy5jb25maWcub25TZWxlY3RJdGVtKSB7XHJcbiAgICAgIGNvbnNvbGUubG9nKCduZ3gtYXV0by10YWJsZTogb25DbGlja1JvdygpJywgeyAkZXZlbnQsIHJvdyB9KTtcclxuICAgICAgdGhpcy5zZWxlY3Rpb25TaW5nbGUuc2VsZWN0KHJvdyk7XHJcbiAgICAgIHRoaXMuY29uZmlnLm9uU2VsZWN0SXRlbShyb3cpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgb25Eb3VibGVDbGlja1JvdygkZXZlbnQsIHJvdzogVCkge1xyXG4gICAgaWYgKHRoaXMuY29uZmlnLm9uU2VsZWN0SXRlbURvdWJsZUNsaWNrKSB7XHJcbiAgICAgIGNvbnNvbGUubG9nKCduZ3gtYXV0by10YWJsZTogb25Eb3VibGVDbGlja1JvdygpJywgeyAkZXZlbnQsIHJvdyB9KTtcclxuICAgICAgdGhpcy5zZWxlY3Rpb25TaW5nbGUuc2VsZWN0KHJvdyk7XHJcbiAgICAgIHRoaXMuY29uZmlnLm9uU2VsZWN0SXRlbURvdWJsZUNsaWNrKHJvdyk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBhc3luYyBvbkNsaWNrQnVsa0FjdGlvbihhY3Rpb246IEFjdGlvbkRlZmluaXRpb25CdWxrPFQ+KSB7XHJcbiAgICBhd2FpdCBhY3Rpb24ub25DbGljayh0aGlzLnNlbGVjdGlvbk11bHRpcGxlLnNlbGVjdGVkKTtcclxuICAgIHRoaXMuc2VsZWN0aW9uTXVsdGlwbGUuY2xlYXIoKTtcclxuICB9XHJcblxyXG4gIHdhcm4obXNnOiBzdHJpbmcpIHt9XHJcbn1cclxuIl19