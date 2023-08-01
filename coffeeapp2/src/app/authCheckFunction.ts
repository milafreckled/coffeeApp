import { Injectable, inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateFn, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

export function authCheckFunction(): CanActivateFn{
  return () => {
    const authService: AuthService = inject(AuthService);
    const router: Router = inject(Router)
    if (authService.isLoggedIn()){
      return true;
    }else{
      router.navigate(['/login']);
      return false;
    }
  }
}
