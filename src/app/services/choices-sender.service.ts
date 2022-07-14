import { EventEmitter, Injectable } from '@angular/core';
import { Subscription } from 'rxjs/internal/Subscription';

@Injectable({
  providedIn: 'root'
})
export class ChoicesSenderService {
// this servies as a medium to connect all the components
invokeAbilitiesFunction = new EventEmitter ();
  subsVar: Subscription = new Subscription;

onSelection() {
  this.invokeAbilitiesFunction.emit();
}

  public speciesSelected: any
  public speciesAbilityModifiers: any
  public abilities: any;
  public selectedClass: string = "Jedi";
  public validate: any;
  public bab: any;
  public skills: any;

  
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
    if (compute <= 25 && compute >= 0){
      this.validate = true;
    }else{
      this.validate=false;
      console.log("can't do")
    }
    break;
    case "skills":

    break;
  default:
    break;
} 
 

}





}
