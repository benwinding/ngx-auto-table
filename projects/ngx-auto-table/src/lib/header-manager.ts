import {
  ColumnDefinitionMap,
  ActionDefinition,
  ActionDefinitionBulk
} from './AutoTableConfig';

export class HeaderManager {
  headerKeysAll: string[] = [];
  headerKeysAllVisible: string[] = [];
  headerKeysDisplayed: string[] = [];
  headerKeysDisplayedMap: {} = {};

  GetDisplayHeaderKeysSet(): Set<string> {
    return new Set(this.headerKeysDisplayed);
  }

  GetDisplayHeaderKeys(): Array<string> {
    return this.headerKeysDisplayed;
  }

  InitHeaderKeys(
    hideTheseFields: string[],
    allColumnDefinitions: ColumnDefinitionMap
  ) {
    this.headerKeysAll = Object.keys(allColumnDefinitions);
    this.headerKeysAllVisible = this.headerKeysAll;
    if (hideTheseFields) {
      // Hide fields if specified
      const hideFields = new Set(hideTheseFields);
      this.headerKeysAllVisible = this.headerKeysAll.filter(
        x => !hideFields.has(x)
      );
    }
  }

  SetDisplayed<T>(
    selected: string[],
    actions: ActionDefinition<T>[],
    actionsBulk: ActionDefinitionBulk<T>[]
  ) {
    // Initialize all keys as false
    this.headerKeysAllVisible.forEach(
      k => (this.headerKeysDisplayedMap[k] = false)
    );
    // Set selected as true
    selected.forEach(c => (this.headerKeysDisplayedMap[c] = true));
    this.headerKeysDisplayed = Object.keys(this.headerKeysDisplayedMap).filter(
      k => this.headerKeysDisplayedMap[k]
    );
    // Add bulk select column at start
    if (actionsBulk) {
      this.headerKeysDisplayed.unshift('__bulk');
    }
    // Add actions column at end
    if (actions) {
      this.headerKeysDisplayed.push('__star');
    }
  }
}
