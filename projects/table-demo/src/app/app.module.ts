import { MatButtonModule } from '@angular/material/button';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSidenavModule } from '@angular/material/sidenav';

import { AppComponent } from './app.component';
import { AutoTableModule } from '../../../ngx-auto-table/src/public_api';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MatReduceCoreModule } from 'mat-reduce-core';
import {
  MainDemoComponent,
  BlankTableDemoComponent,
  QueryParamsTableDemoComponent,
  OfTableDemoComponent,
  FiltersDemoComponent,
  ManyColumnsComponent,
  OrderDemoComponent,
} from './components';
import { AppRoutingModule } from './app.routing';

const allComponents = [
  AppComponent,
  MainDemoComponent,
  BlankTableDemoComponent,
  QueryParamsTableDemoComponent,
  OfTableDemoComponent,
  OrderDemoComponent,
  FiltersDemoComponent,
  ManyColumnsComponent,
];

@NgModule({
  declarations: [...allComponents],
  imports: [
    BrowserModule,
    AutoTableModule,
    CommonModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    BrowserModule,
    AutoTableModule,
    MatReduceCoreModule,
    MatButtonModule,
    MatSidenavModule,
    AppRoutingModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
