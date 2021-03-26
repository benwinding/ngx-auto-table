import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { ActionDefinitionBulk, AutoTableConfig } from '../models';

import { v4 as uuidv4 } from 'uuid';
import { FormControl } from '@angular/forms';
import { SelectionModel } from '@angular/cdk/collections';
import { Subject } from 'rxjs';
import { SimpleLogger } from '../../utils/SimpleLogger';
import { HeaderKeyList } from '../models.internal';

@Component({
  selector: 'ngx-auto-table-header',
  template: `
    <div
      class="table-header auto-elevation overflow-hidden"
      [class.addRightPixel]="config?.hideHeader"
      [hidden]="
        (config?.hideFilter && config?.hideChooseColumns) ||
        config?.hideHeader ||
        HasNoItems
      "
    >
      <div class="relative">
        <mat-toolbar class="mat-elevation-z8">
          <mat-toolbar-row class="flex-h align-center space-between">
            <ngx-auto-table-header-search
              [debug]="config?.debug"
              [hasFilterByColumn]="config?.searchByColumnOption"
              [hidden]="HasNoItems || config?.hideFilter"
              [filterText]="config?.filterText"
              [$setSearchText]="$setSearchText"
              [$clearTrigger]="$clearTrigger"
              (searchChanged)="onSearchChanged($event)"
              [headerKeyValues]="headerKeyValues"
              (searchHeadersChanged)="onSearchHeadersChanged($event)"
            ></ngx-auto-table-header-search>
            <ngx-auto-table-header-columns-chooser
              [hidden]="HasNoItems || config?.hideChooseColumns"
              [headerKeyValues]="headerKeyValues"
              [cacheId]="config?.cacheId"
              [selectedHeaderKeys]="selectedHeaderKeys"
              (columnsChanged)="onColumnsChanged($event)"
            ></ngx-auto-table-header-columns-chooser>
          </mat-toolbar-row>
        </mat-toolbar>
        <mat-toolbar
          class="bulk-actions flex-h align-center mat-primary overflow-x-auto overflow-y-hidden"
          *ngIf="hasInitialized && config?.actionsBulk?.length && !HasNoItems"
          [hidden]="
            !hasInitialized || HasNoItems || !config?.actionsBulk?.length
          "
          [class.hide-header]="!selectionMultiple?.selected?.length"
        >
          <mat-toolbar-row class="flex-h align-center space-between">
            <div class="flex-h align-center">
              <button
                class="mr-10"
                mat-raised-button
                [disabled]="IsPerformingBulkAction"
                (click)="onClickCancelBulk()"
              >
                <mat-icon>clear</mat-icon>
                <span>Cancel</span>
              </button>
              <ngx-auto-table-header-search
                [debug]="config?.debug"
                [hasFilterByColumn]="config?.searchByColumnOption"
                [filterText]="config?.filterText"
                [$setSearchText]="$setSearchText"
                [$clearTrigger]="$clearTrigger"
                (searchChanged)="onSearchChanged($event)"
                [headerKeyValues]="headerKeyValues"
                (searchHeadersChanged)="onSearchHeadersChanged($event)"
              ></ngx-auto-table-header-search>
              <span class="item-count">
                ({{ selectionMultiple.selected.length }} Selected)
              </span>
              <span *ngIf="!IsPerformingBulkAction" class="item-count">
                {{ IsMaxReached ? ' Max Reached!' : '' }}
              </span>
              <span *ngIf="IsPerformingBulkAction" class="item-count">
                Performing action...
              </span>
            </div>
            <span class="buttons flex-h align-center">
              <button
                mat-raised-button
                color="secondary"
                class="ml-10"
                [disabled]="IsPerformingBulkAction"
                *ngFor="let action of config?.actionsBulk"
                (click)="onClickBulkAction(action, btnBulkLoader)"
              >
                <ngx-auto-table-btn-loader
                  [disabled]="true"
                  #btnBulkLoader
                ></ngx-auto-table-btn-loader>
                <mat-icon>{{ action.icon }}</mat-icon>
                <span>{{ action.label }}</span>
              </button>
            </span>
          </mat-toolbar-row>
        </mat-toolbar>
      </div>
    </div>
  `,
  styles: [
    `
      .addRightPixel {
        width: calc(100% - 1px);
      }
      .relative {
        position: relative;
      }
      .flex-h {
        display: flex;
        flex-direction: row;
      }
      .space-between {
        justify-content: space-between;
      }
      .align-center {
        align-items: center;
      }
      .auto-elevation {
        box-shadow: 0px 5px 5px -3px rgba(0, 0, 0, 0.2),
          0px 8px 10px 1px rgba(0, 0, 0, 0.14),
          0px 3px 14px 2px rgba(0, 0, 0, 0.12);
      }
      .bulk-actions {
        position: absolute;
        top: 0px;
        transition: all 0.7s;
        width: 100%;
        height: 100%;
      }
      .item-count {
        padding-left: 10px;
      }
      .table-header {
        width: 100%;
      }
      .hide-header {
        top: -70px !important;
        overflow: hidden !important;
        height: 0px;
      }
      .overflow-x-auto {
        overflow-x: auto;
      }
      .overflow-y-hidden {
        overflow-y: hidden;
      }
      .mr-10 {
        margin-right: 10px;
      }
      .ml-10 {
        margin-left: 10px;
      }
    `
  ],
  styleUrls: ['../ngx-auto-table.component.scss']
})
export class NgxAutoTableHeaderComponent implements OnInit {
  @Input()
  $setSearchText: Subject<string>;
  @Input()
  config: AutoTableConfig<any>;

  @Input()
  IsPerformingBulkAction: boolean;
  @Input()
  HasNoItems: boolean;
  @Input()
  IsMaxReached: boolean;
  @Input()
  headerKeyValues: HeaderKeyList;
  @Input()
  selectedHeaderKeys: string[];
  @Input()
  selectionMultiple: SelectionModel<any>;

  @Output()
  searchChanged = new EventEmitter<string>();
  @Output()
  searchHeadersChanged = new EventEmitter<string[]>();
  @Output()
  columnsChanged = new EventEmitter<string[]>();
  @Output()
  bulkActionStatus = new EventEmitter<boolean>();

  autoCompleteObscureName = uuidv4();
  searchControl = new FormControl();
  chooseColumnsControl = new FormControl();
  tool
  $clearTrigger = new Subject();

  private logger = new SimpleLogger('header', false);

  hasInitialized = false;

  constructor() {}

  ngOnInit() {
    this.logger = new SimpleLogger('header', this.config.debug);
    setTimeout(() => {
      this.hasInitialized = true;
    }, 1000);
  }

  async onClickBulkAction(
    action: ActionDefinitionBulk<any>,
    btnBulkAction: any
  ) {
    this.bulkActionStatus.emit(true);
    if (btnBulkAction) {
      btnBulkAction.disabled = false;
    }
    // const nativeRef = btnBulkAction._elementRef.nativeElement;
    // nativeRef.style.filter = 'brightness(0.8) hue-rotate(15deg);';
    try {
      await action.onClick(this.selectionMultiple.selected);
    } catch (error) {
      console.error('ngx-auto-table: Error Executing Bulk Action', error);
    }
    this.selectionMultiple.clear();
    // nativeRef.style.filter = '';
    if (btnBulkAction) {
      btnBulkAction.disabled = true;
    }
    this.bulkActionStatus.emit(false);
  }

  onClickCancelBulk() {
    this.selectionMultiple.clear();
    this.$clearTrigger.next();
  }

  onSearchChanged(newSearchString: string) {
    this.logger.log('onSearchChanged', { newSearchString });
    this.searchChanged.next(newSearchString);
  }

  onColumnsChanged(newColumnsArray: string[]) {
    this.logger.log('onColumnsChanged', { newColumnsArray });
    this.columnsChanged.next(newColumnsArray);
  }

  onSearchHeadersChanged(newColumnsArray: string[]) {
    this.searchHeadersChanged.next(newColumnsArray);
  }
}
