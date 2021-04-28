import { Observable, BehaviorSubject } from 'rxjs';
import { map, distinctUntilChanged, pluck } from 'rxjs/operators';
import { distinctUntilChangedObj } from '../utils/rxjs-helpers';
import { TableFiltersState } from './models';

export class TableStateManager {
  private currentState = new BehaviorSubject<TableFiltersState>({});

  public $updatedPageIndex = this.currentState.pipe(
    pluck('pageIndex'),
    distinctUntilChanged()
  );
  public $updatedPageSize = this.currentState.pipe(
    pluck('pageSize'),
    distinctUntilChanged()
  );
  public $updatedSearch = this.currentState.pipe(
    pluck('searchText'),
    distinctUntilChanged()
  );

  patchPageIndex(val: number) {
    this.PatchTableState({pageIndex: val});
  }
  patchPageSize(val: number) {
    this.PatchTableState({pageSize: val});
  }
  patchSearch(val: string) {
    this.PatchTableState({searchText: val});
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
    const valCur = this.currentState.getValue() || {};
    const valNew = { ...valCur, ...valPatch };
    this.currentState.next(valNew);
  }

  AllTableState$(): Observable<TableFiltersState> {
    return this.currentState.asObservable().pipe(distinctUntilChangedObj());
  }
}
