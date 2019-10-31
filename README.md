# ngx-auto-table
A simple to use data table for Angular. (Wrapper around the Material Table)

## [Demo](https://benwinding.github.io/ngx-auto-table/index.html)

### Features include
- Default filtering and sorting of all data
- Uses RXJS observables
- Uses angular material theme and icons under the hood
- Row and Bulk actions, easily configurable
- Typed Data passed into the configuration
- Custom ng-templates for each column

#### Install
`yarn add ngx-auto-table`

Then add to your imports

``` typescript
import { AutoTableModule } from 'ngx-auto-table';

imports: [
  ...
  AutoTableModule,
  ...
]
```

Then add this to your tsconfig:

``` json
  "compilerOptions": {
    ...
    "paths": {
      "@angular/*": ["node_modules/@angular/*"]
    }
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

#### Row Operations
``` typescript
this.config = {
  data$: people$,
  actions: [
    {
      label: 'Delete',
      icon: 'delete', // material icon set
      onClick: (p: User) => {
        // Do stuff
      }
    }
  ]
};
```

#### Bulk Row Operations
``` typescript
this.config = {
  data$: people$,
  actionsBulk: [
    {
      label: 'Delete',
      icon: 'delete', // material icon set
      onClick: (p: User) => {
        // Do stuff
      }
    }
  ]
};
```

#### Custom Templates
``` html
<ngx-auto-table 
  [config]="config" 
  [columnDefinitions]="{
    name: {},
    age: {},
    email: {template: emailTemplate}
  }"
>
  <ng-template #emailTemplate let-row>
    <a [href]="'mailto:'+row.email">{{ row.email }} </a>
  </ng-template>
</ngx-auto-table>
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
