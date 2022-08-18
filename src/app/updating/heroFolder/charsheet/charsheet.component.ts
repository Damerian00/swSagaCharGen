import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { LocalstorageService } from 'src/app/localstorage.service';
import { HeroService } from '../../services/hero.service';

@Component({
  selector: 'app-charsheet',
  templateUrl: './charsheet.component.html',
  styleUrls: ['./charsheet.component.scss']
})
export class CharsheetComponent implements OnInit {

  unsorted = (a:any, b:any) => {
    return a;
  }

  constructor(private local: LocalstorageService, private heroservice : HeroService) { }
savedHero: any;
savedName: string = "";
startingFeats: Array <string> = [];
skills: any;
speciesLanguages: any;
heroClass: Object = {};
heroDefenses: any;
heroSpeciesObj: any;
startingTalents: any;
heroPull: boolean = false;
savesPulled: boolean = false;
tempId: string = "";
savedStorage: any;
savedHeroes:any = [];
currentXp: number = 0;
nextXp: number = 0;
heroLevel: number = 0;
halfLevel: number = 0;
xpChart: Array <any> = [0,1,3,6,10,15,21,28,36,45,55,66,78,91,105,120,136,153,171,190]
heroAbilities: Object = {};
size: string = "";
maxHp: number = 0;
currentHp: number = 0;
damageThreshold: number = 0;
abilityMod: any;
currentDtType: any = "Fortitude Defense";
reflexDefense: number = 10;
fortitudeDefense:number = 10;
willDefense: number = 10;
speciesDmgThreshMod: number = 0;
improvedDT: number = 0;
damageThreshMod: number = 0;
dmgThreshMisc: number = 0;
heroCondition: number = 0;
xpModalToggle: boolean = true;

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
    
  }
calcHeroLevel(num: any){
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
        this.heroLevel = level;
        this.nextXp = this.xpChart[i+1]*1000;
        break;
      }
      level++;
    }
  }else{
    this.heroLevel = 1;
    this.nextXp = this.xpChart[1]*1000;
  }
  (this.heroLevel == 1)? this.halfLevel = 1: this.halfLevel = Math.floor(this.heroLevel/2);
  this.openModal('xp');
  this.heroservice.setHeroLevel(this.heroLevel);
  this.heroservice.recalcSkills();
}

getHero(name: string){
  let index = this.savedHeroes.findIndex((el:any)=>el.name == name)
  let hero = this.savedStorage[index];
  console.log("the name", name, index, hero)
  if (hero != null){
    this.tempId = hero;
    let recieved: any = this.local.getHero(hero);
    this.savedHero = JSON.parse(recieved);
    console.log("the hero is", name,this.savedHero)
    this.updateStats();
    this.heroPull = true;
  }
}

async updateStats(){
  this.savedName = await this.savedHero.name;
  this.startingFeats = await [this.savedHero.feats];
  this.skills = await this.savedHero.skills[0];
  (Array.isArray(this.savedHero.class))? this.heroClass = {[this.savedHero.class]: 1}: this.heroClass = this.savedHero.class;
  this.heroDefenses = await this.savedHero.defenses;
  this.heroSpeciesObj = await this.savedHero.species;
  this.startingTalents = await this.savedHero.talents;
  this.speciesLanguages = await this.heroSpeciesObj.traits.languages;
  this.heroAbilities = await this.savedHero.abilities;
  this.size = await this.heroSpeciesObj.traits.size;
  this.calcHeroLevel(this.currentXp);
  await this.heroSets();
  await this.heroGets();
  this.calcDT(this.currentDtType);
  this.updateCondition(this.heroCondition);
}
async heroSets(){
  this.heroservice.setAbilitites(this.savedHero.abilities)
  this.heroservice.setSizeMods(this.size);
  this.heroservice.setDamageThreshold(this.savedHero.dt);
  this.heroservice.setSpeciesTraits(this.savedHero.species.traits);
  this.heroservice.setFeatImprovements(this.savedHero.feats);
  this.heroservice.setClassBonuses(this.heroClass);
}
heroGets(){
  this.damageThreshold = this.heroservice.getDamageThreshold();
  this.abilityMod = this.heroservice.getAbilityModifier();
  // console.log('the absMods', this.abilityMod)
}
updateHero(){ 
  // this.local.removeHero(this.tempId);
  // this.local.saveHerotoStorage(this.tempId, this.savedHero)
  console.log("hero saved", this.tempId, this.savedHero);
}
updateDefenses(defObj: any){
  this.reflexDefense = defObj[0].total;
  this.fortitudeDefense = defObj[1].total;
  this.willDefense = defObj[2].total;
}
updateCondition(num: number){
  this.heroCondition = num;
  this.heroservice.setCondition(num);
  this.heroservice.enforceConditions();
}
setDTMisc(num: number){
  this.dmgThreshMisc = Math.floor(num);
  this.calcDT(this.currentDtType);
}
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
  }
openModal(keyword: string){
  if (keyword == "xp"){
    this.xpModalToggle = !this.xpModalToggle;
  }
}

}
