import { Component, Input, OnInit } from '@angular/core';
import { ControlValueAccessor, FormControl, NgControl } from '@angular/forms';

@Component({
  selector: 'app-textarea-fields',
  templateUrl: './textarea-fields.component.html',
  styleUrls: ['./textarea-fields.component.scss'],
})
export class TextareaFieldsComponent implements ControlValueAccessor {
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
