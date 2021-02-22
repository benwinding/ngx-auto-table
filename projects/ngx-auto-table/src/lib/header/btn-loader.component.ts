import { Component, Input } from '@angular/core';

@Component({
  selector: 'ngx-auto-table-btn-loader',
  template: `
    <div *ngIf="!disabled" class="loader-container is-button-icon">
      <div class="loader-div color-invert">
        <mat-spinner [diameter]="20"></mat-spinner>
      </div>
    </div>
  `,
  styles: [
    `
      .color-invert {
        filter: invert(1);
      }
      .loader-container {
        width: 100%;
        display: flex;
        margin: 25px 0px;
      }
      .loader-div {
        margin: auto;
      }
      .loader-container,
      .is-button-icon {
        display: inline-block;
        margin: 0;
        width: fit-content;
        margin-bottom: -4px;
        margin-right: 5px;
      }
    `
  ]
})
export class AppBtnLoaderComponent {
  @Input()
  disabled;
}
