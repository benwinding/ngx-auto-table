/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
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
const sharedComponents = [AutoTableComponent, AppTableLoaderComponent];
export class AutoTableModule {
}
AutoTableModule.decorators = [
    { type: NgModule, args: [{
                declarations: [...sharedComponents, AppExportCsvExportComponent],
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LWF1dG8tdGFibGUubW9kdWxlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vbmd4LWF1dG8tdGFibGUvIiwic291cmNlcyI6WyJsaWIvbmd4LWF1dG8tdGFibGUubW9kdWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQ0EsT0FBTyxFQUFFLG1CQUFtQixFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFFckQsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUN6QyxPQUFPLEVBQ0wscUJBQXFCLEVBQ3JCLGVBQWUsRUFDZixxQkFBcUIsRUFDckIsa0JBQWtCLEVBQ2xCLGlCQUFpQixFQUNqQixrQkFBa0IsRUFDbEIsYUFBYSxFQUNiLGNBQWMsRUFDZCxvQkFBb0IsRUFDcEIsd0JBQXdCLEVBQ3hCLGVBQWUsRUFDZixhQUFhLEVBQ2IsY0FBYyxFQUNkLGdCQUFnQixFQUNoQixhQUFhLEVBQ2QsTUFBTSxtQkFBbUIsQ0FBQztBQUUzQixPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQzFDLE9BQU8sRUFBRSwyQkFBMkIsRUFBRSxNQUFNLGtDQUFrQyxDQUFDO0FBQy9FLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUMvQyxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDL0MsT0FBTyxFQUFFLGtCQUFrQixFQUFFLE1BQU0sNEJBQTRCLENBQUM7QUFDaEUsT0FBTyxFQUFFLHVCQUF1QixFQUFFLE1BQU0sOEJBQThCLENBQUM7O01BRWpFLGdCQUFnQixHQUFHLENBQUMsa0JBQWtCLEVBQUUsdUJBQXVCLENBQUM7QUEyQnRFLE1BQU0sT0FBTyxlQUFlOzs7WUF6QjNCLFFBQVEsU0FBQztnQkFDUixZQUFZLEVBQUUsQ0FBQyxHQUFHLGdCQUFnQixFQUFFLDJCQUEyQixDQUFDO2dCQUNoRSxPQUFPLEVBQUUsZ0JBQWdCO2dCQUN6QixPQUFPLEVBQUU7b0JBQ1AsU0FBUztvQkFDVCxtQkFBbUI7b0JBQ25CLHFCQUFxQjtvQkFDckIsZUFBZTtvQkFDZixxQkFBcUI7b0JBQ3JCLGlCQUFpQjtvQkFDakIsa0JBQWtCO29CQUNsQixhQUFhO29CQUNiLGNBQWM7b0JBQ2QsYUFBYTtvQkFDYixrQkFBa0I7b0JBQ2xCLG9CQUFvQjtvQkFDcEIsd0JBQXdCO29CQUN4QixlQUFlO29CQUNmLGFBQWE7b0JBQ2IsY0FBYztvQkFDZCxnQkFBZ0I7b0JBQ2hCLFlBQVk7b0JBQ1osWUFBWTtpQkFDYjthQUNGIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQW5ndWxhclxyXG5pbXBvcnQgeyBSZWFjdGl2ZUZvcm1zTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xyXG5cclxuaW1wb3J0IHsgTmdNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHtcclxuICBNYXRBdXRvY29tcGxldGVNb2R1bGUsXHJcbiAgTWF0QnV0dG9uTW9kdWxlLFxyXG4gIE1hdEJ1dHRvblRvZ2dsZU1vZHVsZSxcclxuICBNYXRQYWdpbmF0b3JNb2R1bGUsXHJcbiAgTWF0Q2hlY2tib3hNb2R1bGUsXHJcbiAgTWF0Rm9ybUZpZWxkTW9kdWxlLFxyXG4gIE1hdEljb25Nb2R1bGUsXHJcbiAgTWF0SW5wdXRNb2R1bGUsXHJcbiAgTWF0UHJvZ3Jlc3NCYXJNb2R1bGUsXHJcbiAgTWF0UHJvZ3Jlc3NTcGlubmVyTW9kdWxlLFxyXG4gIE1hdFNlbGVjdE1vZHVsZSxcclxuICBNYXRTb3J0TW9kdWxlLFxyXG4gIE1hdFRhYmxlTW9kdWxlLFxyXG4gIE1hdFRvb2xiYXJNb2R1bGUsXHJcbiAgTWF0TWVudU1vZHVsZVxyXG59IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsJztcclxuXHJcbmltcG9ydCB7IENzdk1vZHVsZSB9IGZyb20gJ0BjdHJsL25neC1jc3YnO1xyXG5pbXBvcnQgeyBBcHBFeHBvcnRDc3ZFeHBvcnRDb21wb25lbnQgfSBmcm9tICcuL2FwcC10YWJsZS1jc3YtZXhwb3J0LmNvbXBvbmVudCc7XHJcbmltcG9ydCB7IENvbW1vbk1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XHJcbmltcG9ydCB7IFJvdXRlck1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL3JvdXRlcic7XHJcbmltcG9ydCB7IEF1dG9UYWJsZUNvbXBvbmVudCB9IGZyb20gJy4vbmd4LWF1dG8tdGFibGUuY29tcG9uZW50JztcclxuaW1wb3J0IHsgQXBwVGFibGVMb2FkZXJDb21wb25lbnQgfSBmcm9tICcuL2FwcC10YWJsZS1sb2FkZXIuY29tcG9uZW50JztcclxuXHJcbmNvbnN0IHNoYXJlZENvbXBvbmVudHMgPSBbQXV0b1RhYmxlQ29tcG9uZW50LCBBcHBUYWJsZUxvYWRlckNvbXBvbmVudF07XHJcblxyXG5ATmdNb2R1bGUoe1xyXG4gIGRlY2xhcmF0aW9uczogWy4uLnNoYXJlZENvbXBvbmVudHMsIEFwcEV4cG9ydENzdkV4cG9ydENvbXBvbmVudF0sXHJcbiAgZXhwb3J0czogc2hhcmVkQ29tcG9uZW50cyxcclxuICBpbXBvcnRzOiBbXHJcbiAgICBDc3ZNb2R1bGUsXHJcbiAgICBSZWFjdGl2ZUZvcm1zTW9kdWxlLFxyXG4gICAgTWF0QXV0b2NvbXBsZXRlTW9kdWxlLFxyXG4gICAgTWF0QnV0dG9uTW9kdWxlLFxyXG4gICAgTWF0QnV0dG9uVG9nZ2xlTW9kdWxlLFxyXG4gICAgTWF0Q2hlY2tib3hNb2R1bGUsXHJcbiAgICBNYXRGb3JtRmllbGRNb2R1bGUsXHJcbiAgICBNYXRJY29uTW9kdWxlLFxyXG4gICAgTWF0SW5wdXRNb2R1bGUsXHJcbiAgICBNYXRNZW51TW9kdWxlLFxyXG4gICAgTWF0UGFnaW5hdG9yTW9kdWxlLFxyXG4gICAgTWF0UHJvZ3Jlc3NCYXJNb2R1bGUsXHJcbiAgICBNYXRQcm9ncmVzc1NwaW5uZXJNb2R1bGUsXHJcbiAgICBNYXRTZWxlY3RNb2R1bGUsXHJcbiAgICBNYXRTb3J0TW9kdWxlLFxyXG4gICAgTWF0VGFibGVNb2R1bGUsXHJcbiAgICBNYXRUb29sYmFyTW9kdWxlLFxyXG4gICAgQ29tbW9uTW9kdWxlLFxyXG4gICAgUm91dGVyTW9kdWxlLFxyXG4gIF1cclxufSlcclxuZXhwb3J0IGNsYXNzIEF1dG9UYWJsZU1vZHVsZSB7fVxyXG4iXX0=