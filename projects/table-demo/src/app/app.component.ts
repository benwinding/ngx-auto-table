import { Component } from '@angular/core';
import { allRoutes } from './app.routing';

@Component({
  selector: 'app-root',
  template: `
    <!--The content below is only a placeholder and can be replaced.-->
    <h2>ngx-auto-table Demo</h2>
    <mat-drawer-container style="height: 90vh;">
      <mat-drawer mode="side" style="width: 160px" opened>
        <nav>
          <a
            *ngFor="let linkItem of linkItems"
            [routerLink]="[linkItem.path]"
            routerLinkActive="active"
            #rla="routerLinkActive"
            [routerLinkActiveOptions]="{ exact: true }"
          >
            {{ linkItem.path }}
          </a>
        </nav>
      </mat-drawer>
      <mat-drawer-content>
        <div style="padding: 10px;">
          <router-outlet></router-outlet>
        </div>
      </mat-drawer-content>
    </mat-drawer-container>
  `,
  styles: [
    `
      nav {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        overflow: hidden;
        width: 250px;
      }
      nav a,
      nav a:visited {
        text-decoration: none;
        color: black;
      }
      nav a {
        padding: 8px;
        width: 100%;
        font-family: sans-serif;
      }
      .active {
        font-weight: bold;
        border-bottom: 1px solid red;
      }
    `,
  ],
})
export class AppComponent {
  linkItems = allRoutes;
}
