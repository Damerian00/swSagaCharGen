import { Injectable, EventEmitter } from '@angular/core';
import { HeroService } from './hero.service';

@Injectable({
  providedIn: 'root'
})
export class LevelingService {
//  ---Variables
currentXp: number = 0;
nextXp: number = 0;
currentLevel: number = 0;
levelPts: number = 0;
heroFeats: any;
heroTalents: any;
heroClassObj: any;
BAB: number = 0;
trees: any;
  constructor(private hero : HeroService) { }

invokeGetXp = new EventEmitter();
invokeTreeCount= new EventEmitter();

displayXp(){
  this.invokeGetXp.emit();
}

//  ---Getters and settters
setCurrentXp(xp : number){
  // console.log(xp ," saved")
  this.currentXp = xp;
}
getCurrentXp(){
 return this.currentXp;

}
setLevelPts(pts: number){
  // console.log(" set pts", pts);
  this.levelPts = pts;
}
getLevelPts(){
  return this.levelPts;
}
setNextXp(xp: number){
  this.nextXp = xp;
}
getNextXp(){
  return this.nextXp;
}
setFeats(feats: any){
  this.heroFeats = feats;
  console.log("feats", this.heroFeats);
}
getHeroFeats(){
  return this.heroFeats;
}
setTalents(talents: any){
  this.heroTalents = talents;
  console.log("talents", this.heroTalents);
  this.invokeTreeCount.emit(this.heroTalents);

}
getHeroTalents(){
  return this.heroTalents;
}
setHeroClassObj(classObj : any){
  console.log("got the classes", classObj);
  this.heroClassObj = classObj;
}
getHeroClassObj(){
  return this.heroClassObj;
}
setBAB(bab : number){
  this.BAB = bab;
}
getBAB(){
  return this.BAB;
}

setNumberinTrees(talents: any){
  this.trees = talents;
  // console.log("checks: ",this.trees)
}
getNumberinTrees(){
  return this.trees;
}
}

/*
  let words = apiValue.split(' ')
        if (words[0] == "Weapon" && words[1] == "Proficiency"){
          let inParan = []
          for (let i = 2; i<words.length; i++){
    let len = words.length - 1
     if (i == 2){
          inParan.push(words[i].substring(1));
      } else if (i == len){
           inParan.push(words[i].slice(0,-1));
          }
    else{
      inParan.push(words[i]);
    }
  }
  console.log(inParan.join(' '))
        }
*/