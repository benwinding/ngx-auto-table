// Angular
import { ReactiveFormsModule } from "@angular/forms";

import { NgModule } from "@angular/core";
import { LayoutModule } from "@angular/cdk/layout";

import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatButtonModule } from "@angular/material/button";
import { MatButtonToggleModule } from "@angular/material/button-toggle"
import { MatCheckboxModule } from "@angular/material/checkbox"
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon"
import { MatInputModule } from "@angular/material/input"
import { MatMenuModule } from "@angular/material/menu"
import { MatPaginatorModule } from "@angular/material/paginator"
import { MatProgressBarModule } from "@angular/material/progress-bar"
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner"
import { MatSelectModule } from "@angular/material/select"
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { MatSortModule } from "@angular/material/sort"
import { MatTableModule } from "@angular/material/table"
import { MatTooltipModule } from "@angular/material/tooltip"
import { MatToolbarModule } from "@angular/material/toolbar"

import { NgxAutoTableActionsMenuComponent } from "./table/actions-menu.component";
import { NgxAutoTableFooterComponent } from "./footer/table-footer";
import { NgxAutoTableContentComponent } from "./table/table-content.component";

import { AppExportCsvExportComponent } from "./footer/app-table-csv-export.component";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { AutoTableComponent } from "./ngx-auto-table.component";
import { AppToolbarLoaderComponent } from "./loaders/toolbar-loader.component";
import { AppTableLoaderComponent } from './loaders/table-loader.component';
import { TableNotifyService } from "./table-notify.service";
import { TableHeaderModule } from "./header/table-header.module";
import { NgxAutoTableFilterColumnComponent } from "./table/table-filter-button.component";
import { MatBadgeModule } from "@angular/material/badge";

const sharedComponents = [AutoTableComponent];

@NgModule({
  declarations: [
    AppTableLoaderComponent,
    AppToolbarLoaderComponent,
    AppExportCsvExportComponent,
    NgxAutoTableActionsMenuComponent,
    NgxAutoTableFooterComponent,
    NgxAutoTableContentComponent,
    NgxAutoTableFilterColumnComponent,
    ...sharedComponents,
  ],
  providers: [TableNotifyService],
  exports: sharedComponents,
  imports: [
    ReactiveFormsModule,
    LayoutModule,
    TableHeaderModule,
    MatAutocompleteModule,
    MatBadgeModule,
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
    MatSnackBarModule,
    MatSortModule,
    MatTableModule,
    MatTooltipModule,
    MatToolbarModule,
    CommonModule,
    RouterModule
  ]
})
export class AutoTableModule {}
