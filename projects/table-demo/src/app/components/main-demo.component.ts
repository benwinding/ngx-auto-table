import { Component, OnInit } from '@angular/core';
import { AutoTableConfig, TableFiltersState } from '../../../../ngx-auto-table/src/public_api';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { take, debounceTime, startWith } from 'rxjs/operators';
import { FormGroup, FormControl } from '@angular/forms';
import _ from 'lodash';

interface TestRow {
  name: string;
  age: number;
  good: boolean;
  next_birthday: number;
  id_taken_from_db: string;
  test$: Observable<string>;
  thisIsSentenceCase: string;
  thisHas_underScores: string;
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
  'Ellsworth',
];
function MakeRandomRow(): TestRow {
  const randomName =
    randomNames[Math.floor(Math.random() * randomNames.length)];
  const randomAge = Math.round(Math.random() * 25 + 20);
  const randId = Math.random().toString(32).slice(2);
  return {
    name: randomName,
    age: randomAge,
    good: _.shuffle([false, true]).pop(),
    id_taken_from_db: randId,
    next_birthday: randomAge + 1,
    test$: new BehaviorSubject(randId),
    thisIsSentenceCase: randId + 'A22',
    thisHas_underScores: randId + '_26',
  };
}

@Component({
  template: `
    <button
      color="primary"
      mat-raised-button
      (click)="this.onClickAddRandomTake1()"
    >
      Add Random Name
    </button>

    <ngx-auto-table
      [config]="config"
      [columnDefinitions]="{
        name: {},
        name2: { template: name2Template },
        age: {},
        good: {},
        mobile: { template: mobileTemplate, hide: true },
        tablet: { template: tabletTemplate, hide: true }
      }"
    >
      <ng-template #name2Template let-row>
        <strong>{{ row.test$ | async }}</strong>
      </ng-template>
      <ng-template #mobileTemplate let-row>
        <strong>Mobile View: {{ row.name }}</strong>
      </ng-template>
      <ng-template #tabletTemplate let-row>
        <strong>Tablet View: {{ row.name }}</strong>
      </ng-template>
    </ngx-auto-table>

    <h3 style="text-align:center">Configuration Object</h3>

    <form
      [formGroup]="formGroup"
      style="display: grid; grid-template-columns: 50% 50%;"
    >
      <div class="">
        <form-number formControlName="bulkSelectMaxCount"></form-number>
        <form-number formControlName="actionsVisibleCount"></form-number>
        <form-select-string
          [selections]="['name', 'age']"
          formControlName="initialSort"
        ></form-select-string>
        <form-select-string
          [selections]="['asc', 'desc']"
          formControlName="initialSortDir"
        ></form-select-string>
        <form-number formControlName="pageSize"></form-number>
        <form-select-string-multiple
          [selections]="['name', 'age']"
          formControlName="hideFields"
        ></form-select-string-multiple>
        <form-select-string-multiple
          [selections]="['name', 'age', 'id_taken_from_db']"
          formControlName="dontSearchFields"
        ></form-select-string-multiple>
        <form-text formControlName="noItemsFoundPlaceholder"></form-text>
        <form-text formControlName="filterText"></form-text>
        <form-text formControlName="exportFilename"></form-text>
      </div>
      <div class="">
        <h2>Flags</h2>
        <form-toggle formControlName="hideFilter"></form-toggle>
        <form-toggle formControlName="hideHeader"></form-toggle>
        <form-toggle formControlName="hidePaginator"></form-toggle>
        <form-toggle formControlName="hideChooseColumns"></form-toggle>
        <form-toggle formControlName="searchOnlyVisibleColumns"></form-toggle>
        <form-toggle formControlName="searchByColumnOption"></form-toggle>
        <form-toggle formControlName="disableSelect"></form-toggle>
        <form-toggle formControlName="disableHoverEffect"></form-toggle>
        <form-toggle formControlName="selectFirstOnInit"></form-toggle>
        <form-toggle formControlName="disableMobileScroll"></form-toggle>
        <form-toggle formControlName="debug"></form-toggle>
      </div>
    </form>

    <pre>
    {{ { config: formGroup.value } | json }}
    </pre
    >
  `,
})
export class MainDemoComponent implements OnInit {
  config: AutoTableConfig<TestRow>;
  data$ = new BehaviorSubject<TestRow[]>(null);

  formGroup = new FormGroup({
    bulkSelectMaxCount: new FormControl(5),
    actionsVisibleCount: new FormControl(1),
    initialSort: new FormControl(),
    initialSortDir: new FormControl(),
    mobileFields: new FormControl(['mobile']),
    tabletFields: new FormControl(['tablet']),
    pageSize: new FormControl(10),
    hideFields: new FormControl(['name']),
    dontSearchFields: new FormControl(['id_taken_from_db']),
    hideFilter: new FormControl(),
    hideHeader: new FormControl(),
    hidePaginator: new FormControl(),
    hideChooseColumns: new FormControl(),
    searchOnlyVisibleColumns: new FormControl(true),
    searchByColumnOption: new FormControl(true),
    noItemsFoundPlaceholder: new FormControl(),
    filterText: new FormControl(),
    exportFilename: new FormControl(),
    disableSelect: new FormControl(),
    disableHoverEffect: new FormControl(),
    selectFirstOnInit: new FormControl(true),
    disableMobileScroll: new FormControl(),
    debug: new FormControl(true),
  });
  
  constructor() {}

  async fakeDelay(ms: number) {
    console.log('fake delay: begin for: ' + ms + 'ms');
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('fake delay: end...');
        resolve(null);
      }, ms);
    });
  }

  async ngOnInit() {
    // await this.fakeDelay(500);
    this.formGroup.valueChanges
      .pipe(startWith(null), debounceTime(500))
      .subscribe((newConfigFlags) => {
        this.makeCofig(this.formGroup.value);
      });
    // await this.fakeDelay(1000);
    await this.fakeDelay(3000);
    this.data$.next(this.makeRandomSet(30));
    if(sessionStorage.getItem('tableState')){
      this.$stateUpdateTrigger.next(JSON.parse(sessionStorage.getItem('tableState')));
      //console.error('state triger',(await $stateUpdateTrigger.toPromise()).columnsEnabled);
    }
  }
  $stateUpdateTrigger = new BehaviorSubject<TableFiltersState>({});

  makeRandomSet(count: number) {
    return Array.from('1'.repeat(count)).map(() => MakeRandomRow());
  }
  async makeCofig(newConfigFlags) {
    // this.config = null;
    // await this.fakeDelay(100);
    this.config = {
      ...newConfigFlags,
      $triggerSetTableFilterState: this.$stateUpdateTrigger,
      data$: this.data$,
      actionsBulk: [
        {
          label: 'Long Delete (30s)',
          icon: 'delete',
          onClick: async (rows: TestRow[]) => {
            await this.fakeDelay(30000);
            await this.removeItems(rows);
            console.log({ rows });
          },
        },
        {
          label: 'Quick Delete (1s)',
          icon: 'delete',
          onClick: async (rows: TestRow[]) => {
            await this.fakeDelay(1000);
            await this.removeItems(rows);
            console.log({ rows });
          },
        },
        {
          label: 'Instant Delete',
          icon: 'delete',
          onClick: async (rows: TestRow[]) => {
            await this.removeItems(rows);
            console.log({ rows });
          },
        },
      ],
      actions: [
        {
          label: 'Delete',
          icon: 'delete',
          onClick: async (row: TestRow) => {
            await this.removeItems([row]);
          },
          disabledByRowField: 'good'
        },
        {
          label: 'Show',
          icon: 'remove_red_eye',
          onClick: (row: TestRow) => {
            console.log({ row });
          },
        },
        {
          label: 'Action',
          icon: 'arrow_forward',
          iconColor: 'accent',
          onClick: async (row: TestRow) => {},
        },
      ],
      exportFilename: 'export.csv',
      exportRowFormat: null
    };
  }

  async onClickAddRandomTake1() {
    const currentItems = await this.data$.pipe(take(1)).toPromise();
    const randomItem = MakeRandomRow();
    console.log('app: adding random item', { currentItems, randomItem });
    currentItems.push(randomItem);
    this.data$.next(currentItems);
  }

  async removeItems(rows: TestRow[]) {
    console.log('app: removing items', { rows });
    const deleteIds = new Set(rows.map((r) => r.id_taken_from_db));
    const dataBefore = await this.data$.pipe(take(1)).toPromise();
    const dataAfter = dataBefore.filter(
      (d) => !deleteIds.has(d.id_taken_from_db)
    );
    this.data$.next(dataAfter);
  }
}
