import { NgModule } from '@angular/core';
import { NutotableComponent } from './nutotable.component';
import { AppExportCsvExportComponent } from './app-table-csv-export.component';
import { CsvModule } from '@ctrl/ngx-csv';

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
} from '@angular/material';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [NutotableComponent, AppExportCsvExportComponent],
  imports: [
    CommonModule,
    CsvModule,
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
  ],
  exports: [NutotableComponent]
})
export class NutotableModule { }
