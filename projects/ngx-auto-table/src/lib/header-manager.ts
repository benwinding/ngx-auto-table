import {
  ColumnDefinitionMap,
  ActionDefinition,
  ActionDefinitionBulk
} from './AutoTableConfig';
import { SimpleLogger } from './SimpleLogger';

export class HeaderManager {
  private _headerKeysAll: string[] = [];
  private _headerKeysAllVisible: string[] = [];
  private _headerKeysDisplayed: string[] = [];
  private _headerKeysDisplayedSet: Set<string> = new Set();
  private _headerKeysDisplayedMap: {} = {};

  get HeadersDisplayedChoices(): string[] {
    return this._headerKeysAllVisible;
  }

  get HeadersDisplayedSet(): Set<string> {
    return this._headerKeysDisplayedSet;
  }

  get HeadersDisplayed(): Array<string> {
    return this._headerKeysDisplayed;
  }

  InitHeaderKeys(
    hideTheseFields: string[],
    allColumnDefinitions: ColumnDefinitionMap
  ) {
    this._headerKeysAll = Object.keys(allColumnDefinitions);
    this._headerKeysAllVisible = this._headerKeysAll;
    if (hideTheseFields) {
      // Hide fields if specified
      const hideFields = new Set(hideTheseFields);
      this._headerKeysAllVisible = this._headerKeysAll.filter(
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
    this._headerKeysAllVisible.forEach(
      k => (this._headerKeysDisplayedMap[k] = false)
    );
    // Set selected as true
    selected.forEach(c => (this._headerKeysDisplayedMap[c] = true));
    this._headerKeysDisplayed = Object.keys(
      this._headerKeysDisplayedMap
    ).filter(k => this._headerKeysDisplayedMap[k]);
    // Add bulk select column at start
    if (actionsBulk) {
      this._headerKeysDisplayed.unshift('__bulk');
    }
    // Add actions column at end
    if (actions) {
      this._headerKeysDisplayed.push('__star');
    }
    this.updateHeaderKeySet(this._headerKeysDisplayed);
  }

  private updateHeaderKeySet(newDisplayed: string[]) {
    this._headerKeysDisplayedSet.clear();
    newDisplayed.forEach(k => {
      this._headerKeysDisplayedSet.add(k);
    });
  }
}
