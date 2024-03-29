import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {
  MainDemoComponent,
  BlankTableDemoComponent,
  QueryParamsTableDemoComponent,
  OfTableDemoComponent,
  FiltersDemoComponent,
  ManyColumnsComponent,
  OrderDemoComponent
} from './components';

export const allRoutes: Routes = [
  { path: 'main-demo', component: MainDemoComponent },
  { path: 'blank-demo', component: BlankTableDemoComponent },
  { path: 'use-queryparams-demo', component: QueryParamsTableDemoComponent },
  { path: 'use-of-demo', component: OfTableDemoComponent },
  { path: 'filters-demo', component: FiltersDemoComponent },
  { path: 'order-demo', component: OrderDemoComponent },
  { path: 'many-columns', component: ManyColumnsComponent },
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
