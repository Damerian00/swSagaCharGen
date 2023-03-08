import { HttpClient } from '@angular/common/http';
import { Injectable, EventEmitter } from '@angular/core';
import { firstValueFrom } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  checkLogIn = new EventEmitter ();
  loggedIn: boolean = false;
  private currentUser: any;
  private acToken: string = '' ;
  userDBAPI : string = "http://localhost:3600/"
  constructor(private http: HttpClient) { }

  // async loggedIn(): Promise<boolean>{
  //   let isLoggedIn = false;
  //   if(sessionStorage.getItem('user')){
  //     const body: {} = {
  //       token: sessionStorage.getItem('user')
  //     }
  //     const res: any = await firstValueFrom(this.http.post(this.userDBAPI + 'users/token', body));
  //     console.log('the res: ',res)
  //     if(!res.error){
  //       isLoggedIn = true;
  //     }
  //   }
  //   return isLoggedIn;
  // }

  setToken(token: string){
    this.acToken = token;
  }
  setCurrentUser(user :any){
    this.currentUser = user;
  }
  getCurrentUser(){
    return this.currentUser;
  }
  async checkToken(){
    let token = await sessionStorage.getItem('user');
      if (token == this.acToken){
         this.loggedIn = true;
      }else{
         this.loggedIn = false;
      }   
      this.checkLogIn.emit(this.loggedIn);
  }
}
