import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { User } from '../logic/User';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  constructor(private auth: AuthService, private router: Router){}
  loginForm = new FormGroup({
    username: new FormControl('', [Validators.required, Validators.pattern(/[a-zA-Z0-9_\!\?\.]{3,}/)]),
    password: new FormControl('', [Validators.required, Validators.pattern(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/)]),
  });
  
  onLogin(){
    this.auth.login(this.loginForm.value as User).then(user => {
      if (user){
        this.router.navigate(['/'])
      }
    })

  }
}
