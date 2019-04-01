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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LWF1dG8tdGFibGUuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vbmd4LWF1dG8tdGFibGUvIiwic291cmNlcyI6WyJsaWIvbmd4LWF1dG8tdGFibGUuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsT0FBTyxFQUNMLFNBQVMsRUFFVCxLQUFLLEVBRUwsU0FBUyxFQUNULE1BQU0sRUFDTixZQUFZLEVBQ2IsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFFLGtCQUFrQixFQUFFLFlBQVksRUFBRSxPQUFPLEVBQUUsTUFBTSxtQkFBbUIsQ0FBQztBQUM5RSxPQUFPLEVBQWMsT0FBTyxFQUFFLE1BQU0sTUFBTSxDQUFDO0FBQzNDLE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUM3QyxPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sMEJBQTBCLENBQUM7QUFDMUQsT0FBTyxFQUFFLE1BQU0sRUFBRSxTQUFTLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQzs7Ozs7QUFFbkQscUNBcUJDOzs7SUFwQkMsZ0NBQXVCOztJQUN2QixnQ0FBZ0I7O0lBQ2hCLG1DQUFrQjs7SUFDbEIsa0NBQWdDOztJQUNoQyxzQ0FBd0M7O0lBQ3hDLDZDQUE0Qjs7SUFDNUIsdUNBQWdDOztJQUNoQyxrREFBMkM7O0lBQzNDLHdDQUFpQzs7SUFDakMsc0NBQXFCOztJQUNyQix5Q0FBZ0M7O0lBQ2hDLG1DQUFrQjs7SUFDbEIscUNBQXNCOztJQUN0QixxQ0FBcUI7O0lBQ3JCLHFDQUFxQjs7SUFDckIsNENBQTRCOztJQUM1QixxQ0FBb0I7O0lBQ3BCLHlDQUF3Qjs7SUFDeEIsMENBQW1DOztJQUNuQyw2Q0FBbUM7Ozs7OztBQUdyQyxzQ0FNQzs7O0lBTEMsaUNBQWM7O0lBQ2QsZ0NBQWM7O0lBQ2QsbUNBQTJCOztJQUMzQix3Q0FBa0M7O0lBQ2xDLDJDQUFpQzs7Ozs7O0FBR25DLDBDQUlDOzs7SUFIQyxxQ0FBYzs7SUFD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QUcsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1NBQy9DO0lBQ0gsQ0FBQzs7OztJQUVELGlDQUFJOzs7SUFBSixjQUFRLENBQUM7O2dCQW5WVixTQUFTLFNBQUM7b0JBQ1QsUUFBUSxFQUFFLGdCQUFnQjtvQkFDMUIsb3hOQUE4Qzs7aUJBRS9DOzs7K0JBRUUsTUFBTTt5QkFFTixLQUFLO29DQUVMLEtBQUs7NEJBZUwsU0FBUyxTQUFDLFlBQVk7dUJBRXRCLFNBQVMsU0FBQyxPQUFPOztJQXlUcEIseUJBQUM7Q0FBQSxBQXBWRCxJQW9WQztTQS9VWSxrQkFBa0I7OztJQUM3QiwwQ0FDdUM7O0lBQ3ZDLG9DQUMyQjs7SUFDM0IsK0NBR087O0lBQ1Asa0RBRU87O0lBQ1AsdURBQTJEOztJQUUzRCwyQ0FBbUI7O0lBQ25CLGtEQUEwQjs7SUFDMUIsaURBQXlCOztJQUN6QixvREFBNEI7O0lBRTVCLHdDQUFvQzs7SUFDcEMsdUNBQWlEOztJQUNqRCxzQ0FBYzs7SUFDZCxrQ0FBa0M7O0lBRWxDLHdDQUFrQjs7SUFDbEIsNENBQXVCOztJQUV2Qix3Q0FBb0I7O0lBRXBCLDJDQUFrQzs7SUFFbEMsK0NBQXNEOztJQUN0RCw2Q0FBcUQ7O0lBRXJELDBDQUE2QiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XHJcbiAgQ29tcG9uZW50LFxyXG4gIE9uSW5pdCxcclxuICBJbnB1dCxcclxuICBPbkRlc3Ryb3ksXHJcbiAgVmlld0NoaWxkLFxyXG4gIE91dHB1dCxcclxuICBFdmVudEVtaXR0ZXJcclxufSBmcm9tIFwiQGFuZ3VsYXIvY29yZVwiO1xyXG5pbXBvcnQgeyBNYXRUYWJsZURhdGFTb3VyY2UsIE1hdFBhZ2luYXRvciwgTWF0U29ydCB9IGZyb20gXCJAYW5ndWxhci9tYXRlcmlhbFwiO1xyXG5pbXBvcnQgeyBPYnNlcnZhYmxlLCBTdWJqZWN0IH0gZnJvbSBcInJ4anNcIjtcclxuaW1wb3J0IHsgRm9ybUNvbnRyb2wgfSBmcm9tIFwiQGFuZ3VsYXIvZm9ybXNcIjtcclxuaW1wb3J0IHsgU2VsZWN0aW9uTW9kZWwgfSBmcm9tIFwiQGFuZ3VsYXIvY2RrL2NvbGxlY3Rpb25zXCI7XHJcbmltcG9ydCB7IGZpbHRlciwgdGFrZVVudGlsIH0gZnJvbSBcInJ4anMvb3BlcmF0b3JzXCI7XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIEF1dG9UYWJsZUNvbmZpZzxUPiB7XHJcbiAgZGF0YSQ6IE9ic2VydmFibGU8VFtdPjtcclxuICBkZWJ1Zz86IGJvb2xlYW47XHJcbiAgZmlsZW5hbWU/OiBzdHJpbmc7XHJcbiAgYWN0aW9ucz86IEFjdGlvbkRlZmluaXRpb248VD5bXTtcclxuICBhY3Rpb25zQnVsaz86IEFjdGlvbkRlZmluaXRpb25CdWxrPFQ+W107XHJcbiAgYnVsa1NlbGVjdE1heENvdW50PzogbnVtYmVyO1xyXG4gIG9uU2VsZWN0SXRlbT86IChyb3c6IFQpID0+IHZvaWQ7XHJcbiAgb25TZWxlY3RJdGVtRG91YmxlQ2xpY2s/OiAocm93OiBUKSA9PiB2b2lkO1xyXG4gIGNsZWFyU2VsZWN0ZWQ/OiBPYnNlcnZhYmxlPHZvaWQ+O1xyXG4gIGluaXRpYWxTb3J0Pzogc3RyaW5nO1xyXG4gIGluaXRpYWxTb3J0RGlyPzogXCJhc2NcIiB8IFwiZGVzY1wiO1xyXG4gIHBhZ2VTaXplPzogbnVtYmVyO1xyXG4gIGhpZGVGaWVsZHM/OiBzdHJpbmdbXTtcclxuICBoaWRlRmlsdGVyPzogYm9vbGVhbjtcclxuICBoaWRlSGVhZGVyPzogYm9vbGVhbjtcclxuICBoaWRlQ2hvb3NlQ29sdW1ucz86IGJvb2xlYW47XHJcbiAgZmlsdGVyVGV4dD86IHN0cmluZztcclxuICBleHBvcnRGaWxlbmFtZT86IHN0cmluZztcclxuICBleHBvcnRSb3dGb3JtYXQ/OiAocm93OiBUKSA9PiB2b2lkO1xyXG4gICR0cmlnZ2VyU2VsZWN0SXRlbT86IE9ic2VydmFibGU8VD47XHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgQWN0aW9uRGVmaW5pdGlvbjxUPiB7XHJcbiAgbGFiZWw6IHN0cmluZztcclxuICBpY29uPzogc3RyaW5nO1xyXG4gIG9uQ2xpY2s/OiAocm93OiBUKSA9PiB2b2lkO1xyXG4gIG9uUm91dGVyTGluaz86IChyb3c6IFQpID0+IHN0cmluZztcclxuICByb3V0ZXJMaW5rUXVlcnk/OiAocm93OiBUKSA9PiB7fTtcclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBBY3Rpb25EZWZpbml0aW9uQnVsazxUPiB7XHJcbiAgbGFiZWw6IHN0cmluZztcclxuICBpY29uPzogc3RyaW5nO1xyXG4gIG9uQ2xpY2s/OiAocm93OiBUW10pID0+IHZvaWQ7XHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgQ29sdW1uRGVmaW5pdGlvbiB7XHJcbiAgaGVhZGVyPzogc3RyaW5nO1xyXG4gIHRlbXBsYXRlPzogYW55O1xyXG4gIGhpZGU/OiBib29sZWFuO1xyXG4gIGZvcmNlV3JhcD86IGJvb2xlYW47XHJcbn1cclxuXHJcbmludGVyZmFjZSBDb2x1bW5EZWZpbml0aW9uSW50ZXJuYWwgZXh0ZW5kcyBDb2x1bW5EZWZpbml0aW9uIHtcclxuICBmaWVsZDogc3RyaW5nO1xyXG59XHJcblxyXG5AQ29tcG9uZW50KHtcclxuICBzZWxlY3RvcjogXCJuZ3gtYXV0by10YWJsZVwiLFxyXG4gIHRlbXBsYXRlVXJsOiBcIi4vbmd4LWF1dG8tdGFibGUuY29tcG9uZW50Lmh0bWxcIixcclxuICBzdHlsZVVybHM6IFtcIi4vbmd4LWF1dG8tdGFibGUuY29tcG9uZW50LnNjc3NcIl1cclxufSlcclxuZXhwb3J0IGNsYXNzIEF1dG9UYWJsZUNvbXBvbmVudDxUPiBpbXBsZW1lbnRzIE9uSW5pdCwgT25EZXN0cm95IHtcclxuICBAT3V0cHV0KClcclxuICBzZWxlY3RlZEJ1bGsgPSBuZXcgRXZlbnRFbWl0dGVyPFRbXT4oKTtcclxuICBASW5wdXQoKVxyXG4gIGNvbmZpZzogQXV0b1RhYmxlQ29uZmlnPFQ+O1xyXG4gIEBJbnB1dCgpXHJcbiAgY29sdW1uRGVmaW5pdGlvbnM6IHtcclxuICAgIFtmaWVsZDogc3RyaW5nXTogQ29sdW1uRGVmaW5pdGlvbjtcclxuICB9ID0ge307XHJcbiAgY29sdW1uRGVmaW5pdGlvbnNBbGw6IHtcclxuICAgIFtmaWVsZDogc3RyaW5nXTogQ29sdW1uRGVmaW5pdGlvbjtcclxuICB9ID0ge307XHJcbiAgY29sdW1uRGVmaW5pdGlvbnNBbGxBcnJheTogQ29sdW1uRGVmaW5pdGlvbkludGVybmFsW10gPSBbXTtcclxuXHJcbiAgaGVhZGVyS2V5c0FsbCA9IFtdO1xyXG4gIGhlYWRlcktleXNBbGxWaXNpYmxlID0gW107XHJcbiAgaGVhZGVyS2V5c0Rpc3BsYXllZCA9IFtdO1xyXG4gIGhlYWRlcktleXNEaXNwbGF5ZWRNYXAgPSB7fTtcclxuXHJcbiAgZGF0YVNvdXJjZTogTWF0VGFibGVEYXRhU291cmNlPGFueT47XHJcbiAgQFZpZXdDaGlsZChNYXRQYWdpbmF0b3IpIHBhZ2luYXRvcjogTWF0UGFnaW5hdG9yO1xyXG4gIHBhZ2VTaXplID0gMjU7XHJcbiAgQFZpZXdDaGlsZChNYXRTb3J0KSBzb3J0OiBNYXRTb3J0O1xyXG5cclxuICBleHBvcnREYXRhOiBhbnlbXTtcclxuICBleHBvcnRGaWxlbmFtZTogc3RyaW5nO1xyXG5cclxuICBoYXNOb0l0ZW1zOiBib29sZWFuO1xyXG5cclxuICBmaWx0ZXJDb250cm9sID0gbmV3IEZvcm1Db250cm9sKCk7XHJcbiAgLy8gQnVsayBpdGVtcyBzZWxlY3Rpb25cclxuICBzZWxlY3Rpb25NdWx0aXBsZSA9IG5ldyBTZWxlY3Rpb25Nb2RlbDxhbnk+KHRydWUsIFtdKTtcclxuICBzZWxlY3Rpb25TaW5nbGUgPSBuZXcgU2VsZWN0aW9uTW9kZWw8YW55PihmYWxzZSwgW10pO1xyXG5cclxuICAkb25EZXN0cm95ZWQgPSBuZXcgU3ViamVjdCgpO1xyXG5cclxuICBuZ09uSW5pdCgpIHtcclxuICAgIHRoaXMuY29uZmlnLmRhdGEkXHJcbiAgICAgIC5waXBlKGZpbHRlcihlID0+ICEhZSkpXHJcbiAgICAgIC5waXBlKHRha2VVbnRpbCh0aGlzLiRvbkRlc3Ryb3llZCkpXHJcbiAgICAgIC5zdWJzY3JpYmUob3JpZ2luYWxEYXRhID0+IHtcclxuICAgICAgICBjb25zb2xlLmxvZyhcIm5neC1hdXRvLXRhYmxlLCBzdWJzY3JpYmVkOiBcIiwgeyBvcmlnaW5hbERhdGEgfSk7XHJcbiAgICAgICAgdGhpcy5kYXRhU291cmNlID0gbmV3IE1hdFRhYmxlRGF0YVNvdXJjZShvcmlnaW5hbERhdGEpO1xyXG4gICAgICAgIHRoaXMuZGF0YVNvdXJjZS5wYWdpbmF0b3IgPSB0aGlzLnBhZ2luYXRvcjtcclxuICAgICAgICB0aGlzLmRhdGFTb3VyY2Uuc29ydCA9IHRoaXMuc29ydDtcclxuICAgICAgICBpZiAob3JpZ2luYWxEYXRhICYmICFvcmlnaW5hbERhdGEubGVuZ3RoKSB7XHJcbiAgICAgICAgICB0aGlzLmhhc05vSXRlbXMgPSB0cnVlO1xyXG4gICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICB0aGlzLmhhc05vSXRlbXMgPSBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHRoaXMuY29uZmlnLnBhZ2VTaXplKSB7XHJcbiAgICAgICAgICB0aGlzLnBhZ2VTaXplID0gdGhpcy5jb25maWcucGFnZVNpemU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvbnN0IGZpcnN0RGF0YUl0ZW0gPSBvcmlnaW5hbERhdGFbMF07XHJcbiAgICAgICAgdGhpcy5pbml0RGlzcGxheWVkQ29sdW1ucyhmaXJzdERhdGFJdGVtKTtcclxuICAgICAgICB0aGlzLmluaXRFeHBvcnQob3JpZ2luYWxEYXRhKTtcclxuICAgICAgICB0aGlzLmluaXRGaWx0ZXIob3JpZ2luYWxEYXRhKTtcclxuICAgICAgfSk7XHJcblxyXG4gICAgaWYgKHRoaXMuY29uZmlnLiR0cmlnZ2VyU2VsZWN0SXRlbSkge1xyXG4gICAgICB0aGlzLmNvbmZpZy4kdHJpZ2dlclNlbGVjdEl0ZW1cclxuICAgICAgICAucGlwZSh0YWtlVW50aWwodGhpcy4kb25EZXN0cm95ZWQpKVxyXG4gICAgICAgIC5zdWJzY3JpYmUoaXRlbSA9PiB7XHJcbiAgICAgICAgICB0aGlzLmxvZyhcIiR0cmlnZ2VyU2VsZWN0SXRlbVwiLCBpdGVtKTtcclxuICAgICAgICAgIGNvbnN0IHN0ciA9IEpTT04uc3RyaW5naWZ5KGl0ZW0pO1xyXG4gICAgICAgICAgY29uc3QgZm91bmRJdGVtID0gdGhpcy5kYXRhU291cmNlLmRhdGEuZmluZChcclxuICAgICAgICAgICAgcm93ID0+IEpTT04uc3RyaW5naWZ5KHJvdykgPT09IHN0clxyXG4gICAgICAgICAgKTtcclxuICAgICAgICAgIGlmIChmb3VuZEl0ZW0pIHtcclxuICAgICAgICAgICAgdGhpcy5zZWxlY3Rpb25TaW5nbGUuc2VsZWN0KGZvdW5kSXRlbSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHRoaXMuY29uZmlnLmNsZWFyU2VsZWN0ZWQpIHtcclxuICAgICAgdGhpcy5jb25maWcuY2xlYXJTZWxlY3RlZFxyXG4gICAgICAgIC5waXBlKHRha2VVbnRpbCh0aGlzLiRvbkRlc3Ryb3llZCkpXHJcbiAgICAgICAgLnN1YnNjcmliZSgoKSA9PiB7XHJcbiAgICAgICAgICB0aGlzLmxvZyhcImNsZWFyU2VsZWN0ZWRcIik7XHJcbiAgICAgICAgICB0aGlzLnNlbGVjdGlvbk11bHRpcGxlLmNsZWFyKCk7XHJcbiAgICAgICAgICB0aGlzLnNlbGVjdGlvblNpbmdsZS5jbGVhcigpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgbmdPbkRlc3Ryb3koKSB7XHJcbiAgICB0aGlzLiRvbkRlc3Ryb3llZC5uZXh0KCk7XHJcbiAgICB0aGlzLiRvbkRlc3Ryb3llZC5jb21wbGV0ZSgpO1xyXG4gIH1cclxuXHJcbiAgYXBwbHlGaWx0ZXIoZmlsdGVyVmFsdWU6IHN0cmluZykge1xyXG4gICAgdGhpcy5kYXRhU291cmNlLmZpbHRlciA9IGZpbHRlclZhbHVlLnRyaW0oKS50b0xvd2VyQ2FzZSgpO1xyXG4gICAgdGhpcy5zZWxlY3Rpb25NdWx0aXBsZS5jbGVhcigpO1xyXG4gICAgdGhpcy5zZWxlY3Rpb25TaW5nbGUuY2xlYXIoKTtcclxuICB9XHJcblxyXG4gIGluaXRGaWx0ZXIob3JpZ2luYWxEYXRhOiBUW10pIHtcclxuICAgIGlmICghb3JpZ2luYWxEYXRhLmxlbmd0aCkge1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcbiAgICBjb25zdCBmaXJzdFJvdyA9IG9yaWdpbmFsRGF0YVswXTtcclxuICAgIGNvbnN0IGtleXNEYXRhID0gbmV3IFNldChPYmplY3Qua2V5cyhmaXJzdFJvdykpO1xyXG4gICAgY29uc3Qga2V5c0hlYWRlciA9IG5ldyBTZXQodGhpcy5oZWFkZXJLZXlzRGlzcGxheWVkKTtcclxuICAgIGtleXNIZWFkZXIuZGVsZXRlKFwiX19idWxrXCIpO1xyXG4gICAga2V5c0hlYWRlci5kZWxldGUoXCJfX3N0YXJcIik7XHJcbiAgICBjb25zdCBhbGxGaWVsZHNFeGlzdCA9IEFycmF5LmZyb20oa2V5c0hlYWRlcikucmVkdWNlKChhY2MsIGN1cikgPT4ge1xyXG4gICAgICByZXR1cm4ga2V5c0RhdGEuaGFzKGN1cikgJiYgYWNjO1xyXG4gICAgfSwgdHJ1ZSk7XHJcblxyXG4gICAgdGhpcy5sb2coXCJpbml0RmlsdGVyKClcIiwge1xyXG4gICAgICByb3dGaWVsZHM6IGtleXNEYXRhLFxyXG4gICAgICBhbGxGaWVsZHNFeGlzdCxcclxuICAgICAgaGVhZGVyS2V5c0Rpc3BsYXllZDogdGhpcy5oZWFkZXJLZXlzRGlzcGxheWVkXHJcbiAgICB9KTtcclxuICAgIHRoaXMuZGF0YVNvdXJjZS5maWx0ZXJQcmVkaWNhdGUgPSAoZGF0YTogVCwgZmlsdGVyVGV4dDogc3RyaW5nKSA9PiB7XHJcbiAgICAgIGlmICghZmlsdGVyVGV4dCkge1xyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICB9XHJcbiAgICAgIGlmICghYWxsRmllbGRzRXhpc3QpIHtcclxuICAgICAgICBjb25zdCBsb3dlciA9IEpTT04uc3RyaW5naWZ5KGRhdGEpLnRvTG93ZXJDYXNlKCk7XHJcbiAgICAgICAgcmV0dXJuIGxvd2VyLmluY2x1ZGVzKGZpbHRlclRleHQpO1xyXG4gICAgICB9XHJcbiAgICAgIGZvciAoY29uc3Qga2V5IG9mIEFycmF5LmZyb20oa2V5c0hlYWRlcikpIHtcclxuICAgICAgICBjb25zdCBkYXRhVmFsID0gZGF0YVtrZXldO1xyXG4gICAgICAgIGNvbnN0IHN0ciA9IEpTT04uc3RyaW5naWZ5KGRhdGFWYWwpO1xyXG4gICAgICAgIGNvbnN0IGlzRm91bmQgPSBzdHIudG9Mb3dlckNhc2UoKS5pbmNsdWRlcyhmaWx0ZXJUZXh0KTtcclxuICAgICAgICBpZiAoaXNGb3VuZCkge1xyXG4gICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9O1xyXG4gIH1cclxuXHJcbiAgaW5pdEV4cG9ydChvcmlnaW5hbERhdGE6IFRbXSkge1xyXG4gICAgdGhpcy5leHBvcnRGaWxlbmFtZSA9IHRoaXMuY29uZmlnLmV4cG9ydEZpbGVuYW1lO1xyXG4gICAgaWYgKCF0aGlzLmV4cG9ydEZpbGVuYW1lKSB7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuICAgIHRoaXMuZXhwb3J0RGF0YSA9IG9yaWdpbmFsRGF0YS5tYXAoZGF0YUl0ZW0gPT4ge1xyXG4gICAgICBpZiAoIXRoaXMuY29uZmlnLmV4cG9ydFJvd0Zvcm1hdCkge1xyXG4gICAgICAgIHJldHVybiBkYXRhSXRlbTtcclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gdGhpcy5jb25maWcuZXhwb3J0Um93Rm9ybWF0KGRhdGFJdGVtKTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIGdldEtleUhlYWRlcihrZXk6IHN0cmluZykge1xyXG4gICAgY29uc3QgaW5wdXREZWYgPSB0aGlzLmNvbHVtbkRlZmluaXRpb25zW2tleV07XHJcbiAgICBpZiAoaW5wdXREZWYgJiYgaW5wdXREZWYuaGVhZGVyICE9IG51bGwpIHtcclxuICAgICAgcmV0dXJuIGlucHV0RGVmLmhlYWRlcjtcclxuICAgIH1cclxuICAgIHJldHVybiB0aGlzLnRvVGl0bGVDYXNlKGtleSk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIHRvVGl0bGVDYXNlKHN0cikge1xyXG4gICAgcmV0dXJuIHN0ci5yZXBsYWNlKFwiX1wiLCBcIiBcIikucmVwbGFjZSgvXFx3XFxTKi9nLCBmdW5jdGlvbih0eHQpIHtcclxuICAgICAgcmV0dXJuIHR4dC5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIHR4dC5zdWJzdHIoMSkudG9Mb3dlckNhc2UoKTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgaW5pdERpc3BsYXllZENvbHVtbnMoZmlyc3REYXRhSXRlbTogVCkge1xyXG4gICAgdGhpcy5pbml0Q29sdW1uRGVmaW5pdGlvbnMoZmlyc3REYXRhSXRlbSk7XHJcblxyXG4gICAgdGhpcy5oZWFkZXJLZXlzQWxsID0gT2JqZWN0LmtleXModGhpcy5jb2x1bW5EZWZpbml0aW9uc0FsbCk7XHJcbiAgICB0aGlzLmhlYWRlcktleXNBbGxWaXNpYmxlID0gdGhpcy5oZWFkZXJLZXlzQWxsO1xyXG4gICAgaWYgKHRoaXMuY29uZmlnLmhpZGVGaWVsZHMpIHtcclxuICAgICAgLy8gSGlkZSBmaWVsZHMgaWYgc3BlY2lmaWVkXHJcbiAgICAgIGNvbnN0IGhpZGVGaWVsZHMgPSBuZXcgU2V0KHRoaXMuY29uZmlnLmhpZGVGaWVsZHMpO1xyXG4gICAgICB0aGlzLmhlYWRlcktleXNBbGxWaXNpYmxlID0gdGhpcy5oZWFkZXJLZXlzQWxsLmZpbHRlcihcclxuICAgICAgICB4ID0+ICFoaWRlRmllbGRzLmhhcyh4KVxyXG4gICAgICApO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IGRpc3BsYXllZCA9IHRoaXMuY29sdW1uRGVmaW5pdGlvbnNBbGxBcnJheVxyXG4gICAgICAuZmlsdGVyKGRlZiA9PiAhZGVmLmhpZGUpXHJcbiAgICAgIC5tYXAoZCA9PiBkLmZpZWxkKTtcclxuXHJcbiAgICB0aGlzLnNldERpc3BsYXllZENvbHVtbnMoZGlzcGxheWVkKTtcclxuICAgIC8vIFNldCBjdXJyZW50bHkgZW5hYmxlZCBpdGVtc1xyXG4gICAgdGhpcy5maWx0ZXJDb250cm9sLnNldFZhbHVlKHRoaXMuaGVhZGVyS2V5c0Rpc3BsYXllZCk7XHJcbiAgfVxyXG5cclxuICBpbml0Q29sdW1uRGVmaW5pdGlvbnMoZmlyc3REYXRhSXRlbTogVCkge1xyXG4gICAgLy8gU2V0IGFsbCBjb2x1bW4gZGVmaW50aW9ucywgd2hpY2ggd2VyZSBleHBsaWNpdGx5IHNldCBpbiBjb25maWdcclxuICAgIGNvbnN0IGlucHV0RGVmaW50aW9uRmllbGRzID0gT2JqZWN0LmtleXModGhpcy5jb2x1bW5EZWZpbml0aW9ucyk7XHJcbiAgICBpbnB1dERlZmludGlvbkZpZWxkcy5mb3JFYWNoKChmaWVsZDogc3RyaW5nKSA9PiB7XHJcbiAgICAgIGNvbnN0IGlucHV0RGVmaW50aW9uID0gdGhpcy5jb2x1bW5EZWZpbml0aW9uc1tmaWVsZF07XHJcbiAgICAgIHRoaXMuY29sdW1uRGVmaW5pdGlvbnNBbGxbZmllbGRdID0ge1xyXG4gICAgICAgIGhlYWRlcjogdGhpcy5nZXRLZXlIZWFkZXIoZmllbGQpLFxyXG4gICAgICAgIHRlbXBsYXRlOiBpbnB1dERlZmludGlvbi50ZW1wbGF0ZSxcclxuICAgICAgICBoaWRlOiBpbnB1dERlZmludGlvbi5oaWRlLFxyXG4gICAgICAgIGZvcmNlV3JhcDogaW5wdXREZWZpbnRpb24uZm9yY2VXcmFwXHJcbiAgICAgIH07XHJcbiAgICB9KTtcclxuXHJcbiAgICAvLyBTZXQgYWxsIGNvbHVtbiBkZWZpbnRpb25zIHJlYWQgZnJvbSB0aGUgXCJpbnB1dCBkYXRhXCJcclxuICAgIGNvbnN0IGlucHV0RGF0YUtleXMgPSBPYmplY3Qua2V5cyhmaXJzdERhdGFJdGVtKTtcclxuICAgIGlucHV0RGF0YUtleXMuZm9yRWFjaCgoZmllbGQ6IHN0cmluZykgPT4ge1xyXG4gICAgICBpZiAoISF0aGlzLmNvbHVtbkRlZmluaXRpb25zQWxsW2ZpZWxkXSkge1xyXG4gICAgICAgIC8vIHNraXAgaWYgZGVmaW5pdGlvbiBleGlzdHNcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIH1cclxuICAgICAgdGhpcy5jb2x1bW5EZWZpbml0aW9uc0FsbFtmaWVsZF0gPSB7XHJcbiAgICAgICAgaGVhZGVyOiB0aGlzLnRvVGl0bGVDYXNlKGZpZWxkKSxcclxuICAgICAgICBoaWRlOiB0cnVlXHJcbiAgICAgIH07XHJcbiAgICB9KTtcclxuXHJcbiAgICB0aGlzLmNvbHVtbkRlZmluaXRpb25zQWxsQXJyYXkgPSBPYmplY3Qua2V5cyh0aGlzLmNvbHVtbkRlZmluaXRpb25zQWxsKS5tYXAoXHJcbiAgICAgIGsgPT4ge1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAuLi50aGlzLmNvbHVtbkRlZmluaXRpb25zQWxsW2tdLFxyXG4gICAgICAgICAgZmllbGQ6IGtcclxuICAgICAgICB9O1xyXG4gICAgICB9XHJcbiAgICApO1xyXG4gICAgdGhpcy5sb2coXCJpbml0Q29sdW1uRGVmaW5pdGlvbnNcIiwge1xyXG4gICAgICBmaXJzdERhdGFJdGVtLFxyXG4gICAgICBpbnB1dERlZmludGlvbkZpZWxkc1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICAvLyBTZXRzIHRoZSBkaXNwbGF5ZWQgY29sdW1ucyBmcm9tIGEgc2V0IG9mIGZpZWxkbmFtZXNcclxuICBzZXREaXNwbGF5ZWRDb2x1bW5zKHNlbGVjdGVkOiBzdHJpbmdbXSkge1xyXG4gICAgLy8gSW5pdGlhbGl6ZSBhbGwga2V5cyBhcyBmYWxzZVxyXG4gICAgdGhpcy5oZWFkZXJLZXlzQWxsVmlzaWJsZS5mb3JFYWNoKFxyXG4gICAgICBrID0+ICh0aGlzLmhlYWRlcktleXNEaXNwbGF5ZWRNYXBba10gPSBmYWxzZSlcclxuICAgICk7XHJcbiAgICAvLyBTZXQgc2VsZWN0ZWQgYXMgdHJ1ZVxyXG4gICAgc2VsZWN0ZWQuZm9yRWFjaChjID0+ICh0aGlzLmhlYWRlcktleXNEaXNwbGF5ZWRNYXBbY10gPSB0cnVlKSk7XHJcbiAgICB0aGlzLmhlYWRlcktleXNEaXNwbGF5ZWQgPSBPYmplY3Qua2V5cyh0aGlzLmhlYWRlcktleXNEaXNwbGF5ZWRNYXApLmZpbHRlcihcclxuICAgICAgayA9PiB0aGlzLmhlYWRlcktleXNEaXNwbGF5ZWRNYXBba11cclxuICAgICk7XHJcbiAgICAvLyBBZGQgYnVsayBzZWxlY3QgY29sdW1uIGF0IHN0YXJ0XHJcbiAgICBpZiAodGhpcy5jb25maWcuYWN0aW9uc0J1bGspIHtcclxuICAgICAgdGhpcy5oZWFkZXJLZXlzRGlzcGxheWVkLnVuc2hpZnQoXCJfX2J1bGtcIik7XHJcbiAgICB9XHJcbiAgICAvLyBBZGQgYWN0aW9ucyBjb2x1bW4gYXQgZW5kXHJcbiAgICBpZiAodGhpcy5jb25maWcuYWN0aW9ucykge1xyXG4gICAgICB0aGlzLmhlYWRlcktleXNEaXNwbGF5ZWQucHVzaChcIl9fc3RhclwiKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8qKiBXaGV0aGVyIHRoZSBudW1iZXIgb2Ygc2VsZWN0ZWQgZWxlbWVudHMgbWF0Y2hlcyB0aGUgdG90YWwgbnVtYmVyIG9mIHJvd3MuICovXHJcbiAgaXNBbGxTZWxlY3RlZCgpIHtcclxuICAgIGNvbnN0IG51bVNlbGVjdGVkID0gdGhpcy5zZWxlY3Rpb25NdWx0aXBsZS5zZWxlY3RlZC5sZW5ndGg7XHJcbiAgICBjb25zdCBudW1Sb3dzID1cclxuICAgICAgdGhpcy5jb25maWcuYnVsa1NlbGVjdE1heENvdW50IHx8IHRoaXMuZGF0YVNvdXJjZS5maWx0ZXJlZERhdGEubGVuZ3RoO1xyXG4gICAgcmV0dXJuIG51bVNlbGVjdGVkID49IG51bVJvd3M7XHJcbiAgfVxyXG5cclxuICAvKiogU2VsZWN0cyBhbGwgcm93cyBpZiB0aGV5IGFyZSBub3QgYWxsIHNlbGVjdGVkOyBvdGhlcndpc2UgY2xlYXIgc2VsZWN0aW9uLiAqL1xyXG4gIG1hc3RlclRvZ2dsZSgpIHtcclxuICAgIHRoaXMuaXNBbGxTZWxlY3RlZCgpID8gdGhpcy5zZWxlY3Rpb25NdWx0aXBsZS5jbGVhcigpIDogdGhpcy5zZWxlY3RBbGwoKTtcclxuICAgIHRoaXMuc2VsZWN0ZWRCdWxrLmVtaXQodGhpcy5zZWxlY3Rpb25NdWx0aXBsZS5zZWxlY3RlZCk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIHNlbGVjdEFsbCgpIHtcclxuICAgIHRoaXMuZGF0YVNvdXJjZS5zb3J0RGF0YShcclxuICAgICAgdGhpcy5kYXRhU291cmNlLmZpbHRlcmVkRGF0YSxcclxuICAgICAgdGhpcy5kYXRhU291cmNlLnNvcnRcclxuICAgICk7XHJcbiAgICBsZXQgY3V0QXJyYXkgPSB0aGlzLmRhdGFTb3VyY2UuZmlsdGVyZWREYXRhO1xyXG4gICAgaWYgKHRoaXMuY29uZmlnLmJ1bGtTZWxlY3RNYXhDb3VudCkge1xyXG4gICAgICBjdXRBcnJheSA9IHRoaXMuZGF0YVNvdXJjZS5maWx0ZXJlZERhdGEuc2xpY2UoXHJcbiAgICAgICAgMCxcclxuICAgICAgICB0aGlzLmNvbmZpZy5idWxrU2VsZWN0TWF4Q291bnRcclxuICAgICAgKTtcclxuICAgIH1cclxuICAgIGN1dEFycmF5LmZvckVhY2gocm93ID0+IHtcclxuICAgICAgdGhpcy5zZWxlY3Rpb25NdWx0aXBsZS5zZWxlY3Qocm93KTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgaXNNYXhSZWFjaGVkKCkge1xyXG4gICAgaWYgKCF0aGlzLmNvbmZpZy5idWxrU2VsZWN0TWF4Q291bnQpIHtcclxuICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIChcclxuICAgICAgdGhpcy5zZWxlY3Rpb25NdWx0aXBsZS5zZWxlY3RlZC5sZW5ndGggPj0gdGhpcy5jb25maWcuYnVsa1NlbGVjdE1heENvdW50XHJcbiAgICApO1xyXG4gIH1cclxuXHJcbiAgb25Db2x1bW5GaWx0ZXJDaGFuZ2UoJGV2ZW50KSB7XHJcbiAgICBjb25zb2xlLmxvZyh7ICRldmVudCB9KTtcclxuICAgIGNvbnN0IHNlbGVjdGVkVmFsdWVzID0gdGhpcy5maWx0ZXJDb250cm9sLnZhbHVlO1xyXG4gICAgdGhpcy5zZXREaXNwbGF5ZWRDb2x1bW5zKHNlbGVjdGVkVmFsdWVzKTtcclxuICAgIHRoaXMuaW5pdEZpbHRlcih0aGlzLmRhdGFTb3VyY2UuZGF0YSk7XHJcbiAgfVxyXG5cclxuICBvbkNsaWNrQnVsa0l0ZW0oJGV2ZW50LCBpdGVtKSB7XHJcbiAgICBpZiAoJGV2ZW50KSB7XHJcbiAgICAgIGNvbnN0IGlzU2VsZWN0ZWQgPSB0aGlzLnNlbGVjdGlvbk11bHRpcGxlLmlzU2VsZWN0ZWQoaXRlbSk7XHJcbiAgICAgIGlmICghdGhpcy5pc01heFJlYWNoZWQoKSkge1xyXG4gICAgICAgIHRoaXMuc2VsZWN0aW9uTXVsdGlwbGUudG9nZ2xlKGl0ZW0pO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGlmIChpc1NlbGVjdGVkKSB7XHJcbiAgICAgICAgICB0aGlzLnNlbGVjdGlvbk11bHRpcGxlLmRlc2VsZWN0KGl0ZW0pO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICB0aGlzLndhcm4oKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgICAgdGhpcy5zZWxlY3RlZEJ1bGsuZW1pdCh0aGlzLnNlbGVjdGlvbk11bHRpcGxlLnNlbGVjdGVkKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIG9uQ2xpY2tSb3coJGV2ZW50LCByb3c6IFQpIHtcclxuICAgIGlmICh0aGlzLmNvbmZpZy5vblNlbGVjdEl0ZW0pIHtcclxuICAgICAgdGhpcy5sb2coXCJvbkNsaWNrUm93KClcIiwgeyAkZXZlbnQsIHJvdyB9KTtcclxuICAgICAgdGhpcy5zZWxlY3Rpb25TaW5nbGUuc2VsZWN0KHJvdyk7XHJcbiAgICAgIHRoaXMuY29uZmlnLm9uU2VsZWN0SXRlbShyb3cpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgb25Eb3VibGVDbGlja1JvdygkZXZlbnQsIHJvdzogVCkge1xyXG4gICAgaWYgKHRoaXMuY29uZmlnLm9uU2VsZWN0SXRlbURvdWJsZUNsaWNrKSB7XHJcbiAgICAgIHRoaXMubG9nKFwib25Eb3VibGVDbGlja1JvdygpXCIsIHsgJGV2ZW50LCByb3cgfSk7XHJcbiAgICAgIHRoaXMuc2VsZWN0aW9uU2luZ2xlLnNlbGVjdChyb3cpO1xyXG4gICAgICB0aGlzLmNvbmZpZy5vblNlbGVjdEl0ZW1Eb3VibGVDbGljayhyb3cpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgYXN5bmMgb25DbGlja0J1bGtBY3Rpb24oYWN0aW9uOiBBY3Rpb25EZWZpbml0aW9uQnVsazxUPikge1xyXG4gICAgYXdhaXQgYWN0aW9uLm9uQ2xpY2sodGhpcy5zZWxlY3Rpb25NdWx0aXBsZS5zZWxlY3RlZCk7XHJcbiAgICB0aGlzLnNlbGVjdGlvbk11bHRpcGxlLmNsZWFyKCk7XHJcbiAgfVxyXG5cclxuICBsb2coc3RyOiBzdHJpbmcsIG9iaj86IGFueSkge1xyXG4gICAgaWYgKHRoaXMuY29uZmlnLmRlYnVnKSB7XHJcbiAgICAgIGNvbnNvbGUubG9nKFwiPG5neC1hdXRvLXRhYmxlPiA6IFwiICsgc3RyLCBvYmopO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgd2FybigpIHt9XHJcbn1cclxuIl19