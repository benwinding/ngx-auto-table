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
        this.$onDestroyed = new Subject();
    }
    /**
     * @return {?}
     */
    AutoTableComponent.prototype.ngOnInit = /**
     * @return {?}
     */
    function () {
        var _this = this;
        this.config.data$
            .pipe(filter((/**
         * @param {?} e
         * @return {?}
         */
        function (e) { return !!e; })))
            .pipe(takeUntil(this.$onDestroyed))
            .subscribe((/**
         * @param {?} originalData
         * @return {?}
         */
        function (originalData) {
            console.log("ngx-auto-table, subscribed: ", { originalData: originalData });
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
        if (this.config.$triggerSelectItem) {
            this.config.$triggerSelectItem
                .pipe(takeUntil(this.$onDestroyed))
                .subscribe((/**
             * @param {?} item
             * @return {?}
             */
            function (item) {
                _this.log("$triggerSelectItem", item);
                /** @type {?} */
                var str = JSON.stringify(item);
                /** @type {?} */
                var foundItem = _this.dataSource.data.find((/**
                 * @param {?} row
                 * @return {?}
                 */
                function (row) { return JSON.stringify(row) === str; }));
                if (foundItem) {
                    _this.selectionSingle.select(foundItem);
                }
            }));
        }
        if (this.config.clearSelected) {
            this.config.clearSelected
                .pipe(takeUntil(this.$onDestroyed))
                .subscribe((/**
             * @return {?}
             */
            function () {
                _this.log("clearSelected");
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
        this.$onDestroyed.next();
        this.$onDestroyed.complete();
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
        keysHeader.delete("__bulk");
        keysHeader.delete("__star");
        /** @type {?} */
        var allFieldsExist = Array.from(keysHeader).reduce((/**
         * @param {?} acc
         * @param {?} cur
         * @return {?}
         */
        function (acc, cur) {
            return keysData.has(cur) && acc;
        }), true);
        this.log("initFilter()", {
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
        return str.replace("_", " ").replace(/\w\S*/g, (/**
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
        this.log("initColumnDefinitions", {
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
            this.headerKeysDisplayed.unshift("__bulk");
        }
        // Add actions column at end
        if (this.config.actions) {
            this.headerKeysDisplayed.push("__star");
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
        this.isAllSelected() ? this.selectionMultiple.clear() : this.selectAll();
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
                    this.warn();
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
            this.log("onClickRow()", { $event: $event, row: row });
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
            this.log("onDoubleClickRow()", { $event: $event, row: row });
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
     * @param {?} str
     * @param {?=} obj
     * @return {?}
     */
    AutoTableComponent.prototype.log = /**
     * @param {?} str
     * @param {?=} obj
     * @return {?}
     */
    function (str, obj) {
        if (this.config.debug) {
            console.log("<ngx-auto-table> : " + str, obj);
        }
    };
    /**
     * @return {?}
     */
    AutoTableComponent.prototype.warn = /**
     * @return {?}
     */
    function () { };
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LWF1dG8tdGFibGUuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vbmd4LWF1dG8tdGFibGUtbGliLyIsInNvdXJjZXMiOlsiY29tcG9uZW50cy9uZ3gtYXV0by10YWJsZS5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxPQUFPLEVBQ0wsU0FBUyxFQUVULEtBQUssRUFFTCxTQUFTLEVBQ1QsTUFBTSxFQUNOLFlBQVksRUFDYixNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQUUsa0JBQWtCLEVBQUUsWUFBWSxFQUFFLE9BQU8sRUFBRSxNQUFNLG1CQUFtQixDQUFDO0FBQzlFLE9BQU8sRUFBYyxPQUFPLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFDM0MsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBQzdDLE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSwwQkFBMEIsQ0FBQztBQUMxRCxPQUFPLEVBQUUsTUFBTSxFQUFFLFNBQVMsRUFBRSxNQUFNLGdCQUFnQixDQUFDOzs7OztBQUVuRCxxQ0FxQkM7OztJQXBCQyxnQ0FBdUI7O0lBQ3ZCLGdDQUFnQjs7SUFDaEIsbUNBQWtCOztJQUNsQixrQ0FBZ0M7O0lBQ2hDLHNDQUF3Qzs7SUFDeEMsNkNBQTRCOztJQUM1Qix1Q0FBZ0M7O0lBQ2hDLGtEQUEyQzs7SUFDM0Msd0NBQWlDOztJQUNqQyxzQ0FBcUI7O0lBQ3JCLHlDQUFnQzs7SUFDaEMsbUNBQWtCOztJQUNsQixxQ0FBc0I7O0lBQ3RCLHFDQUFxQjs7SUFDckIscUNBQXFCOztJQUNyQiw0Q0FBNEI7O0lBQzVCLHFDQUFvQjs7SUFDcEIseUNBQXdCOztJQUN4QiwwQ0FBbUM7O0lBQ25DLDZDQUFtQzs7Ozs7O0FBR3JDLHNDQU1DOzs7SUFMQyxpQ0FBYzs7SUFDZCxnQ0FBYzs7SUFDZCxtQ0FBMkI7O0lBQzNCLHdDQUFrQzs7SUFDbEMsMkNBQWlDOzs7Ozs7QUFHbkMsMENBSUM7OztJQUhD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QyxxQkFBcUIsR0FBRyxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUM7U0FDL0M7SUFDSCxDQUFDOzs7O0lBRUQsaUNBQUk7OztJQUFKLGNBQVEsQ0FBQzs7Z0JBblZWLFNBQVMsU0FBQztvQkFDVCxRQUFRLEVBQUUsZ0JBQWdCO29CQUMxQix1b05BQThDOztpQkFFL0M7OzsrQkFFRSxNQUFNO3lCQUVOLEtBQUs7b0NBRUwsS0FBSzs0QkFlTCxTQUFTLFNBQUMsWUFBWTt1QkFFdEIsU0FBUyxTQUFDLE9BQU87O0lBeVRwQix5QkFBQztDQUFBLEFBcFZELElBb1ZDO1NBL1VZLGtCQUFrQjs7O0lBQzdCLDBDQUN1Qzs7SUFDdkMsb0NBQzJCOztJQUMzQiwrQ0FHTzs7SUFDUCxrREFFTzs7SUFDUCx1REFBMkQ7O0lBRTNELDJDQUFtQjs7SUFDbkIsa0RBQTBCOztJQUMxQixpREFBeUI7O0lBQ3pCLG9EQUE0Qjs7SUFFNUIsd0NBQW9DOztJQUNwQyx1Q0FBaUQ7O0lBQ2pELHNDQUFjOztJQUNkLGtDQUFrQzs7SUFFbEMsd0NBQWtCOztJQUNsQiw0Q0FBdUI7O0lBRXZCLHdDQUFvQjs7SUFFcEIsMkNBQWtDOztJQUVsQywrQ0FBc0Q7O0lBQ3RELDZDQUFxRDs7SUFFckQsMENBQTZCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcclxuICBDb21wb25lbnQsXHJcbiAgT25Jbml0LFxyXG4gIElucHV0LFxyXG4gIE9uRGVzdHJveSxcclxuICBWaWV3Q2hpbGQsXHJcbiAgT3V0cHV0LFxyXG4gIEV2ZW50RW1pdHRlclxyXG59IGZyb20gXCJAYW5ndWxhci9jb3JlXCI7XHJcbmltcG9ydCB7IE1hdFRhYmxlRGF0YVNvdXJjZSwgTWF0UGFnaW5hdG9yLCBNYXRTb3J0IH0gZnJvbSBcIkBhbmd1bGFyL21hdGVyaWFsXCI7XHJcbmltcG9ydCB7IE9ic2VydmFibGUsIFN1YmplY3QgfSBmcm9tIFwicnhqc1wiO1xyXG5pbXBvcnQgeyBGb3JtQ29udHJvbCB9IGZyb20gXCJAYW5ndWxhci9mb3Jtc1wiO1xyXG5pbXBvcnQgeyBTZWxlY3Rpb25Nb2RlbCB9IGZyb20gXCJAYW5ndWxhci9jZGsvY29sbGVjdGlvbnNcIjtcclxuaW1wb3J0IHsgZmlsdGVyLCB0YWtlVW50aWwgfSBmcm9tIFwicnhqcy9vcGVyYXRvcnNcIjtcclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgQXV0b1RhYmxlQ29uZmlnPFQ+IHtcclxuICBkYXRhJDogT2JzZXJ2YWJsZTxUW10+O1xyXG4gIGRlYnVnPzogYm9vbGVhbjtcclxuICBmaWxlbmFtZT86IHN0cmluZztcclxuICBhY3Rpb25zPzogQWN0aW9uRGVmaW5pdGlvbjxUPltdO1xyXG4gIGFjdGlvbnNCdWxrPzogQWN0aW9uRGVmaW5pdGlvbkJ1bGs8VD5bXTtcclxuICBidWxrU2VsZWN0TWF4Q291bnQ/OiBudW1iZXI7XHJcbiAgb25TZWxlY3RJdGVtPzogKHJvdzogVCkgPT4gdm9pZDtcclxuICBvblNlbGVjdEl0ZW1Eb3VibGVDbGljaz86IChyb3c6IFQpID0+IHZvaWQ7XHJcbiAgY2xlYXJTZWxlY3RlZD86IE9ic2VydmFibGU8dm9pZD47XHJcbiAgaW5pdGlhbFNvcnQ/OiBzdHJpbmc7XHJcbiAgaW5pdGlhbFNvcnREaXI/OiBcImFzY1wiIHwgXCJkZXNjXCI7XHJcbiAgcGFnZVNpemU/OiBudW1iZXI7XHJcbiAgaGlkZUZpZWxkcz86IHN0cmluZ1tdO1xyXG4gIGhpZGVGaWx0ZXI/OiBib29sZWFuO1xyXG4gIGhpZGVIZWFkZXI/OiBib29sZWFuO1xyXG4gIGhpZGVDaG9vc2VDb2x1bW5zPzogYm9vbGVhbjtcclxuICBmaWx0ZXJUZXh0Pzogc3RyaW5nO1xyXG4gIGV4cG9ydEZpbGVuYW1lPzogc3RyaW5nO1xyXG4gIGV4cG9ydFJvd0Zvcm1hdD86IChyb3c6IFQpID0+IHZvaWQ7XHJcbiAgJHRyaWdnZXJTZWxlY3RJdGVtPzogT2JzZXJ2YWJsZTxUPjtcclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBBY3Rpb25EZWZpbml0aW9uPFQ+IHtcclxuICBsYWJlbDogc3RyaW5nO1xyXG4gIGljb24/OiBzdHJpbmc7XHJcbiAgb25DbGljaz86IChyb3c6IFQpID0+IHZvaWQ7XHJcbiAgb25Sb3V0ZXJMaW5rPzogKHJvdzogVCkgPT4gc3RyaW5nO1xyXG4gIHJvdXRlckxpbmtRdWVyeT86IChyb3c6IFQpID0+IHt9O1xyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIEFjdGlvbkRlZmluaXRpb25CdWxrPFQ+IHtcclxuICBsYWJlbDogc3RyaW5nO1xyXG4gIGljb24/OiBzdHJpbmc7XHJcbiAgb25DbGljaz86IChyb3c6IFRbXSkgPT4gdm9pZDtcclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBDb2x1bW5EZWZpbml0aW9uIHtcclxuICBoZWFkZXI/OiBzdHJpbmc7XHJcbiAgdGVtcGxhdGU/OiBhbnk7XHJcbiAgaGlkZT86IGJvb2xlYW47XHJcbiAgZm9yY2VXcmFwPzogYm9vbGVhbjtcclxufVxyXG5cclxuaW50ZXJmYWNlIENvbHVtbkRlZmluaXRpb25JbnRlcm5hbCBleHRlbmRzIENvbHVtbkRlZmluaXRpb24ge1xyXG4gIGZpZWxkOiBzdHJpbmc7XHJcbn1cclxuXHJcbkBDb21wb25lbnQoe1xyXG4gIHNlbGVjdG9yOiBcIm5neC1hdXRvLXRhYmxlXCIsXHJcbiAgdGVtcGxhdGVVcmw6IFwiLi9uZ3gtYXV0by10YWJsZS5jb21wb25lbnQuaHRtbFwiLFxyXG4gIHN0eWxlVXJsczogW1wiLi9uZ3gtYXV0by10YWJsZS5jb21wb25lbnQuc2Nzc1wiXVxyXG59KVxyXG5leHBvcnQgY2xhc3MgQXV0b1RhYmxlQ29tcG9uZW50PFQ+IGltcGxlbWVudHMgT25Jbml0LCBPbkRlc3Ryb3kge1xyXG4gIEBPdXRwdXQoKVxyXG4gIHNlbGVjdGVkQnVsayA9IG5ldyBFdmVudEVtaXR0ZXI8VFtdPigpO1xyXG4gIEBJbnB1dCgpXHJcbiAgY29uZmlnOiBBdXRvVGFibGVDb25maWc8VD47XHJcbiAgQElucHV0KClcclxuICBjb2x1bW5EZWZpbml0aW9uczoge1xyXG4gICAgW2ZpZWxkOiBzdHJpbmddOiBDb2x1bW5EZWZpbml0aW9uO1xyXG4gIH0gPSB7fTtcclxuICBjb2x1bW5EZWZpbml0aW9uc0FsbDoge1xyXG4gICAgW2ZpZWxkOiBzdHJpbmddOiBDb2x1bW5EZWZpbml0aW9uO1xyXG4gIH0gPSB7fTtcclxuICBjb2x1bW5EZWZpbml0aW9uc0FsbEFycmF5OiBDb2x1bW5EZWZpbml0aW9uSW50ZXJuYWxbXSA9IFtdO1xyXG5cclxuICBoZWFkZXJLZXlzQWxsID0gW107XHJcbiAgaGVhZGVyS2V5c0FsbFZpc2libGUgPSBbXTtcclxuICBoZWFkZXJLZXlzRGlzcGxheWVkID0gW107XHJcbiAgaGVhZGVyS2V5c0Rpc3BsYXllZE1hcCA9IHt9O1xyXG5cclxuICBkYXRhU291cmNlOiBNYXRUYWJsZURhdGFTb3VyY2U8YW55PjtcclxuICBAVmlld0NoaWxkKE1hdFBhZ2luYXRvcikgcGFnaW5hdG9yOiBNYXRQYWdpbmF0b3I7XHJcbiAgcGFnZVNpemUgPSAyNTtcclxuICBAVmlld0NoaWxkKE1hdFNvcnQpIHNvcnQ6IE1hdFNvcnQ7XHJcblxyXG4gIGV4cG9ydERhdGE6IGFueVtdO1xyXG4gIGV4cG9ydEZpbGVuYW1lOiBzdHJpbmc7XHJcblxyXG4gIGhhc05vSXRlbXM6IGJvb2xlYW47XHJcblxyXG4gIGZpbHRlckNvbnRyb2wgPSBuZXcgRm9ybUNvbnRyb2woKTtcclxuICAvLyBCdWxrIGl0ZW1zIHNlbGVjdGlvblxyXG4gIHNlbGVjdGlvbk11bHRpcGxlID0gbmV3IFNlbGVjdGlvbk1vZGVsPGFueT4odHJ1ZSwgW10pO1xyXG4gIHNlbGVjdGlvblNpbmdsZSA9IG5ldyBTZWxlY3Rpb25Nb2RlbDxhbnk+KGZhbHNlLCBbXSk7XHJcblxyXG4gICRvbkRlc3Ryb3llZCA9IG5ldyBTdWJqZWN0KCk7XHJcblxyXG4gIG5nT25Jbml0KCkge1xyXG4gICAgdGhpcy5jb25maWcuZGF0YSRcclxuICAgICAgLnBpcGUoZmlsdGVyKGUgPT4gISFlKSlcclxuICAgICAgLnBpcGUodGFrZVVudGlsKHRoaXMuJG9uRGVzdHJveWVkKSlcclxuICAgICAgLnN1YnNjcmliZShvcmlnaW5hbERhdGEgPT4ge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKFwibmd4LWF1dG8tdGFibGUsIHN1YnNjcmliZWQ6IFwiLCB7IG9yaWdpbmFsRGF0YSB9KTtcclxuICAgICAgICB0aGlzLmRhdGFTb3VyY2UgPSBuZXcgTWF0VGFibGVEYXRhU291cmNlKG9yaWdpbmFsRGF0YSk7XHJcbiAgICAgICAgdGhpcy5kYXRhU291cmNlLnBhZ2luYXRvciA9IHRoaXMucGFnaW5hdG9yO1xyXG4gICAgICAgIHRoaXMuZGF0YVNvdXJjZS5zb3J0ID0gdGhpcy5zb3J0O1xyXG4gICAgICAgIGlmIChvcmlnaW5hbERhdGEgJiYgIW9yaWdpbmFsRGF0YS5sZW5ndGgpIHtcclxuICAgICAgICAgIHRoaXMuaGFzTm9JdGVtcyA9IHRydWU7XHJcbiAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHRoaXMuaGFzTm9JdGVtcyA9IGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodGhpcy5jb25maWcucGFnZVNpemUpIHtcclxuICAgICAgICAgIHRoaXMucGFnZVNpemUgPSB0aGlzLmNvbmZpZy5wYWdlU2l6ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgY29uc3QgZmlyc3REYXRhSXRlbSA9IG9yaWdpbmFsRGF0YVswXTtcclxuICAgICAgICB0aGlzLmluaXREaXNwbGF5ZWRDb2x1bW5zKGZpcnN0RGF0YUl0ZW0pO1xyXG4gICAgICAgIHRoaXMuaW5pdEV4cG9ydChvcmlnaW5hbERhdGEpO1xyXG4gICAgICAgIHRoaXMuaW5pdEZpbHRlcihvcmlnaW5hbERhdGEpO1xyXG4gICAgICB9KTtcclxuXHJcbiAgICBpZiAodGhpcy5jb25maWcuJHRyaWdnZXJTZWxlY3RJdGVtKSB7XHJcbiAgICAgIHRoaXMuY29uZmlnLiR0cmlnZ2VyU2VsZWN0SXRlbVxyXG4gICAgICAgIC5waXBlKHRha2VVbnRpbCh0aGlzLiRvbkRlc3Ryb3llZCkpXHJcbiAgICAgICAgLnN1YnNjcmliZShpdGVtID0+IHtcclxuICAgICAgICAgIHRoaXMubG9nKFwiJHRyaWdnZXJTZWxlY3RJdGVtXCIsIGl0ZW0pO1xyXG4gICAgICAgICAgY29uc3Qgc3RyID0gSlNPTi5zdHJpbmdpZnkoaXRlbSk7XHJcbiAgICAgICAgICBjb25zdCBmb3VuZEl0ZW0gPSB0aGlzLmRhdGFTb3VyY2UuZGF0YS5maW5kKFxyXG4gICAgICAgICAgICByb3cgPT4gSlNPTi5zdHJpbmdpZnkocm93KSA9PT0gc3RyXHJcbiAgICAgICAgICApO1xyXG4gICAgICAgICAgaWYgKGZvdW5kSXRlbSkge1xyXG4gICAgICAgICAgICB0aGlzLnNlbGVjdGlvblNpbmdsZS5zZWxlY3QoZm91bmRJdGVtKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAodGhpcy5jb25maWcuY2xlYXJTZWxlY3RlZCkge1xyXG4gICAgICB0aGlzLmNvbmZpZy5jbGVhclNlbGVjdGVkXHJcbiAgICAgICAgLnBpcGUodGFrZVVudGlsKHRoaXMuJG9uRGVzdHJveWVkKSlcclxuICAgICAgICAuc3Vic2NyaWJlKCgpID0+IHtcclxuICAgICAgICAgIHRoaXMubG9nKFwiY2xlYXJTZWxlY3RlZFwiKTtcclxuICAgICAgICAgIHRoaXMuc2VsZWN0aW9uTXVsdGlwbGUuY2xlYXIoKTtcclxuICAgICAgICAgIHRoaXMuc2VsZWN0aW9uU2luZ2xlLmNsZWFyKCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBuZ09uRGVzdHJveSgpIHtcclxuICAgIHRoaXMuJG9uRGVzdHJveWVkLm5leHQoKTtcclxuICAgIHRoaXMuJG9uRGVzdHJveWVkLmNvbXBsZXRlKCk7XHJcbiAgfVxyXG5cclxuICBhcHBseUZpbHRlcihmaWx0ZXJWYWx1ZTogc3RyaW5nKSB7XHJcbiAgICB0aGlzLmRhdGFTb3VyY2UuZmlsdGVyID0gZmlsdGVyVmFsdWUudHJpbSgpLnRvTG93ZXJDYXNlKCk7XHJcbiAgICB0aGlzLnNlbGVjdGlvbk11bHRpcGxlLmNsZWFyKCk7XHJcbiAgICB0aGlzLnNlbGVjdGlvblNpbmdsZS5jbGVhcigpO1xyXG4gIH1cclxuXHJcbiAgaW5pdEZpbHRlcihvcmlnaW5hbERhdGE6IFRbXSkge1xyXG4gICAgaWYgKCFvcmlnaW5hbERhdGEubGVuZ3RoKSB7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuICAgIGNvbnN0IGZpcnN0Um93ID0gb3JpZ2luYWxEYXRhWzBdO1xyXG4gICAgY29uc3Qga2V5c0RhdGEgPSBuZXcgU2V0KE9iamVjdC5rZXlzKGZpcnN0Um93KSk7XHJcbiAgICBjb25zdCBrZXlzSGVhZGVyID0gbmV3IFNldCh0aGlzLmhlYWRlcktleXNEaXNwbGF5ZWQpO1xyXG4gICAga2V5c0hlYWRlci5kZWxldGUoXCJfX2J1bGtcIik7XHJcbiAgICBrZXlzSGVhZGVyLmRlbGV0ZShcIl9fc3RhclwiKTtcclxuICAgIGNvbnN0IGFsbEZpZWxkc0V4aXN0ID0gQXJyYXkuZnJvbShrZXlzSGVhZGVyKS5yZWR1Y2UoKGFjYywgY3VyKSA9PiB7XHJcbiAgICAgIHJldHVybiBrZXlzRGF0YS5oYXMoY3VyKSAmJiBhY2M7XHJcbiAgICB9LCB0cnVlKTtcclxuXHJcbiAgICB0aGlzLmxvZyhcImluaXRGaWx0ZXIoKVwiLCB7XHJcbiAgICAgIHJvd0ZpZWxkczoga2V5c0RhdGEsXHJcbiAgICAgIGFsbEZpZWxkc0V4aXN0LFxyXG4gICAgICBoZWFkZXJLZXlzRGlzcGxheWVkOiB0aGlzLmhlYWRlcktleXNEaXNwbGF5ZWRcclxuICAgIH0pO1xyXG4gICAgdGhpcy5kYXRhU291cmNlLmZpbHRlclByZWRpY2F0ZSA9IChkYXRhOiBULCBmaWx0ZXJUZXh0OiBzdHJpbmcpID0+IHtcclxuICAgICAgaWYgKCFmaWx0ZXJUZXh0KSB7XHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgIH1cclxuICAgICAgaWYgKCFhbGxGaWVsZHNFeGlzdCkge1xyXG4gICAgICAgIGNvbnN0IGxvd2VyID0gSlNPTi5zdHJpbmdpZnkoZGF0YSkudG9Mb3dlckNhc2UoKTtcclxuICAgICAgICByZXR1cm4gbG93ZXIuaW5jbHVkZXMoZmlsdGVyVGV4dCk7XHJcbiAgICAgIH1cclxuICAgICAgZm9yIChjb25zdCBrZXkgb2YgQXJyYXkuZnJvbShrZXlzSGVhZGVyKSkge1xyXG4gICAgICAgIGNvbnN0IGRhdGFWYWwgPSBkYXRhW2tleV07XHJcbiAgICAgICAgY29uc3Qgc3RyID0gSlNPTi5zdHJpbmdpZnkoZGF0YVZhbCk7XHJcbiAgICAgICAgY29uc3QgaXNGb3VuZCA9IHN0ci50b0xvd2VyQ2FzZSgpLmluY2x1ZGVzKGZpbHRlclRleHQpO1xyXG4gICAgICAgIGlmIChpc0ZvdW5kKSB7XHJcbiAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH07XHJcbiAgfVxyXG5cclxuICBpbml0RXhwb3J0KG9yaWdpbmFsRGF0YTogVFtdKSB7XHJcbiAgICB0aGlzLmV4cG9ydEZpbGVuYW1lID0gdGhpcy5jb25maWcuZXhwb3J0RmlsZW5hbWU7XHJcbiAgICBpZiAoIXRoaXMuZXhwb3J0RmlsZW5hbWUpIHtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG4gICAgdGhpcy5leHBvcnREYXRhID0gb3JpZ2luYWxEYXRhLm1hcChkYXRhSXRlbSA9PiB7XHJcbiAgICAgIGlmICghdGhpcy5jb25maWcuZXhwb3J0Um93Rm9ybWF0KSB7XHJcbiAgICAgICAgcmV0dXJuIGRhdGFJdGVtO1xyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiB0aGlzLmNvbmZpZy5leHBvcnRSb3dGb3JtYXQoZGF0YUl0ZW0pO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgZ2V0S2V5SGVhZGVyKGtleTogc3RyaW5nKSB7XHJcbiAgICBjb25zdCBpbnB1dERlZiA9IHRoaXMuY29sdW1uRGVmaW5pdGlvbnNba2V5XTtcclxuICAgIGlmIChpbnB1dERlZiAmJiBpbnB1dERlZi5oZWFkZXIgIT0gbnVsbCkge1xyXG4gICAgICByZXR1cm4gaW5wdXREZWYuaGVhZGVyO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHRoaXMudG9UaXRsZUNhc2Uoa2V5KTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgdG9UaXRsZUNhc2Uoc3RyKSB7XHJcbiAgICByZXR1cm4gc3RyLnJlcGxhY2UoXCJfXCIsIFwiIFwiKS5yZXBsYWNlKC9cXHdcXFMqL2csIGZ1bmN0aW9uKHR4dCkge1xyXG4gICAgICByZXR1cm4gdHh0LmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgdHh0LnN1YnN0cigxKS50b0xvd2VyQ2FzZSgpO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBpbml0RGlzcGxheWVkQ29sdW1ucyhmaXJzdERhdGFJdGVtOiBUKSB7XHJcbiAgICB0aGlzLmluaXRDb2x1bW5EZWZpbml0aW9ucyhmaXJzdERhdGFJdGVtKTtcclxuXHJcbiAgICB0aGlzLmhlYWRlcktleXNBbGwgPSBPYmplY3Qua2V5cyh0aGlzLmNvbHVtbkRlZmluaXRpb25zQWxsKTtcclxuICAgIHRoaXMuaGVhZGVyS2V5c0FsbFZpc2libGUgPSB0aGlzLmhlYWRlcktleXNBbGw7XHJcbiAgICBpZiAodGhpcy5jb25maWcuaGlkZUZpZWxkcykge1xyXG4gICAgICAvLyBIaWRlIGZpZWxkcyBpZiBzcGVjaWZpZWRcclxuICAgICAgY29uc3QgaGlkZUZpZWxkcyA9IG5ldyBTZXQodGhpcy5jb25maWcuaGlkZUZpZWxkcyk7XHJcbiAgICAgIHRoaXMuaGVhZGVyS2V5c0FsbFZpc2libGUgPSB0aGlzLmhlYWRlcktleXNBbGwuZmlsdGVyKFxyXG4gICAgICAgIHggPT4gIWhpZGVGaWVsZHMuaGFzKHgpXHJcbiAgICAgICk7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgZGlzcGxheWVkID0gdGhpcy5jb2x1bW5EZWZpbml0aW9uc0FsbEFycmF5XHJcbiAgICAgIC5maWx0ZXIoZGVmID0+ICFkZWYuaGlkZSlcclxuICAgICAgLm1hcChkID0+IGQuZmllbGQpO1xyXG5cclxuICAgIHRoaXMuc2V0RGlzcGxheWVkQ29sdW1ucyhkaXNwbGF5ZWQpO1xyXG4gICAgLy8gU2V0IGN1cnJlbnRseSBlbmFibGVkIGl0ZW1zXHJcbiAgICB0aGlzLmZpbHRlckNvbnRyb2wuc2V0VmFsdWUodGhpcy5oZWFkZXJLZXlzRGlzcGxheWVkKTtcclxuICB9XHJcblxyXG4gIGluaXRDb2x1bW5EZWZpbml0aW9ucyhmaXJzdERhdGFJdGVtOiBUKSB7XHJcbiAgICAvLyBTZXQgYWxsIGNvbHVtbiBkZWZpbnRpb25zLCB3aGljaCB3ZXJlIGV4cGxpY2l0bHkgc2V0IGluIGNvbmZpZ1xyXG4gICAgY29uc3QgaW5wdXREZWZpbnRpb25GaWVsZHMgPSBPYmplY3Qua2V5cyh0aGlzLmNvbHVtbkRlZmluaXRpb25zKTtcclxuICAgIGlucHV0RGVmaW50aW9uRmllbGRzLmZvckVhY2goKGZpZWxkOiBzdHJpbmcpID0+IHtcclxuICAgICAgY29uc3QgaW5wdXREZWZpbnRpb24gPSB0aGlzLmNvbHVtbkRlZmluaXRpb25zW2ZpZWxkXTtcclxuICAgICAgdGhpcy5jb2x1bW5EZWZpbml0aW9uc0FsbFtmaWVsZF0gPSB7XHJcbiAgICAgICAgaGVhZGVyOiB0aGlzLmdldEtleUhlYWRlcihmaWVsZCksXHJcbiAgICAgICAgdGVtcGxhdGU6IGlucHV0RGVmaW50aW9uLnRlbXBsYXRlLFxyXG4gICAgICAgIGhpZGU6IGlucHV0RGVmaW50aW9uLmhpZGUsXHJcbiAgICAgICAgZm9yY2VXcmFwOiBpbnB1dERlZmludGlvbi5mb3JjZVdyYXBcclxuICAgICAgfTtcclxuICAgIH0pO1xyXG5cclxuICAgIC8vIFNldCBhbGwgY29sdW1uIGRlZmludGlvbnMgcmVhZCBmcm9tIHRoZSBcImlucHV0IGRhdGFcIlxyXG4gICAgY29uc3QgaW5wdXREYXRhS2V5cyA9IE9iamVjdC5rZXlzKGZpcnN0RGF0YUl0ZW0pO1xyXG4gICAgaW5wdXREYXRhS2V5cy5mb3JFYWNoKChmaWVsZDogc3RyaW5nKSA9PiB7XHJcbiAgICAgIGlmICghIXRoaXMuY29sdW1uRGVmaW5pdGlvbnNBbGxbZmllbGRdKSB7XHJcbiAgICAgICAgLy8gc2tpcCBpZiBkZWZpbml0aW9uIGV4aXN0c1xyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgfVxyXG4gICAgICB0aGlzLmNvbHVtbkRlZmluaXRpb25zQWxsW2ZpZWxkXSA9IHtcclxuICAgICAgICBoZWFkZXI6IHRoaXMudG9UaXRsZUNhc2UoZmllbGQpLFxyXG4gICAgICAgIGhpZGU6IHRydWVcclxuICAgICAgfTtcclxuICAgIH0pO1xyXG5cclxuICAgIHRoaXMuY29sdW1uRGVmaW5pdGlvbnNBbGxBcnJheSA9IE9iamVjdC5rZXlzKHRoaXMuY29sdW1uRGVmaW5pdGlvbnNBbGwpLm1hcChcclxuICAgICAgayA9PiB7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgIC4uLnRoaXMuY29sdW1uRGVmaW5pdGlvbnNBbGxba10sXHJcbiAgICAgICAgICBmaWVsZDoga1xyXG4gICAgICAgIH07XHJcbiAgICAgIH1cclxuICAgICk7XHJcbiAgICB0aGlzLmxvZyhcImluaXRDb2x1bW5EZWZpbml0aW9uc1wiLCB7XHJcbiAgICAgIGZpcnN0RGF0YUl0ZW0sXHJcbiAgICAgIGlucHV0RGVmaW50aW9uRmllbGRzXHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIC8vIFNldHMgdGhlIGRpc3BsYXllZCBjb2x1bW5zIGZyb20gYSBzZXQgb2YgZmllbGRuYW1lc1xyXG4gIHNldERpc3BsYXllZENvbHVtbnMoc2VsZWN0ZWQ6IHN0cmluZ1tdKSB7XHJcbiAgICAvLyBJbml0aWFsaXplIGFsbCBrZXlzIGFzIGZhbHNlXHJcbiAgICB0aGlzLmhlYWRlcktleXNBbGxWaXNpYmxlLmZvckVhY2goXHJcbiAgICAgIGsgPT4gKHRoaXMuaGVhZGVyS2V5c0Rpc3BsYXllZE1hcFtrXSA9IGZhbHNlKVxyXG4gICAgKTtcclxuICAgIC8vIFNldCBzZWxlY3RlZCBhcyB0cnVlXHJcbiAgICBzZWxlY3RlZC5mb3JFYWNoKGMgPT4gKHRoaXMuaGVhZGVyS2V5c0Rpc3BsYXllZE1hcFtjXSA9IHRydWUpKTtcclxuICAgIHRoaXMuaGVhZGVyS2V5c0Rpc3BsYXllZCA9IE9iamVjdC5rZXlzKHRoaXMuaGVhZGVyS2V5c0Rpc3BsYXllZE1hcCkuZmlsdGVyKFxyXG4gICAgICBrID0+IHRoaXMuaGVhZGVyS2V5c0Rpc3BsYXllZE1hcFtrXVxyXG4gICAgKTtcclxuICAgIC8vIEFkZCBidWxrIHNlbGVjdCBjb2x1bW4gYXQgc3RhcnRcclxuICAgIGlmICh0aGlzLmNvbmZpZy5hY3Rpb25zQnVsaykge1xyXG4gICAgICB0aGlzLmhlYWRlcktleXNEaXNwbGF5ZWQudW5zaGlmdChcIl9fYnVsa1wiKTtcclxuICAgIH1cclxuICAgIC8vIEFkZCBhY3Rpb25zIGNvbHVtbiBhdCBlbmRcclxuICAgIGlmICh0aGlzLmNvbmZpZy5hY3Rpb25zKSB7XHJcbiAgICAgIHRoaXMuaGVhZGVyS2V5c0Rpc3BsYXllZC5wdXNoKFwiX19zdGFyXCIpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLyoqIFdoZXRoZXIgdGhlIG51bWJlciBvZiBzZWxlY3RlZCBlbGVtZW50cyBtYXRjaGVzIHRoZSB0b3RhbCBudW1iZXIgb2Ygcm93cy4gKi9cclxuICBpc0FsbFNlbGVjdGVkKCkge1xyXG4gICAgY29uc3QgbnVtU2VsZWN0ZWQgPSB0aGlzLnNlbGVjdGlvbk11bHRpcGxlLnNlbGVjdGVkLmxlbmd0aDtcclxuICAgIGNvbnN0IG51bVJvd3MgPVxyXG4gICAgICB0aGlzLmNvbmZpZy5idWxrU2VsZWN0TWF4Q291bnQgfHwgdGhpcy5kYXRhU291cmNlLmZpbHRlcmVkRGF0YS5sZW5ndGg7XHJcbiAgICByZXR1cm4gbnVtU2VsZWN0ZWQgPj0gbnVtUm93cztcclxuICB9XHJcblxyXG4gIC8qKiBTZWxlY3RzIGFsbCByb3dzIGlmIHRoZXkgYXJlIG5vdCBhbGwgc2VsZWN0ZWQ7IG90aGVyd2lzZSBjbGVhciBzZWxlY3Rpb24uICovXHJcbiAgbWFzdGVyVG9nZ2xlKCkge1xyXG4gICAgdGhpcy5pc0FsbFNlbGVjdGVkKCkgPyB0aGlzLnNlbGVjdGlvbk11bHRpcGxlLmNsZWFyKCkgOiB0aGlzLnNlbGVjdEFsbCgpO1xyXG4gICAgdGhpcy5zZWxlY3RlZEJ1bGsuZW1pdCh0aGlzLnNlbGVjdGlvbk11bHRpcGxlLnNlbGVjdGVkKTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgc2VsZWN0QWxsKCkge1xyXG4gICAgdGhpcy5kYXRhU291cmNlLnNvcnREYXRhKFxyXG4gICAgICB0aGlzLmRhdGFTb3VyY2UuZmlsdGVyZWREYXRhLFxyXG4gICAgICB0aGlzLmRhdGFTb3VyY2Uuc29ydFxyXG4gICAgKTtcclxuICAgIGxldCBjdXRBcnJheSA9IHRoaXMuZGF0YVNvdXJjZS5maWx0ZXJlZERhdGE7XHJcbiAgICBpZiAodGhpcy5jb25maWcuYnVsa1NlbGVjdE1heENvdW50KSB7XHJcbiAgICAgIGN1dEFycmF5ID0gdGhpcy5kYXRhU291cmNlLmZpbHRlcmVkRGF0YS5zbGljZShcclxuICAgICAgICAwLFxyXG4gICAgICAgIHRoaXMuY29uZmlnLmJ1bGtTZWxlY3RNYXhDb3VudFxyXG4gICAgICApO1xyXG4gICAgfVxyXG4gICAgY3V0QXJyYXkuZm9yRWFjaChyb3cgPT4ge1xyXG4gICAgICB0aGlzLnNlbGVjdGlvbk11bHRpcGxlLnNlbGVjdChyb3cpO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBpc01heFJlYWNoZWQoKSB7XHJcbiAgICBpZiAoIXRoaXMuY29uZmlnLmJ1bGtTZWxlY3RNYXhDb3VudCkge1xyXG4gICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gKFxyXG4gICAgICB0aGlzLnNlbGVjdGlvbk11bHRpcGxlLnNlbGVjdGVkLmxlbmd0aCA+PSB0aGlzLmNvbmZpZy5idWxrU2VsZWN0TWF4Q291bnRcclxuICAgICk7XHJcbiAgfVxyXG5cclxuICBvbkNvbHVtbkZpbHRlckNoYW5nZSgkZXZlbnQpIHtcclxuICAgIGNvbnNvbGUubG9nKHsgJGV2ZW50IH0pO1xyXG4gICAgY29uc3Qgc2VsZWN0ZWRWYWx1ZXMgPSB0aGlzLmZpbHRlckNvbnRyb2wudmFsdWU7XHJcbiAgICB0aGlzLnNldERpc3BsYXllZENvbHVtbnMoc2VsZWN0ZWRWYWx1ZXMpO1xyXG4gICAgdGhpcy5pbml0RmlsdGVyKHRoaXMuZGF0YVNvdXJjZS5kYXRhKTtcclxuICB9XHJcblxyXG4gIG9uQ2xpY2tCdWxrSXRlbSgkZXZlbnQsIGl0ZW0pIHtcclxuICAgIGlmICgkZXZlbnQpIHtcclxuICAgICAgY29uc3QgaXNTZWxlY3RlZCA9IHRoaXMuc2VsZWN0aW9uTXVsdGlwbGUuaXNTZWxlY3RlZChpdGVtKTtcclxuICAgICAgaWYgKCF0aGlzLmlzTWF4UmVhY2hlZCgpKSB7XHJcbiAgICAgICAgdGhpcy5zZWxlY3Rpb25NdWx0aXBsZS50b2dnbGUoaXRlbSk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgaWYgKGlzU2VsZWN0ZWQpIHtcclxuICAgICAgICAgIHRoaXMuc2VsZWN0aW9uTXVsdGlwbGUuZGVzZWxlY3QoaXRlbSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHRoaXMud2FybigpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgICB0aGlzLnNlbGVjdGVkQnVsay5lbWl0KHRoaXMuc2VsZWN0aW9uTXVsdGlwbGUuc2VsZWN0ZWQpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgb25DbGlja1JvdygkZXZlbnQsIHJvdzogVCkge1xyXG4gICAgaWYgKHRoaXMuY29uZmlnLm9uU2VsZWN0SXRlbSkge1xyXG4gICAgICB0aGlzLmxvZyhcIm9uQ2xpY2tSb3coKVwiLCB7ICRldmVudCwgcm93IH0pO1xyXG4gICAgICB0aGlzLnNlbGVjdGlvblNpbmdsZS5zZWxlY3Qocm93KTtcclxuICAgICAgdGhpcy5jb25maWcub25TZWxlY3RJdGVtKHJvdyk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBvbkRvdWJsZUNsaWNrUm93KCRldmVudCwgcm93OiBUKSB7XHJcbiAgICBpZiAodGhpcy5jb25maWcub25TZWxlY3RJdGVtRG91YmxlQ2xpY2spIHtcclxuICAgICAgdGhpcy5sb2coXCJvbkRvdWJsZUNsaWNrUm93KClcIiwgeyAkZXZlbnQsIHJvdyB9KTtcclxuICAgICAgdGhpcy5zZWxlY3Rpb25TaW5nbGUuc2VsZWN0KHJvdyk7XHJcbiAgICAgIHRoaXMuY29uZmlnLm9uU2VsZWN0SXRlbURvdWJsZUNsaWNrKHJvdyk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBhc3luYyBvbkNsaWNrQnVsa0FjdGlvbihhY3Rpb246IEFjdGlvbkRlZmluaXRpb25CdWxrPFQ+KSB7XHJcbiAgICBhd2FpdCBhY3Rpb24ub25DbGljayh0aGlzLnNlbGVjdGlvbk11bHRpcGxlLnNlbGVjdGVkKTtcclxuICAgIHRoaXMuc2VsZWN0aW9uTXVsdGlwbGUuY2xlYXIoKTtcclxuICB9XHJcblxyXG4gIGxvZyhzdHI6IHN0cmluZywgb2JqPzogYW55KSB7XHJcbiAgICBpZiAodGhpcy5jb25maWcuZGVidWcpIHtcclxuICAgICAgY29uc29sZS5sb2coXCI8bmd4LWF1dG8tdGFibGU+IDogXCIgKyBzdHIsIG9iaik7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICB3YXJuKCkge31cclxufVxyXG4iXX0=