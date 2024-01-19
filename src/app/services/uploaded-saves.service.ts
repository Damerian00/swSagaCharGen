import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UploadedSavesService {

  savedHeroes: any;
  currentSave :  any;

  constructor() { }

  getAllSavedHeroes(){
    return this.savedHeroes;
  }
  setSavedHeroes(saved : any){
    this.savedHeroes = saved;
  }
  getCurrentHero(){
    return this.currentSave;
  }
  setCurrentHero(index: any){
    this.currentSave= this.savedHeroes[index];
  }
  authCheck(file: any){
    let bool: any = []
    file.forEach((el: any) => {
      if (el.skillOffset){  
        bool.push(false);
      }else{
        bool.push(true);
      }  
  });
  if (bool.includes(true)){
    return true;
  }else{
    return false;
}
}


}
