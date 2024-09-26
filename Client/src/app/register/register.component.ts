import { Component, inject, input, OnInit, output } from '@angular/core';
import { AbstractControl, FormBuilder,  FormGroup, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { AccountService } from '../_services/account.service';
import { ToastrService } from 'ngx-toastr';
import { NgIf } from '@angular/common';
import { TextInputComponent } from "../_forms/text-input/text-input.component";
import { DatePickerComponent } from "../_forms/date-picker/date-picker.component";
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf, TextInputComponent, DatePickerComponent],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit {
  private accountService = inject(AccountService);
  private fb = inject(FormBuilder);
  private toastr = inject(ToastrService);
  private router = inject(Router);
  cancelRegister = output<boolean>();
  registerForm: FormGroup = new FormGroup({});  
  maxDate = new Date();
  validationErrors: string[] | undefined;

  register(){
    const dob = this.getDateOnly(this.registerForm.get('dateOfBirth')?.value);

    console.log(`date of birth control: ${this.registerForm.get('dateOfBirth')?.value}`);
    
    // this.registerForm.get('dateOfBirth')?.setValue(dob);
    console.log('patch: ', this.registerForm.value);

    var req = this.registerForm.value;
    req.dateOfBirth = dob;
    
    this.accountService.register(req).subscribe({
      next: _ => {
        this.toastr.success('Registered Successfully!', `Welcome ${this.registerForm.get('username')?.value}`);
        this.router.navigateByUrl('/members')
      },
      error: error => this.validationErrors = error
    });
  }
  
  ngOnInit(): void {
    this.initializeForm()
    this.maxDate.setFullYear(this.maxDate.getFullYear() - 18)
  }

  initializeForm(){
    this.registerForm = this.fb.group({
      // gender: ['male'],
      // username: ['', []],
      // knownAs: ['', []],
      // dateOfBirth: ['', []],
      // city: ['', []],
      // country: ['', []],
      // password: ['', [ Validators.minLength(4)]],
      // confirmPassword: ['', [this.matchValues('password')]]
      gender: ['male'],
      username: ['', [Validators.required]],
      knownAs: ['', [Validators.required]],
      dateOfBirth: ['', [Validators.required]],
      city: ['', [Validators.required]],
      country: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(4)]],
      confirmPassword: ['', [Validators.required, this.matchValues('password')]]
    });

    this.registerForm.controls['password'].valueChanges.subscribe({
      next: () => this.registerForm.controls['confirmPassword'].updateValueAndValidity()
    });
  }

  matchValues(matchTo: string): ValidatorFn {
    return (control: AbstractControl) => {
      return control.value === control.parent?.get(matchTo)?.value ? null : {isMatching: true}
    }
  }

  cancel(){
    this.cancelRegister.emit(false);
  }

  private getDateOnly(dob:string | undefined){
    if(!dob) return;
    console.log(`before patch ${dob}`);
    
    var s = new Date(dob).toISOString().slice(0, 10);
    
    console.log(`before setting ${s}`);
    return s;
  }
}
