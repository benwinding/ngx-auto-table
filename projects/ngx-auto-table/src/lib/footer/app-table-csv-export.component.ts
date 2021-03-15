import { Component, Input } from '@angular/core';
import { downloadCSVData } from './csv-export-functions';

@Component({
  selector: 'app-table-csv-export',
  template: `
    <button
      *ngIf="data?.length"
      (click)="onClickDownload()"
      mat-raised-button
      title="Export as CSV"
    >
      <mat-icon>file_download</mat-icon>
      <span>Export CSV</span>
    </button>
  `,
  styles: [
    `
      a {
        color: black;
      }
      mat-icon {
        padding-right: 5px;
      }
    `,
  ],
})
export class AppExportCsvExportComponent {
  @Input()
  data: [];
  @Input()
  exportFunction: (d: any) => any;
  @Input()
  filename: string;

  onClickDownload() {
    downloadCSVData(this.data, this.exportFunction, this.filename);
  }
}
