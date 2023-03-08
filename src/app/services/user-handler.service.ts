import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserHandlerService {

userDBUrl : string = "http://localhost:3600/users/"
heroDBUrl : string = "http://localhost:3600/heroes/"
private userSaves: Array<any> = [];
  constructor(private http: HttpClient) { }

  loginUser(body: {}): Observable<any> {
    return this.http.post(this.userDBUrl + 'login', body);
  }
  addHeroSave(body : {}): Observable<any>{
    return this.http.post<any>(this.heroDBUrl, body);
  }
  getAllHeroSaves(): Observable<any> {
    return this.http.get(this.heroDBUrl);
  }
  getAllUsers(): Observable <any> {
    return this.http.get(this.userDBUrl);
  }
  getUser(id: string): Observable<any>{
    return this.http.get(this.userDBUrl + id);
  }
  updateUser(id: string, body: {}): Observable<any>{
    return this.http.put(this.userDBUrl + id, body);
  }
  getUserSaves(id: string): Observable<any>{
    return this.http.get(this.heroDBUrl + 'save/' + id);
  }
  getAhero(userId: string, id: string): Observable<any>{
    return this.http.get(this.heroDBUrl + userId + '/save/' + id);
  }
  updateHeroSave(id: string, body: {}): Observable <any>{
    return this.http.put(this.heroDBUrl + id, body);
  }
  deleteHeroSave(id: string): Observable<any>{
    return this.http.delete(this.heroDBUrl + id, {responseType: "text"});
  }

  setSaves(saves: any){
    this.userSaves = [...this.userSaves, saves] ;
   }
  getSaves(){
    return this.userSaves;
  }
}
