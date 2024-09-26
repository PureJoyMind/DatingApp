import {  NgIf } from '@angular/common';
import { Component, input, OnInit, Self } from '@angular/core';
import { ControlValueAccessor, FormControl, NgControl, ReactiveFormsModule } from '@angular/forms';
import { CustomValidatorDetails } from '../../models/customValidatorDetails';

@Component({
  selector: 'app-text-input',
  standalone: true,
  imports: [NgIf, ReactiveFormsModule],
  templateUrl: './text-input.component.html',
  styleUrl: './text-input.component.css'
})
export class TextInputComponent  implements ControlValueAccessor{
  label = input<string>('');
  type = input<string>('text');
  customValidators = input<CustomValidatorDetails[]>([]);
  
  constructor(@Self() public ngControl: NgControl) {
        ngControl.valueAccessor = this;
  }
  
  writeValue(obj: any): void {}
  registerOnChange(fn: any): void {}
  registerOnTouched(fn: any): void {}

  get control(): FormControl {
    return this.ngControl.control as FormControl;
  }

}
