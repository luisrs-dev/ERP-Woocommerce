import { CommonModule } from "@angular/common";
import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { DateRange, MatDatepickerInputEvent } from "@angular/material/datepicker";
import { MaterialModule } from "../../../angular-material/material.module";
import { provideNativeDateAdapter } from "@angular/material/core";

@Component({
    selector: 'date-range-picker',
    standalone: true,
    imports: [
        CommonModule, MaterialModule, FormsModule, ReactiveFormsModule
    ],
    providers: [provideNativeDateAdapter()],
    templateUrl: './date-range-picker.component.html',
    styleUrl: './date-range-picker.component.css',
})
export class DateRangePickerComponent {
    @Output() dateRangeSelected = new EventEmitter<{ startDate: Date | null, endDate: Date | null }>();
    startDate: Date | null = null;
    endDate: Date | null = null;
    selected: DateRange<Date> | null = null;
  
    onDateChange(event: MatDatepickerInputEvent<Date>, pickerType: 'start' | 'end') {
        if (pickerType === 'start') {
            this.startDate = event.value;   
        } else if (pickerType === 'end') {
            this.endDate = event.value;
        }

        if (this.startDate && this.endDate) {
            this.dateRangeSelected.emit({ startDate: this.startDate, endDate: this.endDate });
        }
    }

 }
