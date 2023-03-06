import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserHandlerService {

userDBAPI : string = "http://localhost:3600/"

  constructor(private http: HttpClient) { }

  loginUser(body: {}): Observable<any> {
    return this.http.post(this.userDBAPI + 'users/login', body);
  }
  
  getAllUsers() : Observable <any> {
    return this.http.get(this.userDBAPI + 'users/');
  }
  getUser(id: string): Observable<any>{
    return this.http.get(this.userDBAPI + 'users/' + id);
  }
  updateuser(id: string, body: {}): Observable<any>{
    return this.http.put(this.userDBAPI + 'users/' + id, body);
  }
  getUserSaves(id: string): Observable<any>{
    return this.http.get(this.userDBAPI + 'heroes/save/' + id);
  }
  getAhero(userId: string, id: string): Observable<any>{
    return this.http.get(this.userDBAPI + 'heroes' + userId + '/save/' + id);
  }
  addHeroSave(body : {}): Observable<any>{
    return this.http.post(this.userDBAPI + 'heroes/', body)
  }
  updateHeroSave(id: string, body: {}): Observable <any>{
    return this.http.put(this.userDBAPI + 'heroes/' + id, body);
  }
  deleteHeroSave(id: string): Observable<any>{
    return this.http.delete(this.userDBAPI + 'heroes/' + id, {responseType: "text"});
  }
}
