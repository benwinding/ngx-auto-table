import { Component, OnInit, Input } from '@angular/core';
import { ActionDefinition } from '../models';

@Component({
  selector: 'ngx-auto-table-actions-menu',
  template: `
    <div
      *ngIf="actions?.length"
      class="flex flex-row-reverse items-center content-start"
    >
      <button
        class="mr-10"
        *ngIf="(actionsVisibleCount || 0) < actions.length"
        mat-mini-fab
        color="secondary"
        [disabled]="isPerformingBulkAction"
        [matMenuTriggerFor]="rowMenu"
      >
        <mat-icon color="dark">more_vert</mat-icon>
      </button>
      <mat-menu #rowMenu="matMenu" class="row-menu">
        <div
          mat-menu-item
          *ngFor="
            let action of actions
              | slice: actionsVisibleCount || 0:actions.length
          "
        >
          <button
            class="mr-10"
            mat-menu-item
            *ngIf="action.onClick"
            [disabled]="
              !!action.disabledByRowField && row[action.disabledByRowField]
            "
            (click)="onClickedAction(action, row)"
          >
            <mat-icon [color]="action.iconColor">{{ action.icon }}</mat-icon>
            <span>{{ action.label }}</span>
          </button>
          <a
            class="mr-10"
            mat-menu-item
            *ngIf="action.onRouterLink && !action.routerLinkQuery"
            [disabled]="
              !!action.disabledByRowField && row[action.disabledByRowField]
            "
            [routerLink]="['/' + action.onRouterLink(row)]"
          >
            <mat-icon [color]="action.iconColor">{{ action.icon }}</mat-icon>
            <span>{{ action.label }}</span>
          </a>
          <a
            class="mr-10"
            mat-menu-item
            *ngIf="action.onRouterLink && action.routerLinkQuery"
            [disabled]="
              !!action.disabledByRowField && row[action.disabledByRowField]
            "
            [routerLink]="['/' + action.onRouterLink(row)]"
            [queryParams]="action.routerLinkQuery(row)"
          >
            <mat-icon [color]="action.iconColor">{{ action.icon }}</mat-icon>
            <span>{{ action.label }}</span>
          </a>
        </div>
      </mat-menu>
      <div class="flex" *ngIf="actionsVisibleCount as visibleCount">
        <div *ngFor="let action of actions | slice: 0:visibleCount">
          <button
            class="mr-10"
            mat-mini-fab
            *ngIf="action.onClick"
            [disabled]="
              !!action.disabledByRowField && row[action.disabledByRowField]
            "
            (click)="onClickedAction(action, row)"
            [matTooltip]="action.label"
            [color]="action.iconColor || 'accent'"
          >
            <mat-icon>{{ action.icon }}</mat-icon>
          </button>
          <a
            class="mr-10"
            mat-mini-fab
            *ngIf="action.onRouterLink && !action.routerLinkQuery"
            [disabled]="
              !!action.disabledByRowField && row[action.disabledByRowField]
            "
            [routerLink]="['/' + action.onRouterLink(row)]"
            [matTooltip]="action.label"
            [color]="action.iconColor || 'accent'"
          >
            <mat-icon>{{ action.icon }}</mat-icon>
          </a>
          <a
            class="mr-10"
            mat-mini-fab
            *ngIf="action.onRouterLink && action.routerLinkQuery"
            [disabled]="
              !!action.disabledByRowField && row[action.disabledByRowField]
            "
            [routerLink]="['/' + action.onRouterLink(row)]"
            [queryParams]="action.routerLinkQuery(row)"
            [matTooltip]="action.label"
            [color]="action.iconColor || 'accent'"
          >
            <mat-icon>{{ action.icon }}</mat-icon>
          </a>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .flex-row-reverse {
        flex-direction: row-reverse;
      }
      .items-center {
        align-items: center;
      }
      .content-start {
        justify-content: flex-start;
      }
      .flex {
        display: flex;
      }
      .mr-10 {
        margin-right: 10px;
      }
    `,
  ],
  styleUrls: ['../ngx-auto-table.component.scss'],
})
export class NgxAutoTableActionsMenuComponent implements OnInit {
  @Input()
  row: any;
  @Input()
  actions: ActionDefinition<any>[] = [];
  @Input()
  actionsVisibleCount: number;
  @Input()
  isPerformingBulkAction: boolean;

  constructor() {}

  ngOnInit() {}

  async onClickedAction(action: ActionDefinition<any>, row: any) {
    try {
      await action.onClick(row);
    } catch (error) {
      console.error('ngx-auto-table: Error Executing Bulk Action', error);
    }
  }
}
