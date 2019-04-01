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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLXRhYmxlLWNzdi1leHBvcnQuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vbmd4LWF1dG8tdGFibGUvIiwic291cmNlcyI6WyJsaWIvYXBwLXRhYmxlLWNzdi1leHBvcnQuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFFLEtBQUssRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUVqRDtJQUFBO0lBOEJBLENBQUM7O2dCQTlCQSxTQUFTLFNBQUM7b0JBQ1QsUUFBUSxFQUFFLHNCQUFzQjtvQkFDaEMsUUFBUSxFQUFFLDhQQVdUOzZCQUVDLDJHQU9DO2lCQUVKOzs7NEJBRUUsS0FBSzsyQkFFTCxLQUFLOztJQUVSLGtDQUFDO0NBQUEsQUE5QkQsSUE4QkM7U0FMWSwyQkFBMkI7OztJQUN0QyxnREFDYzs7SUFDZCwrQ0FDaUIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIElucHV0IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcblxyXG5AQ29tcG9uZW50KHtcclxuICBzZWxlY3RvcjogJ2FwcC10YWJsZS1jc3YtZXhwb3J0JyxcclxuICB0ZW1wbGF0ZTogYFxyXG4gICAgPGFcclxuICAgICAgKm5nSWY9XCJkYXRhQXJyYXlcIlxyXG4gICAgICBjc3ZMaW5rXHJcbiAgICAgIFtkYXRhXT1cImRhdGFBcnJheVwiXHJcbiAgICAgIFtmaWxlbmFtZV09XCJmaWxlbmFtZVwiXHJcbiAgICAgIG1hdC1yYWlzZWQtYnV0dG9uXHJcbiAgICA+XHJcbiAgICAgIDxtYXQtaWNvbiB0aXRsZT1cIkV4cG9ydCBhcyBDU1ZcIj5maWxlX2Rvd25sb2FkPC9tYXQtaWNvbj5cclxuICAgICAgPHNwYW4+RXhwb3J0IENTVjwvc3Bhbj5cclxuICAgIDwvYT5cclxuICBgLFxyXG4gIHN0eWxlczogW1xyXG4gICAgYFxyXG4gICAgICBhIHtcclxuICAgICAgICBjb2xvcjogYmxhY2s7XHJcbiAgICAgIH1cclxuICAgICAgbWF0LWljb24ge1xyXG4gICAgICAgIHBhZGRpbmctcmlnaHQ6IDVweDtcclxuICAgICAgfVxyXG4gICAgYFxyXG4gIF1cclxufSlcclxuZXhwb3J0IGNsYXNzIEFwcEV4cG9ydENzdkV4cG9ydENvbXBvbmVudCB7XHJcbiAgQElucHV0KClcclxuICBkYXRhQXJyYXk6IFtdO1xyXG4gIEBJbnB1dCgpXHJcbiAgZmlsZW5hbWU6IHN0cmluZztcclxufVxyXG4iXX0=