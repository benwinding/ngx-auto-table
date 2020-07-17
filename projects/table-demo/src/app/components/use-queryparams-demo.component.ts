import {
  AutoTableConfig,
  TableFiltersState,
} from '../../../../ngx-auto-table/src/public_api';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { BehaviorSubject, Subject } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { take, delay } from 'rxjs/operators';
import * as _ from 'lodash';

interface MyTableRow {
  name: string;
  age: number;
}

@Component({
  template: `
    <h2>Update Table From QueryParams</h2>
    <ngx-auto-table
      [config]="config"
      [columnDefinitions]="{
        name: {},
        age: {}
      }"
    ></ngx-auto-table>

    <h3>Datasource</h3>
    <pre>
    {{ myDataSource | async | json }}
    </pre
    >
  `,
})
export class QueryParamsTableDemoComponent implements OnInit {
  config: AutoTableConfig<MyTableRow>;

  form = new FormGroup({
    name: new FormControl(),
    age: new FormControl(),
  });

  myDataSource = new BehaviorSubject<MyTableRow[]>([
    { name: 'Something', age: 222 },
    { name: 'Another', age: 12 },
    { name: 'Thing', age: 3 },
  ]);

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    const searchFilterState = new Subject<TableFiltersState>();
    this.route.queryParams
      .pipe(take(1), delay(100))
      .subscribe((queryParams) => {
        const searchText = queryParams.searchText;
        console.log({ queryParams, searchText });
        if (searchText) {
          searchFilterState.next({ searchText: searchText });
        }
      });
    this.config = {
      debug: true,
      data$: this.myDataSource.asObservable(),
      $triggerSetTableFilterState: searchFilterState,
      onTableFilterStateChanged: (newState) => {
        this.router.navigate([], {
          relativeTo: this.route,
          queryParams: newState,
          queryParamsHandling: 'merge',
        });
      },
      actions: [
        {
          icon: 'delete',
          label: 'Delete',
          onClick: (row) =>
            this.myDataSource.next(
              this.myDataSource.getValue().filter((r) => r.name != row.name)
            ),
        },
      ],
    };
  }
}

function JsonToQueryString(json: {}): string {
  return (
    '?' +
    Object.keys(json)
      .map(function (key) {
        return encodeURIComponent(key) + '=' + encodeURIComponent(json[key]);
      })
      .join('&')
  );
}
