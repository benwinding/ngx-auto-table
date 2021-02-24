import { ColumnDefinitionMap, AutoTableConfig } from './models';
import { SimpleLogger } from '../utils/SimpleLogger';
import {
  ColumnDefinitionInternal,
  FieldFilterMap,
  HeaderKeyList,
} from './models.internal';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import * as _ from 'lodash';
import { ToString } from '../utils/tostr';

function clearArray(arr: any[]) {
  arr.splice(0, arr.length);
}

function arrayMoveEl(arr: any[], fromIndex: number, toIndex: number) {
  var element = arr[fromIndex];
  arr.splice(fromIndex, 1);
  arr.splice(toIndex, 0, element);
}

export class ColumnsManager {
  private _headerKeysAllChoices: HeaderKeyList = [];
  private _$headerKeysVisible = new BehaviorSubject<string[]>([]);
  private _headerKeysInitiallyVisible: string[] = [];
  private _headersSearchFilterVisible: string[] = [];

  private _columnDefinitionsAll: ColumnDefinitionMap = {};
  private _columnDefinitionsAllArray: ColumnDefinitionInternal[] = [];

  private logger = new SimpleLogger('columns-manager', true);

  private _headersChoicesKeyValues$ = new BehaviorSubject<HeaderKeyList>([]);
  private $FilterOptions = new BehaviorSubject<FieldFilterMap>({});

  constructor() {
    this.HeadersChoicesKeyValuesSorted$ = this._headersChoicesKeyValues$.pipe(
      map((arr) => {
        const clonedValue = [...(arr || [])];
        return _.sortBy(clonedValue, 'value');
      })
    );
  }

  public SetLogging(debug: boolean) {
    this.logger = new SimpleLogger('columns-manager', debug);
  }

  public HeadersChoicesKeyValuesSorted$: Observable<HeaderKeyList>;

  public get HeadersVisible(): string[] {
    return this._$headerKeysVisible.getValue();
  }
  public get HeadersVisible$(): Observable<string[]> {
    return this._$headerKeysVisible;
  }

  public get HeadersInitiallyVisible(): string[] {
    return this._headerKeysInitiallyVisible;
  }

  public get HeadersSearchFilterVisible(): string[] {
    return this._headersSearchFilterVisible;
  }

  public get AllColumnDefinitions(): ColumnDefinitionInternal[] {
    return this._columnDefinitionsAllArray;
  }

  public SetDisplayedInitial(
    selected: string[],
    hasActions: boolean,
    hasActionsBulk: boolean
  ) {
    this.SetDisplayed(selected, hasActions, hasActionsBulk);
    this._headerKeysInitiallyVisible = [...selected];
    this._$headerKeysVisible.next([...selected]);
  }

  public GetFilterOptionsFromData(
    columnDefinitions: ColumnDefinitionMap,
    data: any[]
  ): void {
    const columnsWithFilters = Object.entries(columnDefinitions).filter(
      ([key, value]) => !!value.filter && typeof value.filter === 'object'
    );
    const fieldFilterMap: FieldFilterMap = {};
    columnsWithFilters.map(([key, cDef]) => {
      let opts = [];
      let type: 'boolean' | 'string' | 'stringArray';
      if (cDef.filter.bool) {
        type = 'boolean';
      } else if (cDef.filter.string) {
        type = 'string';
        opts = data.map((d) => ToString(d[key]));
      } else if (cDef.filter.stringArray) {
        type = 'stringArray';
        opts = data.reduce(
          (acc, d) => acc.concat(ToString(d[key])),
          []
        ) as string[];
      }
      const optsUnique = Array.from(new Set(opts));
      fieldFilterMap[key] = {
        field: key,
        options: optsUnique,
        type: type,
      };
    });
    this.$FilterOptions.next(fieldFilterMap);
  }

  public SetDisplayed<T>(
    selected: string[],
    hasActions: boolean,
    hasActionsBulk: boolean
  ) {
    selected = selected.filter((s) => s !== '__bulk' && s !== '__star');
    const selectedSet = new Set(selected);
    // Update Array
    const visibleKeys: string[] = [];
    this._columnDefinitionsAllArray.map((colDef) => {
      if (selectedSet.has(colDef.field)) {
        visibleKeys.push(colDef.field);
      }
    });

    // Add bulk select column at start
    if (hasActions) {
      visibleKeys.push('__star');
    }
    // Add actions column at end
    if (hasActionsBulk) {
      visibleKeys.unshift('__bulk');
    }
    this._$headerKeysVisible.next(visibleKeys);
  }

  public SetSearchFilterDisplayed<T>(selected: string[]) {
    clearArray(this._headersSearchFilterVisible);
    selected.forEach((c) => this._headersSearchFilterVisible.push(c));
  }

  public InitializeColumns(
    config: AutoTableConfig<any>,
    orderedColumnDefinitions: ColumnDefinitionMap,
    dataRow: any
  ) {
    const allDefinitions = this.getAllColumnDefinitions(
      orderedColumnDefinitions
    );
    this._columnDefinitionsAll = {
      ...this.getMoreDefinitionsFromDataRow(dataRow),
      ...allDefinitions,
    };
    const orderedFields = Object.keys(orderedColumnDefinitions);
    this._columnDefinitionsAllArray = this.getColumnDefinitionOrderedArray(
      this._columnDefinitionsAll,
      orderedFields
    );
    this._headerKeysAllChoices.splice(0, this._headerKeysAllChoices.length);
    const newHeaderKeys = this.getHeaderKeys(
      config.hideFields,
      this._columnDefinitionsAllArray
    );
    this._headerKeysAllChoices.push(...newHeaderKeys);
    this._headersChoicesKeyValues$.next(this._headerKeysAllChoices);
    this.logger.log('InitializeColumns', {
      _columnDefinitionsAll: this._columnDefinitionsAll,
      _columnDefinitionsAllArray: this._columnDefinitionsAllArray,
      _headerKeysAllChoices: this._headerKeysAllChoices,
    });
  }

  private getHeaderKeys(
    hideTheseFields: string[],
    allColumnDefinitions: ColumnDefinitionInternal[]
  ): HeaderKeyList {
    const hideThese = new Set(hideTheseFields || []);
    const allChoices = [];
    // Add to all choices array
    allColumnDefinitions.map((cd) => {
      if (hideThese.has(cd.field)) {
        return;
      }
      allChoices.push({
        key: cd.field,
        value: cd.header_pretty,
      });
    });
    return allChoices;
  }

  private getColumnDefinitionOrderedArray(
    allColumnDefinitionsMap: ColumnDefinitionMap,
    fieldsOrdered: string[]
  ): ColumnDefinitionInternal[] {
    // Make array that template headers use
    const allKeys = Object.keys(allColumnDefinitionsMap);
    fieldsOrdered.map((field, toIndex) => {
      const fromIndex = allKeys.indexOf(field);
      arrayMoveEl(allKeys, fromIndex, toIndex);
    });
    this.logger.log('final field order', { allKeys });
    const columnDefsProcessed = allKeys.map((k) => {
      const columnDef = allColumnDefinitionsMap[k];
      const columnExtended: ColumnDefinitionInternal = {
        ...columnDef,
        header_pretty: columnDef.header || _.startCase(k),
        field: k,
        $string_options: this.$FilterOptions.pipe(
          map((opts) => {
            const f = opts[k];
            if (!f) {
              return [];
            }
            if (f.type == 'boolean') {
              return [];
            }
            return f.options;
          })
        ),
      };
      return columnExtended;
    });
    this.logger.log('processed column defs', { columnDefsProcessed });
    return columnDefsProcessed;
  }

  private getMoreDefinitionsFromDataRow(
    firstDataItem: any
  ): ColumnDefinitionMap {
    if (!firstDataItem) {
      return {};
    }
    // Set all column defintions read from the "input data"
    return Object.keys(firstDataItem).reduce((acc, fieldName) => {
      acc[fieldName] = {
        hide: true,
      };
      return acc;
    }, {} as ColumnDefinitionMap);
  }

  private getAllColumnDefinitions(columnDefinitions: ColumnDefinitionMap) {
    // Set all column defintions, which were explicitly set in config
    const all: ColumnDefinitionMap = {};
    const inputDefintionFields = Object.keys(columnDefinitions);
    inputDefintionFields.forEach((field: string) => {
      const inputDefintion = columnDefinitions[field];
      all[field] = {
        header: inputDefintion.header,
        template: inputDefintion.template,
        hide: inputDefintion.hide,
        forceWrap: inputDefintion.forceWrap,
        filter: inputDefintion.filter,
      };
    });
    return all;
  }
}
