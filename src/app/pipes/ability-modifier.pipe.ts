import { Pipe, PipeTransform } from '@angular/core';
import { ChoicesSenderService } from '../services/choices-sender.service';


@Pipe({
  name: 'abMod'
})
export class AbilityModifierPipe implements PipeTransform {


  constructor(private choices: ChoicesSenderService) { }
modifiers: any = {};
results: any = {
  Charisma: 10,
  Constitution: 10,
  Dexterity: 10,
  Intelligence: 10,
  Strength: 10,
  Wisdom: 10
}

  transform(value: number, key: string ): unknown {
   this.modifiers = this.choices.speciesAbilityModifiers;

   switch (key){
    case "Charisma":
      value += this.modifiers.Charisma;
    break;
    case "Constitution":
      value += this.modifiers.Constitution;
    break;
    case "Dexterity":
      value += this.modifiers.Dexterity;

    break;
    case "Intelligence":
      value += this.modifiers.Intelligence;

    break;
    case "Strength":
      value += this.modifiers.Strength;

    break;
    case "Wisdom":
      value += this.modifiers.Wisdom;

    break;
    }
  //  let chaA = this.modifiers.Charisma;
  //  if (chaA != 0){
  //    this.results.Charisma += chaA;
  //     }
  //  let conA =  this.modifiers.Constitution;
  //  if (conA != 0){
  //   this.results.Constitution += conA;
  // }
   
  //  let dexA =  this.modifiers.Dexterity;
  //  if (dexA != 0){
  //   this.results.Dexterity += dexA;
  // }
   
  //  let intA =  this.modifiers.Intelligence;
  //  if (intA != 0){
  //   this.results.Intelligence += intA;
  // }
  
  //  let strA =  this.modifiers.Strength;
  //  if (strA != 0){
  //   this.results.Strength += strA;
  // }
 
  //  let wisA =  this.modifiers.Wisdom;
  //  if (wisA != 0){
  //   this.results.Wisdom += wisA;
  // }
    
    console.log('this is modifiers', this.choices, 'this is value',value)
    
    return null;
  }

}
