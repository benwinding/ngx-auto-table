import { Component, Input } from '@angular/core';

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
    const exportFunctionSafe =
      typeof this.exportFunction === 'function'
        ? this.exportFunction
        : (a: any) => a;
    const rows = this.data.map((d) => exportFunctionSafe(d));
    downloadCsvFile(rows, this.filename);
  }
}

function downloadCsvFile(rowStrings: string[], filename: string) {
  const csv_string = rowStrings.join('\n');
  // Download it
  const link = document.createElement('a');
  link.style.display = 'none';
  link.setAttribute('target', '_blank');
  link.setAttribute(
    'href',
    'data:text/csv;charset=utf-8,' + encodeURIComponent(csv_string)
  );
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
