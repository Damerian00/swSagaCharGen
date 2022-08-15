import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ChoicesSenderService } from '../services/choices-sender.service';
import { faCheckSquare, faSquare, faSave, faClose } from '@fortawesome/free-solid-svg-icons';
import {jsPDF} from "jspdf";
import html2canvas from 'html2canvas'


interface heroObject {
  id: string,
  name: string,
  species: Object,
  abilities: Object,
  class: Array<string>,
  defenses: Object,
  skills: Array<any>,
  feats: Array<string>,
  talents: Array<string>,
  languages: Array<any>,
}

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})


export class MainComponent implements OnInit {

/*
 == Objects ==
 */
 speciesModifiers: object = {}
 species: any = {};
 abilities: any = {};
 abilityModifier: any = {};
 talentSelected: any = {};

 /*
 == Arrays ==
 */
chosenSkills: Array <string> = [];
chosenFeats: any = [];
abModOptions: Array<string> = ["Strength","Dexterity","Constitution","Intelligence"," Wisdom","Charisma",]
heroSkillsTotal: any = [
  {
    "skill_name" : "Acrobatics", "skill_value" : 0, "default" : "Dexterity", "trained_skill" : false, "skill_focus" : false
},
{
  "skill_name" : "Climb", "skill_value" : 0, "default" : "Strength", "trained_skill" : false, "skill_focus" : false
},
{
  "skill_name" : "Deception", "skill_value" : 0, "default" : "Dexterity", "trained_skill" : false, "skill_focus" : false
},
{
"skill_name" : "Endurance", "skill_value" : 0, "default" : "Constitution", "trained_skill" : false, "skill_focus" : false
},
{
  "skill_name" : "Gather Information", "skill_value" : 0, "default" : "Charisma", "trained_skill" : false, "skill_focus" : false
},
{
"skill_name" : "Initiative", "skill_value" : 0, "default" : "Dexterity", "trained_skill" : false, "skill_focus" : false
},
{
"skill_name" : "Jump", "skill_value" : 0, "default" : "Strength", "trained_skill" : false, "skill_focus" : false
},
{
  "skill_name" : "Mechanics", "skill_value" : 0, "default" : "Intelligence", "trained_skill" : false, "skill_focus" : false
},
{
"skill_name" : "Perception", "skill_value" : 0, "default" : "Wisdom", "trained_skill" : false, "skill_focus" : false
},
{
  "skill_name" : "Persuasion", "skill_value" : 0, "default" : "Charisma", "trained_skill" : false, "skill_focus" : false
},
  {
    "skill_name" : "Knowledge (Bureaucracy)", "skill_value" : 0, "default" : "Intelligence", "trained_skill" : false, "skill_focus" : false
},
{
  "skill_name" : "Knowledge (Galactic Lore)", "skill_value" : 0, "default" : "Intelligence", "trained_skill" : false, "skill_focus" : false
},
{
  "skill_name" : "Knowledge (Life Sciences)", "skill_value" : 0, "default" : "Intelligence", "trained_skill" : false, "skill_focus" : false
},
{
"skill_name" : "Knowledge (Physical Sciences)", "skill_value" : 0, "default" : "Intelligence", "trained_skill" : false, "skill_focus" : false
},
{
  "skill_name" : "Knowledge (Social Sciences)", "skill_value" : 0, "default" : "Intelligence", "trained_skill" : false, "skill_focus" : false
},
{
"skill_name" : "Knowledge (Tactics)", "skill_value" : 0, "default" : "Intelligence", "trained_skill" : false, "skill_focus" : false
},
{
"skill_name" : "Knowledge (Technology)", "skill_value" : 0, "default" : "Intelligence", "trained_skill" : false, "skill_focus" : false
},
{
"skill_name" : "Mechanics", "skill_value" : 0, "default" : "Intelligence", "trained_skill" : false, "skill_focus" : false
},
{
"skill_name" : "Perception", "skill_value" : 0, "default" : "Wisdom", "trained_skill" : false, "skill_focus" : false
},
{
"skill_name" : "Persuasion", "skill_value" : 0, "default" : "Charisma", "trained_skill" : false, "skill_focus" : false
},
{
  "skill_name" : "Pilot", "skill_value" : 0, "default" : "Dexterity", "trained_skill" : false, "skill_focus" : false
},
{
"skill_name" : "Ride", "skill_value" : 0, "default" : "Dexterity", "trained_skill" : false, "skill_focus" : false
},
{
  "skill_name" : "Stealth", "skill_value" : 0, "default" : "Dexterity", "trained_skill" : false, "skill_focus" : false
},
{
  "skill_name" : "Survival", "skill_value" : 0, "default" : "Wisdom", "trained_skill" : false, "skill_focus" : false
},
{
"skill_name" : "Swim", "skill_value" : 0, "default" : "Strength", "trained_skill" : false, "skill_focus" : false
},
{
"skill_name" : "Treat Injury", "skill_value" : 0, "default" : "Wisdom", "trained_skill" : false, "skill_focus" : false
},
{
"skill_name" : "Use Computer", "skill_value" : 0, "default" : "Intelligence", "trained_skill" : false, "skill_focus" : false
},
{
"skill_name" : "Use the Force", "skill_value" : 0, "default" : "Charisma", "trained_skill" : false, "skill_focus" : false
},
]
featSkills: Array<string> = ["", ""];
featFocus: Array<string> = ["", ""];
languages: Array<any> = [];
/*
== Numbers == 
*/
intModifier: number = 0;
healthPoints: number = 0;
reflexDefense:number = 10;
fortitudeDefense: number = 10;
willDefense:number = 10;
chosenSkillsLength: number = 0;
speciesReflexDefenseMod: number = 0;
speciesFortDefenseMod: number = 0;
carryLimit: number = NaN;
speciesWillDefenseMod: number = 0;
speed: number = 6;
sizeCarryModifier: number = 1;
reflexClassBonus: number = 0;
fortClassBonus: number = 0;
willClassBonus: number = 0;
heroLevel: number = 1;
grapple: number = NaN;
damageThreshold: number = 0;
speciesDmgThreshMod: number = 0;
dmgThreshMod: number = 0;
hpToughness: number = 0;
improvedReflex: number = 0;
improvedFort: number = 0;
improvedWill: number = 0;
improvedDT: number = 0
stealthSizeMod: number = 0
/*
  == Strings ==
*/
importSpecies: string = "";
class: string = "";
heroName: string = "Name Goes Here...";
savedSkillValue: any;
size: string = "";
talentSelectedName: string = "";
talentSelectedDesc: string = "";
disabler: string = "active"
toggleShow: string = "hiding";
/*
== Boolean ==
*/
showAbilities: boolean = false;
toggleClassesComponent: boolean = false;
showRest: boolean = false;
showModal: boolean = false;
//icons
faUncheck = faSquare;
faChecked= faCheckSquare;
faSave = faSave;
faClose = faClose;
// any
currentDtType: any = "Fortitude Defense";
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
    // console.log("the chosen Species",chosenSpecies)
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
    this.speed = chosenSpecies.traits.speed;
    (this.showRest) ? this.showRest = !this.showRest: false;
    (this.size == "Large")? this.speciesDmgThreshMod = 5: this.speciesDmgThreshMod = 0;
    if (this.size == "Small"){
      this.stealthSizeMod = 5;
    }else if (this.size == "Large"){
      this.stealthSizeMod = -5;
    }else{
      this.stealthSizeMod = 0;
    }
  }
  updateAbilities(chosenAbilities: any){
    this.showAbilities = true;
    this.abilities = chosenAbilities;
    this.calcModifier();
    if (this.toggleClassesComponent == false){
      this.toggleClassesComponent = true;
    }
    
  }
 
 async updateClass(chosenClass: string){
  this.class = chosenClass;
  this.calcClassBonuses(chosenClass);
  // if class isn't jedi and the array doesn't have Use the Force as a value for skill remove Use the force skill from the array 
  // let vals = await Object.values(this.heroSkillsTotal)
  if (chosenClass != "Jedi" && Object.values(this.heroSkillsTotal).length >= 28){
    this.heroSkillsTotal.pop();
    // console.log("removed use the force")
  // if jedi is chosen as a Class and Use the Force isn't in the array then add itat the end
  }else if (chosenClass == "Jedi" && Object.values(this.heroSkillsTotal).length < 28){
    this.heroSkillsTotal.push({
      "skill_name" : "Use the Force", "skill_value" : 0, "default" : "Charisma", "trained_skill" : false, "skill_focus" : false
    },)
    // console.log( "added use force")

  // 
  }
  // console.log("this is it", this.heroSkillsTotal, vals.lastIndexOf("Use the Force"))
}

updateSkills(chosenSkills: any){
  this.chosenSkills =  chosenSkills;
  this.chosenSkillsLength = chosenSkills.length;
  // updates skills object.trained  boolean
  let vals = Object.values(this.heroSkillsTotal)
  for (let i =0; i<vals.length; i++){
    (this.chosenSkills.includes(this.heroSkillsTotal[i].skill_name)) ?
      this.heroSkillsTotal[i].trained_skill = true : this.heroSkillsTotal[i].trained_skill = false;
  }
//  console.log("the length is at start: ", this.chosenSkills )
}
resetAdjustments(){
  this.improvedFort = 0;
  this.improvedReflex = 0;
  this.improvedWill = 0;
  this.hpToughness =-0;
  this.improvedDT = 0;
}
async updateFeats(feats: Array<string>){
  await this.resetFocus();
  await this.removeAddedSkills();
  await this.resetAdjustments();
  this.dmgThreshMod = 0;
  // console.log("recieved feats:", feats);
  let specArr = ["Skill Focus","Skill Training"] 
  for (let i=0; i<feats.length; i++){
    const splitter = feats[i].split(' (');
     
   if (specArr.includes(splitter[0])){
      // console.log("spec is here",feats[i]);
      (splitter[0] == 'Skill Focus')? this.updateFocusFeats(feats[i]) : this.updateSkillTrained(feats[i]);
    }
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
        default:
          break;
      }
    
  }
  if (feats.includes("")){
    let index = feats.findIndex((el:any)=> el == "");
    feats.splice(index,1);
  }
  this.chosenFeats = feats;
  this.updateStats();
  // console.log("feats being added:", feats)
}

async updateSkillTrained(skill: any){
let onlySkill = skill.split(' ').slice(2).join(' ').slice(1,-1);
await this.removeAddedSkills();
  for (let i = 0; i<this.heroSkillsTotal.length; i++){
    if (this.heroSkillsTotal[i].skill_name == onlySkill && this.heroSkillsTotal[i].trained_skill == false){
      this.heroSkillsTotal[i].trained_skill = true;
      if (this.featSkills.includes(onlySkill) == false){
        let index = this.featSkills.findIndex((el: any) => el == "");
        this.featSkills.splice(index,1,onlySkill);
      }
    //  console.log("trained and added: ", skill, this.heroSkillsTotal[i].trained_skill, this.featSkills)
      break;
    }  
  }  
}
async updateFocusFeats(chosenFeat: any){
  let feat = chosenFeat.split(' ').slice(2).join(' ').slice(1,-1);
  await this.resetFocus();
  for (let i = 0; i<this.heroSkillsTotal.length; i++){
    if (this.heroSkillsTotal[i].skill_name == feat && this.heroSkillsTotal[i].skill_focus == false){
      this.heroSkillsTotal[i].skill_focus = true;
      if (this.featFocus.includes(feat) == false){
        let index = this.featFocus.findIndex((el: any) => el == "");
        this.featFocus.splice(index,1,feat);
      }
    //  console.log("focus and added: ", chosenFeat, this.heroSkillsTotal[i].skill_focus, this.featFocus)
      break;
    }
  }
  
}
removeAddedSkills(){
  if (this.featSkills[0] == ""){
    return;
  }
   for (let i = 0; i<this.heroSkillsTotal.length; i++){
     if (this.featSkills.includes(this.heroSkillsTotal[i].skill_name)){
       this.heroSkillsTotal[i].trained_skill = false;
       let index = this.featSkills.findIndex((el:any)=> el == this.heroSkillsTotal[i].skill_name);
       this.featSkills.splice(index,1,"");
     }
    }
    // console.log("removes:", this.heroSkillsTotal, this.featSkills )
  }

resetFocus(){ 
  for (let i = 0; i<this.heroSkillsTotal.length; i++){
    if (this.heroSkillsTotal[i].skill_focus == true){
      this.heroSkillsTotal[i].skill_focus = false;
      let index = this.featFocus.findIndex((el:any)=> el == this.heroSkillsTotal[i].skill_name);
      this.featFocus.splice(index,1,"");
    }
  }
  // console.log("removes:", this.heroSkillsTotal, this.featFocus )
  this.removeAddedSkills();
}
// if one of the talent exceptions was chosen use this
updateTalentSpecify(specificArr: any){
  this.talentSelected =specificArr[1];
  this.talentSelectedName = specificArr[0]
  this.talentSelectedDesc = specificArr[2];
  this.showRest = true;
  this.updateStats();
  // console.log("it was specific", specificArr)
}
// if a non exception talent was chosen use this
updateTalents(chosenTalent: any){
this.talentSelected = chosenTalent;
this.talentSelectedName = chosenTalent.name
this.talentSelectedDesc = chosenTalent.description
this.showRest = true;
this.updateStats();
}

/* end of updates from components functions*/

// calls all the functions to update the stats on the sheet
async updateStats(){
  this.calcHP(this.class, this.abilityModifier.Constitution);
  this.calculateCarryLimit(this.sizeCarryModifier, this.abilities.Strength);
  this.calculateDefenses("Reflex", "Dexterity");
  this.calculateDefenses("Fort", "Constitution");
  this.calculateDefenses("Will", "Wisdom");
  this.calcGrapple("Strength");
  this.calcDT(this.currentDtType);
  this.heroSkillsTotal.forEach((el: any)=> {
    this.calcSkills(el.skill_name, el.default, 0);
  })
  
  // console.log("hero skills", this.heroSkillsTotal)
}

// calculates the defense bonuses to be applied to a hero
calculateDefenses(keyword: string, mod: string){
  if (keyword == "Reflex"){
       this.reflexDefense = 10 + this.heroLevel + this.abilityModifier[mod] + this.reflexClassBonus + this.speciesReflexDefenseMod + this.improvedReflex;
    if (mod == "Select"){
      this.reflexDefense = 0
    }
  }else if (keyword == "Fort"){
       this.fortitudeDefense = 10 + this.heroLevel + this.abilityModifier[mod] + this.fortClassBonus + this.speciesFortDefenseMod + this.improvedFort;
    if (mod == "Select"){
      this.fortitudeDefense = 0
    }
  }else{
       this.willDefense = 10 + this.heroLevel + this.abilityModifier[mod] + this.willClassBonus + this.speciesWillDefenseMod + this.improvedWill;
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
  this.healthPoints = offset + mod + this.hpToughness;

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
 // scalculates damage threshold
 calcDT(defenseType: any){
  if (defenseType == "Select Defense"){
    return;
  }
  this.currentDtType = defenseType;
  let calcNum = 0
  switch (defenseType) {
    case "Reflex Defense":
      calcNum = this.reflexDefense
    break;
    case "Fortitude Defense":
      calcNum = this.fortitudeDefense
    break;
    case "Will Defense":
      calcNum = this.willDefense
    break;
    default:
      break;
    }
    this.damageThreshold = this.speciesDmgThreshMod + this.dmgThreshMod + calcNum + this.improvedDT;
  }
// used to add or remove a skill that is added from a feat
  async addRemoveSkill(skillTrained : any){
   
    // console.log("recieved input", skillTrained, "length is:", this.chosenSkillsLength, this.chosenSkills) 
     // conditional that adds or replaces what was selected
     let species = await this.choices.getSpecies();
    //  if (species === "Human" || species == "Nyriaanan" || species == "Anarrian"){

    //  }
     if (skillTrained != ""){
      if (this.chosenSkills.includes(this.savedSkillValue)){
        
      }
      const index = this.chosenSkills.findIndex((el: any)=> el.skill_name == skillTrained ) 
      while (this.chosenSkills.length > this.chosenSkillsLength){
         this.chosenSkills.pop();
       }
       this.chosenSkills.splice(index,1);
      //  console.log("added: ", skillTrained)
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
//  console.log(keys[i]);
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
    //  console.log("the abilities: ", keys[i], tempScore)    
  }
}
collectCalcData(index: any, selection: any){
  // console.log("this is the index", index, this.heroSkillsTotal[index].skill_name, selection.target.value)
  this.calcSkills(this.heroSkillsTotal[index].skill_name,selection.target.value, 0);
}

calcSkills(skill: string, mod: string, misc: number){
  for (let i=0; i<this.heroSkillsTotal.length;i++){
    // console.log("the skill:", this.heroSkillsTotal[i].skill_name, skill)
    if (this.heroSkillsTotal[i].skill_name == skill){
    let t =0;
    let f= 0;
    if (this.heroSkillsTotal[i].trained_skill == true){
      t = 5
    }
    if (this.heroSkillsTotal[i].skill_focus == true){
      f = 5
    }
    this.heroSkillsTotal[i].default = mod;
    this.heroSkillsTotal[i].skill_value = (Math.floor(this.heroLevel/2)) + this.abilityModifier[mod] + t + f + misc;
    if (skill == "Stealth"){
      this.heroSkillsTotal[i].skill_value =+ this.stealthSizeMod 
    }
  // console.log("the value computed:",  this.abilityModifier[mod], t,f, misc)
    }

  }
}

nameHeroToggle(){ 
  (this.disabler == "disabled")? this.disabler = "active": this.disabler = "disabled";
  this.showModal = !this.showModal;
}
nameHero(name: any){
  // console.log("hero name: ",name);
  if(name == ""){
    this.heroName = "Name Goes Here...";
  }else{
    this.heroName = name;
  }
  this.nameHeroToggle();
}
randomIzer(num: number){
  let id = []
   let ranArr = ["a", "b", 5, "c", "d", "e", "f", "g", "h",4, "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", 2, "s", "t",2,"u", "v", 1, 3, "w", "x", "y", "z",6, "A", "B", "C", "D", "E",6, 7, 8, "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R",1, "S", "T", "U", "V", "W", "X", "Y", 0,  5, 9]
   while (id.length < num){
     let ran =  Math.floor(Math.random() * ranArr.length);
     id.push(ranArr[ran]);
   }
 
 return id.join('');
 }
@ViewChild('contentSaved', {static: false}) el!: ElementRef;

saveHero(){
  if (this.heroName == "Name Goes Here..." || Object.keys(this.talentSelected).length == 0){
    return;
  }
  
  let ranId = this.randomIzer(8);
  // console.log("the id is:",ranId)
  let savedHero: heroObject = {
    id: ranId,
    name: this.heroName,
    species: this.species,
    abilities: this.abilities,
    class: [this.class],
    defenses: {
      "reflex" : this.reflexDefense,
      "fort": this.fortitudeDefense,
      "will": this.willDefense,
    },
    skills: [this.heroSkillsTotal],
    feats: [this.chosenFeats],
    talents: [this.talentSelected],
    languages: [this.languages]
  }
  
    let tempName = savedHero.name.split(' ').join('_')
 
  let fileName = `${tempName}${savedHero.id}.pdf`;

  let DATA: any = document.getElementById('contentSaved');
  html2canvas(DATA,{ scale: 3 }).then((canvas) => {
    let PDF = new jsPDF('p', 'mm', 'a4');
    let fileWidth = PDF.internal.pageSize.getWidth();
    let fileHeight = PDF.internal.pageSize.getHeight();
    const FILEURI = canvas.toDataURL('image/png');
    let position = 0;
    PDF.addImage(FILEURI, 'PNG', 0, position, fileWidth, fileHeight);
    PDF.save(fileName);
  });
  // console.log("savedHero", savedHero, fileName);
}

showCharSheet(){
  this.toggleShow == "hiding" ? this.toggleShow = "onTop" : this.toggleShow = "hiding";
}

}


