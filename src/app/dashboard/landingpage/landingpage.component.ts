import { getLocaleDateTimeFormat } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { LocalstorageService } from 'src/app/services/localstorage.service';
import { UploadedSavesService } from 'src/app/services/uploaded-saves.service';
import { UserHandlerService } from 'src/app/services/user-handler.service';



@Component({
  selector: 'app-landingpage',
  templateUrl: './landingpage.component.html',
  styleUrls: ['./landingpage.component.scss']
})
export class LandingpageComponent implements OnInit {
savedStorage: any;  
savedHeroes:  any = [];
locals: boolean = false;
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
  constructor(
    private userDB : UserHandlerService, 
    private auth: AuthService, 
    private upload: UploadedSavesService, 
    private local: LocalstorageService,
    public router: Router) { }

  ngOnInit(): void {
    // this.userDB.getAllHeroSaves().subscribe((saves)=>{
    //   console.log(saves);
    // })
    
    this.auth.checkLogIn.subscribe(authStatus=> {
      this.loggedIn = authStatus;
    })
;   this.checkLocals();
  
    
    // this.loggedIn = this.auth.loggedIn();
 
  }
  checkLocals(){
    this.savedStorage = Object.keys(localStorage);
    if (this.savedStorage.length != 0){
      this.savedStorage.forEach((el:any) => {
        if (el != null){
          let file: any = this.local.getHero(el)
          this.savedHeroes.push(JSON.parse(file));
          this.locals = true;
        }else{
          this.locals=false;
        }
      })
      // console.log("what is saved",this.savedHeroes);     
    }
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
    this.auth.checkToken();
    console.log("logout", this.loggedIn);
  
  }
  public uploadFileName: string = '';
  public uploadFileContent:string = '';
  public saveFileName = "test";
  public saveFileContent = '{ "name": "test"}';
  public saveFileExtension = 'json';
  public names:any;
  
  public async onFileSelected(event:any) {
    this.invalidation = false
    const file:File = event.target.files[0];
    this.uploadFileName = file.name;
    this.uploadFileContent = await file.text(); 
    let a;
  
    try {
      a = await JSON.parse(this.uploadFileContent);
      this.invalidation = await this.upload.authCheck(a)
      if (this.invalidation == true){
        return;
      }
      this.upload.setSavedHeroes(a);
      this.names = a
      this.saveFileContent = JSON.stringify(a);
      this.toggleLogin();
      this.router.navigate(['update-hero'])
      
    } catch (err) {
      this.invalidation=true;
    }
    //get object from json file
    //let obj = JSON.parse(this.uploadFileContent);
  }
  dlLocals(){
     // "skillOffset": 7,
     this.savedHeroes.forEach((el: any) => {
      let ran = Math.floor(Math.random() * 10)+1;
      el.skillOffset = ran;
    });
    let currentName = "SWSEHeroSaves"
    let time = new Date();
    let timeStamp= `${time.getFullYear()}${time.getMonth()+1}${time.getDate()}_${time.getHours()}${time.getMinutes()}`;
    let fileName = currentName + timeStamp + '.' + this.saveFileExtension;
    let fileContent = JSON.stringify(this.savedHeroes);
    const file = new Blob([fileContent], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(file);
    link.download = fileName;
    link.click();
    link.remove();
    
  this.savedHeroes.forEach((el: any) => {
   this.local.removeHero(el.name+el.id); 
    });
    this.checkLocals();

  }

  // public onSaveFile(): void {
  //   let time = new Date();
  //   let timeStamp= `${time.getFullYear()}${time.getMonth()+1}${time.getDate()}_${time.getHours()}${time.getMinutes()}`;
  //   let fileName = this.saveFileName + timeStamp + '.' + this.saveFileExtension;
  //   let fileContent = this.saveFileContent;
  //   // let fileContent = JSON.stringify( {name: "test name"} );
  
  //   const file = new Blob([fileContent], { type: "text/plain" });
  
  //   const link = document.createElement("a");
  //   link.href = URL.createObjectURL(file);
  //   link.download = fileName;
  //   link.click();
  //   link.remove(); 
  // }

}
