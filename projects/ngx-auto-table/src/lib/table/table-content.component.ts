import {
  Component,
  OnInit,
  OnDestroy,
  Input,
  ViewChild,
  Output,
  EventEmitter,
} from '@angular/core';
import { Subject, BehaviorSubject } from 'rxjs';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatCheckboxChange } from '@angular/material/checkbox';

import { AutoTableConfig } from '../models';
import { SimpleLogger } from '../../utils/SimpleLogger';
import { TableNotifyService } from '../table-notify.service';
import {
  ColumnDefinitionInternal,
  ColumnFilterBy,
  ColumnFilterByMap,
} from '../models.internal';

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
        <td mat-header-cell *matHeaderCellDef>
          <div class="flex items-center">
            <span mat-sort-header>{{ def.header_pretty }}</span>
            <ngx-auto-table-filter-button
              *ngIf="!!def.filter"
              [filter]="def.filter"
              [header]="def.header_pretty"
              [controlStringOptions]="def.$string_options | async"
              (filterBy)="onFilterBy($event, def.field)"
            >
            </ngx-auto-table-filter-button>
          </div>
        </td>
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
        <th mat-header-cell *matHeaderCellDef class="is-transparent">
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
        <th mat-header-cell *matHeaderCellDef class="is-transparent"></th>
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
      .flex {
        display: flex;
      }
      .items-center {
        align-items: center;
      }
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
      .is-transparent {
        background: transparent;
      }
    `,
  ],
  styleUrls: ['../ngx-auto-table.component.scss'],
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
      dataSource: this.dataSource,
    });
    this.dataSource.sort = this.sort;
  }
  get dataSource() {
    return this._dataSource;
  }
  @Input()
  set debug(newDebug: boolean) {
    this.logger = new SimpleLogger('content', newDebug);
  }
  @Output()
  filtersChanged = new EventEmitter<ColumnFilterByMap>();

  currentFilters = new BehaviorSubject<ColumnFilterByMap>(null);

  private $onDestroyed = new Subject();

  private logger = new SimpleLogger('content', false);

  @ViewChild(MatSort, { static: false }) sort: MatSort;

  constructor(private notify: TableNotifyService) {}

  ngOnInit() {}

  ngOnDestroy() {
    this.$onDestroyed.next();
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  onClickMasterToggle() {
    this.logger.log('onClickMasterToggle', {
      IsAllSelected: this.IsAllSelected,
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

  onFilterBy(filter: ColumnFilterBy, fieldName: string) {
    const f: ColumnFilterByMap = this.currentFilters.getValue() || {};
    if (filter) {
      f[fieldName] = filter;
    } else {
      delete f[fieldName];
    }
    this.filtersChanged.next(f);
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
