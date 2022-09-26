import { Injectable, EventEmitter } from '@angular/core';
import { HeroService } from './hero.service';

@Injectable({
  providedIn: 'root'
})
export class LevelingService {
//  ---Variables
private currentXp: number = 0;
private nextXp: number = 0;
private currentLevel: number = 0;
private levelPts: number = 0;
private heroFeats: any;
private heroTalents: any;
private heroClassObj: any;
private BAB: number = 0;
private trees: any;

  constructor(private hero : HeroService) { }

invokeGetXp = new EventEmitter();
invokeTreeCount= new EventEmitter();
invokeBABUpdate = new EventEmitter();


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
  // console.log("feats", this.heroFeats);
}
getHeroFeats(){
  return this.heroFeats;
}
setTalents(talents: any){
  this.heroTalents = talents;
  // console.log("talents", this.heroTalents);
  this.invokeTreeCount.emit(this.heroTalents);

}
getHeroTalents(){
  return this.heroTalents;
}
setHeroClassObj(classObj : any){
  // console.log("got the classes", classObj);
  this.heroClassObj = classObj;
  this.calcBAB();
}
addHeroClass(heroClass : string){
  if (this.heroClassObj[heroClass] == undefined){
    this.heroClassObj[heroClass] = 1
  }else{
    this.heroClassObj[heroClass] += 1;
  }
  this.calcBAB();
}
getHeroClassObj(){
  return this.heroClassObj;
}

calcBAB(){
  this.BAB = 0;
  const babArr = {
    "normal" : [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],
    "special" : [0,0,1,2,3,3,4,5,6,6,7,8,9,9,10,11,12,12,13,14,15],
  }
  let norms = ["Jedi","Soldier"]
  let keys = Object.keys(this.heroClassObj);
  let vals:any = Object.values(this.heroClassObj);
  for (let i=0; i < keys.length; i++){
    if (norms.includes(keys[i])){
      this.BAB += babArr.normal[vals[i]];
    }else{
      this.BAB += babArr.special[vals[i]]
    }
  }
  // console.log('the BAB is:', this.BAB, this.heroClassObj)
  this.invokeBABUpdate.emit(this.BAB);
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
         if (words.length == 3){
         inParan.push(words[i].substring(1).slice(0,-1));
       }else{
       	inParan.push(words[i].substring(1));
       } 
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