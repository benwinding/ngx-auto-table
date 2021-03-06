import { AutoTableConfig } from './../../../../ngx-auto-table/src/public_api';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';

interface MyTableRow {
  name: string;
  age: number;
}

const DEFAULT_VAL: MyTableRow = {
  name: 'Frank',
  age: 22
}

@Component({
  template: `
    <h2>Simple Table</h2>
    <h5>Add a row</h5>
    <form
      (submit)="this.addRow($event)"
      [formGroup]="form"
      style="display: flex; flex-direction: row;"
    >
      <form-text formControlName="name"></form-text>
      <div style="width: 10px"></div>
      <form-number formControlName="age"></form-number>
      <div style="width: 10px"></div>
      <button mat-raised-button (click)="this.addRow($event)">Add Row</button>
    </form>
    <ngx-auto-table
      [config]="config"
      [columnDefinitions]="{
        name: {},
        age: {}
      }"
    ></ngx-auto-table>

    <h3>Datasource</h3>
    <pre>
    {{myDataSource | async | json}}
    </pre
    >
  `
})
export class BlankTableDemoComponent implements OnInit {
  config: AutoTableConfig<MyTableRow>;

  form = new FormGroup({
    name: new FormControl('Frank'),
    age: new FormControl(2)
  });

  myDataSource = new BehaviorSubject<MyTableRow[]>([]);

  ngOnInit() {
    this.form.patchValue(DEFAULT_VAL);
    this.config = {
      debug: true,
      data$: this.myDataSource.asObservable(),
      actions: [
        {
          icon: 'delete',
          label: 'Delete',
          onClick: row =>
            this.myDataSource.next(
              this.myDataSource.getValue().filter(r => r.name != row.name)
            )
        }
      ]
    };
  }

  addRow(e) {
    e.preventDefault();
    const row = this.form.value;
    this.myDataSource.getValue().push(row)
    this.myDataSource.next(this.myDataSource.getValue())
    this.form.patchValue(DEFAULT_VAL);
  }
}
