import { Component, OnInit, Input, OnDestroy, ViewChild } from '@angular/core';
import { AutoTableConfig } from '../models';

import { Subject } from 'rxjs';
import { MatPaginator, MatTableDataSource } from '@angular/material';
import { SimpleLogger } from '../../utils/SimpleLogger';

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
          [hidden]="config.hidePaginator"
          [pageSize]="config.pageSize || defaultPageSize"
          [pageSizeOptions]="[5, 10, 25, 100]"
        >
        </mat-paginator>
      </mat-toolbar-row>
    </mat-toolbar>
  `,
  styles: [
    `
      .no-items,
      ngx-auto-app-table-loader {
        text-align: center;
        padding: 20px;
        width: 100%;
      }
      .no-items {
        color: #555;
      }
      .mat-paginator {
        background-color: transparent;
      }
      .paginator-row {
        display: flex;
        align-items: centered;
        justify-content: space-between;
        height: unset;
      }
      .full-width {
        width: 100%;
      }
      .expansion-joint {
        flex-grow: 1;
        min-height: 0px;
      }
    `
  ],
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
    this.logger.log('NgxAutoTableFooterComponent', { newDataSource });
    if (!newDataSource) {
      return;
    }
    newDataSource.paginator = this.paginator;
    this.initExport(newDataSource.data);
  }

  defaultPageSize = 25;

  exportData: any[];
  exportFilename: string;

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;

  private $onDestroyed = new Subject();

  private logger = new SimpleLogger('footer', false);

  ngOnInit() {
    this.logger = new SimpleLogger('footer', this.config.debug);
  }

  ngOnDestroy() {
    this.$onDestroyed.next();
  }

  initExport(originalData: any[]) {
    this.logger.log('NgxAutoTableFooterComponent initExport', { originalData });
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
