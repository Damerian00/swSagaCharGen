import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { SwapiService } from 'src/app/services/swapi.service';
import { HeroService } from '../../services/hero.service';
import { LevelingService } from '../../services/leveling.service';
import  forcePowersArr from '../../../db/fpowers.json';
import saberPowersArr from '../../../db/spowers.json';
import startClasses from '../../../db/sclasses.json';

interface forcePowers {
  name:String,
  desc: String,
  type: Array<string>
}

interface saberPowers {
  name:String,
  desc: String,
  type: Array<string>
}

@Component({
  selector: 'experience',
  templateUrl: './experience.component.html',
  styleUrls: ['./experience.component.scss']
})
export class ExperienceComponent implements OnInit {
  unsorted = (a:any, b:any) => {
    return a;
  }

  //  ---Variables
//  Input/Output
  @Input() levelUp: boolean = false;
  @Output() heroLvlUpObj: EventEmitter <any>  = new EventEmitter <any> ()
//  Arrays
currentfeatsArr: any;
classStartFeatsArr: Array<string> = [];
currentTalentsArr: any;
apifeatsArr: any;
apiTalentsArr: any;
apiTree: any;
apiWeaponsArr: Array<any> = [];
apiMeleeArr : Array<any> = [];
apiRangedArr: Array<any> = [];
importFeatsArr: Array<any> = [];
importClassFeatsArr: Array<any> = [];
importTalentsArr: Array<any> = []
addOptionsArr: Array<string> = [];
availablePrestigeClasses = [];
startingClasses = startClasses;
wepGrps: Array<string> = ["Advanced Melee Weapons","Heavy Weapons","Lightsabers","Pistols","Rifles","Grenades","Simple Weapons (Melee)","Simple Weapons (Ranged)"];
meleeGrps: Array<string> = ["Advanced Melee Weapons","Lightsabers","Simple Weapons (Melee)"];
rangedGrps: Array<string> = ["Heavy Weapons","Pistols","Rifles","Grenades","Simple Weapons (Ranged)"];
repeatFeats: Array<string> = ["Improved Damage Threshold","Force Training", "Extra Rage","Extra Second Wind","Linguist",]
heroForceSuite: Array <any> = []
forcePowersArr: forcePowers[] = forcePowersArr;
saberFormPowers: saberPowers[] = saberPowersArr;

//  Objects
lvlUpObject = {
  "class" : "",
  "BAB" : 0,
  "hp"  : 0,
  "feats" : [""],
  "talents" : {"name" : "", "description": "","alias": ""},
  "abilities" : [""]
}
babArr = {
  "normal" : [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],
  "special" : [0,0,1,2,3,3,4,5,6,6,7,8,9,9,10,11,12,12,13,14,15],
}
abilities: any = {};
validatedArr: Array<boolean> = [];
skillValuetoUpdate: Array<string> = [];
speciesFeats: any;
exoticMelee: Array<any> = [];
exoticRange: Array<any> = [];

//  Boolean
levelUpModal: boolean = false;
showClassFeat: boolean = false;
showNoClassFeat: boolean = false;
showTalent: boolean = false;
showAbs: boolean = false;
lvlButton: boolean = false;
showClassFeatOptions: boolean = false;
showRegFeatOptions: boolean = false
showTalentOptions: boolean = false;
updateSkills: boolean = false;
unrestrictFlag: boolean = false;
forceTraining: boolean = false;
showForcePowers: boolean = false;
//  Numbers & Strings
levelPts: number = 0;
currentXp: number = 0;
nextXp: number = 0;
timesLeveled: number = 0;
hpKeyWord: string = '';
rolledHp: number = 0;
classSelection: string = '';
featName: string = '';
featDesc: string = '';
classFeatName: string = '';
classFeatDesc: string = ''
talentName: string = '';
talentDesc: string = '';
unrestrictFeat : string = "";
forceName: string = "";
forceDesc: string = "";
maxPowers: number = 0;
numPowers: number =  0;
/*
0,1,2,3,3,4,5,6,6,7,8,9,9,10,11,12,12,13,14,15
*/
  constructor(private heroservice : HeroService, private swapi : SwapiService, private level : LevelingService) { }

  ngOnInit(): void {
    this.swapi.getFeats().subscribe((feats)=> {
      this.apifeatsArr = feats;
      this.apifeatsArr.sort(this.sortNames("name"));
    })
    this.swapi.getTalents().subscribe((talents) =>{
      this.apiTalentsArr = talents
      this.apiTalentsArr.sort(this.sortNames("name"));
    })
    this.swapi.getMelees().subscribe((melee)=> {
      this.apiMeleeArr = [...melee];
      melee.forEach((el:any)=>{
        if (el.w_type == "Exotic Weapons (Melee)"){
          this.exoticMelee.push(el.name);
        } 
      })
 
    })
    this.swapi.getRanged().subscribe((ranged)=> {
      this.apiRangedArr = [...ranged];
      ranged.forEach((el:any)=> {
        if (el.w_type == "Exotic Weapons (Ranged)"){
          this.exoticRange.push(el.name);
        }
      })
    })
    this.swapi.getTalentTree().subscribe((tree)=> {
      this.apiTree = [...tree];
    })
    this.level.invokeGetXp.subscribe(() => {
      this.getXp();
    })
    this.level.invokeTreeCount.subscribe((talents)=> {
      this.countTrees(talents);
    })
    setTimeout(() => {
      this.apiWeaponsArr = [...this.apiMeleeArr, ...this.apiRangedArr];
      }, 500);
    
  }
  sortNames(prop: string){
    let sortOrder = 1;
    if(prop[0] === "-") {
        sortOrder = -1;
        prop = prop.substr(1);
    }
    return function (a:any,b:any) {
        if(sortOrder == -1){
            return b[prop].localeCompare(a[prop]);
        }else{
            return a[prop].localeCompare(b[prop]);
        }        
    }
  }

sortArray(arr: Array<any>){
  // console.log("the arr", arr);
 return arr.sort(function(a, b){return a-b});
}

// check hero level to see if it's every 3rd level and return the answer
currFeat: string = '';
clearArr(arr : any){
  // console.log("clearing", arr, this.currFeat);
  if (arr == undefined){
    return;
  }
  if (arr.length != 0){
    while(arr.length){
      arr.pop();
    }
  }
}

// checks to see what hero and class level the user is leveling to
checkHeroLvl(){
  let num = 1;
  let hc = this.level.getHeroClassObj();
  let hcArr = Object.values(hc);
  if (hc[this.lvlUpObject.class] != undefined){
    num = hc[this.lvlUpObject.class] + 1;
  }
  // let hl = this.heroservice.getHeroLevel();
  // let valid = false;
  let count:any = hcArr.reduce((prev: any, curr: any) => prev + curr, 1);
  this.showNoClassFeat = (this.thirdLevelFeat(count))? true: false;
  this.showAbs = (this.everyFourth(count))? true: false;
  if (num % 2 == 0){ this.showClassFeat = true; this.showTalent = false }else{ this.showClassFeat = false; this.showTalent = true; this.addFeat('','none', 'yes'); this.countTrees(this.level.getHeroTalents()) }
}

thirdLevelFeat(lvl : number){
  // console.log("this is your level", lvl)
  if (lvl % 3 === 0){
    this.addFeatOptions();
    return true;
  }else{
    return false;
  }
}
everyFourth(lvl : number){
  // console.log("the count", lvl)
  if (lvl % 4 === 0){
    this.displayCurrentAbs(true);
    return true;
  }else{
    this.displayCurrentAbs(false);
    return false;
  }
}
getXp(){
  this.currentXp = this.level.getCurrentXp();
  this.nextXp = this.level.getNextXp();
}
beginLevelUp(){
  this.levelUpModal = true;
  this.lvlButton = false;
}

async showAvailable(feat : any, arr: Array<any>, keyWord: string){
  this.currFeat = feat;
  let index=0;
  for (let i =0; i < arr.length; i++){
    if(arr[i].name == feat){
      index = i;
      break;
    }    
  }
    let keys = Object.keys(arr[index].prereqs);
    let vals: any = Object.values(arr[index].prereqs);
    // console.log("vals:",vals, feat)
    let noreqClassFeat = ["Weapon Proficiency (Advanced Melee Weapons)","Weapon Proficiency (Heavy Weapons)","Weapon Proficiency (Rifles)"]
    if (vals[0].includes("none") || noreqClassFeat.includes(feat)){
      (keyWord == 'regular')?this.importFeatsArr.push(feat):this.importClassFeatsArr.push(feat);
    }else{
         for(let v = 0; v < vals.length; v++){
          let valid = false;
        if (keys.includes("orLogic")){
            let orArr = [];
            for (let or = 0; or < vals.length; or++){
              if (vals[or].includes("or")){
                for (let c = 2; c<vals[v].length; c++){
                  let orValid = await this.checkFeatReqs(vals[or][c], vals[or][0], feat, valid)
                   if (orValid == true){
                    orArr.push(true);
                     break;       
                 }
                 if (orArr.length == 0){
                  orArr.push(false);
                 }
                 }
              }else{
                let orValid = await this.checkFeatReqs(vals[or][1], vals[or][0], feat, valid);
                orArr.push(orValid);
              }
            }
            if (orArr.includes(true)){
              valid = true;
          }
        }else if (vals[v].includes("or")){
          for (let c = 2; c<vals[v].length; c++){
           valid = await this.checkFeatReqs(vals[v][c], vals[v][0], feat, valid)
            if (valid == true){
              break;       
          }
          }
        }else{
          let check = vals[v][1];
         valid = await this.checkFeatReqs(check, vals[v][0], feat,valid)
          if (valid == false) {
            // console.log("valid is false");
            this.validatedArr = [valid]
            break;
          };
        } 
        // console.log("the vals: ",vals," feat:", feat, valid)
        this.validatedArr = [valid]
      } 
      if (this.validatedArr.includes(false) == false && this.validatedArr.length != 0) {
        // console.log("adding to arry:", feat)
        (keyWord == 'regular')?this.importFeatsArr.push(feat):this.importClassFeatsArr.push(feat);
      };
    }
    (keyWord == 'regular')?this.sortArray(this.importFeatsArr):this.sortArray(this.importClassFeatsArr);
    // let tempArr = this.sortArray(this.importFeatsArr)
    // this.importFeatsArr = [...tempArr];
}
async checkFeatReqs(apiValue: any, keyWord: string, feat: any, valid: boolean){
  // console.log(apiValue, keyWord, feat)
  let skills = await this.heroservice.getSkills();
  let feats = await this.level.getHeroFeats();
  let trait = await this.heroservice.getSpeciesTraits();
  let talents = await this.level.getHeroTalents();
  switch(keyWord){
    case "BAB":
      valid =(this.lvlUpObject.BAB >= apiValue)? true: false ;
      // console.log(keyWord,":",this.lvlUpObject.BAB, apiValue, this.validated, feat);
      break;
      case "trained":
        for (let i=0; i<skills.length;i++){
          if (skills[i].skill_name == apiValue){
           valid = (skills[i].trained_skill)? true : false;
          }
        }   
      break;
      case "feat":
        for (let i = 0; i< feats.length; i++){
          let words = feats[i].split(' ');
          if (words[0] == "Weapon" && words[1] == "Proficiency" && feat == "Weapon Focus"){
           valid = true;
            // console.log("the split",words, apiValue)
            break;
          }
        }        
        valid = (feats.includes(apiValue))? true: false;         
      break;
      case "trait":
        let keys = Object.keys(trait);
       valid = keys.includes(apiValue) ? true :  false;
      break;
      case "talent":
        for (let i=0 ; i<talents.length;i++){
          if (talents[i].name == apiValue){
            valid = true;
            break;
          }else{
            valid = false;
          }
        }
      break;
      case "!species":
        valid = (trait.species_name != apiValue)? true: false;
      break;
      default:
        valid = (this.heroservice.getAbilities()[keyWord] >= apiValue && this.heroservice.getAbilities()[keyWord] != undefined)? true: false;
        // console.log(this.validatedArr, ":",this.heroservice.getAbilities()[keyWord],keyWord,apiValue, feat)
      break;
  }
  // if (feat == "Force Training"){
  //   console.log(feats, "+",feat,":",apiValue, "/",keyWord,"/",valid)
  // }
  return valid;
}
async addFeatOptions(){
  this.clearArr(this.importFeatsArr);
  let currFeats = this.level.getHeroFeats();
  let traits = await this.heroservice.getSpeciesTraits();
  let featsArr = [...this.apifeatsArr]
  this.speciesFeats = traits["Species Feats"];
  if (Object.keys(traits).includes("Species Feats")){
    let tempArr = []
    // console.log("keys:", traits)
    let keys =  Object.keys(this.speciesFeats);
    let vals =  Object.values(this.speciesFeats);
    for (let i=0; i<keys.length;i++){
      let obj = {
        "name" : keys[i],
        "description" : vals[i],
        "prereqs" : {"req1": ["none"]},
        "species" : "yes",
      };
      tempArr.push(obj);
  }
  featsArr = [...this.apifeatsArr, ...tempArr]
}
// console.log(this.lvlUpObject.class)
  featsArr.forEach((el:any)=>{
    // console.log("the list:",currFeats);
    if (this.repeatableFeats.includes(el.name) || currFeats.includes(el.name) == false){
      this.showAvailable(el.name, featsArr, 'regular');
    }
  })
}
//  displays classs feats that aren't already on the character
addClassFeatOptions(heroClass : string){
  this.clearArr(this.importFeatsArr);
  let currFeats = this.level.getHeroFeats();
  let index = this.startingClasses.findIndex((el: any)=> el.name == heroClass);
  let newFeats = this.startingClasses[index].class_Feats;
  this.lvlUpObject.BAB = (this.level.getBAB() + this.startingClasses[index].BAB)
  this.sortArray(newFeats);
  // console.log(this.lvlUpObject.BAB,this.level.getBAB(), "+", this.startingClasses[index].BAB )
  for (let i=0; i< newFeats.length; i++){
    if(currFeats.includes(newFeats[i]) == false){
      this.showAvailable(newFeats[i], this.apifeatsArr, 'class')
    }
  }
  // console.log("show me feats",currFeats, this.importFeatsArr);
}
//  adds to a starting feats array when choosing a new class to multiclass with
repeatableFeats = ["Improved Damage Threshold","Force Training"]
addStartFeats(heroClass : string){
  this.clearArr(this.classStartFeatsArr);
  let currFeats = this.level.getHeroFeats();
  let index = this.startingClasses.findIndex((el: any)=> el.name == heroClass);
  let startFeats = this.startingClasses[index].start_feats;
  for (let i=0; i< startFeats.length; i++){
    let key = this.checkClassReqs(startFeats[i]);
    if(currFeats.includes(startFeats[i]) == false && key == "yes"){
      this.classStartFeatsArr.push(startFeats[i]);
    }
  }
  // console.log("show me start feats",currFeats, this.classStartFeatsArr);
}
//  checks class requirments for scout and noble
checkClassReqs(feat : string){
  let key = '';
  switch (feat) {
    case "Linguist":
      key = (this.heroservice.getAbilities()["Intelligence"] >= 13)? "yes": "no";
      break;
    case "Shake It Off":
      let skills = this.heroservice.getSkills();
      console.log(skills);
      let skill = true;
      for (let i = 0; i < skills.length; i++){
        if (skills[i].skill_name == "Endurance"){
            skill = skills[i].trained_skill;
        }
      }
      key = (this.heroservice.getAbilities()["Constitution"] >= 13 && skill == true)? "yes": "no";
    break;
    default:
      key = "yes";
      break;
  }
  return key;
}
// creates the array for selecting when choosing a talent
addTalentSelectables(selectedClass : string, keyWaord: string){
  // console.log("adding selectables", selectedClass);
  let tempTree = [];
  this.clearArr(this.importTalentsArr);
  for (let i = 0; i < this.apiTree.length; i ++){
    if (this.apiTree[i].classUsage.includes(selectedClass)){
      tempTree.push(this.apiTree[i].id);
    }
  }
  // console.log("tempTree arr", tempTree);
  for (let i=0; i<this.apiTalentsArr.length; i++){
    if (tempTree.includes(this.apiTalentsArr[i].TalentTreeId)){
      if (this.apiTalentsArr[i].preReqs.req1 == "none"){
        (keyWaord == 'talent')?this.importTalentsArr.push(this.apiTalentsArr[i]):this.addOptionsArr.push(this.apiTalentsArr[i].name);
      }else{
        let preReqs = this.apiTalentsArr[i].preReqs
        for (let p = 0; p< Object.keys(preReqs).length; p++){
          let vals = Object.values(preReqs)[p];
        //  console.log(this.apiTalentsArr[i])
          if (this.checkArrLength(vals, this.apiTalentsArr[i].name) == true){
            (keyWaord == 'talent')?this.importTalentsArr.push(this.apiTalentsArr[i]):this.addOptionsArr.push(this.apiTalentsArr[i].name);
          }
        }
      }
    }
  }
  (keyWaord == 'talent')?this.sortArray(this.importTalentsArr):this.sortArray(this.addOptionsArr);
  // console.log(this.importTalentsArr, "<--imp talentsarr");
}
checkArrLength(arr: any, talent: string){
  let valid = false;
  if (arr.length == 2){
    valid = (this.checkTalentReqs(arr, talent))? true: false;
  }else if (arr.includes("or")){
    //start i @ 2 since we are only looping through indexes after the first 2
    for (let i=2; i< arr.length; i++){
      let newArr = [arr[0], arr[i]];
      // if true will break loop and set valid to true because only need one to be true
      if (this.checkTalentReqs(newArr, talent) == true){
        valid = true;
        break;
      }
    }
  }else{
    //start i @ 2 since we are only looping through indexes after the first 2
    for (let i=2; i< arr.length; i++){
      let newArr = [arr[0], arr[i]];
      // if false will return false and break the loop because all need to be true
      if (this.checkTalentReqs(newArr, talent) == false){
        valid = false;
        break;
      }else{
        valid = true;
      }
    } 
  }
  return valid;
}
// function checks the different requirements passed into it then returns if valid
checkTalentReqs(arr: any, talent: string){
  let valid = false
  let tempStr = '';
  const abs = Object.keys(this.heroservice.getAbilities());
  if (abs.includes(arr[0])){
    let index = abs.findIndex((el: any)=> el == arr[0])
    tempStr = abs[index];
    arr[0] = "abilities";
  }else{
    let split = arr[0].split(' ');
    if (split[split.length -1] == "Tree"){
      tempStr = arr[0];
      arr[0] = "tree";
    }
  }
  const bab = this.level.getBAB();
  const skills = this.heroservice.getSkills();
  const talents = this.level.getHeroTalents();
  const feats = this.level.getHeroFeats();
  const trees = this.level.getNumberinTrees();
  switch (arr[0]){
    case "Trained":
      let index = skills.findIndex((el : any)=> el.skill_name == arr[1]);
      valid = skills[index].trained_skill
    break;
    case "talent":
    valid = talents.includes(arr[1]);
    break;
    case "abilities":
    valid = (this.heroservice.getAbilities()[tempStr] >= arr[1])? true: false;
    break;
    case "BAB":
    valid = (arr[1] >= bab)? true: false;
    break;
    case "Language":
    valid = (this.heroservice.getLanguages().includes(arr[1]))? true: false;
    break;
    case "feat":
    valid = (feats.includes(arr[1]));
    break;
    case "tree":
    valid = (Object.keys(trees).includes(tempStr))? true: false;
    break;
  }
  // console.log("Well?", talent, arr, valid, tempStr);
 return valid;
}

// if a talent has an additional option this function creates an array of those options
addTalentOptions(key: string, talent : any){
  this.updateSkills = false;
  // console.log("here's a talent:", key, talent)
  let heroTalents = this.level.getHeroTalents();
  let tempArr: Array <any> = [];
  let meleeExotic: Array<any> = [];
  let rangedExotic: Array<any> = [];
  this.apiMeleeArr.forEach((el: any)=> {
    if(el.w_type == "Exotic Weapons (Melee)"){
      meleeExotic.push(el.name);
    }else if (el.w_type == "Exotic Weapons (Ranged)"){
      rangedExotic.push(el.name);
    }
  })
  switch (key){
    case "talentTree":
      switch (talent.name){
        case "Coordinated Leadership":
        // list of talents user possess from LTT     
        heroTalents.forEach((el:any) => {
          if (el.TalentTreeId == "LTT"){
            tempArr.push(el.name);
          }
        });
        break;
        case "Stolen Form":
        // the list will be from the LFTT that the user meets the requirements for.

        break;
        case "Squadron Maneuvers":
        // list talents that user possesses from either EPTT and GTT
        heroTalents.forEach((el:any) => {
          if (el.TalentTreeId == "EPTT" || el.TalentTreeId == "GTT"){
            tempArr.push(el.name);
          }
        });

        break;
        case "Share Talent":
        // list talents user possess from LCTT, DTT and LFTT
        heroTalents.forEach((el:any) => {
          if (el.TalentTreeId == "LCTT" || el.TalentTreeId == "DTT" || el.TalentTreeId == "LFTT"){
            tempArr.push(el.name);
          }
        });
        break;
      }
    break;
    case "proficient":
      const feats = this.level.getHeroFeats();
      feats.forEach((el: any) => {
        let words = el.split(' ')
          if (words[0] == "Weapon" && words[1] == "Proficiency"){
            tempArr.push(el);
          }
      })
      if (talent.name == "Accurate Blow"){
        //  list of melee exotic and melee weapon groups user has proficiency with
        feats.forEach((el:any)=> {
          let words = el.split(' ')
          if (words[0] == "Weapon" && words[1] == "Proficiency"){
            let inParan = []
            for (let i = 2; i<words.length; i++){
      let len = words.length - 1
       if (i == 2){
           if (words.length == 3){
           inParan.push(words[i].substring(1).slice(0,-1));
         }else{
           inParan.push(words[i].substring(1));
         } 
        } else if (i == len){
             inParan.push(words[i].slice(0,-1));
            }
      else{
        inParan.push(words[i]);
      }
    }
    let keyWord = inParan.join(' ');
    if (this.meleeGrps.includes(keyWord) || meleeExotic.includes(keyWord)){
        tempArr.push(el);
    }
          }
        })
      }else{
        // list of any exotic weapon and weapon group user has proficiency with
        feats.forEach((el:any)=> {
          let words = el.split(' ')
          if (words[0] == "Weapon" && words[1] == "Proficiency"){
            let inParan = []
            for (let i = 2; i<words.length; i++){
      let len = words.length - 1
       if (i == 2){
           if (words.length == 3){
           inParan.push(words[i].substring(1).slice(0,-1));
         }else{
           inParan.push(words[i].substring(1));
         } 
        } else if (i == len){
             inParan.push(words[i].slice(0,-1));
            }
      else{
        inParan.push(words[i]);
      }
    }
    let keyWord = inParan.join(' ');
    let exotics = [...meleeExotic, ...rangedExotic]
    if (this.wepGrps.includes(keyWord) || exotics.includes(keyWord)){
        tempArr.push(el);
    }
          }
        })
      }

    break;
    case "weapon":
      // list of all exotic weapons and Advanced Melee Weapons, Heavy Weapons, Pistols, Rifles, and Simple Weapons
      let wepGrp = ["Advanced Melee Weapons", "Heavy Weapons", "Pistols", "Rifles", "Simple Weapons (Melee)","Simple Weapons (Ranged)"]
      tempArr = [...meleeExotic,...rangedExotic,...wepGrp]; 
    break;
    case "force":
      if (talent.name == "Share Force Secret"){
        //  list known force secrets
      }else{
        // list known force techniques
      }
    break;
    case "skills":
      const heroSkills = this.heroservice.getSkills();
      this.updateSkills = true;
      switch (talent.name){
        case "Assured Skill":
        // show skills that have assured value as undefined or false
        heroSkills.forEach((el: any) => {
          if (el.assured != true){
            tempArr.push(el.skill_name);
          }
        });
        this.skillValuetoUpdate[0] = 'assured';
        break;
        case "Exceptional Skill":
        // show skills that have exceptional value as undefined or false and are trained
        heroSkills.forEach((el:any) => {
          if (el.trained_skill == true && el.exceptional != true){
            tempArr.push(el.skill_name);
          }
        });
        this.skillValuetoUpdate[0] = 'exceptional';
        break;
        case "Skill Boon":
        // show skills that have boon value as undefined of false and are trained
        heroSkills.forEach((el:any) => {
          if (el.trained_skill == true && el.boon != true){
            tempArr.push(el.skill_name);
          }
        });
        this.skillValuetoUpdate[0] = 'boon';
        break;
        case "Skill Confidence":
         // show skills that have confidence value as undefined of false and are trained
         heroSkills.forEach((el:any) => {
          if (el.trained_skill == true && el.confidence != true){
            tempArr.push(el.skill_name);
          }
        });
        this.skillValuetoUpdate[0] = 'confidence';
        break;
        case "Skillful Recovery":
        // show skills that have recovery value as undefined of false and are trained
        heroSkills.forEach((el:any) => {
          if (el.trained_skill == true && el.recovery != true){
            tempArr.push(el.skill_name);
          }
        });
        this.skillValuetoUpdate[0] = 'recovery';
        break;

      }
    break;


  }
  this.addOptionsArr = [...tempArr];
}
selectTalent(talent : string){
  if (talent == "Select"){
    this.talentName = "";
    this.talentDesc = "";
    this.showTalentOptions = false;
    return;
  }
  this.showTalentOptions = false;
  let index = this.apiTalentsArr.findIndex((el : any)=> el.name == talent);
  this.talentName = this.apiTalentsArr[index].name;
  this.talentDesc = this.apiTalentsArr[index].description;
  if (this.apiTalentsArr[index].addOption.includes("none") == false){
    this.showTalentOptions = true;
    let skills = ["Assured Skill","Exceptional Skill","Skill Boon","Skill Confidence","Skillful Recovery"]
    let force = ["Share Force Secret","Share Force Technique"];
    if (skills.includes(this.apiTalentsArr[index].name)){
      this.addTalentOptions("skills",this.apiTalentsArr[index]);
    }else if(force.includes(this.apiTalentsArr[index].name)){
      this.addTalentOptions("force", this.apiTalentsArr[index]);
    }else{
      this.addTalentOptions(this.apiTalentsArr[index].addOption[0], this.apiTalentsArr[index]);
    }

  }
}
addTalent(talent: string, opt : string){
  if (talent == "Select" || opt == "Select"){
    return;
  }
  let talentSkills = ["Assured Skill","Exceptional Skill","Skill Boon","Skill Confidence","Skillful Recovery"]
  if (talentSkills.includes(talent)){
    this.skillValuetoUpdate[1] = opt
  }
  let index = this.apiTalentsArr.findIndex((el:any)=> el.name == talent)
  let obj = this.apiTalentsArr[index];
  if (opt != "none"){
    obj["alias"] = `${talent} (${opt})`
  }
 this.lvlUpObject.talents = Object.assign(obj);
  // console.log("the obj:", this.lvlUpObject);
  this.checkSelections('talent');
}
countTrees(talents: any){
  // console.log("counting", talents)
  let obj:any = {};
  for (let i = 0; i < talents.length; i++){
    for (let j = 0; j<this.apiTree.length; j++){
      if (talents[i].TalentTreeId == this.apiTree[j].id){
        if (obj[this.apiTree[j].name] == undefined){
          obj[this.apiTree[j].name] = 1;
        }else{
          let value = obj[this.apiTree[j].name];
          obj[this.apiTree[j].name] = value + 1;
        }
      }
    }
  }
  this.level.setNumberinTrees(obj);
  this.addTalentSelectables(this.lvlUpObject.class, 'talent')
  // console.log("heres trees", obj)
}
selectFeat(feat: string, type: string){
  this.forceTraining = false;
  if (feat == "Select"){
    if (type == 'regular'){
      this.featName = "";
      this.featDesc = "";
    }else{
      this.classFeatName = "";
      this.classFeatDesc = "";
    }
    return;
  } 
  this.clearArr(this.addOptionsArr);
  let skillsTrained = [];
  let skillsFocused = [];
  let optionFeats = ["Skill Focus","Skill Training","Weapon Focus","Weapon Proficiency","Adaptable Talent", "Recurring Success","Exotic Weapon Proficiency","Force Training","Withdrawal Strike","Mission Specialist"]
  if (optionFeats.includes(feat)){
    if (feat == optionFeats[0] || feat == optionFeats[1] ){
      let skills = this.heroservice.getSkills();
      for (let i = 0; i<skills.length; i++){
        if(skills[i].trained_skill == false){
          skillsTrained.push(skills[i].skill_name);
        }
        if(skills[i].skill_focus == false && skills[i].trained_skill == true){
          skillsFocused.push(skills[i].skill_name)
        }
      }
      this.addOptionsArr = (feat == "Skill Training")?  [...skillsTrained]: [...skillsFocused];
      
    }else{
      let heroFeats = this.level.getHeroFeats();
      const species = this.heroservice.getSpecies();
      const abs = this.heroservice.getAbilityModifier();
      const heroObject = this.level.getHeroClassObj();
      switch (feat){
        case "Weapon Focus":
          for (let i=0; i<heroFeats.length;i++){
            let splitter = heroFeats[i].split(' ');
            if (splitter[0] == "Weapon" && splitter[1] == "Proficiency"){
              let word = splitter.slice(2).join(' ')    
              this.addOptionsArr.push(word.slice(1,-1));
            }
          }
        break;
        case "Weapon Proficiency":
          let weaponOptions = ["Simple Weapons", "Pistols", "Rifles", "Lightsabers", "Heavy Weapons", "Advanced Melee Weapons"]
        // console.log("feats", feats)
          for (let i =0; i<weaponOptions.length;i++){
            const word = `Weapon Proficiency (${weaponOptions[i]})`
            if (heroFeats.includes(word)== false){
            this.addOptionsArr.push(weaponOptions[i]);
            }

      } 
        break;
  //  needs to show talents for all classes that the character possesses as well as meets the requirements for
        case "Adaptable Talent":
        let keys = Object.keys(heroObject);
        if (keys.includes(this.lvlUpObject.class) == false){
          keys.push(this.lvlUpObject.class); 
        }
        keys.forEach((el:any)=> {
          this.addTalentSelectables(el,'feat');
          console.log("pushed", el);
      })
      // need to set something up to add options if a talent is choosen that has additional options
        break;
        case "Recurring Success":
// check current talents and feats for restrictions on uses per encounter and add that talent or feat to options array will have ope set to true
          const heroTalents = this.level.getHeroTalents();
          for (let i=0; i< this.apifeatsArr.length;i++){
            if (heroFeats.includes(this.apifeatsArr[i].name)){
                if (this.apifeatsArr[i].ope == true){
                  this.addOptionsArr.push(this.apifeatsArr[i].name);
                }
            }
          }
          for (let i=0; i<heroTalents.length;i++){
            if (heroTalents[i].ope == true){
              this.addOptionsArr.push(heroTalents[i].name);
            }
          }
        break;
        case "Exotic Weapon Proficiency":
          let exclusiveSpecies = ["Gamorrean","Gungan","Wookiee","Kissai","Massassi","Felucians","Squib","Verpine"];
      let excludeArr: any = [];
      let exoticOpts: Array<any> = [...this.exoticMelee, ...this.exoticRange];
      if (exclusiveSpecies.includes(species)){
        switch (species){
          case "Gamorrean":
            excludeArr = ["Arg'garok"];
          break;
          case "Gungan":
            excludeArr = ["Atlatl","Cesta"];
          break;
          case "Wookiee":
            excludeArr = ["Bowcaster","Ryyk Blade"];
          break;
          case "Kissai":
            excludeArr = ["Massassi Lanvarok"];
          break;
          case "Massassi":
            excludeArr = ["Massassi Lanvarok"];
            break;
          case "Felucians":
            excludeArr = ["Felucian Skullblade"];
          break;
          case "Squib":
            excludeArr = ["Squib Tensor Rifle"];
          break;
          case "Verpine":
            excludeArr = ["Verpine Shattergun"];
        }
      }
      exoticOpts.forEach((el: any)=> {
        if (excludeArr.length == 0){
          this.addOptionsArr.push(el);
        }else if (excludeArr.includes(el) == false){
          this.addOptionsArr.push(el);
        }
        // console.log(this.addOptionsArr, "addOpts")
      })
        break;
        case "Force Training":
        this.showRegFeatOptions = false;
        this.forceTraining = true;
        break;
        case "Withdrawal Strike":

        break;
        case "Mission Specialist":

        break;
        
      }
//  after switch sort the options array alphabetically
      this.sortArray(this.addOptionsArr);
      let exoticsArr = [];
      let proficient = [""];
      let feats = [...this.level.getHeroFeats()];
      for (let i =0; i < feats.length; i++){
        let words = feats[i].split(' ')
        // console.log("these are current feats", words);
          if (words[0] == "Weapon" && words[1] == "Proficiency"){
            let inParan = []
            for (let i = 2; i<words.length; i++){
      let len = words.length - 1
       if ( words.length == 3){     
        inParan.push(words[2].substring(1).slice(0,-1));
       } else if(i == 2){
            inParan.push(words[i].substring(1));
        }  else if (i == len){
          inParan.push(words[i].slice(0,-1));
        } else{
        inParan.push(words[i]);
      }
    }
      // console.log("no Parans",inParan.join(' '))
      proficient.push(inParan.join(' '))
          }
        }
        proficient.shift();
      // need to check feats to see if proficient first.
      for (let i = 0; i< this.apiWeaponsArr.length; i++){
        if(this.apiWeaponsArr[i].w_type == 'Exotic Weapons (Ranged)' || this.apiWeaponsArr[i].w_type == 'Exotic Weapons (Melee)'){
          exoticsArr.push(this.apiWeaponsArr[i].name);
        }
      }
      // this.addOptionsArr = [...proficient];
    }    
    // toggles the view
    if(type == 'regular' && feat != "Force Training"){
      this.showRegFeatOptions = true;
    }else{
      this.showClassFeatOptions = true;
    }
  }else{
    this.showRegFeatOptions = false;
    this.showClassFeatOptions = false;   
  }
  for (let i = 0; i<this.apifeatsArr.length; i++){
  let split = feat.split(' ');
  let tempFeat = ((split[0] == 'Weapon' && split[1]=='Proficiency')? 'Weapon Proficiency': "");
    if (this.apifeatsArr[i].name == feat || this.apifeatsArr[i].name == tempFeat){
      if (type == 'regular'){
        this.featName =  (tempFeat == "")?this.apifeatsArr[i].name:feat;
        this.featDesc = this.apifeatsArr[i].description;
      }else{
        this.classFeatName = (tempFeat == "")?this.apifeatsArr[i].name:feat;
        this.classFeatDesc = this.apifeatsArr[i].description;
      }
      break;
    }else if (this.speciesFeats != undefined ){
      let keys = Object.keys(this.speciesFeats);
      let vals:any = Object.values(this.speciesFeats);
      for (let i=0; i < keys.length; i++){
        if (keys[i] == feat){
          if (type == 'regular'){
            this.featName = keys[i];
            this.featDesc = vals[i];
          }else{
            this.classFeatName = keys[i];
            this.classFeatDesc = vals[i];
          }
          break;
        }
      }
    }
}
}
checkSelections(key: string){
  switch(key){
    case "talent":
      if(this.unrestrictFlag == true && this.unrestrictFeat != "" || this.showAbs == false){
        this.lvlButton = true;
      }else{
        this.lvlButton = false;
      }
    break;
    case "feat":
      if(this.unrestrictFlag == true && this.unrestrictFeat != "" || this.showAbs == false){
        this.lvlButton = true;
      }else{
        this.lvlButton = false;
      }
    break;
    case "abs":
    if (this.increaseAbsCounter == 0){
      if(this.unrestrictFlag == true && this.unrestrictFeat != "" || this.unrestrictFlag == false){
          this.lvlButton = true;
        }
    }else{
      this.lvlButton = false;
    }  
    break
  }

}
addFeat(feat: string, option: string, unrestricted: string){
  if (feat == "Select" || option == "Select"){
    return;
  }
  let hfs = this.level.getHeroFeats();
  for (let i=0; i<this.classStartFeatsArr.length; i++){
    if (hfs.includes(this.classStartFeatsArr[i])){
      this.classStartFeatsArr.splice(i,1)
    }
  }
  if (feat == "Skill Focus" || feat == "Skill Training" ){
    this.updateSkills = true;
    this.skillValuetoUpdate = [feat,option];
  }
  let tempFeat;
  if (option == "none"){
    tempFeat = [feat];
  }else{
    tempFeat =[`${feat} (${option})`];
  }
  // console.log("current feats:", this.lvlUpObject.feats)
// need to get current feats and compare with starting feats should remove feats that character already has
if (unrestricted == 'yes'){
  this.unrestrictFlag = true;
  this.unrestrictFeat = tempFeat[0];
  this.lvlUpObject.feats = (this.classStartFeatsArr.length > 0)?[...this.classStartFeatsArr, ...tempFeat]:[...tempFeat]
}else{
  this.checkSelections('feat');
  if (this.unrestrictFlag == true){
    this.lvlUpObject.feats = (this.classStartFeatsArr.length > 0)?  [...this.classStartFeatsArr, this.unrestrictFeat, ...tempFeat]:  [this.unrestrictFeat, ...tempFeat];
  }else{
    this.lvlUpObject.feats = (this.classStartFeatsArr.length > 0)?  [...this.classStartFeatsArr, ...tempFeat]:  [...tempFeat];
  }
}
this.showForcePowers = (feat == "Force Training")? true:false;
if (feat != "Force Training"){this.heroservice.checkFeatPower()};
}
checkTimesLeveled(){
  let obj = this.level.getHeroClassObj();
 let vals: Array<number> = Object.values(obj);
 this.timesLeveled = vals.reduce((prev:any, curr)=> Number(prev) + Number(curr),0);
  // console.log("number of times", vals,this.timesLeveled)
}

// select a class when first leveling up
addClassSelection(selection: any){
  this.resetAllSelections("Select", 'no')
  this.showTalent = false;
  this.showClassFeat = false;
  this.showNoClassFeat = false;
  this.hpKeyWord = '';
  if (selection == "Select a Class"){
    this.lvlUpObject.class = '';
    return;
  }
  let curClass = Object.keys(this.level.getHeroClassObj());
  this.classSelection = selection;
  this.lvlUpObject.class = selection;
  this.rolledHp = 0;
  if (curClass.includes(selection)== false){
    this.addStartFeats(selection);
    // console.log("class obj:",curClass);
  }
  this.addClassFeatOptions(this.lvlUpObject.class);
}
// selects one of 2 methods on increasing hp
selectHPIncrease(selection: string){
  // console.log("the Selection:", selection);
  if (selection == "Select"){
    return;
  }
  this.hpKeyWord = selection;
}
// rolls hp based on die associated with class selected
rollHP(){
  let die = 0;
  for (let i =0; i<this.startingClasses.length; i++){
    if (this.classSelection == this.startingClasses[i].name){
      die = this.startingClasses[i].hp
      break;
    }
  }

 this.rolledHp = Math.floor(Math.random() * die + 1)
//  console.log("rolled", this.rolledHp, die);
 this.calcHPIncrease(this.rolledHp);
}
// calculates the hp based on the roll or the input recieved from user
calcHPIncrease(value: any){
let num = (isNaN(value))? value: Math.floor(parseInt(value));
let con = this.heroservice.getAbilityModifier()["Constitution"];
this.lvlUpObject.hp = ((num + con) >= 1)? num + con: 1;
// console.log("new hp", this.lvlUpObject.hp, num)
this.checkTimesLeveled();
this.checkHeroLvl();

}
displayCurrentAbs(flag : boolean){
  this.showAbs = flag;
  if (flag){
    this.abilities = this.heroservice.getAbilities();
  }
}
increaseAbsCounter: number = 2;
increaseAbs(e: any, key: any){
  if (this.lvlUpObject.abilities.includes(key)){
    this.increaseAbsCounter += 1;
    let index = this.lvlUpObject.abilities.findIndex((el: any)=> el == key);
    this.lvlUpObject.abilities.splice(index,1);
  }else if(this.increaseAbsCounter <= 0){
    e.target.checked = !e.target.checked
    // console.log("unchecked", e)
    return;
  }else{
    if (this.lvlUpObject.abilities[0] == ''){
      this.lvlUpObject.abilities.pop();
    }
  if (e.target.checked){
      this.lvlUpObject.abilities.push(key);
      this.increaseAbsCounter -= 1;
    }
  }
  this.checkSelections('abs');
  // console.log("the abs array", this.lvlUpObject.abilities)
}
//  force powers
forcePower: any;
selectedPower(power: any){
  if (power == "Select a Power" || power == undefined){
    this.forceName = "";
    this.forceDesc = "";
    return;
  }
  console.log("Chosen Power:" ,power);
  for (let i = 0; i< this.forcePowersArr.length; i++){
    if (this.forcePowersArr[i].name == power){
      this.forcePower = this.forcePowersArr[i];
      break;
    }
  }
  for (let i = 0; i< this.saberFormPowers.length; i++){
    if (this.saberFormPowers[i].name == power){
      this.forcePower = this.saberFormPowers[i];
      break;
    }
  }
      this.forceName = this.forcePower.name;
      this.forceDesc = this.forcePower.desc;
}

acceptPower(){
  if (this.numPowers > 0 && this.heroForceSuite.length < this.maxPowers){
    this.addPower(this.forcePower)
  }
}
addPower(power: any){
  this.heroForceSuite.push(power);
  this.numPowers -= 1
  console.log("the suite: ", this.heroForceSuite)
}
deletePower(index: number){
  this.heroForceSuite.splice(index, 1);
  this.numPowers += 1
}
clearPowers(){
   while (this.heroForceSuite.length){
    this.heroForceSuite.pop();
    this.numPowers += 1
  }
  console.log("cleared arr:",  this.heroForceSuite)
}



levelUpHero(){
  let skills = this.heroservice.getSkills();
  if (this.updateSkills == true){
    let index = skills.findIndex((el: any)=> el.skill_name == this.skillValuetoUpdate[1])
    if (this.skillValuetoUpdate[0] == "Skill Focus" ){
      skills[index].skill_focus = true;
    }else if (this.skillValuetoUpdate[0] == "Skill Training"){
      console.log('the index:',index)
      skills[index].trained_skill = true;
    }else{
      skills[index][this.skillValuetoUpdate[0]] = true;
    }
    this.heroservice.setSkills(skills);
  }
  // (this.heroForceSuite.length > 0)? this.heroservice.addForcePowers(this.heroForceSuite):'nothing';
 // adds the Use the Force skill to the skills array
//  console.log('the skills',skills);
  if (this.lvlUpObject.class == "Jedi" && skills.length < 24 || this.lvlUpObject.feats.includes("Force Sensitivity")){
    let jediSkill = {
      "skill_name": 'Use the Force',
      "skill_value": 0, 
      "default": 'Charisma', 
      "trained_skill": false,
      "skill_focus": false,
      "misc": 0,
    }
    skills.push(jediSkill);
    this.heroservice.setSkills(skills);
  }
  if (this.lvlUpObject.feats.includes("")){
    // console.log("it's there");
    this.lvlUpObject.feats.pop();
  }
  if (this.lvlUpObject.abilities.length == 2 && this.lvlUpObject.abilities.includes("") == false){
    this.heroservice.increaseAbilities(this.lvlUpObject.abilities);
  }
  // console.log("leveling this", this.lvlUpObject, this.heroForceSuite);
  this.levelUpModal = false;
  this.heroLvlUpObj.emit(this.lvlUpObject);
  this.lvlUpObject = {
    "class" : "",
    "BAB" : 0,
    "hp"  : 0,
    "feats" : [""],
    "talents" : {"name" : "", "description": "","alias": ""},
    "abilities" : [""],
  }
 this.resetAllSelections("Select", 'yes')
 //connect to a service to have the other components update
}
resetAllSelections(reset: string, cs: string){
  if (cs == 'yes'){
    this.addClassSelection("Select a Class");
  }
  this.selectHPIncrease(reset);
  this.selectFeat(reset, 'regular');
  this.addFeat(reset, 'none', 'yes');
  this.selectTalent(reset);
  this.addTalent(reset, 'none')
  this.showAbs = false;
  this.showNoClassFeat = false;
  this.lvlButton = false;
  this.unrestrictFlag = false;
  this.unrestrictFeat = "";
}
}
