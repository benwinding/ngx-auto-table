/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
// Angular
import { ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { AutoTableComponent } from './components/ngx-auto-table.component';
import { MatAutocompleteModule, MatButtonModule, MatButtonToggleModule, MatPaginatorModule, MatCheckboxModule, MatFormFieldModule, MatIconModule, MatInputModule, MatProgressBarModule, MatProgressSpinnerModule, MatSelectModule, MatSortModule, MatTableModule, MatToolbarModule, MatMenuModule } from '@angular/material';
import { AppTableLoaderComponent } from './components/app-table-loader.component';
import { CsvModule } from '@ctrl/ngx-csv';
import { AppExportCsvExportComponent } from './components/app-table-csv-export.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
/** @type {?} */
const sharedComponents = [AutoTableComponent, AppTableLoaderComponent];
export class AutoTableModule {
}
AutoTableModule.decorators = [
    { type: NgModule, args: [{
                declarations: [...sharedComponents, AppExportCsvExportComponent],
                exports: sharedComponents,
                imports: [
                    CommonModule,
                    RouterModule,
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
                ]
            },] }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LWF1dG8tdGFibGUubW9kdWxlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vbmd4LWF1dG8tdGFibGUtbGliLyIsInNvdXJjZXMiOlsibmd4LWF1dG8tdGFibGUubW9kdWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQ0EsT0FBTyxFQUFFLG1CQUFtQixFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFFckQsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUN6QyxPQUFPLEVBQUUsa0JBQWtCLEVBQUUsTUFBTSx1Q0FBdUMsQ0FBQztBQUMzRSxPQUFPLEVBQ0wscUJBQXFCLEVBQ3JCLGVBQWUsRUFDZixxQkFBcUIsRUFDckIsa0JBQWtCLEVBQ2xCLGlCQUFpQixFQUNqQixrQkFBa0IsRUFDbEIsYUFBYSxFQUNiLGNBQWMsRUFDZCxvQkFBb0IsRUFDcEIsd0JBQXdCLEVBQ3hCLGVBQWUsRUFDZixhQUFhLEVBQ2IsY0FBYyxFQUNkLGdCQUFnQixFQUNoQixhQUFhLEVBQ2QsTUFBTSxtQkFBbUIsQ0FBQztBQUUzQixPQUFPLEVBQUUsdUJBQXVCLEVBQUUsTUFBTSx5Q0FBeUMsQ0FBQztBQUNsRixPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQzFDLE9BQU8sRUFBRSwyQkFBMkIsRUFBRSxNQUFNLDZDQUE2QyxDQUFDO0FBQzFGLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUMvQyxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0saUJBQWlCLENBQUM7O01BRXpDLGdCQUFnQixHQUFHLENBQUMsa0JBQWtCLEVBQUUsdUJBQXVCLENBQUM7QUEyQnRFLE1BQU0sT0FBTyxlQUFlOzs7WUF6QjNCLFFBQVEsU0FBQztnQkFDUixZQUFZLEVBQUUsQ0FBQyxHQUFHLGdCQUFnQixFQUFFLDJCQUEyQixDQUFDO2dCQUNoRSxPQUFPLEVBQUUsZ0JBQWdCO2dCQUN6QixPQUFPLEVBQUU7b0JBQ1AsWUFBWTtvQkFDWixZQUFZO29CQUNaLFNBQVM7b0JBQ1QsbUJBQW1CO29CQUNuQixxQkFBcUI7b0JBQ3JCLGVBQWU7b0JBQ2YscUJBQXFCO29CQUNyQixpQkFBaUI7b0JBQ2pCLGtCQUFrQjtvQkFDbEIsYUFBYTtvQkFDYixjQUFjO29CQUNkLGFBQWE7b0JBQ2Isa0JBQWtCO29CQUNsQixvQkFBb0I7b0JBQ3BCLHdCQUF3QjtvQkFDeEIsZUFBZTtvQkFDZixhQUFhO29CQUNiLGNBQWM7b0JBQ2QsZ0JBQWdCO2lCQUNqQjthQUNGIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQW5ndWxhclxyXG5pbXBvcnQgeyBSZWFjdGl2ZUZvcm1zTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xyXG5cclxuaW1wb3J0IHsgTmdNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgQXV0b1RhYmxlQ29tcG9uZW50IH0gZnJvbSAnLi9jb21wb25lbnRzL25neC1hdXRvLXRhYmxlLmNvbXBvbmVudCc7XHJcbmltcG9ydCB7XHJcbiAgTWF0QXV0b2NvbXBsZXRlTW9kdWxlLFxyXG4gIE1hdEJ1dHRvbk1vZHVsZSxcclxuICBNYXRCdXR0b25Ub2dnbGVNb2R1bGUsXHJcbiAgTWF0UGFnaW5hdG9yTW9kdWxlLFxyXG4gIE1hdENoZWNrYm94TW9kdWxlLFxyXG4gIE1hdEZvcm1GaWVsZE1vZHVsZSxcclxuICBNYXRJY29uTW9kdWxlLFxyXG4gIE1hdElucHV0TW9kdWxlLFxyXG4gIE1hdFByb2dyZXNzQmFyTW9kdWxlLFxyXG4gIE1hdFByb2dyZXNzU3Bpbm5lck1vZHVsZSxcclxuICBNYXRTZWxlY3RNb2R1bGUsXHJcbiAgTWF0U29ydE1vZHVsZSxcclxuICBNYXRUYWJsZU1vZHVsZSxcclxuICBNYXRUb29sYmFyTW9kdWxlLFxyXG4gIE1hdE1lbnVNb2R1bGVcclxufSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbCc7XHJcblxyXG5pbXBvcnQgeyBBcHBUYWJsZUxvYWRlckNvbXBvbmVudCB9IGZyb20gJy4vY29tcG9uZW50cy9hcHAtdGFibGUtbG9hZGVyLmNvbXBvbmVudCc7XHJcbmltcG9ydCB7IENzdk1vZHVsZSB9IGZyb20gJ0BjdHJsL25neC1jc3YnO1xyXG5pbXBvcnQgeyBBcHBFeHBvcnRDc3ZFeHBvcnRDb21wb25lbnQgfSBmcm9tICcuL2NvbXBvbmVudHMvYXBwLXRhYmxlLWNzdi1leHBvcnQuY29tcG9uZW50JztcclxuaW1wb3J0IHsgQ29tbW9uTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcclxuaW1wb3J0IHsgUm91dGVyTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvcm91dGVyJztcclxuXHJcbmNvbnN0IHNoYXJlZENvbXBvbmVudHMgPSBbQXV0b1RhYmxlQ29tcG9uZW50LCBBcHBUYWJsZUxvYWRlckNvbXBvbmVudF07XHJcblxyXG5ATmdNb2R1bGUoe1xyXG4gIGRlY2xhcmF0aW9uczogWy4uLnNoYXJlZENvbXBvbmVudHMsIEFwcEV4cG9ydENzdkV4cG9ydENvbXBvbmVudF0sXHJcbiAgZXhwb3J0czogc2hhcmVkQ29tcG9uZW50cyxcclxuICBpbXBvcnRzOiBbXHJcbiAgICBDb21tb25Nb2R1bGUsXHJcbiAgICBSb3V0ZXJNb2R1bGUsXHJcbiAgICBDc3ZNb2R1bGUsXHJcbiAgICBSZWFjdGl2ZUZvcm1zTW9kdWxlLFxyXG4gICAgTWF0QXV0b2NvbXBsZXRlTW9kdWxlLFxyXG4gICAgTWF0QnV0dG9uTW9kdWxlLFxyXG4gICAgTWF0QnV0dG9uVG9nZ2xlTW9kdWxlLFxyXG4gICAgTWF0Q2hlY2tib3hNb2R1bGUsXHJcbiAgICBNYXRGb3JtRmllbGRNb2R1bGUsXHJcbiAgICBNYXRJY29uTW9kdWxlLFxyXG4gICAgTWF0SW5wdXRNb2R1bGUsXHJcbiAgICBNYXRNZW51TW9kdWxlLFxyXG4gICAgTWF0UGFnaW5hdG9yTW9kdWxlLFxyXG4gICAgTWF0UHJvZ3Jlc3NCYXJNb2R1bGUsXHJcbiAgICBNYXRQcm9ncmVzc1NwaW5uZXJNb2R1bGUsXHJcbiAgICBNYXRTZWxlY3RNb2R1bGUsXHJcbiAgICBNYXRTb3J0TW9kdWxlLFxyXG4gICAgTWF0VGFibGVNb2R1bGUsXHJcbiAgICBNYXRUb29sYmFyTW9kdWxlLFxyXG4gIF1cclxufSlcclxuZXhwb3J0IGNsYXNzIEF1dG9UYWJsZU1vZHVsZSB7fVxyXG4iXX0=