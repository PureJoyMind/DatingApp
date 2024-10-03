import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { Member } from '../models/member';
import { AccountService } from './account.service';
import { of, tap } from 'rxjs';
import { Photo } from '../models/Photo';
import { PaginationResult } from '../models/pagination';
import { UserParams } from '../models/userParams';

@Injectable({
  providedIn: 'root'
})
export class MembersService {
  private http = inject(HttpClient);
  baseUrl = environment.apiUrl;
  private accountService = inject(AccountService);
  // members = signal<Member[]>([]);
  paginatedResults = signal<PaginationResult<Member[]> | null>(null);
  memberCache = new Map();
  user = this.accountService.currentUser();
  userParams = signal<UserParams>(new UserParams(this.user));

  resetUserParams(){
    this.userParams.set(new UserParams(this.user));
  }

  getMembers() {
    const cacheKey = Object.values(this.userParams()).join('-');
    const response = this.memberCache.get(cacheKey); // key for cache

    if(response) return this.setPaginatedResponse(response);

    let params = this.setPaginationHeaders(this.userParams().pageNumber, this.userParams().pageSize);

    params = params.append('minAge', this.userParams().minAge);
    params = params.append('maxAge', this.userParams().maxAge);
    params = params.append('gender', this.userParams().gender);
    params = params.append('orderBy', this.userParams().orderBy);

    return this.http.get<Member[]>(this.baseUrl + 'users', { observe: 'response', params }).subscribe({
      next: response => {
        this.setPaginatedResponse(response);
        this.memberCache.set(cacheKey, response);
      }
    })
  }

  private setPaginatedResponse(response: HttpResponse<Member[]>){
    this.paginatedResults.set({
          items: response.body as Member[],
          pagination: JSON.parse(response.headers.get('Pagination')!)
        })
  }

  private setPaginationHeaders(pageNumber: number, pageSize: number) {
    var params = new HttpParams();
    if (pageNumber && pageSize) {
      params = params.append('pageNumber', pageNumber)
        .append('pageSize', pageSize);
    }
    return params;
  }

  getMember(username: string) {
    /*
    Since we don't want to change the already implemented observable,
    we just manually return the observable. This is because there are
    already components using the previous direct request result observable.
    */
    // const member = this.members().find(x => x.userName === username)
    // if(member !== undefined) return of(member);

    const member: Member = [...this.memberCache.values()]
      .reduce((arr, elem) => arr.concat(elem.body), [])
      .find((m: Member) => m.userName === username);

    if(member) return of(member);

    return this.http.get<Member>(this.baseUrl + 'users/' + username)
  }

  updateMember(updatedMember: Member) {
    const memberIndex = this.paginatedResults()?.items?.findIndex(x => x.userName === updatedMember.userName)
    return this.http.put(this.baseUrl + 'users', updatedMember).pipe(
      // tap(() => {
      //   this.members.update(members => {
      //     members[memberIndex] = updatedMember;
      //     return members;
      //   })
      // })
    );
  }

  setMainPhoto(photo: Photo) {
    return this.http.put(this.baseUrl + 'users/set-main-photo/' + photo.id, {})
      .pipe(
      // tap(() => {
      //   this.members.update(members => members.map(m => {
      //     if(m.photos.includes(photo)){
      //       m.photoUrl = photo.url;
      //     }
      //     return m;
      //   }))
      // })
    )
  }

  deletePhoto(photo: Photo) {
    return this.http.delete(this.baseUrl + 'users/delete-photo/' + photo.id).pipe(
      // tap(() => {
      //   this.members.update(members => members.map(m => {
      //     if(m.photos.includes(photo)){
      //       m.photos = m.photos.filter(x => x.id !== photo.id);
      //     }
      //     return m;
      //   }))
      // })
    );
  }


}
