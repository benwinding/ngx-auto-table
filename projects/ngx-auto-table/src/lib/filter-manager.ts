import { Subject } from 'rxjs';
import { ToString } from '../utils/tostr';
import { ColumnsManager } from './columns-manager';
import { AutoTableConfig } from './models';
import { ColumnFilterByMap } from './models.internal';

export class FilterManager<T> {
  private searchKeys: string[];
  private columnsManager: ColumnsManager;
  private config: AutoTableConfig<T>;
  private firstRowHeaderFields: string[];

  public $FilterTextChanged = new Subject<string>();

  public SetColumsManager(cm: ColumnsManager) {
    this.columnsManager = cm;
  }

  public SetConfig(config: AutoTableConfig<T>) {
    this.config = config;
  }

  public CheckFirstRow(firstRow: T) {
    const keysHeader = this.columnsManager.HeadersVisibleSet;
    const firstRowKeys = Object.keys(firstRow);
    const firstRowKeysSet = new Set(firstRowKeys);
    keysHeader.delete('__bulk');
    keysHeader.delete('__star');
    const firstRowHasAllHeaderFields = Array.from(keysHeader).reduce(
      (acc, cur) => {
        return firstRowKeysSet.has(cur) && acc;
      },
      true
    );
    this.firstRowHeaderFields = null;
    if (firstRowHasAllHeaderFields) {
      this.firstRowHeaderFields = Array.from(keysHeader);
    }
  }

  public FilterData(
    data: T,
    filterText: string,
    filterObj: ColumnFilterByMap,
    isSelectedInMultiple: (d: T) => boolean
  ): boolean {
    const isInFilter = this.IsInFilter(data, filterObj);
    const noFilterText = !filterText;
    if (isInFilter && noFilterText) {
      return true;
    }
    if (!isInFilter) {
      return false;
    }
    if (isSelectedInMultiple(data)) {
      return true;
    }
    const containsText = this.DoesDataContainText(data, filterText);
    return containsText;
  }

  public IsInFilter(data: T, filters: ColumnFilterByMap): boolean {
    const filtersSafe = filters || {};
    const hasFilters = !!Object.values(filtersSafe).length;
    if (!hasFilters) {
      return true;
    }
    const isInFilter = Object.entries(filters).reduce(
      (total, [fieldName, filterObj]) => {
        const valData = data[fieldName];
        const hasBoolFilter = filterObj.bool != undefined;
        if (hasBoolFilter) {
          const valFilter = filterObj.bool;
          const filterMatches = valFilter === valData;
          return total && filterMatches;
        }
        const hasStringFilter = filterObj.stringArray != undefined;
        if (hasStringFilter) {
          const isEmptyFilter =
            !Array.isArray(filterObj.stringArray) ||
            !filterObj.stringArray.length;
          if (isEmptyFilter) {
            return true;
          }
          if (Array.isArray(valData)) {
            const valDataStringArr = (valData as any[]).map((v) => ToString(v));
            const valDataSet = new Set(valDataStringArr);
            const filterMatches = valDataStringArr.every((d) =>
              valDataSet.has(d)
            );
            return total && filterMatches;
          } else {
            const valFilter = new Set(filterObj.stringArray);
            const valDataString = ToString(valData);
            const filterMatches = valFilter.has(valDataString);
            return total && filterMatches;
          }
        }
      },
      true
    );
    return isInFilter;
  }

  public DoesDataContainText(data: T, filterText: string): boolean {
    this.$FilterTextChanged.next(filterText);
    if (!filterText) {
      return true;
    }
    if (this.config.searchByColumnOption) {
      const filterByColumns = this.columnsManager.HeadersSearchFilterVisible;
      if (filterByColumns.length > 0) {
        return this.searchFields(data, filterByColumns, filterText);
      }
      const currentHeadersVisible = this.columnsManager.HeadersVisible;
      return this.searchFields(data, currentHeadersVisible, filterText);
    }
    if (this.config.searchOnlyVisibleColumns) {
      const currentHeadersVisible = this.columnsManager.HeadersVisible;
      return this.searchFields(data, currentHeadersVisible, filterText);
    }
    if (this.firstRowHeaderFields) {
      return this.searchFields(data, this.firstRowHeaderFields, filterText);
    }
    const allDataKeys = Object.keys(data);
    return this.searchFields(data, allDataKeys, filterText);
  }

  private searchFields(data: T, fields: string[], filterText: string): boolean {
    const dontSearchFields = this.config.dontSearchFields as string[];
    if (!Array.isArray(this.config.dontSearchFields)) {
      return doesDataContainText(data, fields, filterText);
    }
    const searchOnlyFields = fields.filter(
      (f) => !dontSearchFields.includes(f)
    );
    return doesDataContainText(data, searchOnlyFields, filterText);
  }
}

const doesDataContainText = (
  data: {},
  keysToCheck: string[],
  filterText: string
): boolean => {
  for (const key of keysToCheck) {
    const dataVal = data[key];
    try {
      const str = JSON.stringify(dataVal) || '';
      const isFound = str.toLowerCase().includes(filterText);
      if (isFound) {
        return true;
      }
    } catch (error) {
      return false;
    }
  }
  return false;
};
