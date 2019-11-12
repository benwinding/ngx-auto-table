import { Component, OnInit } from '@angular/core';
import { AutoTableConfig } from '../../../ngx-auto-table/src/public_api';
import { BehaviorSubject } from 'rxjs';
import { take } from 'rxjs/operators';

interface TestRow {
  name: string;
  age: number;
  next_birthday: number;
  id_taken_from_db: string;
}

const randomNames = [
  'Betty',
  'Sherlene',
  'Holli',
  'Jacinto',
  'Dewayne',
  'Maureen',
  'Gwyneth',
  'Ellis',
  'Iva',
  'Treena',
  'Cordia',
  'Kirsten',
  'Tora',
  'Nelida',
  'Rosella',
  'Ronnie',
  'Shena',
  'Darcey',
  'Tad',
  'Ellsworth'
];
function MakeRandomRow(): TestRow {
  const randomName =
    randomNames[Math.floor(Math.random() * randomNames.length)];
  const randomAge = Math.round(Math.random() * 25 + 20);
  return {
    name: randomName,
    age: randomAge,
    id_taken_from_db: randomAge + randomName,
    next_birthday: randomAge + 1
  };
}

@Component({
  selector: 'app-root',
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
        age: {},
        mobile: { template: mobileTemplate, hide: true}
      }"
    ></ngx-auto-table>

    <ng-template #mobileTemplate let-row>
      <strong>{{ row.name }}</strong>
    </ng-template>
  `
})
export class AppComponent implements OnInit {
  config: AutoTableConfig<TestRow>;
  data$ = new BehaviorSubject<TestRow[]>(null);

  constructor() {
    this.data$.next([
      MakeRandomRow(),
      MakeRandomRow(),
      MakeRandomRow(),
      MakeRandomRow(),
      MakeRandomRow(),
      MakeRandomRow(),
      MakeRandomRow(),
      MakeRandomRow()
    ]);
  }

  async fakeDelay(ms: number) {
    console.log('fake delay: begin for: ' + ms + 'ms');
    return new Promise(resolve => {
      setTimeout(() => {
        console.log('fake delay: end...');
        resolve();
      }, ms);
    });
  }

  async ngOnInit() {
    await this.fakeDelay(1000);
    // await this.fakeDelay(400000);
    this.config = {
      data$: this.data$,
      debug: true,
      bulkSelectMaxCount: 5,
      actionsBulk: [
        {
          label: 'Long Delete (30s)',
          icon: 'delete',
          onClick: async (rows: TestRow[]) => {
            await this.fakeDelay(30000);
            await this.removeItems(rows);
            console.log({ rows });
          }
        },
        {
          label: 'Quick Delete (1s)',
          icon: 'delete',
          onClick: async (rows: TestRow[]) => {
            await this.fakeDelay(1000);
            await this.removeItems(rows);
            console.log({ rows });
          }
        },
        {
          label: 'Instant Delete',
          icon: 'delete',
          onClick: async (rows: TestRow[]) => {
            await this.removeItems(rows);
            console.log({ rows });
          }
        }
      ],
      actions: [
        {
          label: 'Delete',
          icon: 'delete',
          onClick: async (row: TestRow) => {
            await this.removeItem(row);
          }
        },
        {
          label: 'Show',
          icon: 'remove_red_eye',
          onClick: (row: TestRow) => {
            console.log({ row });
          }
        }
      ],
      selectFirstOnInit: true,
      hidePaginator: false,
      cacheId: 'some-table',
      pageSize: 10,
      actionsVisibleCount: 1,
      mobileFields: ['mobile']
      // disableSelect: true,
      // disableHoverEffect: true
    };
  }

  async onClickAddRandomTake1() {
    const currentItems = await this.data$.pipe(take(1)).toPromise();
    const randomItem = MakeRandomRow();
    console.log('app: adding random item', { currentItems, randomItem });
    currentItems.push(randomItem);
    this.data$.next(currentItems);
  }

  async removeItem(row: TestRow) {
    console.log('app: removing item', { row });
    const currentItems = await this.data$.pipe(take(1)).toPromise();
    const itemsAfterDelete = currentItems.filter(
      r => JSON.stringify(r) != JSON.stringify(row)
    );
    this.data$.next(itemsAfterDelete);
  }

  async removeItems(rows: TestRow[]) {
    console.log('app: removing items', { rows });
    const currentItems = await this.data$.pipe(take(1)).toPromise();
    const removeSet = new Set(rows.map(r => JSON.stringify(r)));
    const itemsAfterDelete = currentItems.filter(
      r => !removeSet.has(JSON.stringify(r))
    );
    this.data$.next(itemsAfterDelete);
  }
}
