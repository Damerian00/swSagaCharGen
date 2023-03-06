import { Component, OnInit } from '@angular/core';
import { UserHandlerService } from 'src/app/user-handler.service';


@Component({
  selector: 'app-landingpage',
  templateUrl: './landingpage.component.html',
  styleUrls: ['./landingpage.component.scss']
})
export class LandingpageComponent implements OnInit {

loggedIn: boolean = false;
log_in: boolean = false;
invalidation: boolean = false;
currentUser = {
        id: '',
        userName: '',
        permission: '',
        valid: false
};
  constructor(private userDB : UserHandlerService) { }

  ngOnInit(): void {
    this.loggedIn = false;
 
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
      "password" : pass
    }
   this.userDB.loginUser(body).subscribe(payload=>{
      this.currentUser = {
        id: payload.user.id,
        userName: payload.user.name,
        permission: payload.user.permission,
        valid: true
      }
      console.log(`current User: ${payload} payload: ${payload.accessToken}`);
      this.toggleLogin();
       return this.loggedIn = true;
    });
    if (!this.currentUser.valid){
      this.invalidation = true;
   }
  }


}
