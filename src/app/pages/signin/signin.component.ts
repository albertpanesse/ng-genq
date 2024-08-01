import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../lib/services/auth.service';

@Component({
  selector: 'signin-comp',
  templateUrl: './signin.component.html',
})
export class SigninComponent implements OnInit {
  signinForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.signinForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  ngOnInit(): void {}

  onLogin() {
    if (this.signinForm.valid) {
      this.authService.login(this.signinForm.value).subscribe(
        () => this.router.navigate(['/dashboard']),
        err => console.error(err)
      );
    }
  }

  loginWithGoogle() {
    this.authService.loginWithGoogle();
  }
}
