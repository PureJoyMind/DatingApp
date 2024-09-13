import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { Member } from '../models/member';
import { AccountService } from './account.service';
import { of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MembersService {
  private http = inject(HttpClient);
  baseUrl = environment.apiUrl;

  members = signal<Member[]>([]);

  getMembers(){
    return this.http.get<Member[]>(this.baseUrl + 'users').subscribe({
      next: members => this.members.set(members)
    })
  }

  getMember(username: string){
    /*
    Since we don't want to change the already implemented observable,
    we just manually return the observable. This is because there are
    already components using the previous direct request result observable.
    */
    const member = this.members().find(x => x.userName === username)
    if(member !== undefined) return of(member);
    
    return this.http.get<Member>(this.baseUrl + 'users/' + username)
  }
  
  updateMember(updatedMember: Member){
    const memberIndex = this.members().findIndex(x => x.userName === updatedMember.userName)
    return this.http.put(this.baseUrl + 'users', updatedMember).pipe(
      tap(() => {
        this.members.update(members => {
          members[memberIndex] = updatedMember;
          return members;
        })
      })
    );
  }

  
}
