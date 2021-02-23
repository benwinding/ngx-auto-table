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
import { FilterManager } from './filter-manager';
import { convertObservableToBehaviorSubject } from '../utils/rxjs-helpers';
import { ColumnFilterBy, ColumnFilterByMap } from './models.internal';

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
        [HasNoItems]="$HasNoItems | async"
        [IsMaxReached]="$IsMaxReached | async"
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
        [IsAllSelected]="$IsAllSelected | async"
        [IsMaxReached]="$IsMaxReached | async"
        [HasNoItems]="$HasNoItems | async"
        [HeadersVisible]="columnsManager.HeadersVisible"
        [config]="config"
        [debug]="config?.debug"
        [dataSource]="dataSource"
        [selectionMultiple]="selectionMultiple"
        [selectionSingle]="selectionSingle"
        [columnDefinitionsAll]="columnsManager.AllColumnDefinitions"
        (filtersChanged)="onFilterChanged($event)"
      ></ngx-auto-table-content>
      <ngx-auto-table-footer
        [HasNoItems]="$HasNoItems | async"
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

  dataSource = new MatTableDataSource<T>(null);

  columnsManager = new ColumnsManager();
  filterManager = new FilterManager<T>();

  IsPerformingBulkAction = false;

  // Bulk items selection
  selectionMultiple = new SelectionModel<any>(true, []);
  selectionSingle = new SelectionModel<any>(false, []);

  $onDestroyed = new Subject();

  $isMobile: Observable<boolean>;
  $isTablet: Observable<boolean>;

  $refreshTrigger = new Subject<string[]>();
  $setDisplayedColumnsTrigger = new Subject<string[]>();
  $filterChangedTrigger = new BehaviorSubject<ColumnFilterByMap>(null);
  $setSearchHeadersTrigger = new Subject<string[]>();
  $setSearchText = new Subject<string>();
  $CurrentSearchText = new BehaviorSubject<string>('');

  $IsLoading = new Subject<boolean>();
  $HasNoItems = new Subject<boolean>();
  $IsMaxReached = new Subject<boolean>();
  $IsAllSelected = new Subject<boolean>();

  private logger: SimpleLogger;

  constructor(private breakpointObserver: BreakpointObserver) {}

  ngOnInit() {
    this.logger = new SimpleLogger('main.component', this.config.debug);
    this.columnsManager.SetLogging(this.config.debug);
    this.filterManager.SetColumsManager(this.columnsManager);
    this.filterManager.SetConfig(this.config);

    this.initResponsive();

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
          this.dataSource.filter = this.dataSource.filter;
        }
      });

    this.$setSearchHeadersTrigger
      .pipe(takeUntil(this.$onDestroyed), debounceTime(100))
      .subscribe((newHeaders) => {
        this.logger.log('setSearchHeadersTrigger', { newHeaders });
        this.columnsManager.SetSearchFilterDisplayed<T>(newHeaders);
        if (this.dataSource) {
          this.dataSource.filter = this.dataSource.filter;
        }
      });

    this.reInitializeVariables();

    this.initDataChanges();
    this.initializeConfigTriggers();
  }

  ngOnDestroy() {
    this.$onDestroyed.next();
  }

  initDataChanges() {
    const inputData$ = convertObservableToBehaviorSubject(
      this.config.data$,
      null
    );

    const DATA$ = new BehaviorSubject<T[]>(null);

    // On Data Changed
    inputData$
      .pipe(debounceTime(100), takeUntil(this.$onDestroyed))
      .subscribe((originalData) => {
        DATA$.next(originalData);
        const isArray = Array.isArray(originalData);
        this.$IsLoading.next(!isArray);
        if (!isArray) {
          return;
        }
        this.$HasNoItems.next(!originalData.length);
        this.logger.log('config.data$.subscribe: ', { originalData });
        if (this.config.onDataUpdated) {
          this.config.onDataUpdated(originalData);
        }
        const firstDataItem = originalData[0];
        if (this.config.selectFirstOnInit) {
          this.selectionSingle.select(firstDataItem);
        }
        this.initTable(this.columnDefinitions, this.config, firstDataItem);
        this.initFilters(this.columnDefinitions, originalData);
        if (!originalData.length) {
          return;
        }

        const firstRow = originalData[0];
        this.filterManager.CheckFirstRow(firstRow);
      });

    combineLatest([DATA$, this.$CurrentSearchText, this.$filterChangedTrigger])
      .pipe(debounceTime(50), takeUntil(this.$onDestroyed))
      .subscribe(([originalData, searchText, filters]) => {
        if (!Array.isArray(originalData)) {
          this.dataSource.data = null;
          return;
        }
        const searchTextParsed = (searchText || '').trim().toLowerCase();
        if (searchTextParsed) {
          this.selectionSingle.clear();
        }
        const CheckIsSelected = (d: T) => this.selectionMultiple.isSelected(d);
        const filtered = originalData.filter((d) =>
          this.filterManager.FilterData(
            d,
            searchTextParsed,
            filters,
            CheckIsSelected
          )
        );
        this.dataSource.data = filtered;
      });

    const IsAllSelected = () => {
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
    };

    const IsMaxReached = () => {
      if (!this.config.bulkSelectMaxCount) {
        return false;
      }
      const maxReached =
        this.selectionMultiple.selected.length >=
        this.config.bulkSelectMaxCount;
      return maxReached;
    };

    this.selectionMultiple.changed
      .pipe(takeUntil(this.$onDestroyed))
      .subscribe(() => {
        this.$IsMaxReached.next(IsMaxReached());
        this.$IsAllSelected.next(IsAllSelected());
      });
  }

  initResponsive() {
    this.$isMobile = this.breakpointObserver.observe('(max-width: 599px)').pipe(
      map(
        (result) =>
          result.matches && Object.values(result.breakpoints).every((v) => !!v)
      ),
      tap((result) => this.logger.log('$isMobile', result)),
      takeUntil(this.$onDestroyed),
      distinctUntilChanged(),
      debounceTime(100)
    );

    this.$isTablet = this.breakpointObserver
      .observe(['(min-width: 600px)', '(max-width: 959px)'])
      .pipe(
        map(
          (result) =>
            result.matches &&
            Object.values(result.breakpoints).every((v) => !!v)
        ),
        tap((result) => this.logger.log('$isTablet', result)),
        takeUntil(this.$onDestroyed),
        distinctUntilChanged(),
        debounceTime(100)
      );

    combineLatest([this.$isMobile, this.$isTablet, this.$refreshTrigger])
      .pipe(takeUntil(this.$onDestroyed))
      .subscribe(([isMobile, isTablet]) => {
        if (isMobile) {
          this.onRefreshMobileDefaultColumns();
        } else if (isTablet) {
          this.onRefreshTabletDefaultColumns();
        } else {
          this.onRefreshDefaultColumns();
        }
      });
  }

  reInitializeVariables() {
    this.selectionMultiple = new SelectionModel<any>(true, []);
    this.selectionSingle = new SelectionModel<any>(false, []);
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
      this.filterManager.$FilterTextChanged.pipe(
        takeUntil(this.$onDestroyed)
      ).subscribe((searchText) => {
        this.config.onTableFilterStateChanged({ searchText: searchText });
      });
    }
  }

  initFilters(
    columnDefinitions: ColumnDefinitionMap,
    dataItems: T[]
  ) {
    this.columnsManager.GetFilterOptionsFromData(columnDefinitions, dataItems);
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
    this.logger.log('onRefreshDefaultColumns()', { columns });
    this.$setDisplayedColumnsTrigger.next(columns);
  }

  onRefreshMobileDefaultColumns() {
    let columns = this.config.mobileFields || [
      ...this.columnsManager.HeadersInitiallyVisible,
    ];
    this.logger.log('onRefreshMobileDefaultColumns()', {
      columns,
    });
    this.$setDisplayedColumnsTrigger.next(columns);
  }

  onRefreshTabletDefaultColumns() {
    let columns = this.config.tabletFields || [
      ...this.columnsManager.HeadersInitiallyVisible,
    ];
    this.logger.log('onRefreshMobileDefaultColumns()', {
      columns,
    });
    this.$setDisplayedColumnsTrigger.next(columns);
  }

  public onSearchHeadersChanged(columns: string[]) {
    this.$setSearchHeadersTrigger.next(columns);
  }

  public onColumnsChanged(columns: string[]) {
    this.$setDisplayedColumnsTrigger.next(columns);
  }

  public onFilterChanged(filters: ColumnFilterByMap) {
    this.logger.log('onFilterChanged', { filters });
    this.$filterChangedTrigger.next(filters);
  }
}
