(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('@ctrl/ngx-csv'), require('@angular/material'), require('@angular/common')) :
    typeof define === 'function' && define.amd ? define('nutotable', ['exports', '@angular/core', '@ctrl/ngx-csv', '@angular/material', '@angular/common'], factory) :
    (factory((global.nutotable = {}),global.ng.core,global.ngxCsv,global.ng.material,global.ng.common));
}(this, (function (exports,i0,ngxCsv,material,common) { 'use strict';

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */
    var NutotableService = /** @class */ (function () {
        function NutotableService() {
        }
        NutotableService.decorators = [
            { type: i0.Injectable, args: [{
                        providedIn: 'root'
                    },] }
        ];
        /** @nocollapse */
        NutotableService.ctorParameters = function () { return []; };
        /** @nocollapse */ NutotableService.ngInjectableDef = i0.defineInjectable({ factory: function NutotableService_Factory() { return new NutotableService(); }, token: NutotableService, providedIn: "root" });
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
            { type: i0.Component, args: [{
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
            { type: i0.Component, args: [{
                        selector: 'app-table-csv-export',
                        template: "\n    <a\n      *ngIf=\"dataArray\"\n      csvLink\n      [data]=\"dataArray\"\n      [filename]=\"filename\"\n      mat-raised-button\n    >\n      <mat-icon title=\"Export as CSV\">file_download</mat-icon>\n      <span>Export CSV</span>\n    </a>\n  ",
                        styles: ["\n      a {\n        color: black;\n      }\n      mat-icon {\n        padding-right: 5px;\n      }\n    "]
                    }] }
        ];
        AppExportCsvExportComponent.propDecorators = {
            dataArray: [{ type: i0.Input }],
            filename: [{ type: i0.Input }]
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
            { type: i0.NgModule, args: [{
                        declarations: [NutotableComponent, AppExportCsvExportComponent],
                        imports: [
                            common.CommonModule,
                            ngxCsv.CsvModule,
                            material.MatAutocompleteModule,
                            material.MatButtonModule,
                            material.MatButtonToggleModule,
                            material.MatPaginatorModule,
                            material.MatCheckboxModule,
                            material.MatFormFieldModule,
                            material.MatIconModule,
                            material.MatInputModule,
                            material.MatProgressBarModule,
                            material.MatProgressSpinnerModule,
                            material.MatSelectModule,
                            material.MatSortModule,
                            material.MatTableModule,
                            material.MatToolbarModule,
                            material.MatMenuModule
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

    exports.NutotableService = NutotableService;
    exports.NutotableComponent = NutotableComponent;
    exports.NutotableModule = NutotableModule;
    exports.ɵa = AppExportCsvExportComponent;

    Object.defineProperty(exports, '__esModule', { value: true });

})));

//# sourceMappingURL=nutotable.umd.js.map