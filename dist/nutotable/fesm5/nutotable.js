import { Injectable, Component, Input, NgModule, defineInjectable } from '@angular/core';
import { CsvModule } from '@ctrl/ngx-csv';
import { MatAutocompleteModule, MatButtonModule, MatButtonToggleModule, MatPaginatorModule, MatCheckboxModule, MatFormFieldModule, MatIconModule, MatInputModule, MatProgressBarModule, MatProgressSpinnerModule, MatSelectModule, MatSortModule, MatTableModule, MatToolbarModule, MatMenuModule } from '@angular/material';
import { CommonModule } from '@angular/common';

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
var NutotableService = /** @class */ (function () {
    function NutotableService() {
    }
    NutotableService.decorators = [
        { type: Injectable, args: [{
                    providedIn: 'root'
                },] }
    ];
    /** @nocollapse */
    NutotableService.ctorParameters = function () { return []; };
    /** @nocollapse */ NutotableService.ngInjectableDef = defineInjectable({ factory: function NutotableService_Factory() { return new NutotableService(); }, token: NutotableService, providedIn: "root" });
    return NutotableService;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
var NutotableComponent = /** @class */ (function () {
    function NutotableComponent() {
    }
    /**
     * @return {?}
     */
    NutotableComponent.prototype.ngOnInit = /**
     * @return {?}
     */
    function () {
    };
    NutotableComponent.decorators = [
        { type: Component, args: [{
                    selector: 'lib-nutotable',
                    template: "\n    <p>\n      nutotable works!\n    </p>\n  "
                }] }
    ];
    /** @nocollapse */
    NutotableComponent.ctorParameters = function () { return []; };
    return NutotableComponent;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
var AppExportCsvExportComponent = /** @class */ (function () {
    function AppExportCsvExportComponent() {
    }
    AppExportCsvExportComponent.decorators = [
        { type: Component, args: [{
                    selector: 'app-table-csv-export',
                    template: "\n    <a\n      *ngIf=\"dataArray\"\n      csvLink\n      [data]=\"dataArray\"\n      [filename]=\"filename\"\n      mat-raised-button\n    >\n      <mat-icon title=\"Export as CSV\">file_download</mat-icon>\n      <span>Export CSV</span>\n    </a>\n  ",
                    styles: ["\n      a {\n        color: black;\n      }\n      mat-icon {\n        padding-right: 5px;\n      }\n    "]
                }] }
    ];
    AppExportCsvExportComponent.propDecorators = {
        dataArray: [{ type: Input }],
        filename: [{ type: Input }]
    };
    return AppExportCsvExportComponent;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
var NutotableModule = /** @class */ (function () {
    function NutotableModule() {
    }
    NutotableModule.decorators = [
        { type: NgModule, args: [{
                    declarations: [NutotableComponent, AppExportCsvExportComponent],
                    imports: [
                        CommonModule,
                        CsvModule,
                        MatAutocompleteModule,
                        MatButtonModule,
                        MatButtonToggleModule,
                        MatPaginatorModule,
                        MatCheckboxModule,
                        MatFormFieldModule,
                        MatIconModule,
                        MatInputModule,
                        MatProgressBarModule,
                        MatProgressSpinnerModule,
                        MatSelectModule,
                        MatSortModule,
                        MatTableModule,
                        MatToolbarModule,
                        MatMenuModule
                    ],
                    exports: [NutotableComponent]
                },] }
    ];
    return NutotableModule;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

export { NutotableService, NutotableComponent, NutotableModule, AppExportCsvExportComponent as ɵa };

//# sourceMappingURL=nutotable.js.map