import { Component, Input } from '@angular/core';
import { ControlValueAccessor, FormControl, NgControl } from '@angular/forms';

@Component({
  selector: 'app-hr-fields',
  templateUrl: './hr-fields.component.html',
  styleUrls: ['./hr-fields.component.scss'],
})
export class HrFieldsComponent implements ControlValueAccessor {
  @Input() type = '';
  @Input() attrLabel = '';
  @Input() placeholder = '';
  @Input() inputTitle = '';
  constructor(private ngControl: NgControl) {
    this.ngControl.valueAccessor = this;
  }

  writeValue(obj: any): void {}
  registerOnChange(fn: any): void {}
  registerOnTouched(fn: any): void {}

  get control(): FormControl {
    return this.ngControl.control as FormControl;
  }
}
