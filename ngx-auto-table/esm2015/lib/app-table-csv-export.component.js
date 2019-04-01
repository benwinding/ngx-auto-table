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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLXRhYmxlLWNzdi1leHBvcnQuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vbmd4LWF1dG8tdGFibGUvIiwic291cmNlcyI6WyJsaWIvYXBwLXRhYmxlLWNzdi1leHBvcnQuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFFLEtBQUssRUFBRSxNQUFNLGVBQWUsQ0FBQztBQTJCakQsTUFBTSxPQUFPLDJCQUEyQjs7O1lBekJ2QyxTQUFTLFNBQUM7Z0JBQ1QsUUFBUSxFQUFFLHNCQUFzQjtnQkFDaEMsUUFBUSxFQUFFOzs7Ozs7Ozs7OztHQVdUO3lCQUVDOzs7Ozs7O0tBT0M7YUFFSjs7O3dCQUVFLEtBQUs7dUJBRUwsS0FBSzs7OztJQUZOLGdEQUNjOztJQUNkLCtDQUNpQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgSW5wdXQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuXHJcbkBDb21wb25lbnQoe1xyXG4gIHNlbGVjdG9yOiAnYXBwLXRhYmxlLWNzdi1leHBvcnQnLFxyXG4gIHRlbXBsYXRlOiBgXHJcbiAgICA8YVxyXG4gICAgICAqbmdJZj1cImRhdGFBcnJheVwiXHJcbiAgICAgIGNzdkxpbmtcclxuICAgICAgW2RhdGFdPVwiZGF0YUFycmF5XCJcclxuICAgICAgW2ZpbGVuYW1lXT1cImZpbGVuYW1lXCJcclxuICAgICAgbWF0LXJhaXNlZC1idXR0b25cclxuICAgID5cclxuICAgICAgPG1hdC1pY29uIHRpdGxlPVwiRXhwb3J0IGFzIENTVlwiPmZpbGVfZG93bmxvYWQ8L21hdC1pY29uPlxyXG4gICAgICA8c3Bhbj5FeHBvcnQgQ1NWPC9zcGFuPlxyXG4gICAgPC9hPlxyXG4gIGAsXHJcbiAgc3R5bGVzOiBbXHJcbiAgICBgXHJcbiAgICAgIGEge1xyXG4gICAgICAgIGNvbG9yOiBibGFjaztcclxuICAgICAgfVxyXG4gICAgICBtYXQtaWNvbiB7XHJcbiAgICAgICAgcGFkZGluZy1yaWdodDogNXB4O1xyXG4gICAgICB9XHJcbiAgICBgXHJcbiAgXVxyXG59KVxyXG5leHBvcnQgY2xhc3MgQXBwRXhwb3J0Q3N2RXhwb3J0Q29tcG9uZW50IHtcclxuICBASW5wdXQoKVxyXG4gIGRhdGFBcnJheTogW107XHJcbiAgQElucHV0KClcclxuICBmaWxlbmFtZTogc3RyaW5nO1xyXG59XHJcbiJdfQ==