import {
  ColumnDefinition,
  ColumnDefinitionMap,
  AutoTableConfig
} from './AutoTableConfig';
import { SimpleLogger } from './SimpleLogger';
import { ColumnDefinitionInternal } from './AutoTableInternal';

export class ColumnsManager<T> {
  private columnDefinitions: ColumnDefinitionInternal[] = [];

  private logger: SimpleLogger;
  private hasActions: boolean;
  private hasActionsBulk: boolean;

  private isMobile: boolean;

  public get CurrentColumns(): ColumnDefinitionInternal[] {
    return this.columnDefinitions;
  }

  constructor(config: AutoTableConfig<T>) {
    this.hasActions = HasItems(config.actions);
    this.hasActionsBulk = HasItems(config.actionsBulk);
    this.logger = new SimpleLogger(config.debug, 'columns-manager');
  }

  public InitializeDefinitions(
    defintionsDesktop: ColumnDefinitionMap,
    defintionsMobile: ColumnDefinitionMap
  ) {
    this.logger.log('InitializeDefinitions', {
      defintionsDesktop,
      defintionsMobile
    });
    // Set all column defintions, which were explicitly set in config
    const desktopMap = normalizeColumnDefinitions(defintionsDesktop, true);
    const mobileMap = normalizeColumnDefinitions(defintionsMobile, false);
    this.columnDefinitions = [
      ...columnDefinitionsMapToArray(desktopMap),
      ...columnDefinitionsMapToArray(mobileMap)
    ];
    this.initActionColumns();
  }

  private initActionColumns() {
    // Add bulk select column at start
    if (this.hasActionsBulk) {
      this.columnDefinitions.unshift({
        header: '',
        field: '__bulk'
      });
    }
    // Add actions column at end
    if (this.hasActions) {
      this.columnDefinitions.unshift({
        header: '',
        field: '__star'
      });
    }
  }

  public InitializeDefinitionsFromRow(row: any) {
    this.logger.log('InitializeDefinitionsFromRow', { row });
    if (typeof row !== 'object') {
      return;
    }
    const inputDataKeys = Object.keys(row);
    const existingFields = new Set(this.columnDefinitions.map(c => c.field));
    const newDefintions: ColumnDefinitionInternal[] = [];
    inputDataKeys.forEach((field: string) => {
      if (existingFields.has(field)) {
        // skip if definition exists
        return;
      }
      newDefintions.push({
        header: toTitleCase(field),
        field: field,
        isShown: false,
        isMobile: false,
        isInFilter: true
      });
    });
    this.columnDefinitions.push(...newDefintions);
    this.logger.log('InitializeDefinitionsFromRow', {
      row,
      columnDefinitions: this.columnDefinitions
    });
  }

  public SetMobile() {
    this.isMobile = true;
    this.logger.log('SetMobile', { isMobile: this.isMobile });
  }

  public SetDesktop() {
    this.isMobile = false;
    this.logger.log('SetMobile', { isMobile: this.isMobile });
  }

  public SetDisplayed(selected: string[]) {
    const selectedFields = new Set(selected);
    this.columnDefinitions
      .filter(c => selectedFields.has(c.field))
      .map(c => (c.isShown = true));
  }

  public GetDisplayed(): string[] {
    return this.columnDefinitions.filter(c => c.isShown).map(c => c.field);
  }

  public AllFilterOptions() {
    return this.columnDefinitions
      .filter(c => c.isInFilter)
      .map(c => ({
        value: c.field,
        label: c.header
      }));
  }
}

function normalizeColumnDefinitions(
  definitions: ColumnDefinitionMap,
  isMobile: boolean
): ColumnDefinitionMap {
  // Set all column defintions, which were explicitly set in config
  const inputDefintionFields = Object.keys(definitions);
  const columnDefinitionsAll = {} as {
    [field: string]: ColumnDefinitionInternal;
  };
  inputDefintionFields.forEach((field: string) => {
    const inputDefintion = definitions[field];
    columnDefinitionsAll[field] = {
      field,
      header: getKeyHeader(inputDefintion, field),
      template: inputDefintion.template,
      forceWrap: inputDefintion.forceWrap,
      isMobile,
      isShown: true,
      isInFilter: true
    };
  });
  return columnDefinitionsAll;
}

function columnDefinitionsMapToArray(
  definitionsMap: ColumnDefinitionMap
): ColumnDefinitionInternal[] {
  // Make array that template headers use
  const definitionsArray = Object.keys(definitionsMap).map(k => {
    return {
      ...definitionsMap[k],
      field: k
    };
  });
  return definitionsArray;
}

function getKeyHeader(inputDef: ColumnDefinition, fieldName: string) {
  if (inputDef && inputDef.header != null) {
    return inputDef.header;
  }
  return toTitleCase(fieldName);
}

function toTitleCase(str) {
  const spacedStr = str.replace(new RegExp('_', 'g'), ' ');
  return spacedStr.replace(/\w\S*/g, function(txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
}

function HasItems(arr: any[]) {
  return Array.isArray(arr) && !!arr.length;
}
