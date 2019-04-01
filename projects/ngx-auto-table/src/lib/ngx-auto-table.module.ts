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
  MatMenuModule
} from "@angular/material";

import { CsvModule } from "@ctrl/ngx-csv";
import { AppExportCsvExportComponent } from "./app-table-csv-export.component";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { AutoTableComponent } from "./ngx-auto-table.component";
import { AppTableLoaderComponent } from "./app-table-loader.component";

const sharedComponents = [AutoTableComponent, AppTableLoaderComponent];

@NgModule({
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
    RouterModule
  ]
})
export class AutoTableModule {}
