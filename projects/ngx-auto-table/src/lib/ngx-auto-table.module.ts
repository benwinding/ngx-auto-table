// Angular
import { ReactiveFormsModule } from "@angular/forms";

import { NgModule } from "@angular/core";
import {
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
  MatMenuModule,
  MatTooltipModule,
  MatSnackBarModule
} from "@angular/material";

import { CsvModule } from "@ctrl/ngx-csv";
import { AppExportCsvExportComponent } from "./app-table-csv-export.component";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { AutoTableComponent } from "./ngx-auto-table.component";
import { AppToolbarLoaderComponent } from "./loaders/toolbar-loader.component";
import { AppBtnLoaderComponent } from "./loaders/btn-loader.component";
import { AppTableLoaderComponent } from './loaders/table-loader.component';
import { LayoutModule } from "@angular/cdk/layout";
import { TableNotifyService } from "./table-notify.service";
import { NgxAutoTableActionsMenuComponent } from "./actions-menu.component";
import { NgxAutoTableHeaderComponent } from "./table-header.component";
import { NgxAutoTableHeaderColumnsChooserComponent } from "./table-header-columns-chooser";
import { NgxAutoTableHeaderSearchComponent } from "./table-header-search.component";
import { NgxAutoTableFooterComponent } from "./table-footer";

const sharedComponents = [AutoTableComponent];

@NgModule({
  declarations: [
    AppTableLoaderComponent,
    AppToolbarLoaderComponent,
    AppExportCsvExportComponent,
    AppBtnLoaderComponent,
    NgxAutoTableActionsMenuComponent,
    NgxAutoTableHeaderComponent,
    NgxAutoTableHeaderSearchComponent,
    NgxAutoTableHeaderColumnsChooserComponent,
    NgxAutoTableFooterComponent,
    ...sharedComponents,
  ],
  providers: [TableNotifyService],
  exports: sharedComponents,
  imports: [
    CsvModule,
    ReactiveFormsModule,
    LayoutModule,
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
