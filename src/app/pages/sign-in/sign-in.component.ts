import { Component } from '@angular/core';
import { NgStyle } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { IconDirective } from '@coreui/icons-angular';
import { 
  ContainerComponent,
  RowComponent,
  ColComponent,
  CardGroupComponent,
  TextColorDirective,
  CardComponent,
  CardBodyComponent,
  FormDirective,
  InputGroupComponent,
  InputGroupTextDirective,
  FormControlDirective,
  ButtonDirective,
} from '@coreui/angular';

import { AuthService } from '../../libs/services/auth.service';

@Component({
    templateUrl: './sign-in.component.html',
    styleUrls: ['./sign-in.component.scss'],
    standalone: true,
    imports: [
      ContainerComponent,
      RowComponent,
      ReactiveFormsModule,
      ColComponent,
      CardGroupComponent,
      TextColorDirective,
      CardComponent,
      CardBodyComponent,
      FormDirective,
      InputGroupComponent,
      InputGroupTextDirective,
      IconDirective,
      FormControlDirective,
      ButtonDirective,
      NgStyle,
    ]
})
export class SignInComponent {

  signInForm!: FormGroup;

  constructor(private authService: AuthService, private formBuilder: FormBuilder) {
    this.signInForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  handlerOnSubmit = () => {
    if (this.signInForm.valid) {
      this.authService.signIn(this.signInForm.value);  
    }
  }
}
