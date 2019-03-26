# ngx-auto-table
A simple to use data table for Angular.

### Features include
- Default filtering and sorting of all data
- Uses RXJS observables
- Uses angular material under the hood
- Row and Bulk actions, easily configurable
- Typed Data passed into the configuration

#### Install
`yarn add ngx-auto-table`

Then add to your imports

``` typescript
import { AutoTableModule } from 'ngx-auto-table/dist';

imports: [
  ...
  AutoTableModule,
  ...
]
```

#### Usage
- Add the table to the HTML template
``` html
<ngx-auto-table 
  [config]="config" 
  [columnDefinitions]="{
    name: {},
    age: {}
  }"
>
</ngx-auto-table>
```
- Add config object to the typescript
``` typescript
config: AutoTableConfig<User>;

ngOnInit() {
  this.config = {
    data$: people$
  };
}
```

#### Basic Example Component
To use the table in a component, simply add it to the template and feed it an obseravble in the Typescript file.

``` typescript
import { Component, OnInit } from '@angular/core';
import { AutoTableConfig } from 'ngx-auto-table/dist/public_api';
import { of, Observable } from 'rxjs';

interface User {
  name: string;
  age: number;
}

const sampleUsers: User[] = [
  { name: 'Frank', age: 22 },
  { name: 'Albert', age: 34 },
  { name: 'Jasper', age: 29 },
  { name: 'Hugo', age: 23 }
];

@Component({
  selector: 'app-auto-table-test',
  template: `
    <div>
      <ngx-auto-table [config]="config" [columnDefinitions]="{
        name: {},
        age: {}
      }">
      </ngx-auto-table>
    </div>
  `
})
export class AutoTableTestComponent implements OnInit {
  config: AutoTableConfig<User>;

  ngOnInit() {
    const people$: Observable<User[]> = of(sampleUsers);
    this.config = {
      data$: people$
    };
  }
}
```
