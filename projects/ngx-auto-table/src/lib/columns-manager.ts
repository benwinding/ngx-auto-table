import { ColumnDefinitionMap, AutoTableConfig } from './models';
import { SimpleLogger } from '../utils/SimpleLogger';
import { ColumnDefinitionInternal, HeaderKeyList } from './models.internal';
import { formatPretty, sortObjectArrayCase } from '../utils/utils';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

export class ColumnsManager {
  private _headerKeysAllChoices: HeaderKeyList = [];
  private _headerKeysVisibleArray: string[] = [];
  private _headersSearchFilterVisible: string[] = [];
  private _headerKeysVisibleSet: Set<string> = new Set();

  private _columnDefinitionsAll: ColumnDefinitionMap = {};
  private _columnDefinitionsAllArray: ColumnDefinitionInternal[] = [];

  private logger = new SimpleLogger(false);

  private _headersChoicesKeyValues$ = new BehaviorSubject<HeaderKeyList>([]);
  public HeadersChoicesKeyValuesSorted$: Observable<HeaderKeyList>;

  constructor() {
    this.HeadersChoicesKeyValuesSorted$ = this._headersChoicesKeyValues$.pipe(
      map(arr => {
        const clonedValue = [...(arr || [])];
        clonedValue.sort(sortObjectArrayCase('value'));
        return clonedValue;
      })
    );
  }

  public get HeadersVisible(): string[] {
    return this._headerKeysVisibleArray;
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

  public SetDisplayed<T>(
    selected: string[],
    hasActions: boolean,
    hasActionsBulk: boolean
  ) {
    selected = selected.filter(s => s !== '__bulk' && s !== '__star');
    // Update sets
    this._headerKeysVisibleSet.clear();
    selected.forEach(c => this._headerKeysVisibleSet.add(c));

    // Update Array
    this._headerKeysVisibleArray.splice(0, this._headerKeysVisibleArray.length);
    selected.forEach(c => this._headerKeysVisibleArray.push(c));

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

  SetSearchFilterDisplayed<T>(selected: string[]) {
    this._headersSearchFilterVisible.splice(
      0,
      this._headersSearchFilterVisible.length
    );
    selected.forEach(c => this._headersSearchFilterVisible.push(c));
  }

  public InitializeColumns(
    config: AutoTableConfig<any>,
    columnDefinitions: ColumnDefinitionMap,
    dataRow: any
  ) {
    this._columnDefinitionsAll = this.getAllColumnDefinitions(
      columnDefinitions
    );
    this._columnDefinitionsAll = {
      ...this.getDefinitionsFromDataRow(dataRow),
      ...this._columnDefinitionsAll
    };
    this._columnDefinitionsAllArray = this.getColumnDefinitionArray(
      this._columnDefinitionsAll
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

  private getColumnDefinitionArray(
    colMap: ColumnDefinitionMap
  ): ColumnDefinitionInternal[] {
    // Make array that template headers use
    return Object.keys(colMap).map(k => {
      const columnDef = colMap[k];
      return {
        ...columnDef,
        header_pretty: columnDef.header || formatPretty(k),
        field: k
      };
    });
  }

  private getDefinitionsFromDataRow(firstDataItem: any): ColumnDefinitionMap {
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
