import { AutoTableConfig } from '../../../../ngx-auto-table/src/public_api';
import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, of } from 'rxjs';

interface MyTableRow {
  name: string;
  obj: {
    age: number;
  };
  verified: boolean;
}

function makeRow(name: string, age: number, bool: boolean): MyTableRow {
  return {
    name,
    obj: { age },
    verified: bool 
  }
}

@Component({
  template: `
    <h2>Filters Demo</h2>
    <ngx-auto-table
      [config]="config"
      [columnDefinitions]="{
        name: {},
        'obj.age': {},
        verified: {}
      }"
    ></ngx-auto-table>

    <h3>Datasource</h3>
    <pre>
    {{ myDataSource | async | json }}
    </pre
    >
  `,
})
export class OrderDemoComponent implements OnInit {
  config: AutoTableConfig<MyTableRow>;

  myDataSource = new BehaviorSubject<MyTableRow[]>([]);

  ngOnInit() {
    this.config = {
      initialSort: 'obj.age', // <- You can filter by nested properties too!
      initialSortDir: 'asc',
      debug: true,
      data$: of([
        makeRow('frank', 10, false),
        makeRow('bob', 10, false),
        makeRow('alice', 10, true),
        makeRow('dan', 10, true),
        makeRow('ben', 10, false),
        makeRow('ben', 11, false),
        makeRow('ben', 12, true),
        makeRow('ben', 13, true),
      ]),
    };
  }
}
