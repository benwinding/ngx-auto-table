import {
  Component,
  OnInit,
  Input,
  OnDestroy,
  ViewChild
} from '@angular/core';
import { AutoTableConfig } from '../AutoTableConfig';

import { Subject } from 'rxjs';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';

@Component({
  selector: 'ngx-auto-table-footer',
  template: `
    <mat-toolbar class="mat-elevation-z8 overflow-hidden expansion-joint">
      <mat-toolbar-row> </mat-toolbar-row>
    </mat-toolbar>
    <mat-toolbar class="mat-elevation-z8 overflow-hidden">
      <mat-toolbar-row *ngIf="IsLoading">
        <ngx-auto-app-toolbar-loader
          class="full-width"
        ></ngx-auto-app-toolbar-loader>
      </mat-toolbar-row>
      <mat-toolbar-row *ngIf="IsLoading">
        <h1 class="no-items">Loading...</h1>
      </mat-toolbar-row>
      <mat-toolbar-row *ngIf="HasNoItems">
        <h1 class="no-items">No items found</h1>
      </mat-toolbar-row>
      <mat-toolbar-row class="paginator-row">
        <app-table-csv-export
          *ngIf="exportFilename"
          [dataArray]="exportData"
          [filename]="exportFilename"
        ></app-table-csv-export>
        <mat-paginator
          *ngIf="!config.hidePaginator"
          [pageSize]="config.pageSize || defaultPageSize"
          [pageSizeOptions]="[5, 10, 25, 100]"
        >
        </mat-paginator>
      </mat-toolbar-row>
    </mat-toolbar>
  `,
  styleUrls: ['../ngx-auto-table.component.scss']
})
export class NgxAutoTableFooterComponent implements OnInit, OnDestroy {
  @Input()
  IsLoading: boolean;
  @Input()
  HasNoItems: boolean;
  @Input()
  config: AutoTableConfig<any>;
  @Input()
  set dataSource(newDataSource: MatTableDataSource<any>) {
    setTimeout(() => {
      newDataSource.paginator = this.paginator;
      newDataSource.sort = this.sort;
      this.initExport(newDataSource.data);
    })
  }

  defaultPageSize = 25;

  exportData: any[];
  exportFilename: string;

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;

  private $onDestroyed = new Subject();

  ngOnInit() {
  }

  ngOnDestroy() {
    this.$onDestroyed.next();
  }

  initExport(originalData: any[]) {
    this.exportFilename = this.config.exportFilename;
    if (!this.exportFilename) {
      return;
    }
    this.exportData = originalData.map(dataItem => {
      if (!this.config.exportRowFormat) {
        return dataItem;
      }
      return this.config.exportRowFormat(dataItem);
    });
  }
}
