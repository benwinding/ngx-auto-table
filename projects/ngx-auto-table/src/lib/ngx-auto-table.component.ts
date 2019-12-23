import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Subject, BehaviorSubject } from 'rxjs';
import {
  takeUntil,
  distinctUntilChanged,
  debounceTime,
  map
} from 'rxjs/operators';
import { AutoTableConfig, ColumnDefinitionMap } from './AutoTableConfig';

import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { SimpleLogger } from './SimpleLogger';
import { ColumnDefinitionInternal } from './AutoTableInternal';

function blankConfig<T>(): AutoTableConfig<T> {
  return {
    data$: new Subject<T[]>()
  };
}

@Component({
  selector: 'ngx-auto-table',
  template: `
    <ngx-table-viewer
      [isMobile]="isMobile"
      [data]="config?.data$ | async"
      [config]="config"
    ></ngx-table-viewer>
  `
})
export class AutoTableComponent<T> implements OnInit, OnDestroy {
  private _blankConfig: AutoTableConfig<T> = blankConfig<T>();
  private _config: AutoTableConfig<T>;
  @Input()
  set config(newConfig) {
    this._config = newConfig;
    setTimeout(() => {
      this.$onDestroyed.next();
      this.ngOnInit();
    });
  }
  get config() {
    return this._config || this._blankConfig;
  }
  @Input()
  columnDefinitions: ColumnDefinitionMap = {};
  @Input()
  columnDefinitionsMobile: ColumnDefinitionMap = {};

  public currentColumns: ColumnDefinitionInternal[];

  public $data = new BehaviorSubject<T>(null);

  isMobile: boolean;

  $onDestroyed = new Subject();

  private logger: SimpleLogger;

  constructor(private breakpointObserver: BreakpointObserver) {
    this.breakpointObserver
      .observe([Breakpoints.Tablet])
      .pipe(
        takeUntil(this.$onDestroyed),
        debounceTime(100),
        map(res => res.matches),
        distinctUntilChanged()
      )
      .subscribe(isMobile => {
        this.isMobile = isMobile;
      });
  }

  ngOnInit() {
    if (!this.config) {
      this.logger.log('no [config] set on auto-table component');
      return;
    }
    this.logger = new SimpleLogger(this.config.debug, 'main');
  }

  ngOnDestroy() {
    this.$onDestroyed.next();
  }
}
