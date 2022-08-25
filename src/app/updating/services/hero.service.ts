import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HeroService {

  constructor() { }

invokeConditions = new EventEmitter ();
invokeSkills = new EventEmitter ();
invokeAttacks = new EventEmitter ();
invokeCarry = new EventEmitter();
invokeCarryCalcs = new EventEmitter();
enforceConditions(){
  this.invokeConditions.emit();
}
recalcSkills(){
  this.invokeSkills.emit();
}
reCalcAttacks(){
  this.invokeAttacks.emit();
}
getCarry(){
  this.invokeCarry.emit();
}
updateCarry(num: number){
this.carryMod += num;
  this.invokeCarryCalcs.emit();
}
private carryMod: number = 0;
private abilities:any;
private skills: any;
public abModOptions: Array<string> = ["Strength","Dexterity","Constitution","Intelligence","Wisdom","Charisma",];
private stealthSizeMod: number = 0;
private abilityModifier: any;
private damageThreshold: number = 0;
private speciesTraits: any;
private  reflexClassBonus: number = 0;
private fortClassBonus: number = 0;
private willClassBonus:number = 0;
improvedReflex: number = 0;
improvedFort: number = 0;
improvedWill: number = 0;
improvedDT: number = 0
hpToughness: number = 0;
private heroLevel: number = 0;
private heroCondition: number = 0

//gettters and setters
setHeroLevel(level : number){
  this.heroLevel = level;
}
getHeroLevel(){
  return this.heroLevel;
}
setCondition(level: number){
  this.heroCondition = level;
}
getCondition(){
  return this.heroCondition;
}
setAbilitites(abObj: object){
  this.abilities = {
    "Strength": 0,"Dexterity" :0,"Constitution": 0,"Intelligence": 0,"Wisdom": 0,"Charisma": 0,
  };
  this.abilityModifier = {
    "Strength": 0,"Dexterity" :0,"Constitution": 0,"Intelligence": 0,"Wisdom": 0,"Charisma": 0,
  };
  // console.log("hero service abs", abObj);
  Object.assign(this.abilities, abObj);
  Object.assign(this.abilityModifier, abObj);
  this.calcModifier();
}
getAbilities(){
  return this.abilities;
}
getAbilityModifier(){
  return this.abilityModifier;
}
setSkills(skillArr: Array <any>){
  this.skills = skillArr;
}
getCarryMod(){
  return this.carryMod;
}
getSkills(){
  return this.skills;
}

getModOptions(){
  return this.abModOptions;
}
setSizeMods(size: string){
  if (size == "Small"){
    this.stealthSizeMod = 5;
  }else if (size == "Large"){
    this.stealthSizeMod = -5;
  }else{
    this.stealthSizeMod = 0;
  }
}
getstealthSizeMod(){
  return this.stealthSizeMod;
}

calcModifier(){
  let keys = Object.keys(this.abilities);
  for (let i=0; i< keys.length; i++){
//  console.log(keys[i]);
 let tempScore =0;
//  console.log("starting temp", tempScore)
 if (this.abilities[keys[i]]-10< 0){
   if(this.abilities[keys[i]] == 9){
     tempScore = -1;
   }else {
    //  console.log("temp score",tempScore);
    tempScore = Math.ceil((this.abilities[keys[i]]-10)/2);
   }
 }else{
  //  console.log("temp score",tempScore);
   tempScore = Math.floor((this.abilities[keys[i]]-10)/2);
 }
     this.abilityModifier[keys[i]] = tempScore;
    //  console.log("the abilities: ", keys[i], tempScore)    
  }
}
setDamageThreshold(dt: number){
  this.damageThreshold = dt;
}
getDamageThreshold(){
  return this.damageThreshold;
}
setSpeciesTraits(traits: any){
  this.speciesTraits = traits;
}
getSpeciesTraits(){
  return this.speciesTraits;
}
setClassBonuses(classsObj: object){
  let keys = Object.keys(classsObj);
  let tempReflex = 0
  let tempFort = 0;
  let tempWill = 0;
  for (let i=0; i<keys.length;i++){
    let obj = Object.assign(this.calcClassBonuses(keys[i]))
    tempReflex = obj.reflex;
    tempFort = obj.fort;
    tempWill = obj.will;
    (tempReflex > this.reflexClassBonus)? this.reflexClassBonus = tempReflex: tempReflex = 0;
    (tempFort > this.fortClassBonus)? this.fortClassBonus = tempFort: tempFort = 0;
    (tempWill > this.willClassBonus)? this.willClassBonus = tempWill: tempWill = 0;
  }



}
calcClassBonuses(chosenClass: string){
  let obj = {}
  switch (chosenClass) {
    case "Jedi":
      obj = {"reflex" : 1, "fort" : 1, "will" : 1};
    break;
    case "Noble":
      obj = {"reflex" : 1, "fort" : 0, "will" : 2};
    break;
    case "Scoundrel":
      obj = {"reflex" : 2, "fort" : 0, "will" : 1};
    break;
    case "Scout":
      obj = {"reflex" : 2, "fort" : 1, "will" : 0};
    break;
    case "Soldier":
      obj = {"reflex" : 1, "fort" : 2, "will" : 0};
    break;
  }
  return obj;
}
getReflexClassBonus(){
  return this.reflexClassBonus;
}
getFortClassBonus(){
  return this.fortClassBonus;
}
getWillClassBonus(){
  return this.willClassBonus;
}
setFeatImprovements(feats: Array <string>){
  // console.log("the feats:", feats);
  for (let i=0; i<feats.length;i++){
    switch (feats[i]) {
      case "Improved Defenses":
        this.improvedReflex =+ 1;
        this.improvedFort =+ 1;
        this.improvedWill =+ 1;
        break;
        case "Improved Damage Threshold":
        this.improvedDT =+ 5;
          break;
        case "Martial Arts I":
        this.improvedReflex =+ 1;
        break;
        case "Toughness":
        this.hpToughness = 1;
        break;
     
    }
  }
}

getImprovedDT(){
  return this.improvedDT;
}


}
