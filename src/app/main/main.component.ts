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
abilities: any = {};
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
    this.calcModifier();
    
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

calcModifier(){
  let keys = Object.keys(this.abilities);
  for (let i=0; i< keys.length; i++){
 console.log(keys[i]);
 let tempScore =0;
//  console.log("starting temp", tempScore, )
 if (this.abilities[keys[i]]-10< 0){
   if(this.abilities[keys[i]] == 9){
     tempScore = -1;
   }else {
     // console.log("temp score",tempScore);
    tempScore = Math.ceil((this.abilities[keys[i]]-10)/2);
   }
 }else{
   // console.log("temp score",tempScore);
   tempScore = Math.floor((this.abilities[keys[i]]-10)/2);
 }
     this.abilityModifier[keys[i]] = tempScore;
     if (keys[i] == "Intelligence"){
      this.intModifier = tempScore;
     }
     console.log("the abilities: ", keys[i], tempScore)    
  }
}


}
