import { TestBed } from '@angular/core/testing';
import { AutoTableModule, AutoTableComponent } from '../../ngx-auto-table/src/public_api';
import { of, BehaviorSubject } from 'rxjs';
import { setTimeoutAsync } from './utils';

interface MyTableRow {
  name: string;
  age: number;
}

function MakeRow(name: string, age: number): MyTableRow {
  return {
    name,
    age,
  }
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
    }
    inst.columnDefinitions = {
      age: {},
      name: {}
    }
    await setTimeoutAsync(1000);
    expect(inst.dataSource.data.length).toBe(6);
  });
});
