import { OnInit, OnDestroy, EventEmitter } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { Subscription, Observable } from 'rxjs';
import { FormControl } from '@angular/forms';
import { SelectionModel } from '@angular/cdk/collections';
export interface AutoTableConfig<T> {
    data$: Observable<T[]>;
    filename?: string;
    actions?: ActionDefinition<T>[];
    actionsBulk?: ActionDefinitionBulk<T>[];
    bulkSelectMaxCount?: number;
    onSelectItem?: (row: T) => void;
    clearSelected?: Observable<void>;
    initialSort?: string;
    initialSortDir?: 'asc' | 'desc';
    pageSize?: number;
    hideFields?: string[];
    hideFilter?: boolean;
    hideHeader?: boolean;
    hideChooseColumns?: boolean;
    exportFilename?: string;
    exportRowFormat?: (row: T) => void;
}
export interface ActionDefinition<T> {
    label: string;
    icon?: string;
    onClick?: (row: T) => void;
    onRouterLink?: (row: T) => string;
    routerLinkQuery?: (row: T) => {};
}
export interface ActionDefinitionBulk<T> {
    label: string;
    icon?: string;
    onClick?: (row: T[]) => void;
}
export interface ColumnDefinition {
    header?: string;
    template?: any;
    hide?: boolean;
    forceWrap?: boolean;
}
interface ColumnDefinitionInternal extends ColumnDefinition {
    field: string;
}
export declare class AutoTableComponent<T> implements OnInit, OnDestroy {
    selectedBulk: EventEmitter<T[]>;
    config: AutoTableConfig<T>;
    columnDefinitions: {
        [field: string]: ColumnDefinition;
    };
    columnDefinitionsAll: {
        [field: string]: ColumnDefinition;
    };
    columnDefinitionsAllArray: ColumnDefinitionInternal[];
    headerKeysAll: any[];
    headerKeysAllVisible: any[];
    headerKeysDisplayed: any[];
    headerKeysDisplayedMap: {};
    dataSource: MatTableDataSource<any>;
    dataSourceSubscription: Subscription;
    paginator: MatPaginator;
    pageSize: number;
    sort: MatSort;
    exportData: any[];
    exportFilename: string;
    hasNoItems: boolean;
    filterControl: FormControl;
    selectionMultiple: SelectionModel<any>;
    selectionSingle: SelectionModel<any>;
    clearSelectedSubscription: Subscription;
    ngOnInit(): void;
    ngOnDestroy(): void;
    applyFilter(filterValue: string): void;
    initFilter(originalData: T[]): void;
    initExport(originalData: T[]): void;
    getKeyHeader(key: string): any;
    private toTitleCase;
    initDisplayedColumns(firstDataItem: T): void;
    initColumnDefinitions(firstDataItem: T): void;
    setDisplayedColumns(selected: string[]): void;
    /** Whether the number of selected elements matches the total number of rows. */
    isAllSelected(): boolean;
    /** Selects all rows if they are not all selected; otherwise clear selection. */
    masterToggle(): void;
    private selectAll;
    isMaxReached(): boolean;
    onColumnFilterChange($event: any): void;
    onClickBulkItem($event: any, item: any): void;
    onClickRow($event: any, row: T): void;
    onClickBulkAction(action: ActionDefinitionBulk<T>): Promise<void>;
    warn(msg: string): void;
}
export {};
