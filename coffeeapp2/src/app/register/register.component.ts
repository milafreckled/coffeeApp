import { Component } from '@angular/core';
import { User } from '../logic/User';
import { AuthService } from '../auth.service';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { PasswordErrorStateMatcher } from './errorStateMatcher';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  constructor(private auth: AuthService){}
  matcher = new PasswordErrorStateMatcher();
  registerMessage: string | null = null;
  checkPasswords: ValidatorFn = (group: AbstractControl):  ValidationErrors | null => { 
    let pass = group.get('password')?.value;
    let confirmPass = group.get('passwordConfirmation')?.value
    return pass === confirmPass ? null : { notSame: true }
  }

  registerForm = new FormGroup({
    username: new FormControl('', [Validators.required, Validators.pattern(/[a-zA-Z0-9_]{3,}/)]),
    password: new FormControl('', [Validators.required, Validators.pattern(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/)]),
    passwordConfirmation: new FormControl('', [Validators.required, Validators.pattern(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/)]),
  }, {validators: this.checkPasswords});
  
  onRegister(){
    this.auth.register(this.registerForm.value as User).subscribe((response: any) => {
      if (response.message){
        this.registerMessage = response.message;
      }
    });
  }
}
