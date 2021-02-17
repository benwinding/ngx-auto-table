import { Subject } from 'rxjs';
import { ColumnsManager } from './columns-manager';
import { AutoTableConfig } from './models';

export class SearchManager<T> {
  private searchKeys: string[];
  private columnsManager: ColumnsManager;
  private config: AutoTableConfig<T>;
  private firstRowHeaderFields: string[];
  
  public FilterTextChanged = new Subject<string>();

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

  public DoesDataContainText(data: T, filterText: string): boolean {
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
    const searchOnlyFields = fields.filter(f => !dontSearchFields.includes(f));
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
