import { Component, OnInit, OnDestroy, Input, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { AutoTableConfig, ColumnDefinitionMap } from '../models';
import {
  MatTableDataSource,
  MatCheckboxChange,
  MatSort
} from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import {
  takeUntil,
  map,
  distinctUntilChanged,
  debounceTime,
  tap
} from 'rxjs/operators';
import { SimpleLogger } from '../../utils/SimpleLogger';
import { TableNotifyService } from '../table-notify.service';
import { ColumnDefinitionInternal } from '../models.internal';

@Component({
  selector: 'ngx-auto-table-content',
  template: `
    <table
      mat-table
      #table
      matSort
      [matSortActive]="config.initialSort"
      [matSortDirection]="config.initialSortDir"
      [dataSource]="dataSource"
      style="width:100%;"
      class="mat-elevation-z8"
    >
      <!-- All header definitions given to ngx-auto-table -->
      <ng-container
        *ngFor="let def of columnDefinitionsAll"
        [matColumnDef]="def.field"
      >
        <th mat-header-cell mat-sort-header *matHeaderCellDef>
          {{ def.header_pretty }}
        </th>
        <td mat-cell *matCellDef="let row">
          <div *ngIf="!def.template" [class.break-words]="def.forceWrap">
            {{ row[def.field] }}
          </div>
          <div *ngIf="def.template">
            <div
              *ngTemplateOutlet="def.template; context: { $implicit: row }"
            ></div>
          </div>
        </td>
      </ng-container>

      <ng-container matColumnDef="__bulk" stickyEnd>
        <th mat-header-cell *matHeaderCellDef>
          <mat-checkbox
            [disabled]="IsPerformingBulkAction || HasNoItems"
            (change)="onClickMasterToggle()"
            [checked]="selectionMultiple.hasValue() && IsAllSelected"
            [indeterminate]="selectionMultiple.hasValue() && !IsAllSelected"
          >
          </mat-checkbox>
        </th>
        <td mat-cell *matCellDef="let row" class="bulk-checkbox bg-initial">
          <mat-checkbox
            [disabled]="IsPerformingBulkAction"
            (click)="$event.stopPropagation()"
            (change)="onClickBulkItem($event, row)"
            [checked]="selectionMultiple.isSelected(row)"
          >
          </mat-checkbox>
        </td>
      </ng-container>

      <ng-container matColumnDef="__star" stickyEnd>
        <th mat-header-cell *matHeaderCellDef></th>
        <td mat-cell *matCellDef="let row" class="bg-initial">
          <ngx-auto-table-actions-menu
            [row]="row"
            [actions]="config?.actions"
            [actionsVisibleCount]="config?.actionsVisibleCount"
            [isPerformingBulkAction]="IsPerformingBulkAction"
          ></ngx-auto-table-actions-menu>
        </td>
      </ng-container>

      <!-- Show only visible definitions -->
      <tr
        mat-header-row
        *matHeaderRowDef="HeadersVisible"
        [hidden]="config.hideHeader"
      ></tr>
      <tr
        mat-row
        *matRowDef="let row; columns: HeadersVisible"
        (click)="onClickRow(row)"
        (dblclick)="onDoubleClickRow(row)"
        [class.selected-row-multiple]="
          !config.disableSelect && selectionMultiple.isSelected(row)
        "
        [class.selected-row-single]="
          !config.disableSelect && selectionSingle.isSelected(row)
        "
        [class.has-pointer]="!config.disableSelect && config.onSelectItem"
        [class.hover-row]="!(config.disableSelect && config.disableHoverEffect)"
      ></tr>
    </table>
  `,
  styles: [
    `
      td {
        background: unset;
      }
      .has-pointer {
        cursor: pointer;
      }
      .hover-row:hover {
        filter: brightness(0.9) hue-rotate(15deg);
      }
      .selected-row-single {
        filter: brightness(0.8) hue-rotate(15deg);
      }
      .selected-row-multiple {
        filter: brightness(0.7) hue-rotate(15deg);
      }
      .break-words {
        word-break: break-all;
      }
      .bulk-checkbox {
        width: 30px;
      }
      .bg-initial {
        background: initial;
      }
    `
  ],
  styleUrls: ['../ngx-auto-table.component.scss']
})
export class NgxAutoTableContentComponent implements OnInit, OnDestroy {
  @Input()
  IsPerformingBulkAction: boolean;
  @Input()
  IsAllSelected: boolean;
  @Input()
  IsMaxReached: boolean;
  @Input()
  HasNoItems: boolean;
  @Input()
  HeadersVisible: string[];
  @Input()
  columnDefinitionsAll: ColumnDefinitionInternal[] = [];

  @Input()
  config: AutoTableConfig<any>;
  @Input()
  selectionMultiple: SelectionModel<any>;
  @Input()
  selectionSingle: SelectionModel<any>;
  _dataSource: MatTableDataSource<any>;
  @Input()
  set dataSource(d: MatTableDataSource<any>) {
    if (!d) {
      return;
    }
    this._dataSource = d;
    this.logger.log('ngx-auto-table-content, set dataSource', {
      sort: this.sort,
      dataSource: this.dataSource
    });
    this.dataSource.sort = this.sort;
  }
  get dataSource() {
    return this._dataSource;
  }
  @Input()
  set debug(newDebug: boolean) {
    this.logger = new SimpleLogger(newDebug);
  }

  private $onDestroyed = new Subject();

  private logger = new SimpleLogger(false);

  @ViewChild(MatSort, { static: false }) sort;

  constructor(
    private breakpointObserver: BreakpointObserver,
    private notify: TableNotifyService
  ) {
    this.breakpointObserver
      .observe([Breakpoints.HandsetLandscape, Breakpoints.HandsetPortrait])
      .pipe(
        takeUntil(this.$onDestroyed),
        map(result => result.matches),
        distinctUntilChanged(),
        debounceTime(100),
        tap(isMobile =>
          this.logger.log('this.breakpointObserver$', { isMobile })
        )
      )
      .subscribe(() => {
        // this.isMobile = isMobile;
        // this.refreshDefaultColumns();
      });
  }

  ngOnInit() {}

  ngOnDestroy() {
    this.$onDestroyed.next();
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  onClickMasterToggle() {
    this.logger.log('onClickMasterToggle', {
      IsAllSelected: this.IsAllSelected
    });
    if (this.IsAllSelected) {
      this.selectionMultiple.clear();
    } else {
      this.selectAll();
    }
    if (this.config.onSelectedBulk) {
      this.config.onSelectedBulk(this.selectionMultiple.selected);
    }
  }

  private selectAll() {
    this.dataSource.sortData(
      this.dataSource.filteredData,
      this.dataSource.sort
    );
    let cutArray = this.dataSource.filteredData;
    if (this.config.bulkSelectMaxCount) {
      cutArray = this.dataSource.filteredData.slice(
        0,
        this.config.bulkSelectMaxCount
      );
    }
    this.selectionMultiple.select(...cutArray);
  }

  onClickBulkItem($event: MatCheckboxChange, item) {
    if (!$event) {
      return;
    }
    const isSelected = this.selectionMultiple.isSelected(item);
    const maxReached = this.IsMaxReached;
    if (maxReached) {
      $event.source.writeValue(false);
    }
    console.log('onClickBulkItem()', { isSelected, maxReached, $event });
    if (!maxReached) {
      this.selectionMultiple.toggle(item);
    }
    if (maxReached && isSelected) {
      this.selectionMultiple.deselect(item);
    }
    if (maxReached && !isSelected) {
      this.notify.warn(
        `Cannot select! (maxium of ${this.config.bulkSelectMaxCount} items)`
      );
    }
    if (this.config.onSelectedBulk) {
      this.config.onSelectedBulk(this.selectionMultiple.selected);
    }
  }

  onClickRow(row: any) {
    this.logger.log('onClickRow()', { row });
    this.selectionSingle.select(row);
    if (this.config.onSelectItem) {
      this.config.onSelectItem(row);
    }
  }

  onDoubleClickRow(row: any) {
    if (this.config.onSelectItemDoubleClick) {
      this.logger.log('onDoubleClickRow()', { row });
      this.selectionSingle.select(row);
      this.config.onSelectItemDoubleClick(row);
    }
  }
}
