import {
  Component,
  OnInit,
  OnDestroy,
  AfterViewInit,
  Input,
  ViewChild,
  Output,
  EventEmitter,
} from '@angular/core';
import { AutoTableConfig } from '../models';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';

import { Subject, BehaviorSubject } from 'rxjs';
import { SimpleLogger } from '../../utils/SimpleLogger';
import { filter, takeUntil, debounceTime } from 'rxjs/operators';

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
        <h1 class="no-items">{{ noItemsMessage || 'No items found' }}</h1>
      </mat-toolbar-row>
      <mat-toolbar-row class="paginator-row">
        <app-table-csv-export
          *ngIf="exportFilename"
          [data]="rawData"
          [exportFunction]="exportFunction"
          [filename]="exportFilename"
        ></app-table-csv-export>
        <mat-paginator
          #paginator
          [hidden]="config.hidePaginator"
          (page)="onPageChange($event)"
          [pageSize]="config.pageSize || defaultPageSize"
          [pageSizeOptions]="defaultPageOptions"
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
    `,
  ],
  styleUrls: ['../ngx-auto-table.component.scss'],
})
export class NgxAutoTableFooterComponent
  implements OnInit, OnDestroy, AfterViewInit {
  @Input()
  IsLoading: boolean;
  @Input()
  HasNoItems: boolean;
  @Input()
  noItemsMessage: string;
  @Input()
  config: AutoTableConfig<any>;
  @Input()
  set dataSourceData(data: any[]) {
    this.initExport(data);
  }
  @Input()
  set pageIndex(val: number) {
    val && (this.paginator.pageIndex = Number(val));
  }
  @Input()
  set pageSize(val: number) {
    if (!val) {
      return;
    }
    const valNum = Number(val);
    this.paginator.pageSize = valNum;
    if (!this.defaultPageOptions.includes(valNum)) {
      this.defaultPageOptions.push(valNum);
    }
  }
  @Input()
  set dataSource(newDataSource: MatTableDataSource<any>) {
    this._dataSource.next(newDataSource);
  }
  @Output()
  pageSizeChanged = new EventEmitter<number>();
  @Output()
  pageIndexChanged = new EventEmitter<number>();

  _dataSource = new BehaviorSubject<MatTableDataSource<any>>(null);

  defaultPageSize = 25;
  defaultPageOptions = [5, 10, 25, 100];

  rawData: any[];
  exportFilename: string;
  exportFunction: (row: any) => void;

  @ViewChild('paginator', { static: false }) paginator: MatPaginator;

  private $onDestroyed = new Subject();

  private logger = new SimpleLogger('footer', false);

  ngOnInit() {
    this.logger = new SimpleLogger('footer', true);
  }

  ngAfterViewInit(): void {
    this._dataSource
      .pipe(
        takeUntil(this.$onDestroyed),
        filter((d) => !!d),
        debounceTime(10)
      )
      .subscribe((dataSource) => {
        this.logger.log('_dataSource.pipe', {
          dataSource,
          paginator: this.paginator,
        });
        dataSource.paginator = this.paginator;
      });
  }

  ngOnDestroy() {
    this.$onDestroyed.next();
  }

  onPageChange($event: PageEvent) {
    this.pageSizeChanged.next($event.pageSize);
    this.pageIndexChanged.next($event.pageIndex);
  }

  initExport(originalData: any[]) {
    this.logger.log('NgxAutoTableFooterComponent initExport', { originalData });
    this.exportFilename = this.config.exportFilename;
    if (!this.exportFilename) {
      return;
    }
    this.rawData = originalData;
    this.exportFunction = this.config.exportRowFormat;
  }
}
