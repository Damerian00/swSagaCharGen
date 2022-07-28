import { Component, OnInit } from '@angular/core';
import { ChoicesSenderService } from '../services/choices-sender.service';


@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
speciesModifiers: object = {}
importSpecies: string = "";
species: string = "";
abilities: object = {};
class: string = "";
abilityModifier: any = {};
showAbilities: boolean = false
intModifier: number = 0;
chosenSkills: Array <string> = [];
heroName: string = "Name Goes Here...";
chosenFeats: any = [];
healthPoints: number = 0;
reflexDefense:number = 10;
fortitudeDefense: number = 10;
willDefense:number = 10;
chosenSkillsLength: number = 0;
savedSkillValue: string = "";
// tells the html not to sort
unsorted = (a:any, b:any) => {
  return a;
}
  constructor(private choices: ChoicesSenderService) { }

  ngOnInit(): void {
  }
/* 
the below functions are used to display the choices that the user selects on to the character sheet
*/
  updateSpecies(chosenSpecies: string) {
    this.species = chosenSpecies;
  }
  updateAbilities(chosenAbilities: any){
    this.showAbilities = true;
    this.abilities = chosenAbilities;
    
  }

  updateClass(chosenClass: any){
    this.class = chosenClass;
    this.updateStats();
  }
  updateSkills(chosenSkills: any){
    this.chosenSkills = chosenSkills;
    this.chosenSkillsLength = chosenSkills.length;
    console.log("the length is at start: ", this.chosenSkillsLength)
  }
  updateFeats(chosenFeats: Array<string>){
    console.log("here are the choosen ones: ", chosenFeats)
    this.chosenFeats = chosenFeats;
  }

  async addRemoveSkill(skillTrained : any){
    console.log("recieved input", skillTrained, "length is:", this.chosenSkillsLength, this.chosenSkills) 
     // conditional that adds or replaces what was selected
     if (skillTrained != ""){
       while (this.chosenSkills.length > this.chosenSkillsLength){
         this.chosenSkills.pop();
       }
       console.log("added: ", skillTrained)
       this.chosenSkills.push(skillTrained);
       this.savedSkillValue = skillTrained;
       // this conditional removes any extra skills added if skill trained wasn't selected
      } else if (this.savedSkillValue == ""){
        while (this.chosenSkills.length > this.chosenSkillsLength){
          this.chosenSkills.pop();
        }
        // resets savedValue Skill to ""
      } else {
        this.savedSkillValue = "";
      } 
  }

  updateStats(){
    this.calcHP();
  }

  async calcHP(){
    const heroicClass = await this.choices.getClass();
    const conModifier = await this.abilityModifier.Constitution;
    let offset;
    if (heroicClass == "Jedi" || heroicClass == "Soldier"){
      offset = 30;
    }else if(heroicClass == "Scout"){
      offset = 24
    }else {
      offset = 18
    }
    this.healthPoints = offset + conModifier;

  }

calcReflexDefense(){
  
}


  getAbilityModifier(chosenAbilities: any){
    const str = chosenAbilities.Strength;
    this.calcModifier('Strength', str);
    const dex = chosenAbilities.Dexterity;
    this.calcModifier('Dexterity', dex);
    const con = chosenAbilities.Constitution;
    this.calcModifier('Constitution', con);
    const int = chosenAbilities.Intelligence;
    this.calcModifier('Intelligence', int);
    const wis = chosenAbilities.Wisdom;
    this.calcModifier('Wisdom', wis);
    const char = chosenAbilities.Charisma;
    this.calcModifier('Charisma', char);

  }

  /* 
  calculates the ability modifier score based on what the ability score is
   */
calcModifier(ability: string, score: number){
  let tempScore = 0;
  switch (score) {
    case 1:
      tempScore = -5;
    break;
    case 2:
    case 3:
      tempScore = -4;
    break;
    case 4:
    case 5:
      tempScore = -3
    break;
    case 6:
    case 7:
      tempScore = -2;
    break;
    case 8:
    case 9:
      tempScore = -1;
    break;
    case 10:
    case 11:
      tempScore = 0;
    break;
    case 12:
    case 13:
      tempScore = 1;
    break;
    case 14:
    case 15:
      tempScore = 2;
    break;
    case 16:
    case 17:
      tempScore = 3;
    break;
    case 18:
    case 19:
      tempScore = 4;
    break;
    case 20:
    case 21:
      tempScore = 5;
    break;
    case 22:
    case 23:
      tempScore = 6;
    break;
    default:
      break;
  }
  switch (ability) {
    case "Strength":
      this.abilityModifier.Strength = tempScore;
    break;
    case "Dexterity":
      this.abilityModifier.Dexterity = tempScore;
    break;
    case "Constitution":
      this.abilityModifier.Constitution = tempScore;
    break;
    case "Intelligence":
      this.abilityModifier.Intelligence = tempScore;
      this.intModifier = tempScore;
    break;
    case "Wisdom":
      this.abilityModifier.Wisdom = tempScore;
      break;
      case "Charisma":
        this.abilityModifier.Charisma = tempScore;
      break;

    default:
      break;
  }
}

}
