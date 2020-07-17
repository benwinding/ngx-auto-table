import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {
  MainDemoComponent,
  BlankTableDemoComponent,
  QueryParamsTableDemoComponent,
} from './components';

export const allRoutes: Routes = [
  { path: 'main-demo', component: MainDemoComponent },
  { path: 'blank-demo', component: BlankTableDemoComponent },
  { path: 'use-queryparams-demo', component: QueryParamsTableDemoComponent },
];

@NgModule({
  imports: [
    RouterModule.forRoot([
      ...allRoutes,
      { path: '**', redirectTo: 'main-demo' },
    ]),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
