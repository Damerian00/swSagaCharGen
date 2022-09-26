import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { LocalstorageService } from 'src/app/localstorage.service';
import { HeroService } from '../../services/hero.service';
import { LevelingService } from '../../services/leveling.service';

@Component({
  selector: 'app-charsheet',
  templateUrl: './charsheet.component.html',
  styleUrls: ['./charsheet.component.scss']
})
export class CharsheetComponent implements OnInit {

  unsorted = (a:any, b:any) => {
    return a;
  }

  constructor(private local: LocalstorageService, private heroservice : HeroService, private level : LevelingService) { }
//  ----Variables
//  Input/Output
//  Arrays
savedHero: any;
startingFeats: any;
savedFeats: Array<any> = [];
skills: any;
heroLanguages: any;
startingTalents: any;
savedStorage: any;
savedHeroes:any = [];
xpChart: Array <any> = [0,1,3,6,10,15,21,28,36,45,55,66,78,91,105,120,136,153,171,190]
heroAbilities: Object = {};
savedLanguages: Array <string> = [];
currentArmor: any;
heroInventory: Array<string> = [];
heroAttacks: Array<string> = [];
//  Objects
heroClass: Object = {};
heroDefenses: any;
heroSpeciesObj: any;
abilityMod: any;
//  Booleans
heroPull: boolean = false;
savesPulled: boolean = false;
xpModalToggle: boolean = false;
levelUp : boolean = false;
showSpecQual: boolean = false;
forceUser: boolean = false;
//  Numbers & Strings
savedName: string = "";
tempId: string = "";
currentXp: number = 0;
nextXp: number = 0;
heroLevel: number = 0;
halfLevel: number = 0;
size: string = "";
maxHp: number = 0;
currentHp: number = 0;
damageThreshold: number = 0;
currentDtType: string = "Fortitude Defense";
reflexDefense: number = 10;
fortitudeDefense:number = 10;
willDefense: number = 10;
speciesDmgThreshMod: number = 0;
improvedDT: number = 0;
damageThreshMod: number = 0;
dmgThreshMisc: number = 0;
heroCondition: number = 0;
forceDice: string = "1d6";
hpType: string = "set"
forcePoints: number = 5
grapple: number = 0;
BAB: number = 1;
grappleModSelected: string = "Strength";
grappleMisc: number = 0;
langsAllowed: number = 0;
credits: number = 0;
forcePowers: Array<any> = [];
attack: number = 0;
// holds the values for notes user adds
specialQuals: string = '';
heroNotes: string = '';
attackOptsNotes: string = '';
specAttackNotes: string = '';
starshipNotes: string = '';
forceTechniques: string = '';
forceSecrets: string = "";
forceRegimens: string = "";
// array to track lvlup changes
//  Misc

//  ---End Variables---
  ngOnInit(): void {
    
    this.savedStorage = Object.keys(localStorage);
    // console.log(this.savedStorage);
    if (this.savedStorage.length != 0){
     this.savedStorage.forEach((el:any) => {
      if (el != null){
        let file: any = this.local.getHero(el)
        this.savedHeroes.push(JSON.parse(file));
        this.savesPulled = true;
      }
     })
    }
    this.heroservice.updateAbs.subscribe(()=>{
      this.upDateAbs();
    })
    this.level.invokeBABUpdate.subscribe((BAB)=>{
      this.BAB = BAB;
      this.heroservice.reCalcAttacks();
      
    })
    this.heroservice.distroCredits.subscribe((creds)=>{
      if (creds != "not valid"){
        this.credits = creds;
      }
    })
  }
  //  gets the hero data from the user selection from the local storage/db
  getHero(name: string){  
    let index = this.savedHeroes.findIndex((el:any)=>el.name == name)
    let hero = this.savedStorage[index];
    // console.log("the name", name, index, hero)
    if (hero != null){
      this.tempId = hero;
      let recieved: any = this.local.getHero(hero);
      this.savedHero = JSON.parse(recieved);
      console.log("the hero is", name,this.savedHero)
      this.updateStats();
      this.heroPull = true;
      // this.calcDT(this.currentDtType);
    }
  }

  testChange(){ 
    (this.savedHero['test'] == 1)? this.savedHero['test'] = 0:this.savedHero['test'] = 1;
    console.log("hero:", this.savedHero.test);
  }
// calculates the heroes kevel based on their current xp
calcHeroLevel(num: any){
  if (num == ""){
    num = 0;
  }
  this.currentXp += parseInt(num);
  let tempNum = this.currentXp;
  if (this.currentXp >= 1000){
    let numStr = tempNum.toString();
    let len = numStr.length - 3;
    numStr.substring(0,len);
    let level = 0;
    let sawedNum = parseInt(numStr.substring(0,len))
    for (let i =0; i<this.xpChart.length; i++){
      // console.log("the number to calc", tempNum, numStr, sawedNum, i, this.xpChart.length);
      if (sawedNum >= this.xpChart[i]){
        
        // console.log("the level", i);
      }else{
        let num = 0;
      let hc = (this.level.getHeroClassObj() == undefined)? this.savedHero.class: this.level.getHeroClassObj();
      let hcArr: any = Object.values(hc);
      // console.log("the hc",Object.values(hc));
      let totalHC = hcArr.reduce((prev: any, curr: any) => prev + curr, num);
    // console.log("total HC", totalHC);
        (this.heroLevel < level && this.heroLevel == totalHC)?this.levelUp = true: this.levelUp = false;
        this.heroLevel = level;
        this.nextXp = this.xpChart[i]*1000;
        // this.level.calcBAB();
     
        break;
      }
      this.level.setLevelPts(level);
      level++;
    }
  }else{
    this.heroLevel = 1;
    this.nextXp = this.xpChart[1]*1000;
  }
  this.halfLevel = Math.floor(this.heroLevel/2);
  if (this.xpModalToggle == true){
    this.openModal('xp');
  }
  if (this.heroLevel <= 7){
    this.forceDice = "1d6";
  }else if (this.heroLevel <= 14){
    this.forceDice = "2d6";
  }else{
    this.forceDice = "3d6";
  }
  this.level.setNextXp(this.nextXp);
  this.heroservice.setHeroLevel(this.heroLevel);
  this.heroservice.recalcSkills();
  this.heroservice.reCalcAttacks();
  this.forcePoints = 5 + Math.floor((this.heroLevel/2));
  this.level.setCurrentXp(this.currentXp)
  this.level.displayXp();
  this.BAB = this.level.getBAB();
}
async calcLangsAllowed(){
  let int = this.heroservice.getAbilityModifier()["Intelligence"];
  let feats = this.savedHero.feats;
  for (let i=0; i<feats.length; i++){
    (feats[i] == "Linguist")? int += 1: "nothing";
  }
  let knownLangs = await (this.savedLanguages.length == 0)?this.heroLanguages.length : this.savedLanguages.length;
  (knownLangs >= int)? this.langsAllowed = knownLangs: this.langsAllowed = int;
   
  // console.log ("the stats for lang", int, this.heroLanguages,this.savedLanguages, this.langsAllowed);
}
// updates saved languages array with the outputted languages array from language component
updatelanguages(langs : any){
  this.savedLanguages = [...langs];
  this.heroservice.setLanguages(langs)
}
// updates hero stats and cvalls the setters and getters
async updateStats(){
  //timeout interval to call this function once charactersheet loads properly.
  setTimeout(() => {
    this.heroservice.loadHeroStats(this.savedHero.currentArmor, this.savedHero.equipment, this.savedHero.attacks)
    this.level.displayXp();
    this.heroservice.calcCredits(this.credits, "+");
    }, 500);
  this.savedName = await this.savedHero.name;
  this.startingFeats = await this.savedHero.feats;
  this.level.setFeats(this.startingFeats);
  this.skills = await this.savedHero.skills;
  this.heroservice.setSkills(this.savedHero.skills);
  (Array.isArray(this.savedHero.class))? this.heroClass = {[this.savedHero.class]: 1}: this.heroClass = this.savedHero.class;
  this.heroDefenses = await this.savedHero.defenses;
  this.heroSpeciesObj = await this.savedHero.species;
  this.startingTalents = await this.savedHero.talents;
  this.level.setTalents(this.savedHero.talents);
  this.heroLanguages = await (this.savedHero.languages == undefined)?this.heroSpeciesObj.traits.languages: this.savedHero.languages;
  this.heroAbilities = await this.savedHero.abilities;
  this.size = await this.heroSpeciesObj.traits.size;
  this.BAB = await this.savedHero.bab;
  this.damageThreshold = this.savedHero.dt;
  this.specialQuals = (this.savedHero.notes == undefined || this.savedHero.notes.specQualNotes == undefined)? "": this.savedHero.notes.specQualNotes;
  this.heroNotes = (this.savedHero.notes == undefined || this.savedHero.notes.heroNotes == undefined)? "": this.savedHero.notes.heroNotes;
  this.attackOptsNotes= (this.savedHero.notes == undefined || this.savedHero.notes.attackOptsNotes == undefined)? "": this.savedHero.notes.attackOptsNotes;
  this.specAttackNotes = (this.savedHero.notes == undefined || this.savedHero.notes.specAttackNotes == undefined)? "": this.savedHero.notes.specAttackNotes;
  this.starshipNotes = (this.savedHero.notes == undefined || this.savedHero.notes.starshipNotes == undefined)? "": this.savedHero.notes.starshipNotes;
  this.forceTechniques = (this.savedHero.forceNotes == undefined || this.savedHero.forceNotes.forceTechniques == undefined)? "": this.savedHero.forceNotes.forceTechniques;
  this.forceSecrets = (this.savedHero.forceNotes == undefined || this.savedHero.forceNotes.forceSecrets == undefined)? "": this.savedHero.forceNotes.forceSecrets;
  this.forceRegimens = (this.savedHero.forceNotes == undefined || this.savedHero.forceNotes.forceRegimens == undefined)? "": this.savedHero.forceNotes.forceRegimens;
  await (this.savedHero.currentArmor == undefined)? "nothing":this.currentArmor = this.savedHero.currentArmor; 
  await (this.savedHero.attacks == undefined || this.savedHero.attacks.length == 0)? "nothing":this.heroAttacks= [...this.savedHero.attacks];
  (this.savedHero.equipment == undefined || this.savedHero.equipment.length == 0)? "nothing": this.heroInventory = [...this.savedHero.equipment];
  this.maxHp = (Array.isArray(this.savedHero.hp))? this.savedHero.hp[1]: this.savedHero.hp;
  this.currentHp = (Array.isArray(this.savedHero.hp))? this.savedHero.hp[0]: this.savedHero.hp;
  this.credits = (this.savedHero.credits == undefined)? 0: this.savedHero.credits;
   if(this.savedHero.currentXp == undefined){
    this.currentXp = 0
  }else{
    this.currentXp = this.savedHero.currentXp
  } 
  this.level.setCurrentXp(this.currentXp);
  this.calcHeroLevel(0);
  this.heroservice.resetLanguages(this.heroLanguages);
  await this.heroSets();
  await this.heroGets();
}
// calls methods to set variables in heroService to be used with other components
async heroSets(){
  this.heroservice.setAbilitites(this.savedHero.abilities)
  this.heroservice.setSizeMods(this.size);
  this.heroservice.setDamageThreshold(this.damageThreshold);
  this.heroservice.setSpeciesTraits(this.savedHero.species.traits);
  this.heroservice.setFeatImprovements(this.savedHero.feats);
  this.heroservice.setClassBonuses(this.heroClass);
  this.heroservice.getCarry();
  this.level.setHeroClassObj(this.heroClass);
  
  
   
}
//  gets values for variables by calling the methods
async heroGets(){
  // this.damageThreshold = this.heroservice.getDamageThreshold();
  this.abilityMod = await this.heroservice.getAbilityModifier();
  this.calcGrapple("Strength");
  this.calcLangsAllowed();
  this.updatelanguages(this.heroLanguages);
  // console.log('the absMods', this.abilityMod)
}
//  sets defenses to value output by defenses componenet
updateDefenses(defObj: any){
  this.reflexDefense = defObj[0].total;
  this.fortitudeDefense = defObj[1].total;
  this.willDefense = defObj[2].total;
  this.calcDT(this.currentDtType);
}
//  sets current armor to the value output by armor component
updateArmor(armor : any){
  this.currentArmor = armor;
}
// updates inventory array with the outputted value from equipment component
updateInventory(inventory: any){
  this.heroInventory = [...inventory];
}
// updates the heroAttacks array woith the outputted value from atttacks conmponent 
updateAttacks(attacks: any){
  this.heroAttacks = [...attacks];
}
// adjusts hero's condition based on the selection
updateCondition(num: number){
  this.heroCondition = num;
  this.heroservice.setCondition(num);
  this.heroservice.enforceConditions();
  this.calcDT(this.currentDtType);
}
// sets current hp to the input
updateCurrentHp(num: any){
  this.currentHp = Math.floor(parseInt(num))
}

// sets the damage threshold misc value to the input
setDTMisc(num: any){
  this.dmgThreshMisc = Math.floor(parseInt(num));
  this.calcDT(this.currentDtType);
}
//  calculates damage threshold
calcDT(defenseType: any){
  this.improvedDT = this.heroservice.getImprovedDT();
  if (defenseType == "Select Defense"){
    return;
  }
  (this.size == "Large")? this.speciesDmgThreshMod = 5: this.speciesDmgThreshMod = 0;
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
    this.damageThreshold = this.speciesDmgThreshMod + this.dmgThreshMisc + calcNum + this.improvedDT;
    this.heroservice.setDamageThreshold(this.damageThreshold);
  }
openModal(keyword: string){
  if (keyword == "xp" ){
    this.xpModalToggle = !this.xpModalToggle;
  }
}
// sets the value from the input to the misc for the grapple.
setGrappleMisc(misc: any){
  this.grappleMisc = Math.floor(parseInt(misc));
  this.calcGrapple(this.grappleModSelected);
}
// calculates grapple value
async calcGrapple(mod: string){
  this.grappleModSelected = mod;
  let abMod = await this.heroservice.getAbilityModifier()
  if (this.size == "Small"){
    this.grapple = (this.BAB + abMod[this.grappleModSelected]) - 5;
  }else if (this.size == "Large"){
    this.grapple = (this.BAB + abMod[this.grappleModSelected]) + 5;
  }else{
    this.grapple = (this.BAB + abMod[this.grappleModSelected]);
  }
  this.grapple += (this.heroCondition + this.grappleMisc)
  // console.log(this.grappleModSelected, abMod);
}
// levels up hero by updating each property in the object to it's corresponding member
levelUpHero(lvlObj : any){
// will push lvlObj to the changes array 

// this.level.setBAB(this.level.getBAB() + lvlObj.BAB);
this.maxHp += lvlObj.hp;
this.currentHp += lvlObj.hp;
this.skills = this.heroservice.getSkills();
this.heroservice.recalcSkills();
this.level.addHeroClass(lvlObj.class);
let tempArr = []
if (lvlObj.feats.length > 0){
  let currFeats = this.level.getHeroFeats();
  tempArr = [...currFeats, ...lvlObj.feats];
  this.level.setFeats(tempArr);
  this.startingFeats = this.level.getHeroFeats();
}
if (lvlObj.talents.name != ''){
  let currTalents = this.level.getHeroTalents();
  tempArr = [...currTalents, lvlObj.talents];
  this.level.setTalents(tempArr);
  this.startingTalents = this.level.getHeroTalents();
}
const classObj = this.level.getHeroClassObj();
let vals = Object.values(classObj);
let num = vals.reduce((prev: any, curr: any)=> prev + curr);
console.log("the values",vals, num);
(Number(num) < this.heroLevel)? this.levelUp = true: this.levelUp = false;
this.heroClass = this.level.getHeroClassObj();
}
upDateAbs(){
this.heroAbilities = this.heroservice.getAbilities();
this.abilityMod = this.heroservice.getAbilityModifier();
}
editNotes(value: string){
  switch (value){
    case "specQual":
      this.showSpecQual = !this.showSpecQual;
    break;

  }


}
saveNotes(key: string, value: any){
  switch (key){
    case 'specQual':  
    this.specialQuals = value.target.value;
    break;
    case "hero_notes":
    this.heroNotes = value.target.value;
    break;
    case "attackOpts":
    this.attackOptsNotes = value.target.value;
    break;
    case "attackNotes":
    this.specAttackNotes = value.target.value;
    break;
    case "starshipNotes":
    this.starshipNotes = value.target.value;
    break;
    case "techniques":
      this.forceTechniques = value.target.value;
    break;
    case "secrets":
      this.forceSecrets  = value.target.value;
    break;
    case "regimens":
      this.forceRegimens  = value.target.value;
    break;
  }

}


// saves the current configurations of the hero by removing the item in localstorage and adding it back
async updateHero(){ 
  let heroObj = await {
    "id"  : this.savedHero.id,
    "name" : this.savedName,
    "dt" : this.damageThreshold,
    "defenses"  : {
      "reflex": this.reflexDefense,
      "fort": this.fortitudeDefense,
      "will": this.willDefense,
    },
    "equipment" : this.heroInventory,
    "currentArmor" : this.currentArmor,
    "attacks" : this.heroAttacks,
    "hp" : [this.currentHp,this.maxHp],
    "class" : this.heroClass,
    "skills" : this.skills,
    "species" : this.savedHero.species,
    "condition" : this.heroCondition,
    "bab" : this.BAB,
    "abilities" : this.heroAbilities,
    "feats" : this.startingFeats,
    "talents" : this.startingTalents,
    "currentXp" : this.currentXp,
    "level" : this.heroLevel,
    "grapple" : this.grapple,
    "languages" : this.savedLanguages,
    "credits" : this.credits,
    "forcePoints" : this.forcePoints,
    "notes" : {
      "specQualNotes" : this.specialQuals,
      "heroNotes": this.heroNotes,
      "attackOptsNotes": this.attackOptsNotes,
      "specAttackNotes" : this.specAttackNotes,
      "starshipNotes" : this.starshipNotes,
    },
    "forceNotes" : {
      "techniques" : "",
      "secrets" : "",
      "regimens" : "",
    }
  }
  this.local.removeHero(this.tempId);
  this.local.saveHerotoStorage(this.tempId, heroObj)
  console.log("hero saved", this.tempId, this.savedHero, heroObj);
  window.location.href = '/index.html';
}
deleteHero(){
  this.local.removeHero(this.tempId);
  window.location.href = '/index.html';
}
}
