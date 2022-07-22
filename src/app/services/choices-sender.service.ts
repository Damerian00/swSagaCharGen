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
  public speciesAbilityModifiers: any
  public abilities: any;
  public selectedClass: string = "Jedi";
  public validate: any;
  public bab: number = 0;
  public skills: Array<string> = [];
  public maxPoints: number = 25;

  
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
getSpecies(){
  return this.speciesSelected;
}

 // Acquires the Starting Feats for the chosen class
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
getClass(){
  return this.selectedClass;
}

}
