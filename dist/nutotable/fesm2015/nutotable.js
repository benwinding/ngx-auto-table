import { Injectable, Component, Input, NgModule, defineInjectable } from '@angular/core';
import { CsvModule } from '@ctrl/ngx-csv';
import { MatAutocompleteModule, MatButtonModule, MatButtonToggleModule, MatPaginatorModule, MatCheckboxModule, MatFormFieldModule, MatIconModule, MatInputModule, MatProgressBarModule, MatProgressSpinnerModule, MatSelectModule, MatSortModule, MatTableModule, MatToolbarModule, MatMenuModule } from '@angular/material';
import { CommonModule } from '@angular/common';

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class NutotableService {
    constructor() { }
}
NutotableService.decorators = [
    { type: Injectable, args: [{
                providedIn: 'root'
            },] }
];
/** @nocollapse */
NutotableService.ctorParameters = () => [];
/** @nocollapse */ NutotableService.ngInjectableDef = defineInjectable({ factory: function NutotableService_Factory() { return new NutotableService(); }, token: NutotableService, providedIn: "root" });

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class NutotableComponent {
    constructor() { }
    /**
     * @return {?}
     */
    ngOnInit() {
    }
}
NutotableComponent.decorators = [
    { type: Component, args: [{
                selector: 'lib-nutotable',
                template: `
    <p>
      nutotable works!
    </p>
  `
            }] }
];
/** @nocollapse */
NutotableComponent.ctorParameters = () => [];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class AppExportCsvExportComponent {
}
AppExportCsvExportComponent.decorators = [
    { type: Component, args: [{
                selector: 'app-table-csv-export',
                template: `
    <a
      *ngIf="dataArray"
      csvLink
      [data]="dataArray"
      [filename]="filename"
      mat-raised-button
    >
      <mat-icon title="Export as CSV">file_download</mat-icon>
      <span>Export CSV</span>
    </a>
  `,
                styles: [`
      a {
        color: black;
      }
      mat-icon {
        padding-right: 5px;
      }
    `]
            }] }
];
AppExportCsvExportComponent.propDecorators = {
    dataArray: [{ type: Input }],
    filename: [{ type: Input }]
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class NutotableModule {
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