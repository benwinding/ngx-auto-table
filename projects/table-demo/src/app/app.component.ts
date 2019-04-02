import { Component } from "@angular/core";
import { AutoTableConfig } from "ngx-auto-table/public_api";
import { BehaviorSubject } from "rxjs";
import { take } from "rxjs/operators";

interface TestRow {
  name: string;
  age: number;
}

const randomNames = [
  "Betty",
  "Sherlene",
  "Holli",
  "Jacinto",
  "Dewayne",
  "Maureen",
  "Gwyneth",
  "Ellis",
  "Iva",
  "Treena",
  "Cordia",
  "Kirsten",
  "Tora",
  "Nelida",
  "Rosella",
  "Ronnie",
  "Shena",
  "Darcey",
  "Tad",
  "Ellsworth"
];
function MakeRandomRow(): TestRow {
  const randomName =
    randomNames[Math.floor(Math.random() * randomNames.length)];
  const randomAge = Math.round(Math.random() * 25 + 20);
  return {
    name: randomName,
    age: randomAge
  };
}

@Component({
  selector: "app-root",
  template: `
    <div style="text-align:center">
      NGX Auto Table Testing
    </div>

    <button (click)="this.onClickAddRandomTake1()">
      Add Random Name
    </button>

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
  data$ = new BehaviorSubject<TestRow[]>(null);

  constructor() {
    this.data$.next([
      MakeRandomRow(),
      MakeRandomRow(),
      MakeRandomRow(),
      MakeRandomRow()
    ]);
    this.config = {
      data$: this.data$,
      debug: true,
      actionsBulk: [
        {
          label: "Delete",
          icon: "delete",
          onClick: (rows: TestRow[]) => {
            console.log({ rows });
          }
        }
      ],
      actions: [
        {
          label: "Show",
          icon: "remove_red_eye",
          onClick: (row: TestRow) => {
            console.log({ row });
          }
        }
      ],
      selectFirstOnInit: true
    };
  }
  async onClickAddRandomTake1() {
    const currentItems = await this.data$.pipe(take(1)).toPromise();
    const randomItem = MakeRandomRow();
    console.log("app: adding random item", { currentItems, randomItem });
    currentItems.push(randomItem);
    this.data$.next(currentItems);
  }
}
