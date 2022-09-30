import { EventEmitter, Injectable } from '@angular/core';
import { Subscription } from 'rxjs/internal/Subscription';

@Injectable({
  providedIn: 'root'
})
export class ChoicesSenderService {
// this servies as a medium to connect sibling component events
invokeAbilitiesFunction = new EventEmitter ();
  subsVar: Subscription = new Subscription;
setStartingFeats = new EventEmitter();
intiializeTalents = new EventEmitter();
initializeAbilityPoints = new EventEmitter();

// middleware function to display starting feats
setStartFeats(){
  this.setStartingFeats.emit();
}

//middleware function to show talents
startTalentComponent(){
  this.intiializeTalents.emit();
}

// middleware function to show ability points and final ability values
onSelection() {
  this.invokeAbilitiesFunction.emit();
}
initAbPoints(pts: number){
  this.initializeAbilityPoints.emit(pts);
}

  public speciesSelected: any
  public speciesSelectedObject: any = {};
  public speciesAbilityModifiers: any
  public abilities: any;
  public selectedAbilities: any;
  public selectedClass: string = "Jedi";
  public validate: any;
  public bab: number = 0;
  public skills: Array<string> = [];
  public maxPoints: number = 25;
  public featsArray: any = [];
  public classSkills: any;
  private startingFeatsLength: number = 0;
  private allSkillsArray = ["Acrobatics",  "Climb", "Deception", "Endurance","Gather Information","Initiative","Jump", "Mechanics","Perception","Persuasion","Knowledge (Bureaucracy)","Knowledge (Galactic Lore)","Knowledge (Life Sciences)","Knowledge (Physical Sciences)","Knowledge (Social Sciences)","Knowledge (Tactics)","Knowledge (Technology)","Mechanics","Perception","Persuasion", "Pilot","Ride", "Stealth", "Survival","Swim", "Treat Injury", "Use Computer","Use the Force"]
  private trainedSkillsArray: any;
  private availableTalents: any;
  private abilityMods: any;
   constructor() { }
// function set up to handle validtion and responses based on parameter inputs
validator(value1 :any, value2: any, operand:string, type: string){
switch (type) {
  case "abilities":
    let compute;
    if (operand == 'add'){
     compute = value1 - value2;
   } else {
     compute = value1 + value2; 
   }
  //  console.log('this is computed',compute)
    if (compute <= this.maxPoints && compute >= 0){
      this.validate = true;
    }else{
      this.validate=false;
      // console.log("can't do")
    }
    break;
    case "skills":

    break;
    case "feats":
    
    break;
  default:
    break;
} 
 

}

/*
Getters and Setters
*/
setStartFeatsLength(num: number){
  // console.log(num, "the number of length")
    this.startingFeatsLength = num;
}
getStartFeatsLength(){
  return this.startingFeatsLength;
}
setSpecies(selection: object){
  console.log("show me selection:", selection);
  this.speciesSelectedObject = selection;
}
setSpeciesTraits(selection: any){
  this.speciesSelectedObject.traits = selection;
}
acquireSpeciesTraits(){
  return this.speciesSelectedObject.traits;
}
getSpecies(){
  return this.speciesSelected;
}
 // Acquires the Starting skills for the chosen class
 acquireSkillsArray(){
  return this.skills;
}

//getter for bab
acquireBab(){
 return this.bab;
}
// getter for intelligence
acquireInt(){
  return this.abilities.Intelligence;
}
// getter for constitution
acquireCon(){
  return this.abilities.Constitution;
}
// returns the selected class
getClass(){
  return this.selectedClass;
}
// sets the featsArray
setFeatsArray(importArray: Array<string>){
  // console.log('the import:', importArray)
  if (this.featsArray.length !=0){
    // if it isn't empty we use pop method to empty it out
      while(this.featsArray.length){
        this.featsArray.pop()
      }
    }
    for (let i =0; i< importArray.length; i++){
      if (importArray[i] != ""){this.featsArray.push(importArray[i])}
    }
    // console.log("loaded the feats", this.featsArray)
}
//returns the feats array
getFeatsArray(){
  return this.featsArray;
}

//gets skillsArray for all skills
getAllSkillsArray(){
  return this.allSkillsArray;
}
setTrainedSkills(arr : Array<any>){
  if (this.trainedSkillsArray != undefined){
    while(this.trainedSkillsArray.length){
      this.trainedSkillsArray.pop();
    }
  }
  this.trainedSkillsArray = arr;
}
getTrainedSkills(){
  return this.trainedSkillsArray;
}
setAbilityMods(abilities: any){
  this.abilityMods = abilities;
}
getAbilityMods(){
  return this.abilityMods;
}
/*

save for later use

calcScore (score: number){
  let tempScore = 0;
  console.log("starting temp", tempScore)
  if (score-10< 0){
    console.log("temp score",tempScore)
    return tempScore = Math.ceil((score-10)/2);
  }else{
    console.log("temp score",tempScore)
   return tempScore = Math.floor((score-10)/2);
  }
}



 */
setAvailableTalents(talents: any){
  this.availableTalents = talents;
  
}
getAvailableTalents(){
  return this.availableTalents;
}
}
