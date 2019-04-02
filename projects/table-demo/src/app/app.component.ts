import { Component } from "@angular/core";
import { AutoTableConfig } from "ngx-auto-table/public_api";
import { Observable, of, BehaviorSubject } from "rxjs";

interface TestRow {
  name: string;
  age: number;
}

function MakeRow(name: string): TestRow {
  return {
    name: name,
    age: Math.round(Math.random() * 25 + 20)
  };
}

@Component({
  selector: "app-root",
  template: `
    <div style="text-align:center">
      NGX Auto Table Testing
    </div>

    <ngx-auto-table
      [config]="config"
      [columnDefinitions]="{
        name: {},
        age: {}
      }"
    ></ngx-auto-table>
  `
})
export class AppComponent {
  config: AutoTableConfig<TestRow>;
  constructor() {
    const rowDavid = MakeRow("David");
    const data$ = of([
      MakeRow("Mike"),
      rowDavid,
      MakeRow("Frank"),
      MakeRow("Jess"),
      MakeRow("Thelma")
    ]);
    const $triggerSelectItem = new BehaviorSubject(rowDavid);
    this.config = {
      data$: data$,
      actionsBulk: [
        {
          label: 'Delete',
          icon: 'delete',
          onClick: (rows: TestRow[]) => {
            console.log({rows});
          }
        }
      ],
      actions: [
        {
          label: 'Show',
          icon: 'remove_red_eye',
          onClick: (row: TestRow) => {
            console.log({row});
          }
        }
      ],
      $triggerSelectItem: $triggerSelectItem
    };
  }
}
