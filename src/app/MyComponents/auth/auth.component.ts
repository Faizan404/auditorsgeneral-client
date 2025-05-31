import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AccountService } from 'src/app/services/account.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
})
export class AuthComponent implements OnInit {
  authFormTitle: string = 'Login';
  isLoginHidden: boolean = false;
  isRegisterHidden: boolean = true;
  isForgetPasswordHidden: boolean = true;
  isResetPasswordHidden: boolean = true;

  model: any = {};
  myRegisterForm: FormGroup = new FormGroup({});
  myLoginForm: FormGroup = new FormGroup({});
  myPasswordForgetForm: FormGroup = new FormGroup({});
  myPasswordResetForm: FormGroup = new FormGroup({});

  loggedIn: boolean = false;
  activatedRoute: any;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private service: AccountService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.getCurrentUrl();
    this.initializeUserLogin();
    this.initializeUserRegisterForm();
    this.initializeUserPasswordForget();
    this.initializeUserPasswordReset();
  }

  getCurrentUrl() {
    const urlPath = window.location.pathname;
    if (urlPath === '/account/reset-password') {
      this.activeForm('Reset Password');
    }
  }

  // TODO: Reactive Froms structure start
  initializeUserLogin() {
    this.myLoginForm = this.fb.group({
      email: ['', [Validators.email, Validators.required]],
      password: ['', Validators.required],
    });
  }

  initializeUserPasswordForget() {
    this.myPasswordForgetForm = this.fb.group({
      email: ['', [Validators.email, Validators.required]],
    });
  }

  initializeUserPasswordReset() {
    this.myPasswordResetForm = this.fb.group({
      email: ['', [Validators.email, Validators.required]],
      resetToken: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(8)]],
      passwordConfirm: [
        '',
        [Validators.required, this.matchValues('password')],
      ],
    });
    this.myPasswordResetForm.controls['password'].valueChanges.subscribe({
      next: () =>
        this.myPasswordResetForm.controls[
          'passwordConfirm'
        ].updateValueAndValidity(),
    });
  }

  initializeUserRegisterForm() {
    this.myRegisterForm = this.fb.group({
      personnelNo: ['', [Validators.required, Validators.minLength(8)]],
      name: ['', Validators.required],
      email: ['', [Validators.email, Validators.required]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      passwordConfirm: [
        '',
        [Validators.required, this.matchValues('password')],
      ],
    });
    this.myRegisterForm.controls['password'].valueChanges.subscribe({
      next: () =>
        this.myRegisterForm.controls[
          'passwordConfirm'
        ].updateValueAndValidity(),
    });
  }
  // TODO: Custom Validation (Check password and passwordConfirm are same)
  matchValues(matchTo: string): ValidatorFn {
    return (control: AbstractControl) => {
      return control.value === control.parent?.get(matchTo)?.value
        ? null
        : { notMatching: true };
    };
  }
  // TODO: Reactive Froms structure end

  // TODO: Authentcation methods start
  getUserLogin() {
    this.service.login(this.myLoginForm.value).subscribe({
      next: (res) => {
        console.log(res);
        this.loggedIn = true;
        this.router.navigateByUrl('home');
      },
      error: (err) => this.toastr.error(err.error),
    });
  }

  getUserRegister() {
    this.service.register(this.myRegisterForm.value).subscribe({
      next: (res) => this.router.navigateByUrl('home'),
      error: (err) => this.toastr.error(err.error),
    });
  }

  getUserResetPasswordEmail() {
    this.service.forgetPassword(this.myPasswordForgetForm.value).subscribe({
      next: () =>
        this.toastr.success(
          'Successfully sent password reset token on your email id'
        ),
      error: (err) => this.toastr.error(err.error),
    });
  }

  resetPassword() {
    this.service.resetPassword(this.myPasswordResetForm.value).subscribe({
      next: () => {
        this.toastr.success(
          'Your password has been resetted successfully, please login with new password'
        );
        this.router.navigateByUrl('/');
      },
      error: (err) => this.toastr.error(err.error),
    });
  }
  // TODO: Authentcation methods end

  formsStateController(
    login: boolean,
    signup: boolean,
    forget: boolean,
    reset: boolean
  ) {
    this.isLoginHidden = login;
    this.isRegisterHidden = signup;
    this.isForgetPasswordHidden = forget;
    this.isResetPasswordHidden = reset;
  }

  activeForm(formType: string) {
    this.authFormTitle = formType;
    if (formType === 'Login')
      this.formsStateController(false, true, true, true);
    else if (formType === 'Sign Up')
      this.formsStateController(true, false, true, true);
    else if (formType === 'Forget Password')
      this.formsStateController(true, true, false, true);
    else if (formType === 'Reset Password')
      this.formsStateController(true, true, true, false);
  }
}
