import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { User } from '../models/user';
import { map } from 'rxjs';
import { JsonPipe } from '@angular/common';
import { environment } from '../../environments/environment';
 
@Injectable({ // These are Singletons
  providedIn: 'root'
})
export class AccountService {
  private http = inject(HttpClient);
  baseUrl = environment.apiUrl;
  currentUser = signal<User | null>(null)
  login(model : any){
    return this.http.post<User>(this.baseUrl + "account/login", model).pipe(
      map(user => {
        if(user){
          this.setCurrentUser(user);
        }
      })
    );
  }
  
  register(model : any){
    return this.http.post<User>(this.baseUrl + "account/register", model).pipe(
      map(user => {
        if(user){
          this.setCurrentUser(user);
        }
        return user;
      })
    );
  }
  
  setCurrentUser(user: User){
    localStorage.setItem('user', JSON.stringify(user));
    this.currentUser.set(user);
    console.log(JSON.stringify(user));
  }

  logout(){
    localStorage.removeItem('user');
    this.currentUser.set(null);
  }

}
