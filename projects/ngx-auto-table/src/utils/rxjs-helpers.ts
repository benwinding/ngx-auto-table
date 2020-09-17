import { Observable, BehaviorSubject } from 'rxjs';
import { map, distinctUntilChanged } from 'rxjs/operators';

export function GetLength() {
  return map((arr: any[]) => arr.length);
}

export function convertObservableToBehaviorSubject<T>(
  observable: Observable<T>,
  initValue: T
): BehaviorSubject<T> {
  const subject = new BehaviorSubject(initValue);

  observable.subscribe({
    // DONT COMPLETE ME YET!
    // complete: () => subject.complete(),
    error: (x) => subject.error(x),
    next: (x) => subject.next(x),
  });

  return subject;
}

export function distinctUntilChangedObj<T>() {
  return distinctUntilChanged<T>(
    (a, b) => JSON.stringify(a) === JSON.stringify(b)
  );
}
