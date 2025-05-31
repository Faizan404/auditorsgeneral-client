import { Component, Input, OnInit } from '@angular/core';
import {
  ControlValueAccessor,
  FormControl,
  FormControlOptions,
  NgControl,
} from '@angular/forms';

@Component({
  selector: 'app-select-fields',
  templateUrl: './select-fields.component.html',
  styleUrls: ['./select-fields.component.scss'],
})
export class SelectFieldsComponent implements ControlValueAccessor {
  deptSelected($event: Event) {
    console.log($event);
  }
  @Input() inputTitle: string = '';
  @Input() attrLabel: string = '';
  @Input() options: { value: string; label: string }[] = [];

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
