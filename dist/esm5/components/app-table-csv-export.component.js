/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Component, Input } from '@angular/core';
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
export { AppExportCsvExportComponent };
if (false) {
    /** @type {?} */
    AppExportCsvExportComponent.prototype.dataArray;
    /** @type {?} */
    AppExportCsvExportComponent.prototype.filename;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLXRhYmxlLWNzdi1leHBvcnQuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vbmd4LWF1dG8tdGFibGUtbGliLyIsInNvdXJjZXMiOlsiY29tcG9uZW50cy9hcHAtdGFibGUtY3N2LWV4cG9ydC5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQUUsS0FBSyxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBRWpEO0lBQUE7SUE4QkEsQ0FBQzs7Z0JBOUJBLFNBQVMsU0FBQztvQkFDVCxRQUFRLEVBQUUsc0JBQXNCO29CQUNoQyxRQUFRLEVBQUUsOFBBV1Q7NkJBRUMsMkdBT0M7aUJBRUo7Ozs0QkFFRSxLQUFLOzJCQUVMLEtBQUs7O0lBRVIsa0NBQUM7Q0FBQSxBQTlCRCxJQThCQztTQUxZLDJCQUEyQjs7O0lBQ3RDLGdEQUNjOztJQUNkLCtDQUNpQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgSW5wdXQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuXHJcbkBDb21wb25lbnQoe1xyXG4gIHNlbGVjdG9yOiAnYXBwLXRhYmxlLWNzdi1leHBvcnQnLFxyXG4gIHRlbXBsYXRlOiBgXHJcbiAgICA8YVxyXG4gICAgICAqbmdJZj1cImRhdGFBcnJheVwiXHJcbiAgICAgIGNzdkxpbmtcclxuICAgICAgW2RhdGFdPVwiZGF0YUFycmF5XCJcclxuICAgICAgW2ZpbGVuYW1lXT1cImZpbGVuYW1lXCJcclxuICAgICAgbWF0LXJhaXNlZC1idXR0b25cclxuICAgID5cclxuICAgICAgPG1hdC1pY29uIHRpdGxlPVwiRXhwb3J0IGFzIENTVlwiPmZpbGVfZG93bmxvYWQ8L21hdC1pY29uPlxyXG4gICAgICA8c3Bhbj5FeHBvcnQgQ1NWPC9zcGFuPlxyXG4gICAgPC9hPlxyXG4gIGAsXHJcbiAgc3R5bGVzOiBbXHJcbiAgICBgXHJcbiAgICAgIGEge1xyXG4gICAgICAgIGNvbG9yOiBibGFjaztcclxuICAgICAgfVxyXG4gICAgICBtYXQtaWNvbiB7XHJcbiAgICAgICAgcGFkZGluZy1yaWdodDogNXB4O1xyXG4gICAgICB9XHJcbiAgICBgXHJcbiAgXVxyXG59KVxyXG5leHBvcnQgY2xhc3MgQXBwRXhwb3J0Q3N2RXhwb3J0Q29tcG9uZW50IHtcclxuICBASW5wdXQoKVxyXG4gIGRhdGFBcnJheTogW107XHJcbiAgQElucHV0KClcclxuICBmaWxlbmFtZTogc3RyaW5nO1xyXG59XHJcbiJdfQ==