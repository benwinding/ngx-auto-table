import { AutoTableConfig } from './models';
import { Subject } from 'rxjs';

export function blankConfig<T>(): AutoTableConfig<T> {
  return {
    data$: new Subject<T[]>(),
    searchOnlyVisibleColumns: true,
    searchByColumnOption: true
  };
}
