import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

import { AppComponent } from "./app.component";
import { AutoTableModule } from "../../../ngx-auto-table/src/public_api";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { MatReduceCoreModule } from 'mat-reduce/src/core'

@NgModule({
  declarations: [AppComponent],
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
    MatReduceCoreModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
