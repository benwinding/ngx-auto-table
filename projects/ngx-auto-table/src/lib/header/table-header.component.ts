import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { ActionDefinitionBulk, AutoTableConfig } from '../AutoTableConfig';

import { v4 as uuidv4 } from 'uuid';
import { FormControl } from '@angular/forms';
import { SelectionModel } from '@angular/cdk/collections';

@Component({
  selector: 'ngx-auto-table-header',
  template: `
    <div
      class="table-header auto-elevation overflow-hidden"
      [class.addRightPixel]="config?.hideHeader"
      *ngIf="
        !(config?.hideFilter && config?.hideChooseColumns) &&
        !config?.hideHeader &&
        !HasNoItems
      "
    >
      <div class="relative">
        <mat-toolbar class="mat-elevation-z8">
          <mat-toolbar-row class="flex-h align-center space-between">
            <ngx-auto-table-header-search
              *ngIf="!HasNoItems && !config?.hideFilter"
              [filterText]="config?.filterText"
              (searchChanged)="onSearchChanged($event)"
            ></ngx-auto-table-header-search>
            <ngx-auto-table-header-columns-chooser
              *ngIf="!HasNoItems && !config?.hideChooseColumns"
              [allColumnStrings]="AllColumnStrings"
              [cacheId]="config?.cacheId"
              (columnsChanged)="onColumnsChanged($event)"
            ></ngx-auto-table-header-columns-chooser>
          </mat-toolbar-row>
        </mat-toolbar>
        <mat-toolbar
          class="bulk-actions flex-h align-center mat-primary overflow-x-auto"
          *ngIf="config?.actionsBulk?.length"
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
  AllColumnStrings: string[];
  @Input()
  selectionMultiple: SelectionModel<any>;

  @Output()
  searchChanged = new EventEmitter();
  @Output()
  bulkActionStatus = new EventEmitter();

  autoCompleteObscureName = uuidv4();
  searchControl = new FormControl();
  chooseColumnsControl = new FormControl();

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
    await action.onClick(this.selectionMultiple.selected);
    this.selectionMultiple.clear();
    // nativeRef.style.filter = '';
    if (btnBulkAction) {
      btnBulkAction.disabled = true;
    }
    this.bulkActionStatus.emit(false);
  }

  onClickCancelBulk() {
    this.selectionMultiple.clear();
  }

  onSearchChanged(newSearchString: string) {
    console.log('onSearchChanged', { newSearchString });
    this.searchChanged.next(newSearchString);
  }
  onColumnsChanged(newColumnsArray: string[]) {
    console.log('onColumnsChanged', { newColumnsArray });
  }
}
