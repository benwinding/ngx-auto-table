import { Observable } from "rxjs";

export interface ActionDefinition<T> {
  label: string;
  icon?: string;
  onClick?: (row: T) => void;
  onRouterLink?: (row: T) => string;
  routerLinkQuery?: (row: T) => {};
}

export interface ActionDefinitionBulk<T> {
  label: string;
  icon?: string;
  onClick?: (row: T[]) => void;
}

export interface ColumnDefinition {
  header?: string;
  template?: any;
  hide?: boolean;
  forceWrap?: boolean;
}
export interface ColumnDefinitionMap {
  [field: string]: ColumnDefinition;
}

export interface AutoTableConfig<T> {
  data$: Observable<T[]>;
  onDataUpdated?: (rows: T[]) => void;
  debug?: boolean;
  cacheId?: string;
  // Actions
  actions?: ActionDefinition<T>[];
  actionsBulk?: ActionDefinitionBulk<T>[];
  bulkSelectMaxCount?: number;
  actionsVisibleCount?: number;
  // Sorting and pagination
  initialSort?: string;
  initialSortDir?: "asc" | "desc";
  pageSize?: number;
  // Top bar configuration
  hideFields?: string[];
  hideFilter?: boolean;
  hideHeader?: boolean;
  hidePaginator?: boolean;
  hideChooseColumns?: boolean;
  filterText?: string;
  // Export configuration
  exportFilename?: string;
  exportRowFormat?: (row: T) => void;
  // Selection callbacks
  onSelectItem?: (row: T) => void;
  onSelectItemDoubleClick?: (row: T) => void;
  onSelectedBulk?: (row: T[]) => void;
  // Triggers
  disableSelect?: boolean;
  disableHoverEffect?: boolean;
  selectFirstOnInit?: boolean;
  $triggerClearSelected?: Observable<void>;
  $triggerSelectItem?: Observable<T>;
  disableMobileScroll?: boolean;
  // Responsive
  mobileFields?: string[];
}
