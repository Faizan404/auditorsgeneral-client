import { Component, Input, OnInit, Self } from '@angular/core';
import { ControlValueAccessor, FormControl, NgControl } from '@angular/forms';

@Component({
  selector: 'app-auth-fields',
  templateUrl: './auth-fields.component.html',
  styleUrls: ['./auth-fields.component.scss'],
})
export class AuthFieldsComponent implements ControlValueAccessor {
  @Input() inputTitle = '';
  @Input() attrLabel = '';
  @Input() placeholder = '';
  @Input() type = '';

  constructor(@Self() public ngControl: NgControl) {
    this.ngControl.valueAccessor = this;
  }

  writeValue(obj: any): void {}
  registerOnChange(fn: any): void {}
  registerOnTouched(fn: any): void {}

  get control(): FormControl{
    return this.ngControl.control as FormControl;
  }
}
