import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { ActionDefinitionBulk, AutoTableConfig } from '../models';

import { v4 as uuidv4 } from 'uuid';
import { FormControl } from '@angular/forms';
import { SelectionModel } from '@angular/cdk/collections';
import { KeyValue } from '@angular/common';
import { Subject } from 'rxjs';

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
              [hidden]="HasNoItems || config?.hideFilter"
              [filterText]="config?.filterText"
              [$clearTrigger]="$clearTrigger"
              (searchChanged)="onSearchChanged($event)"
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
          class="bulk-actions flex-h align-center mat-primary overflow-x-auto"
          [hidden]="!config?.actionsBulk?.length"
          [class.hidden]="!selectionMultiple.hasValue()"
        >
          <mat-toolbar-row class="flex-h align-center space-between">
            <div class="flex-h align-center">
              <button
                mat-raised-button
                [disabled]="IsPerformingBulkAction"
                (click)="onClickCancelBulk()"
              >
                <mat-icon>clear</mat-icon>
                <span>Cancel</span>
              </button>
              <ngx-auto-table-header-search
                [filterText]="config?.filterText"
                [$clearTrigger]="$clearTrigger"
                (searchChanged)="onSearchChanged($event)"
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
  styleUrls: ['../ngx-auto-table.component.scss']
})
export class NgxAutoTableHeaderComponent implements OnInit {
  @Input()
  config: AutoTableConfig<any>;

  @Input()
  IsPerformingBulkAction: boolean;
  @Input()
  HasNoItems: boolean;
  @Input()
  IsMaxReached: boolean;
  @Input()
  headerKeyValues: KeyValue<string, string>[];
  @Input()
  selectedHeaderKeys: string[];
  @Input()
  selectionMultiple: SelectionModel<any>;

  @Output()
  searchChanged = new EventEmitter<string>();
  @Output()
  columnsChanged = new EventEmitter<string[]>();
  @Output()
  bulkActionStatus = new EventEmitter<boolean>();

  autoCompleteObscureName = uuidv4();
  searchControl = new FormControl();
  chooseColumnsControl = new FormControl();

  $clearTrigger = new Subject();

  constructor() {}

  ngOnInit() {}

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
    console.log('onSearchChanged', { newSearchString });
    this.searchChanged.next(newSearchString);
  }

  onColumnsChanged(newColumnsArray: string[]) {
    console.log('onColumnsChanged', { newColumnsArray });
    this.columnsChanged.next(newColumnsArray);
  }
}
