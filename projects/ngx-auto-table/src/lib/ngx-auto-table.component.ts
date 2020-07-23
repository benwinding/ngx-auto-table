import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Subject, Observable, combineLatest, BehaviorSubject } from 'rxjs';
import { SelectionModel } from '@angular/cdk/collections';
import {
  filter,
  takeUntil,
  debounceTime,
  map,
  distinctUntilChanged,
  tap,
} from 'rxjs/operators';
import { AutoTableConfig, ColumnDefinitionMap } from './models';

import { ColumnsManager } from './columns-manager';
import { SimpleLogger } from '../utils/SimpleLogger';
import { blankConfig } from './models.defaults';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { SearchManager } from './search-manager';

@Component({
  selector: 'ngx-auto-table',
  template: `
    <div
      [class.isMobile]="config.disableMobileScroll"
      class="table-container mat-elevation-z8"
    >
      <ngx-auto-table-header
        [config]="config"
        [$setSearchText]="$setSearchText"
        [IsPerformingBulkAction]="IsPerformingBulkAction"
        [HasNoItems]="HasNoItems"
        [IsMaxReached]="IsMaxReached"
        [headerKeyValues]="
          columnsManager.HeadersChoicesKeyValuesSorted$ | async
        "
        [selectionMultiple]="selectionMultiple"
        [selectedHeaderKeys]="columnsManager.HeadersVisible"
        (searchChanged)="$CurrentSearchText.next($event)"
        (searchHeadersChanged)="onSearchHeadersChanged($event)"
        (columnsChanged)="onColumnsChanged($event)"
        (bulkActionStatus)="IsPerformingBulkAction = $event"
      ></ngx-auto-table-header>
      <ngx-auto-table-content
        [IsPerformingBulkAction]="IsPerformingBulkAction"
        [IsAllSelected]="IsAllSelected"
        [IsMaxReached]="IsMaxReached"
        [HasNoItems]="HasNoItems"
        [HeadersVisible]="columnsManager.HeadersVisible"
        [config]="config"
        [debug]="config?.debug"
        [dataSource]="dataSource"
        [selectionMultiple]="selectionMultiple"
        [selectionSingle]="selectionSingle"
        [columnDefinitionsAll]="columnsManager.AllColumnDefinitions"
      ></ngx-auto-table-content>
      <ngx-auto-table-footer
        [HasNoItems]="HasNoItems"
        [IsLoading]="$IsLoading | async"
        [config]="config"
        [dataSource]="dataSource"
        [noItemsMessage]="config?.noItemsFoundPlaceholder"
      ></ngx-auto-table-footer>
    </div>
  `,
  styles: [
    `
      .table-container {
        display: flex;
        flex-direction: column;
        overflow-y: auto;
      }
      .isMobile {
        overflow-x: hidden;
      }
    `,
  ],
  styleUrls: ['./ngx-auto-table.component.scss'],
})
export class AutoTableComponent<T> implements OnInit, OnDestroy {
  private _blankConfig: AutoTableConfig<T> = blankConfig<T>();
  private _config: AutoTableConfig<T>;
  @Input()
  set config(newConfig) {
    this._config = newConfig;
    setTimeout(() => {
      this.$onDestroyed.next();
      this.ngOnInit();
    });
  }
  get config(): AutoTableConfig<T> {
    return this._config || this._blankConfig;
  }
  @Input()
  columnDefinitions: ColumnDefinitionMap = {};

  dataSource: MatTableDataSource<any>;

  columnsManager = new ColumnsManager();
  searchManager = new SearchManager<T>();

  IsPerformingBulkAction = false;

  // Bulk items selection
  selectionMultiple = new SelectionModel<any>(true, []);
  selectionSingle = new SelectionModel<any>(false, []);

  $onDestroyed = new Subject();

  $isMobile: Observable<boolean>;
  $isTablet: Observable<boolean>;

  $refreshTrigger = new Subject<string[]>();
  $setDisplayedColumnsTrigger = new Subject<string[]>();
  $setSearchHeadersTrigger = new Subject<string[]>();
  $setSearchText = new Subject<string>();
  $CurrentSearchText = new BehaviorSubject<string>('');

  private $triggerFilter = new Subject<string>();

  $IsLoading = new Subject<boolean>();

  private logger: SimpleLogger;

  get HasNoItems(): boolean {
    return (
      this.dataSource && this.dataSource.data && !this.dataSource.data.length
    );
  }

  get IsMaxReached(): boolean {
    if (!this.config.bulkSelectMaxCount) {
      return false;
    }
    const maxReached =
      this.selectionMultiple.selected.length >= this.config.bulkSelectMaxCount;
    return maxReached;
  }

  get IsAllSelected() {
    const numSelected = this.selectionMultiple.selected.length;
    if (!this.dataSource || !this.dataSource.filteredData) {
      return false;
    }
    const numInData = this.dataSource.filteredData.length;
    if (numSelected >= numInData) {
      return true;
    }
    if (
      this.config.bulkSelectMaxCount &&
      numSelected >= this.config.bulkSelectMaxCount
    ) {
      return true;
    }
    return false;
  }

  constructor(private breakpointObserver: BreakpointObserver) {}

  ngOnInit() {
    this.logger = new SimpleLogger('main.component', this.config.debug);
    this.columnsManager.SetLogging(this.config.debug);
    this.searchManager.SetColumsManager(this.columnsManager);
    this.searchManager.SetConfig(this.config);

    this.$isMobile = this.breakpointObserver.observe('(max-width: 599px)').pipe(
      map((result) => result.matches && Object.values(result.breakpoints).every(v => !!v)),
      tap(result => console.log('$isMobile', result)),
      takeUntil(this.$onDestroyed),
      distinctUntilChanged(),
      debounceTime(100),
    );

    this.$isTablet = this.breakpointObserver
      .observe(['(min-width: 600px)', '(max-width: 959px)'])
      .pipe(
        map((result) => result.matches && Object.values(result.breakpoints).every(v => !!v)),
        tap(result => console.log('$isTablet', result)),
        takeUntil(this.$onDestroyed),
        distinctUntilChanged(),
        debounceTime(100),
      );

    if (!this.config) {
      this.logger.log('ngOnInit(), no [config] set on auto-table component');
      return;
    }

    this.$setDisplayedColumnsTrigger
      .pipe(takeUntil(this.$onDestroyed), debounceTime(100))
      .subscribe((newHeaders) => {
        this.logger.log('setDisplayedColumnsTrigger', { newHeaders });
        this.columnsManager.SetDisplayed<T>(
          newHeaders,
          !!this.config.actions,
          !!this.config.actionsBulk
        );
        if (this.dataSource) {
          this.$triggerFilter.next(this.dataSource.filter)
        }
      });

    this.$setSearchHeadersTrigger
      .pipe(takeUntil(this.$onDestroyed), debounceTime(100))
      .subscribe((newHeaders) => {
        this.logger.log('setSearchHeadersTrigger', { newHeaders });
        this.columnsManager.SetSearchFilterDisplayed<T>(newHeaders);
        if (this.dataSource) {
          this.$triggerFilter.next(this.dataSource.filter)
        }
      });

    this.reInitializeVariables();

    this.config.data$
      .pipe(
        debounceTime(100),
        filter((originalData) => {
          const isArray = Array.isArray(originalData);
          this.$IsLoading.next(!isArray);
          return isArray;
        })
      )
      .pipe(takeUntil(this.$onDestroyed))
      .subscribe((originalData) => {
        this.logger.log('config.data$.subscribe: ', { originalData });
        this.dataSource = new MatTableDataSource(originalData);
        if (this.config.onDataUpdated) {
          this.config.onDataUpdated(originalData);
        }
        const firstDataItem = originalData[0];
        if (this.config.selectFirstOnInit) {
          this.selectionSingle.select(firstDataItem);
        }
        this.initTable(this.columnDefinitions, this.config, firstDataItem);
        this.initFilterPredicate(originalData);
        this.$triggerFilter.next(this.$CurrentSearchText.getValue())
      });

    this.$CurrentSearchText
      .pipe(debounceTime(50), takeUntil(this.$onDestroyed))
      .subscribe((text) => {
        this.$triggerFilter.next(text)
      });

    this.initializeConfigTriggers();

    combineLatest([this.$isMobile, this.$isTablet, this.$refreshTrigger])
      .pipe(takeUntil(this.$onDestroyed))
      .subscribe(([isMobile, isTablet]) => {
        if (isMobile) {
          this.onRefreshMobileDefaultColumns();
        } 
        else if (isTablet) {
          this.onRefreshTabletDefaultColumns();
        }
        else {
          this.onRefreshDefaultColumns();
        }
      });

    this.$triggerFilter
      .pipe(takeUntil(this.$onDestroyed))
      .subscribe((filterText) => {
        this.onSearchChanged(filterText);
      });
  }

  ngOnDestroy() {
    this.$onDestroyed.next();
  }

  reInitializeVariables() {
    this.selectionMultiple = new SelectionModel<any>(true, []);
    this.selectionSingle = new SelectionModel<any>(false, []);
    this.dataSource = undefined;
  }

  initializeConfigTriggers() {
    if (this.config.$triggerSelectItem) {
      this.config.$triggerSelectItem
        .pipe(debounceTime(300))
        .pipe(takeUntil(this.$onDestroyed))
        .subscribe((item) => {
          this.logger.log(
            'config.$triggerSelectItem.subscribe: selecting item',
            { item }
          );
          const str = JSON.stringify(item);
          const foundItem = this.dataSource.data.find(
            (row) => JSON.stringify(row) === str
          );
          this.logger.log('config.$triggerSelectItem.subscribe: found item:', {
            foundItem,
          });
          if (foundItem) {
            this.selectionSingle.select(foundItem);
          }
        });
    }

    if (this.config.$triggerClearSelected) {
      this.config.$triggerClearSelected
        .pipe(takeUntil(this.$onDestroyed))
        .subscribe(() => {
          this.logger.log(
            'config.$triggerClearSelected.subscribe: clearing selection'
          );
          this.selectionMultiple.clear();
          this.selectionSingle.clear();
        });
    }
    if (this.config.$triggerSetTableFilterState) {
      this.config.$triggerSetTableFilterState
        .pipe(
          takeUntil(this.$onDestroyed),
          filter((a) => !!a)
        )
        .subscribe((newFilterState) => {
          this.logger.log(
            'config.$triggerSetTableFilterState.subscribe: clearing selection'
          );
          this.$setSearchText.next(newFilterState.searchText);
        });
    }
    if (typeof this.config.onTableFilterStateChanged === 'function') {
      this.searchManager.FilterTextChanged.pipe(
        takeUntil(this.$onDestroyed)
      ).subscribe((searchText) => {
        this.config.onTableFilterStateChanged({ searchText: searchText });
      });
    }
  }

  initTable(
    columnDefinitions: ColumnDefinitionMap,
    config: AutoTableConfig<T>,
    firstDataItem: T
  ) {
    this.columnsManager.InitializeColumns(
      config,
      columnDefinitions,
      firstDataItem
    );
    const initialKeys = Object.keys(columnDefinitions).filter(
      (k) =>
        !columnDefinitions[k].hide && !(config.hideFields || []).includes(k)
    );
    this.logger.log('initialKeys', { initialKeys });
    this.columnsManager.SetDisplayedInitial(
      initialKeys,
      !!this.config.actions,
      !!this.config.actionsBulk
    );
    this.$refreshTrigger.next();
  }

  onRefreshDefaultColumns() {
    const columns = [...this.columnsManager.HeadersInitiallyVisible];
    this.logger.log('onRefreshDefaultColumns()', {columns});
    this.$setDisplayedColumnsTrigger.next(columns);
  }

  onRefreshMobileDefaultColumns() {
    let columns = this.config.mobileFields || [...this.columnsManager.HeadersInitiallyVisible];
    this.logger.log('onRefreshMobileDefaultColumns()', {
      columns,
    });
    this.$setDisplayedColumnsTrigger.next(columns);
  }

  onRefreshTabletDefaultColumns() {
    let columns = this.config.tabletFields || [...this.columnsManager.HeadersInitiallyVisible];
    this.logger.log('onRefreshMobileDefaultColumns()', {
      columns,
    });
    this.$setDisplayedColumnsTrigger.next(columns);
  }

  public onSearchChanged(inputValue: string) {
    const parsedString = inputValue || '';
    if (!this.dataSource) {
      return;
    }
    this.dataSource.filter = parsedString.trim().toLowerCase();
    this.selectionSingle.clear();
  }

  public onSearchHeadersChanged(columns: string[]) {
    this.$setSearchHeadersTrigger.next(columns);
  }

  public onColumnsChanged(columns: string[]) {
    this.$setDisplayedColumnsTrigger.next(columns);
  }

  initFilterPredicate(originalData: T[]) {
    if (!originalData.length) {
      return;
    }

    const firstRow = originalData[0];
    this.searchManager.CheckFirstRow(firstRow);

    this.dataSource.filterPredicate = (data: T, filterText: string) => {
      if (!filterText) {
        return true;
      }
      if (this.selectionMultiple.isSelected(data)) {
        return true;
      }
      return this.searchManager.DoesDataContainText(data, filterText);
    };
  }
}
