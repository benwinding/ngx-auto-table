import { Component } from "@angular/core";

@Component({
  selector: "ngx-auto-app-toolbar-loader",
  template: `
    <div class="loader-container is-button-icon">
      <div class="loader-div">
        <mat-spinner [diameter]="60"></mat-spinner>
      </div>
    </div>
  `,
  styles: [
    `
      .loader-container {
        display: flex !important;
        padding: 0px 0px;
        z-index: 100000000;
      }
      .loader-div {
        margin: auto;
      }
      .loader-container,
      .is-button-icon {
        display: inline-block;
        margin: 0;
        margin-top: 10px;
        margin-bottom: -4px;
        margin-right: 5px;
      }
    `
  ]
})
export class AppToolbarLoaderComponent {}
