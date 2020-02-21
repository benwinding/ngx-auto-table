import { ColumnDefinitionMap, AutoTableConfig } from './models';
import { SimpleLogger } from '../utils/SimpleLogger';
import { ColumnDefinitionInternal, HeaderKeyList } from './models.internal';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import * as _ from 'lodash';

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
  private _headerKeysVisibleArray: string[] = [];
  private _headerKeysInitiallyVisible: string[] = [];
  private _headersSearchFilterVisible: string[] = [];
  private _headerKeysVisibleSet: Set<string> = new Set();

  private _columnDefinitionsAll: ColumnDefinitionMap = {};
  private _columnDefinitionsAllArray: ColumnDefinitionInternal[] = [];

  private logger = new SimpleLogger('columns-manager', true);

  private _headersChoicesKeyValues$ = new BehaviorSubject<HeaderKeyList>([]);

  constructor() {
    this.HeadersChoicesKeyValuesSorted$ = this._headersChoicesKeyValues$.pipe(
      map(arr => {
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
    return this._headerKeysVisibleArray;
  }

  public get HeadersInitiallyVisible(): string[] {
    return this._headerKeysInitiallyVisible;
  }

  public get HeadersSearchFilterVisible(): string[] {
    return this._headersSearchFilterVisible;
  }

  public get HeadersVisibleSet(): Set<string> {
    return this._headerKeysVisibleSet;
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
    this._headerKeysInitiallyVisible = [...this._headerKeysVisibleArray];
  }

  public SetDisplayed<T>(
    selected: string[],
    hasActions: boolean,
    hasActionsBulk: boolean
  ) {
    selected = selected.filter(s => s !== '__bulk' && s !== '__star');
    const selectedSet = new Set(selected);
    // Update sets
    this._headerKeysVisibleSet.clear();
    selected.forEach(c => this._headerKeysVisibleSet.add(c));

    // Update Array
    clearArray(this._headerKeysVisibleArray);
    this._columnDefinitionsAllArray.map(colDef => {
      if (selectedSet.has(colDef.field)) {
        this._headerKeysVisibleArray.push(colDef.field);
      }
    });

    // Add bulk select column at start
    if (hasActions) {
      this._headerKeysVisibleSet.add('__star');
      this._headerKeysVisibleArray.push('__star');
    }
    // Add actions column at end
    if (hasActionsBulk) {
      this._headerKeysVisibleSet.add('__bulk');
      this._headerKeysVisibleArray.unshift('__bulk');
    }
  }

  public SetSearchFilterDisplayed<T>(selected: string[]) {
    clearArray(this._headersSearchFilterVisible);
    selected.forEach(c => this._headersSearchFilterVisible.push(c));
  }

  public InitializeColumns(
    config: AutoTableConfig<any>,
    orderedColumnDefinitions: ColumnDefinitionMap,
    dataRow: any
  ) {
    this._columnDefinitionsAll = this.getAllColumnDefinitions(
      orderedColumnDefinitions
    );
    this._columnDefinitionsAll = {
      ...this.getMoreDefinitionsFromDataRow(dataRow),
      ...this._columnDefinitionsAll
    };
    const orderedFields = Object.keys(orderedColumnDefinitions);
    this._columnDefinitionsAllArray = this.getColumnDefinitionOrderedArray(
      this._columnDefinitionsAll,
      orderedFields
    );
    this._headerKeysAllChoices.splice(0, this._headerKeysAllChoices.length);
    this._headerKeysAllChoices.push(
      ...this.getHeaderKeys(config.hideFields, this._columnDefinitionsAllArray)
    );
    this._headersChoicesKeyValues$.next(this._headerKeysAllChoices);
  }

  private getHeaderKeys(
    hideTheseFields: string[],
    allColumnDefinitions: ColumnDefinitionInternal[]
  ): HeaderKeyList {
    const hideThese = new Set(hideTheseFields || []);
    const allChoices = [];
    // Add to all choices array
    allColumnDefinitions.map(cd => {
      if (hideThese.has(cd.field)) {
        return;
      }
      allChoices.push({
        key: cd.field,
        value: cd.header_pretty
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
    return allKeys.map(k => {
      const columnDef = allColumnDefinitionsMap[k];
      return {
        ...columnDef,
        header_pretty: columnDef.header || _.startCase(k),
        field: k
      };
    });
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
        hide: true
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
        forceWrap: inputDefintion.forceWrap
      };
    });
    return all;
  }
}
