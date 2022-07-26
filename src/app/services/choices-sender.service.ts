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

  public speciesSelected: any
  public speciesSelectedObject: any = {};
  public speciesAbilityModifiers: any
  public abilities: any;
  public selectedClass: string = "Jedi";
  public validate: any;
  public bab: number = 0;
  public skills: Array<string> = [];
  public maxPoints: number = 25;
  public featsArray: any = [];
  public classSkills: any;

  
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
   console.log('this is computed',compute)
    if (compute <= this.maxPoints && compute >= 0){
      this.validate = true;
    }else{
      this.validate=false;
      console.log("can't do")
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
setSpecies(selection: object){
  // if (this.speciesSelectedObject == undefined || this.speciesSelectedObject.id > 0){
  //   for (const key in this.speciesSelectedObject) {
  //     delete this.speciesSelectedObject[key];
  //   }
  // }
  this.speciesSelectedObject = selection;
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
  if (this.featsArray.length !=0){
    // if it isn't empty we use pop method to empty it out
      while(this.featsArray.length){
        this.featsArray.pop()
      }
    }
    for (let i =0; i< importArray.length; i++){
      this.featsArray.push(importArray[i])
    }
    console.log("loaded the feats", this.featsArray, importArray)
}
//returns the feats array
getFeatsArray(){
  return this.featsArray;
}

}
