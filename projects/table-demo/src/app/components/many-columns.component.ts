import { AutoTableConfig } from '../../../../ngx-auto-table/src/public_api';
import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, of } from 'rxjs';

interface MyTableRow {
  id: string;
  id0: string;
  id1: string;
  id2: string;
  id3: string;
  id4: string;
  id5: string;
  id6: string;
  name: string;
  age: number;
  verified: boolean;
}

function Rand() {
  return Math.random().toString().slice(2, 10);
}

function makeRow(name: string, age: number, bool: boolean): MyTableRow {
  return {
    id: Rand(),
    id0: Rand(),
    id1: Rand(),
    id2: Rand(),
    id3: Rand(),
    id4: Rand(),
    id5: Rand(),
    id6: Rand(),
    name,
    age,
    verified: bool,
  };
}

@Component({
  template: `
    <h2>Filters Demo</h2>
    <ngx-auto-table
      [config]="config"
      [columnDefinitions]="{
        name: {},
        age: {},
        verified: {},
        id: {},
        id0: {},
        id1: {},
        id2: {},
        id3: {},
        id4: {},
        id5: {},
        id6: {}
      }"
    ></ngx-auto-table>

    <h3>Datasource</h3>
    <pre>
    {{ myDataSource | async | json }}
    </pre
    >
  `,
})
export class ManyColumnsComponent implements OnInit {
  config: AutoTableConfig<MyTableRow>;

  myDataSource = new BehaviorSubject<MyTableRow[]>([]);

  ngOnInit() {
    this.config = {
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
      actionsVisibleCount: 1,
      actions: [
        {
          label: 'Action',
          onClick: () => {},
          icon: 'remove_red_eye'
        },
        {
          label: 'Action',
          onClick: () => {},
          icon: 'remove_red_eye'
        }
      ]
    };
  }

  addRow(e) {
    e.preventDefault();
  }
}
