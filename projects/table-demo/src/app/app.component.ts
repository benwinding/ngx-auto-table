import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <h3 style="text-align:center">
      ngx-auto-table Testing
    </h3>
    <div>
      <router-outlet></router-outlet>
    </div>
  `
})
export class AppComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
