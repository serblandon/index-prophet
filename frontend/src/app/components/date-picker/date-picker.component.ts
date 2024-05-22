import { Component, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ToastrService } from 'ngx-toastr';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-date-picker',
  standalone: true,
  imports: [MatDatepickerModule, MatNativeDateModule, MatFormFieldModule, MatInputModule, FormsModule, ButtonModule],
  templateUrl: './date-picker.component.html',
  styleUrl: './date-picker.component.scss'
})
export class DatePickerComponent {

  @Output() dateRangeChange = new EventEmitter<{ startDate: Date | null, endDate: Date | null }>();

  startDate: Date | null = null;
  endDate: Date | null = null;

  constructor(private toastr: ToastrService) {}

  applyDateRange() {
    this.dateRangeChange.emit({ startDate: this.startDate, endDate: this.endDate });

    this.toastr.success(`Date filter has been successfully applied.`, 'Success');
  }

  resetDateRange() {
    if (this.startDate !== null || this.endDate !== null) {
    this.startDate = null;
    this.endDate = null;
    this.dateRangeChange.emit({ startDate: this.startDate, endDate: this.endDate });

    this.toastr.success(`Date filter was Reset.`, 'Success');
    }
  }

}
