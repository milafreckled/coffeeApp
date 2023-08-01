import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Subscription, catchError, take } from 'rxjs';
import { User } from './logic/User';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  #userBehaviourSubject = new BehaviorSubject<User | null>(null);
  public userObject$ = this.#userBehaviourSubject.asObservable();
  constructor(private http: HttpClient) { }
  httpOptions = {
    headers: new HttpHeaders({
    'Content-Type': 'application/json',
    }),
  }
  endpoint = 'http://localhost:3000'
  getCookies(cname: string){
      let name = cname + "=";
      let decodedCookie = decodeURIComponent(document.cookie);
      let ca = decodedCookie.split(';');
      for(let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
          c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
          return c.substring(name.length, c.length);
        }
      }
      return "";
    }

  login(userData: User): Promise<User | null>{
    return new Promise(resolve => {
      this.http.post(`${this.endpoint}/login`, { username: userData.username, password: userData.password}, this.httpOptions)
      .pipe(catchError((err, caught) => { throw new Error(err) }))
      .subscribe((response: any) => {
      if (response.username){
        this.#userBehaviourSubject.next({...userData, _id: response.id});
        resolve({...userData, _id: response.id});
      }
      resolve(null);
    })
  })
  }

  register(userData: User){
    return this.http.post(`${this.endpoint}/register`, { username: userData.username, password: userData.password}, this.httpOptions);
  }

  logout(){
    this.#userBehaviourSubject.next(null);
    return this.http.post(`${this.endpoint}/logout`, this.httpOptions);
  }

  isLoggedIn(){
    return this.#userBehaviourSubject.value !== null;
  }
}


