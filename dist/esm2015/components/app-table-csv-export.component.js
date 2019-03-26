/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Component, Input } from '@angular/core';
export class AppExportCsvExportComponent {
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
if (false) {
    /** @type {?} */
    AppExportCsvExportComponent.prototype.dataArray;
    /** @type {?} */
    AppExportCsvExportComponent.prototype.filename;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLXRhYmxlLWNzdi1leHBvcnQuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vbmd4LWF1dG8tdGFibGUtbGliLyIsInNvdXJjZXMiOlsiY29tcG9uZW50cy9hcHAtdGFibGUtY3N2LWV4cG9ydC5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQUUsS0FBSyxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBMkJqRCxNQUFNLE9BQU8sMkJBQTJCOzs7WUF6QnZDLFNBQVMsU0FBQztnQkFDVCxRQUFRLEVBQUUsc0JBQXNCO2dCQUNoQyxRQUFRLEVBQUU7Ozs7Ozs7Ozs7O0dBV1Q7eUJBRUM7Ozs7Ozs7S0FPQzthQUVKOzs7d0JBRUUsS0FBSzt1QkFFTCxLQUFLOzs7O0lBRk4sZ0RBQ2M7O0lBQ2QsK0NBQ2lCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBJbnB1dCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5cclxuQENvbXBvbmVudCh7XHJcbiAgc2VsZWN0b3I6ICdhcHAtdGFibGUtY3N2LWV4cG9ydCcsXHJcbiAgdGVtcGxhdGU6IGBcclxuICAgIDxhXHJcbiAgICAgICpuZ0lmPVwiZGF0YUFycmF5XCJcclxuICAgICAgY3N2TGlua1xyXG4gICAgICBbZGF0YV09XCJkYXRhQXJyYXlcIlxyXG4gICAgICBbZmlsZW5hbWVdPVwiZmlsZW5hbWVcIlxyXG4gICAgICBtYXQtcmFpc2VkLWJ1dHRvblxyXG4gICAgPlxyXG4gICAgICA8bWF0LWljb24gdGl0bGU9XCJFeHBvcnQgYXMgQ1NWXCI+ZmlsZV9kb3dubG9hZDwvbWF0LWljb24+XHJcbiAgICAgIDxzcGFuPkV4cG9ydCBDU1Y8L3NwYW4+XHJcbiAgICA8L2E+XHJcbiAgYCxcclxuICBzdHlsZXM6IFtcclxuICAgIGBcclxuICAgICAgYSB7XHJcbiAgICAgICAgY29sb3I6IGJsYWNrO1xyXG4gICAgICB9XHJcbiAgICAgIG1hdC1pY29uIHtcclxuICAgICAgICBwYWRkaW5nLXJpZ2h0OiA1cHg7XHJcbiAgICAgIH1cclxuICAgIGBcclxuICBdXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBBcHBFeHBvcnRDc3ZFeHBvcnRDb21wb25lbnQge1xyXG4gIEBJbnB1dCgpXHJcbiAgZGF0YUFycmF5OiBbXTtcclxuICBASW5wdXQoKVxyXG4gIGZpbGVuYW1lOiBzdHJpbmc7XHJcbn1cclxuIl19