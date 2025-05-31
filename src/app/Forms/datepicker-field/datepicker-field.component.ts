import { Component, Input, OnInit } from '@angular/core';
import { ControlValueAccessor, FormControl, NgControl } from '@angular/forms';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';

@Component({
  selector: 'app-datepicker-field',
  templateUrl: './datepicker-field.component.html',
  styleUrls: ['./datepicker-field.component.scss'],
})
export class DatepickerFieldComponent implements ControlValueAccessor {
  @Input() attrLabel = '';
  @Input() inputTitle = '';
  bsConfig: Partial<BsDatepickerConfig> | undefined;
  @Input() placeholder = '';

  constructor(private ngControl: NgControl) {
    this.ngControl.valueAccessor = this;

    this.bsConfig = {
      containerClass: 'theme-green',
      dateInputFormat: 'YYYY-MM-DD',
    };
  }

  writeValue(obj: any): void {}
  registerOnChange(fn: any): void {}
  registerOnTouched(fn: any): void {}

  get control(): FormControl {
    return this.ngControl.control as FormControl;
  }
}
