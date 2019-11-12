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
  MatTooltipModule
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

const sharedComponents = [AutoTableComponent];

@NgModule({
  declarations: [
    AppTableLoaderComponent,
    AppToolbarLoaderComponent,
    AppExportCsvExportComponent,
    AppBtnLoaderComponent,
    ...sharedComponents,
  ],
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
    MatSortModule,
    MatTableModule,
    MatTooltipModule,
    MatToolbarModule,
    CommonModule,
    RouterModule
  ]
})
export class AutoTableModule {}
