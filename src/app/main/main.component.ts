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
species: any = {};
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
toggleClassesComponent: boolean = false;
talentSelected: any = {};
carryLimit: number = NaN;
speciesReflexDefenseMod: number = 0;
speciesFortDefenseMod: number = 0;
speciesWillDefenseMod: number = 0;
languages: Array<string> = [];
size: string = "";
speed: number = 6;
sizeCarryModifier: number = 1;
reflexClassBonus: number = 0;
fortClassBonus: number = 0;
willClassBonus: number = 0;
heroLevel: number = 1;
grapple: number = NaN;
hideSelectors: string = "show";
abModOptions: Array<string> = ["Strength","Dexterity","Constitution","Intelligence"," Wisdom","Charisma",]

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
popArray(arr : Array<any>){
  while (arr.length){
    arr.pop();
  }
}
// the update Functions dynamically add the data from the corrosponding component to be displayed
  updateSpecies(chosenSpecies: any) {
    console.log("the chosen Species",chosenSpecies)
    this.species = chosenSpecies;
    this.sizeCarryModifier = chosenSpecies.traits["Carry Limit"];
    this.speciesReflexDefenseMod = chosenSpecies.traits.Defenses["Reflex Defense"];
    this.speciesFortDefenseMod = chosenSpecies.traits.Defenses["Fortitude Defense"];
    this.speciesWillDefenseMod = chosenSpecies.traits.Defenses["Will Defense"];
    if (this.languages.length != 0){
     this.popArray(this.languages)
    }
    this.languages = [...chosenSpecies.traits.languages];
    this.size = chosenSpecies.traits.size;
    this.speed = chosenSpecies.traits.speed

  }
  updateAbilities(chosenAbilities: any){
    this.showAbilities = true;
    this.abilities = chosenAbilities;
    this.calcModifier();
    if (this.toggleClassesComponent == false){
      this.toggleClassesComponent = true;
    }
    
  }
 
 updateClass(chosenClass: string){
  this.class = chosenClass;
  this.calcClassBonuses(chosenClass);
  
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

updateTalents(chosenTalent: any){
this.hideSelectors = "hide";
this.talentSelected = chosenTalent;
this.updateStats();

}

/* end of updates from components functions*/

// calls all the functions to update the stats on the sheet
updateStats(){
  this.calcHP(this.class, this.abilityModifier.Constitution);
  this.calculateCarryLimit(this.sizeCarryModifier, this.abilities.Strength);
  this.calculateDefenses("Reflex", "Dexterity");
  this.calculateDefenses("Fort", "Constitution");
  this.calculateDefenses("Will", "Wisdom");
  this.calcGrapple("Strength");

}

// calculates the defense bonuses to be applied to a hero
calculateDefenses(keyword: string, mod: string){
  if (keyword == "Reflex"){
    this.reflexDefense = 10 + this.heroLevel + this.abilityModifier[mod] + this.reflexClassBonus + this.speciesReflexDefenseMod;
    if (mod == "Select"){
      this.reflexDefense = 0
    }
  }else if (keyword == "Fort"){
    this.fortitudeDefense = 10 + this.heroLevel + this.abilityModifier[mod] + this.fortClassBonus + this.speciesFortDefenseMod;
    if (mod == "Select"){
      this.fortitudeDefense = 0
    }
  }else{
    this.willDefense = 10 + this.heroLevel + this.abilityModifier[mod] + this.willClassBonus + this.speciesWillDefenseMod;
    if (mod == "Select"){
      this.willDefense = 0
    }
  }

}
calcGrapple(mod: string){
  const bab = this.choices.acquireBab();
  if (this.size == "Small"){
    this.grapple = (bab + this.abilityModifier[mod]) - 5
  }else if (this.size == "Large"){
    this.grapple = (bab + this.abilityModifier[mod]) + 5
  }else{
    this.grapple = (bab + this.abilityModifier[mod])
  }
}
// sets the carrying capacity of the hero
calculateCarryLimit(cl : number, strScore : number){
  console.log("this is carry stuff:" ,strScore, cl)
  this.carryLimit = Math.pow(strScore, 2) * 0.5 * cl;
}
// calculates the hero's hp total
async calcHP(heroicClass: string, mod: number){
  let offset;
  if (heroicClass == "Jedi" || heroicClass == "Soldier"){
    offset = 30;
  }else if(heroicClass == "Scout"){
    offset = 24
  }else {
    offset = 18
  }
  this.healthPoints = offset + mod;

}
// sets the class bonuses based on class selected
  calcClassBonuses(chosenClass: string){
      switch (chosenClass) {
        case "Jedi":
          this.reflexClassBonus = 1;
          this.fortClassBonus = 1;
          this.willClassBonus = 1;   
        break;
        case "Noble":
          this.reflexClassBonus = 1;
          this.fortClassBonus = 0;
          this.willClassBonus = 2;
        break;
        case "Scoundrel":
          this.reflexClassBonus = 2;
          this.fortClassBonus = 0;
          this.willClassBonus = 1;
        break;
        case "Scout":
          this.reflexClassBonus = 2;
          this.fortClassBonus = 1;
          this.willClassBonus = 0;
        break;
        case "Soldier":
          this.reflexClassBonus = 1;
          this.fortClassBonus = 2;
          this.willClassBonus = 0;
        break;
      }
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
// calculates the ability modifier for each ability score
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
toggleSelectors(){
  this.hideSelectors = "show";
}

}
