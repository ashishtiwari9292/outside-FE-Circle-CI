import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackBarComponent } from '../components/snack-bar/snack-bar.component';

@Injectable({
  providedIn: 'root',
})
export class SnackBarService {
  constructor(private _snackBar: MatSnackBar) {}

	public openSnackBar(
		message: string = 'Data saved successfully!',
		type: 'success' | 'error' | 'warning' | 'info' = 'success',
		outline?: string
	) {
		this._snackBar.openFromComponent(SnackBarComponent, {
			duration: 5000,
			horizontalPosition: 'center',
			// panelClass: panelClass,
			verticalPosition: 'bottom',
			data: {
				message: message,
				snackType: type,
				snackBar: this._snackBar,
				outline: outline,
			},
		});
	}
}

