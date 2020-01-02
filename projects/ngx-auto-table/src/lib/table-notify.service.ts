import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';

@Injectable({ providedIn: 'root' })
export class TableNotifyService {
  constructor(private snackbar: MatSnackBar) {}

  warn(msg: string) {
    this.snackbar.open(msg, '', { duration: 2000 });
  }
}
