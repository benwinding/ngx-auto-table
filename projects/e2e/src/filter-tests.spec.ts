import { TestBed } from '@angular/core/testing';
import {
  AutoTableModule,
  AutoTableComponent,
} from '../../ngx-auto-table/src/public_api';
import { of, BehaviorSubject } from 'rxjs';
import { setTimeoutAsync } from './utils';

interface MyTableRow {
  name: string;
  age: number;
  verified?: boolean;
}

function MakeRow(name: string, age: number): MyTableRow {
  return {
    name,
    age,
  };
}

function MakeRowBool(name: string, age: number, verified = false): MyTableRow {
  return {
    name,
    age,
    verified,
  };
}

function MakeTestTableComponent() {
  TestBed.configureTestingModule({
    imports: [AutoTableModule],
  });
  const comp = TestBed.createComponent(AutoTableComponent);
  const inst = comp.componentInstance as AutoTableComponent<MyTableRow>;
  return inst;
}

describe('filter tests', () => {
  test('should have 6 items (no filtering)', async () => {
    const inst = MakeTestTableComponent();
    inst.config = {
      data$: new BehaviorSubject([
        MakeRow('Adam', 11),
        MakeRow('Ben', 20),
        MakeRow('Alice', 12),
        MakeRow('Allen', 23),
        MakeRow('Dan', 33),
        MakeRow('Robert', 22),
      ]),
    };
    inst.columnDefinitions = {
      age: {},
      name: {},
    };
    await setTimeoutAsync(1000);
    expect(inst.dataSource.data.length).toBe(6);
  });
  test('should have filtered items from search', async () => {
    const inst = MakeTestTableComponent();
    inst.config = {
      data$: new BehaviorSubject([
        MakeRow('Adam', 11),
        MakeRow('Ben', 20),
        MakeRow('Alice', 12),
        MakeRow('Allen', 23),
        MakeRow('Dan', 33),
        MakeRow('Robert', 22),
      ]),
    };
    inst.columnDefinitions = {
      age: {},
      name: {},
    };
    inst.$CurrentSearchText.next('Al');
    await setTimeoutAsync(1000);
    expect(inst.dataSource.data.length).toBe(2);
  });
  test('filtered items (string)', async () => {
    const inst = MakeTestTableComponent();
    inst.config = {
      data$: new BehaviorSubject([
        MakeRow('Adam', 11),
        MakeRow('Adam2', 20),
        MakeRow('Ben', 20),
        MakeRow('Alice', 12),
        MakeRow('Allen', 23),
        MakeRow('Dan', 33),
        MakeRow('Robert', 22),
      ]),
    };
    inst.columnDefinitions = {
      age: {},
      name: {},
    };
    inst.$filterChangedTrigger.next({
      age: {
        fieldName: 'age',
        stringArray: ['20'],
      },
    });
    await setTimeoutAsync(1000);
    expect(inst.dataSource.data.length).toBe(2);
  });
  test('should have filtered items from filters and search', async () => {
    const inst = MakeTestTableComponent();
    inst.config = {
      data$: new BehaviorSubject([
        MakeRow('Adam', 11),
        MakeRow('Adam2', 20),
        MakeRow('Ben', 20),
        MakeRow('Alice', 12),
        MakeRow('Allen', 23),
        MakeRow('Dan', 33),
        MakeRow('Robert', 22),
      ]),
    };
    inst.columnDefinitions = {
      age: {},
      name: {},
    };
    inst.$filterChangedTrigger.next({
      age: {
        fieldName: 'age',
        stringArray: ['20'],
      },
    });
    inst.$CurrentSearchText.next('Adam');
    await setTimeoutAsync(1000);
    expect(inst.dataSource.data.length).toBe(1);
  });
  test('filtered items (boolean true)', async () => {
    const inst = MakeTestTableComponent();
    inst.config = {
      data$: new BehaviorSubject([
        MakeRowBool('Adam', 11, true),
        MakeRowBool('Adam2', 20, true),
        MakeRowBool('Ben', 20),
        MakeRowBool('Alice', 12),
        MakeRowBool('Allen', 23, true),
        MakeRowBool('Dan', 33),
        MakeRowBool('Robert', 22),
      ]),
    };
    inst.columnDefinitions = {
      age: {},
      name: {},
    };
    inst.$filterChangedTrigger.next({
      verified: { fieldName: 'verified', bool: true },
    });
    await setTimeoutAsync(1000);
    expect(inst.dataSource.data.length).toBe(3);
  });
  test('filtered items (boolean false)', async () => {
    const inst = MakeTestTableComponent();
    inst.config = {
      data$: new BehaviorSubject([
        MakeRowBool('Adam', 11, true),
        MakeRowBool('Adam2', 20),
        MakeRowBool('Ben', 20),
        MakeRowBool('Alice', 12),
        MakeRowBool('Allen', 23, true),
        MakeRowBool('Dan', 33),
        MakeRowBool('Robert', 22),
      ]),
    };
    inst.columnDefinitions = {
      age: {},
      name: {},
    };
    inst.$filterChangedTrigger.next({
      verified: { fieldName: 'verified', bool: false },
    });
    await setTimeoutAsync(1000);
    expect(inst.dataSource.data.length).toBe(5);
  });
  test('check options are present (string filter)', async () => {
    const inst = MakeTestTableComponent();
    inst.config = {
      data$: new BehaviorSubject([
        MakeRowBool('Adam', 11, true),
        MakeRowBool('Adam2', 20),
        MakeRowBool('Ben', 20),
        MakeRowBool('Alice', 12),
        MakeRowBool('Allen', 23, true),
        MakeRowBool('Dan', 33),
        MakeRowBool('Robert', 22),
      ]),
    };
    inst.columnDefinitions = {
      age: {},
      name: {},
    };
    inst.$filterChangedTrigger.next({
      verified: { fieldName: 'verified', bool: false },
    });
    await setTimeoutAsync(1000);
    expect(inst.dataSource.data.length).toBe(5);
  });
});
