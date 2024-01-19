import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalstorageService {

  constructor() { }

  public saveHerotoStorage(key: string, value: object){
    localStorage.setItem(key, JSON.stringify(value));
  }

  public getHero(key: string){
    return localStorage.getItem(key);
  }

  public removeHero(key: string){
    console.log("removed: ", key)
    localStorage.removeItem(key)
  }


}
