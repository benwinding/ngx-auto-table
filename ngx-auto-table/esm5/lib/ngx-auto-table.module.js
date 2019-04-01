/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import * as tslib_1 from "tslib";
// Angular
import { ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { MatAutocompleteModule, MatButtonModule, MatButtonToggleModule, MatPaginatorModule, MatCheckboxModule, MatFormFieldModule, MatIconModule, MatInputModule, MatProgressBarModule, MatProgressSpinnerModule, MatSelectModule, MatSortModule, MatTableModule, MatToolbarModule, MatMenuModule } from '@angular/material';
import { CsvModule } from '@ctrl/ngx-csv';
import { AppExportCsvExportComponent } from './app-table-csv-export.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AutoTableComponent } from './ngx-auto-table.component';
import { AppTableLoaderComponent } from './app-table-loader.component';
/** @type {?} */
var sharedComponents = [AutoTableComponent, AppTableLoaderComponent];
var AutoTableModule = /** @class */ (function () {
    function AutoTableModule() {
    }
    AutoTableModule.decorators = [
        { type: NgModule, args: [{
                    declarations: tslib_1.__spread(sharedComponents, [AppExportCsvExportComponent]),
                    exports: sharedComponents,
                    imports: [
                        CsvModule,
                        ReactiveFormsModule,
                        MatAutocompleteModule,
                        MatButtonModule,
                        MatButtonToggleModule,
                        MatCheckboxModule,
                        MatFormFieldModule,
                        MatIconModule,
                        MatInputModule,
                        MatMenuModule,
                        MatPaginatorModule,
                        MatProgressBarModule,
                        MatProgressSpinnerModule,
                        MatSelectModule,
                        MatSortModule,
                        MatTableModule,
                        MatToolbarModule,
                        CommonModule,
                        RouterModule,
                    ]
                },] }
    ];
    return AutoTableModule;
}());
export { AutoTableModule };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LWF1dG8tdGFibGUubW9kdWxlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vbmd4LWF1dG8tdGFibGUvIiwic291cmNlcyI6WyJsaWIvbmd4LWF1dG8tdGFibGUubW9kdWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUNBLE9BQU8sRUFBRSxtQkFBbUIsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBRXJELE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDekMsT0FBTyxFQUNMLHFCQUFxQixFQUNyQixlQUFlLEVBQ2YscUJBQXFCLEVBQ3JCLGtCQUFrQixFQUNsQixpQkFBaUIsRUFDakIsa0JBQWtCLEVBQ2xCLGFBQWEsRUFDYixjQUFjLEVBQ2Qsb0JBQW9CLEVBQ3BCLHdCQUF3QixFQUN4QixlQUFlLEVBQ2YsYUFBYSxFQUNiLGNBQWMsRUFDZCxnQkFBZ0IsRUFDaEIsYUFBYSxFQUNkLE1BQU0sbUJBQW1CLENBQUM7QUFFM0IsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUMxQyxPQUFPLEVBQUUsMkJBQTJCLEVBQUUsTUFBTSxrQ0FBa0MsQ0FBQztBQUMvRSxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDL0MsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQy9DLE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxNQUFNLDRCQUE0QixDQUFDO0FBQ2hFLE9BQU8sRUFBRSx1QkFBdUIsRUFBRSxNQUFNLDhCQUE4QixDQUFDOztJQUVqRSxnQkFBZ0IsR0FBRyxDQUFDLGtCQUFrQixFQUFFLHVCQUF1QixDQUFDO0FBRXRFO0lBQUE7SUF5QjhCLENBQUM7O2dCQXpCOUIsUUFBUSxTQUFDO29CQUNSLFlBQVksbUJBQU0sZ0JBQWdCLEdBQUUsMkJBQTJCLEVBQUM7b0JBQ2hFLE9BQU8sRUFBRSxnQkFBZ0I7b0JBQ3pCLE9BQU8sRUFBRTt3QkFDUCxTQUFTO3dCQUNULG1CQUFtQjt3QkFDbkIscUJBQXFCO3dCQUNyQixlQUFlO3dCQUNmLHFCQUFxQjt3QkFDckIsaUJBQWlCO3dCQUNqQixrQkFBa0I7d0JBQ2xCLGFBQWE7d0JBQ2IsY0FBYzt3QkFDZCxhQUFhO3dCQUNiLGtCQUFrQjt3QkFDbEIsb0JBQW9CO3dCQUNwQix3QkFBd0I7d0JBQ3hCLGVBQWU7d0JBQ2YsYUFBYTt3QkFDYixjQUFjO3dCQUNkLGdCQUFnQjt3QkFDaEIsWUFBWTt3QkFDWixZQUFZO3FCQUNiO2lCQUNGOztJQUM2QixzQkFBQztDQUFBLEFBekIvQixJQXlCK0I7U0FBbEIsZUFBZSIsInNvdXJjZXNDb250ZW50IjpbIi8vIEFuZ3VsYXJcclxuaW1wb3J0IHsgUmVhY3RpdmVGb3Jtc01vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcclxuXHJcbmltcG9ydCB7IE5nTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7XHJcbiAgTWF0QXV0b2NvbXBsZXRlTW9kdWxlLFxyXG4gIE1hdEJ1dHRvbk1vZHVsZSxcclxuICBNYXRCdXR0b25Ub2dnbGVNb2R1bGUsXHJcbiAgTWF0UGFnaW5hdG9yTW9kdWxlLFxyXG4gIE1hdENoZWNrYm94TW9kdWxlLFxyXG4gIE1hdEZvcm1GaWVsZE1vZHVsZSxcclxuICBNYXRJY29uTW9kdWxlLFxyXG4gIE1hdElucHV0TW9kdWxlLFxyXG4gIE1hdFByb2dyZXNzQmFyTW9kdWxlLFxyXG4gIE1hdFByb2dyZXNzU3Bpbm5lck1vZHVsZSxcclxuICBNYXRTZWxlY3RNb2R1bGUsXHJcbiAgTWF0U29ydE1vZHVsZSxcclxuICBNYXRUYWJsZU1vZHVsZSxcclxuICBNYXRUb29sYmFyTW9kdWxlLFxyXG4gIE1hdE1lbnVNb2R1bGVcclxufSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbCc7XHJcblxyXG5pbXBvcnQgeyBDc3ZNb2R1bGUgfSBmcm9tICdAY3RybC9uZ3gtY3N2JztcclxuaW1wb3J0IHsgQXBwRXhwb3J0Q3N2RXhwb3J0Q29tcG9uZW50IH0gZnJvbSAnLi9hcHAtdGFibGUtY3N2LWV4cG9ydC5jb21wb25lbnQnO1xyXG5pbXBvcnQgeyBDb21tb25Nb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xyXG5pbXBvcnQgeyBSb3V0ZXJNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9yb3V0ZXInO1xyXG5pbXBvcnQgeyBBdXRvVGFibGVDb21wb25lbnQgfSBmcm9tICcuL25neC1hdXRvLXRhYmxlLmNvbXBvbmVudCc7XHJcbmltcG9ydCB7IEFwcFRhYmxlTG9hZGVyQ29tcG9uZW50IH0gZnJvbSAnLi9hcHAtdGFibGUtbG9hZGVyLmNvbXBvbmVudCc7XHJcblxyXG5jb25zdCBzaGFyZWRDb21wb25lbnRzID0gW0F1dG9UYWJsZUNvbXBvbmVudCwgQXBwVGFibGVMb2FkZXJDb21wb25lbnRdO1xyXG5cclxuQE5nTW9kdWxlKHtcclxuICBkZWNsYXJhdGlvbnM6IFsuLi5zaGFyZWRDb21wb25lbnRzLCBBcHBFeHBvcnRDc3ZFeHBvcnRDb21wb25lbnRdLFxyXG4gIGV4cG9ydHM6IHNoYXJlZENvbXBvbmVudHMsXHJcbiAgaW1wb3J0czogW1xyXG4gICAgQ3N2TW9kdWxlLFxyXG4gICAgUmVhY3RpdmVGb3Jtc01vZHVsZSxcclxuICAgIE1hdEF1dG9jb21wbGV0ZU1vZHVsZSxcclxuICAgIE1hdEJ1dHRvbk1vZHVsZSxcclxuICAgIE1hdEJ1dHRvblRvZ2dsZU1vZHVsZSxcclxuICAgIE1hdENoZWNrYm94TW9kdWxlLFxyXG4gICAgTWF0Rm9ybUZpZWxkTW9kdWxlLFxyXG4gICAgTWF0SWNvbk1vZHVsZSxcclxuICAgIE1hdElucHV0TW9kdWxlLFxyXG4gICAgTWF0TWVudU1vZHVsZSxcclxuICAgIE1hdFBhZ2luYXRvck1vZHVsZSxcclxuICAgIE1hdFByb2dyZXNzQmFyTW9kdWxlLFxyXG4gICAgTWF0UHJvZ3Jlc3NTcGlubmVyTW9kdWxlLFxyXG4gICAgTWF0U2VsZWN0TW9kdWxlLFxyXG4gICAgTWF0U29ydE1vZHVsZSxcclxuICAgIE1hdFRhYmxlTW9kdWxlLFxyXG4gICAgTWF0VG9vbGJhck1vZHVsZSxcclxuICAgIENvbW1vbk1vZHVsZSxcclxuICAgIFJvdXRlck1vZHVsZSxcclxuICBdXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBBdXRvVGFibGVNb2R1bGUge31cclxuIl19