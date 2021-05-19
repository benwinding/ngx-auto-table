import { Observable, BehaviorSubject } from 'rxjs';
import { map, distinctUntilChanged, pluck, delay } from 'rxjs/operators';
import { distinctUntilChangedObj } from '../utils/rxjs-helpers';
import { TableFiltersState } from './models';

export class TableStateManager {
  private $currentState: BehaviorSubject<TableFiltersState> =
    new BehaviorSubject({ columnsEnabled: []});

  public $updatedPageIndex = this.$currentState.pipe(
    pluck('pageIndex'),
    distinctUntilChanged()
  );
  public $updatedPageSize = this.$currentState.pipe(
    pluck('pageSize'),
    distinctUntilChanged()
  );
  public $updatedSearch = this.$currentState.pipe(
    pluck('searchText'),
    distinctUntilChanged()
  );
  public $columsEnabled = this.$currentState.pipe(
    pluck('columnsEnabled'),
    delay(1),
    distinctUntilChanged()
  );
  public getColumnsEnabled() {
    return this.$currentState.getValue()?.columnsEnabled;
  }

  patchPageIndex(val: number) {
    this.PatchTableState({ pageIndex: val });
  }
  patchPageSize(val: number) {
    this.PatchTableState({ pageSize: val });
  }
  patchSearch(val: string) {
    this.PatchTableState({ searchText: val });
  }
  patchColumnsEnabled(val: string[]) {
    this.PatchTableState({ columnsEnabled: val });
  }

  PatchTableState(valPatch: Partial<TableFiltersState>) {
    const hasState =
      valPatch &&
      typeof valPatch === 'object' &&
      Object.keys(valPatch).length > 0;
    if (!hasState) {
      return;
    }
    // Remove nulls
    Object.entries(valPatch).map(([key, val]) => {
      if (val == null) {
        delete valPatch[key];
      }
    });
    const valCur = this.$currentState.getValue() || {};
    const valNew = { ...valCur, ...valPatch };
    this.$currentState.next(valNew);
  }

  AllTableState$(): Observable<TableFiltersState> {
    return this.$currentState.asObservable().pipe(distinctUntilChangedObj());
  }
}
