import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { UserHandlerService } from 'src/app/services/user-handler.service';


@Component({
  selector: 'app-landingpage',
  templateUrl: './landingpage.component.html',
  styleUrls: ['./landingpage.component.scss']
})
export class LandingpageComponent implements OnInit {

loggedIn = this.auth.loggedIn;
log_in: boolean = false;
invalidation: boolean = false;
token = '';
currentUser = {
        id: '',
        userName: '',
        permission: '',
        valid: false
};
  constructor(private userDB : UserHandlerService, private auth: AuthService) { }

  ngOnInit(): void {
    // this.userDB.getAllHeroSaves().subscribe((saves)=>{
    //   console.log(saves);
    // })
    
    this.auth.checkLogIn.subscribe(authStatus=> {
      this.loggedIn = authStatus;
    })
    
    
    // this.loggedIn = this.auth.loggedIn();
 
  }
  toggleLogin(){
    this.log_in = !this.log_in;
    this.invalidation = false;
  }
  handleLogin(userName: string, pass: string){
    this.invalidation = false;
    if (!userName || !pass){
      // return this.invalidation = true;
    }
    const body = {
      "name" : userName,
      "password" : pass,
    }
   this.userDB.loginUser(body).subscribe(payload=>{
    if(!payload.error){
      this.token = payload.accessToken
      sessionStorage.setItem('user', this.token);
      this.auth.setToken(payload.accessToken);
      this.currentUser = {
        id: payload.user.id,
        userName: payload.user.name,
        permission: payload.user.permission,
        valid: true
      }
      this.auth.setCurrentUser(this.currentUser);
      // console.log(`current User: ${payload} payload: ${payload.accessToken}`);
      this.toggleLogin();
      this.auth.checkToken();
      return;
    }  
    });
    if (!this.currentUser.valid){
      this.invalidation = true;
   }
  }
  logOut(){
    sessionStorage.removeItem('user');
    this.loggedIn = false;
  

  }

}
