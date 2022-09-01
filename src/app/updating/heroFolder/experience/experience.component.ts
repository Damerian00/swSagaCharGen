import { Component, OnInit, Input } from '@angular/core';
import { SwapiService } from 'src/app/services/swapi.service';
import { HeroService } from '../../services/hero.service';
import { LevelingService } from '../../services/leveling.service';

@Component({
  selector: 'experience',
  templateUrl: './experience.component.html',
  styleUrls: ['./experience.component.scss']
})
export class ExperienceComponent implements OnInit {
//  ---Variables
//  Input/Output
  @Input() levelUp: boolean = false;
//  Arrays
currentfeatsArr: any;
classStartFeatsArr: Array<string> = [];
currentTalentsArr: any;
apifeatsArr: any;
apiTalentsArr: any;
apiWeaponsArr: Array<any> = [];
apiMeleeArr : Array<any> = [];
apiRangedArr: Array<any> = [];
importFeatsArr: Array<any> = [];
addOptionsArr: Array<string> = [];
importTalentsArr: any;
availablePrestigeClasses = [];
startingClasses = [
  {
    "name" : "Jedi",
    "defenses" : {
      "reflex" : 1,
      "fortitude" : 1,
      "will"  : 1,
    },
    "start_feats" : ["Force Sensitivity", "Weapon Proficiency (Lightsabers)", "Weapon Proficiency (Simple Weapons)"],
    "BAB" : 1,
    "hp" : 10,
    "babId" : "normal",
    "class_Feats" : ["Acrobatic Strike","Cleave","Combat Reflexes","Dodge","Double Attack","Dreadful Rage","Dual Weapon Mastery I","Dual Weapon Mastery II","Dual Weapon Mastery III","Great Cleave","Improved Charge","Improved Disarm","Martial Arts I","Martial Arts II","Martial Arts III","Melee Defense","Mobility","Power Attack","Powerful Charge","Quick Draw","Rapid Strike","Running Attack","Skill Focus","Skill Training","Strong in the Force","Triple Attack","Triple Crit","Weapon Finesse","Weapon Focus","Accelerated Strike","Critical Strike","Flurry","Force Readiness","Improved Rapid Strike","Tumble Defense","Withdrawal Strike","Savage Attack","Swarm","Burst of Speed","Close Combat Escape","Impetuous Move","Impulsive Flight","Lightning Draw","Opportunistic Retreat","Resurgence","Slippery Maneuver","Stay Up","Tactical Advantage","Wicked Strike","Unstoppable Force","Unwavering Resolve","Wary Defender","Attack Combo (Melee)","Brink of Death","Feat of Strength","Grapple Resistance","Assured Attack","Deft Charge","Fast Surge","Moving Target","Rapid Reaction","Recovering Surge","Battering Attack","Dive for Cover","Fight Through Pain","Force of Personality","Mission Specialist","Never Surrender","Officer Candidacy Training","Resilient Strength","Risk Taker","Staggering Attack","Brilliant Defense","Resolute Stance","Stand Tall","Elder's Knowledge","Instinctive Attack","Instinctive Defense"],
  },
 {
  "name" : "Noble", 
    "defenses" : {
      "reflex" : 1,
      "fortitude" : 0,
      "will"  : 2,
    },
    "start_feats" : ["Linguist","Weapon Proficiency (Pistols)","Weapon Proficiency (Simple Weapons)"],
    "BAB" : 0,
    "hp" : 6, 
    "babId" : "special",
    "class_Feats" : ["Armor Proficiency (Light)","Cybernetic Surgery","Exotic Weapon Proficiency","Linguist","Melee Defense","Skill Focus","Skill Training","Surgical Expertise","Weapon Finesse","Weapon Proficiency (Advanced Melee Weapons)","Weapon Proficiency (Rifles)","Tech Specialist","Flurry","Quick Skill","Informer","Rapport","Recall","Cornered","Friends in Low Places","Hasty Modification","Impulsive Flight","Opportunistic Retreat","Signature Device","Superior Tech","Tactical Advantage","Wicked Strike","Experienced Medic","Leader of Droids","Unwavering Resolve","Wary Defender","Biotech Specialist","Biotech Surgery","Return Fire","Returning Bug","Fast Surge","Rapid Reaction","Recovering Surge","Disabler","Fight Through Pain","Force of Personality","Mission Specialist","Predictive Defense","Sport Hunter","Brilliant Defense","Cut the Red Tape","Demoralizing Strike","Disturbing Presence","Expert Briber","Flèche","Indomitable Personality","Master of Disguise","Sadistic Strike","Silver Tongue","Stand Tall","Combat Trickery","Elder's Knowledge","Intimidator","Mounted Combat"],
  }, 
   {
    "name"  : "Scoundrel",
    "defenses" : {
      "reflex" : 2,
      "fortitude" : 0,
      "will"  : 1,
    },
    "start_feats" : ["Point-Blank Shot","Weapon Proficiency (Pistols)","Weapon Proficiency (Simple Weapons)"],
    "BAB" : 0,
    "hp"  : 6,
    "babId" : "special",
    "class_Feats" : ["Deadeye","Dodge","Melee Defense","Mobility","Precise Shot","Quick Draw","Rapid Shot","Running Attack","Skill Focus","Skill Training","Vehicular Combat","Weapon Proficiency (Advanced Melee Weapons)","Tech Specialist","Gearhead","Implant Training","Poison Resistance","Quick Skill","Sniper Shot","Advantageous Attack","Advantageous Cover","Bad Feeling","Crossfire","Cunning Attack","Scavenger","Burst of Speed","Close Combat Escape","Collateral Damage","Cornered","Deceptive Drop","Desperate Gambit","Duck and Cover","Fleet-Footed","Friends in Low Places","Hasty Modification","Impulsive Flight","Knife Trick","Lightning Draw","Signature Device","Superior Tech","Droidcraft","Droid Hunter","Expert Droid Repair","Overwhelming Attack","Attack Combo (Ranged)","Biotech Specialist","Fatal Hit","Return Fire","Vehicle Systems Expertise","Zero Range","Fast Surge","Moving Target","Prime Shot","Rapid Reaction","Recovering Surge","Vehicular Surge","Bantha Herder","Disabler","Fight Through Pain","Force of Personality","Mission Specialist","Opportunistic Shooter","Pistoleer","Predictive Defense","Steadying Position","Disturbing Presence","Expert Briber","Hobbling Strike","Improved Opportunistic Trickery","Indomitable Personality","Master of Disguise","Opportunistic Trickery","Sadistic Strike","Silver Tongue","Stand Tall","Acrobatic Ally","Acrobatic Dodge","Combat Trickery","Hold Together","Improved Sleight of Hand"],
  },
   {
    "name"  : "Scout",
    "defenses" : {
      "reflex" : 2,
      "fortitude" : 1,
      "will"  : 0,
    },
    "start_feats" : ["Shake It Off","Weapon Proficiency (Pistols)","Weapon Proficiency (Rifles)","Weapon Proficiency (Simple Weapons)"],
    "BAB" : 0,
    "hp"  : 8,
    "babId" : "special",
    "class_Feats" : ["Armor Proficiency (Heavy)","Armor Proficiency (Light)","Armor Proficiency (Medium)","Careful Shot","Deadeye","Dodge","Far Shot","Linguist","Mobility","Point-Blank Shot","Precise Shot","Rapid Shot","Running Attack","Skill Focus","Skill Training","Sniper","Vehicular Combat","Weapon Proficiency (Advanced Melee Weapons)","Conditioning","Gearhead","Increased Agility","Poison Resistance","Advantageous Attack","Advantageous Cover","Bad Feeling","Cunning Attack","Burst of Speed","Cornered","Deadly Sniper","Duck and Cover","Fleet-Footed","Resurgence","Slippery Maneuver","Stay Up","Droidcraft","Droid Hunter","Expert Droid Repair","Flash and Clear","Attack Combo (Ranged)","Fatal Hit","Feat of Strength","Grapple Resistance","Return Fire","Vehicle Systems Expertise","Deft Charge","Fast Surge","Moving Target","Prime Shot","Rapid Reaction","Rebel Military Training","Recovering Surge","Vehicular Surge","Destructive Force","Disabler","Dive for Cover","Forceful Blast","Fortifying Recovery","Mission Specialist","Never Surrender","Opportunistic Shooter","Pistoleer","Resilient Strength","Riflemaster","Risk Taker","Sport Hunter","Steadying Position","Grazing Shot","Hobbling Strike","Meat Shield","Stand Tall","Hold Together","Hyperblazer","Improvised Weapon Mastery","Maniacal Charge","Mounted Combat","Targeted Area","Trample","Wilderness First Aid"],
  },
   {
    "name"  : "Soldier",
    "defenses" : {
      "reflex" : 1,
      "fortitude" : 2,
      "will"  : 0,
    },
    "start_feats" : ["Armor Proficiency (Light)","Armor Proficiency (Medium)","Weapon Proficiency (Pistols)","Weapon Proficiency (Rifles)","Weapon Proficiency (Simple Weapons)"],
    "BAB" : 1,
    "hp"  : 10,
    "babId" : "normal",
    "class_Feats" : ["Armor Proficiency (Heavy)","Bantha Rush","Careful Shot","Charging Fire","Cleave","Combat Reflexes","Coordinated Attack","Crush","Deadeye","Double Attack","Dual Weapon Mastery I","Dual Weapon Mastery II","Dual Weapon Mastery III","Exotic Weapon Proficiency","Far Shot","Great Cleave","Improved Charge","Improved Disarm","Martial Arts I","Martial Arts II","Martial Arts III","Melee Defense","Mighty Swing","Pin","Point-Blank Shot","Power Attack","Precise Shot","Quick Draw","Rapid Shot","Rapid Strike","Running Attack","Shake It Off","Skill Focus","Skill Training","Sniper","Throw","Toughness","Trip","Triple Attack","Triple Crit","Vehicular Combat","Weapon Focus","Weapon Proficiency (Advanced Melee Weapons)","Weapon Proficiency (Heavy Weapons)","Accelerated Strike","Conditioning","Critical Strike","Flurry","Improved Rapid Strike","Increased Agility","Power Blast","Sniper Shot","Tumble Defense","Withdrawal Strike"],
  }
]

//  Objects
lvlUpObject = {
  "class" : "",
  "BAB" : 0,
  "hp"  : 0,
  "feat" : [""],
  "talent" : [""],
}
babArr = {
  "normal" : [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],
  "special" : [0,0,1,2,3,3,4,5,6,6,7,8,9,9,10,11,12,12,13,14,15],
}
validatedArr: Array<boolean> = [];
//  Boolean
levelUpModal: boolean = false;
showClassFeat: boolean = false;
showNoClassFeat: boolean = false;
showTalent: boolean = false;
lvlButton: boolean = false;
showAddOptions: boolean = false;
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
talentName: string = '';
talentDesc: string = '';
// heroClass: any;
/*
0,1,2,3,3,4,5,6,6,7,8,9,9,10,11,12,12,13,14,15
*/
  constructor(private heroservice : HeroService, private swapi : SwapiService, private level : LevelingService) { }

  ngOnInit(): void {
    this.swapi.getFeats().subscribe((feats)=> {
      this.apifeatsArr = feats;
      // console.log(this.apifeatsArr);
    })
    this.swapi.getTalents().subscribe((talents) =>{
      this.apiTalentsArr = talents
    })
    this.swapi.getMelees().subscribe((melee)=> {
      this.apiMeleeArr = [...melee];
    })
    this.swapi.getRanged().subscribe((ranged)=> {
      this.apiRangedArr = [...ranged];
    })
    this.level.invokeGetXp.subscribe(() => {
      this.getXp();
    })
    setTimeout(() => {
      this.apiWeaponsArr = [...this.apiMeleeArr, ...this.apiRangedArr];
      }, 500);
    
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
async showAvailable(feat : any, arr: Array<any>){
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
    if (vals[0].includes("none")){
      this.importFeatsArr.push(feat);
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
        this.importFeatsArr.push(feat)
      };
    }
    
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
          }else{
           valid = (feats[i] == apiValue)? true: false;
          }
        }        
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
  // console.log(feat,":",apiValue, "/",keyWord,"/",valid)
  return valid;
}
//  displays classs feats that aren't already on the character
addClassFeatOptions(heroClass : string){
  this.clearArr(this.importFeatsArr);
  let currFeats = this.level.getHeroFeats();
  let index = this.startingClasses.findIndex((el: any)=> el.name == heroClass);
  let newFeats = this.startingClasses[index].class_Feats;
  this.lvlUpObject.BAB = (this.level.getBAB() + this.startingClasses[index].BAB)
  // console.log(this.lvlUpObject.BAB,this.level.getBAB(), "+", this.startingClasses[index].BAB )
  for (let i=0; i< newFeats.length; i++){
    if(currFeats.includes(newFeats[i]) == false){
      this.showAvailable(newFeats[i], this.apifeatsArr)
    }
  }
  console.log("show me feats",currFeats, this.importFeatsArr);
}
//  adds to a starting feats array when choosing a new class to multiclass with
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
  console.log("show me start feats",currFeats, this.classStartFeatsArr);
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
addTalentOptions(){

}

selectFeat(feat: string){
  if (feat == "Select"){
    return;
  } 
  this.clearArr(this.addOptionsArr);
  let skillsTrained = [];
  let skillsFocused = [];
  
  if (feat == "Skill Focus" || feat == "Skill Training" || feat == "Weapon Focus"){
    if (feat != "Weapon Focus"){
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
      let exoticsArr = [];
      let wepGrps = ["Advanced Melee Weapons","Heavy Weapons","Lightsabers","Pistols","Rifles","Grenades","Simple Weapons (Melee)","Simple Weapons (Ranged)" ]
      let proficient = [""];
      let feats = [...this.level.getHeroFeats(), ...this.classStartFeatsArr];
      for (let i =0; i < feats.length; i++){
        let words = feats[i].split(' ')
        console.log("these are current feats", words);
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
      console.log("no Parans",inParan.join(' '))
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
  
      this.addOptionsArr = [...proficient];
    }
    
    
    this.showAddOptions = true;
  }else{
    this.showAddOptions = false
    
  }
  for (let i = 0; i<this.apifeatsArr.length; i++){
    let splitter = feat.split('Weapon Proficiency');
  let tempFeat = ((splitter[0]== '')? 'Weapon Proficiency': "nope");
    if (this.apifeatsArr[i].name == feat || this.apifeatsArr[i].name == tempFeat){
      this.featName = (splitter[0]== '')? feat : this.apifeatsArr[i].name;
      this.featDesc = this.apifeatsArr[i].description;
      break;
    }
}
}
addFeat(feat: string, option: string){
  let tempFeat;
  if (feat == "Select" || option == "Select"){
    return;
  }else if (option == "none"){
    tempFeat = [feat];
  }else{
    tempFeat =[`${feat} (${option})`];
  }
  (this.classStartFeatsArr.length > 0)? this.lvlUpObject.feat = [...this.classStartFeatsArr, ...tempFeat] : this.lvlUpObject.feat = [...tempFeat]
}
checkTimesLeveled(){
  let obj = this.level.getHeroClassObj();
 let vals: Array<number> = Object.values(obj);
 this.timesLeveled = vals.reduce((prev:any, curr)=> Number(prev) + Number(curr),0);
  // console.log("number of times", vals,this.timesLeveled)
}
thirdLevelFeat(){
  let num =this.heroservice.getHeroLevel();
  if (num % 3 === 0){
    return true;
  }else{
    return false;
  }
}
everyFourth(){
  let num = this.heroservice.getHeroLevel();
  if (num % 4 === 0){
    return true;
  }else{
    return false;
  }
}
getXp(){
  this.currentXp = this.level.getCurrentXp();
  this.nextXp = this.level.getNextXp();
}
beginLevelUp(){
  this.levelUpModal = true;
}
addClassSelection(selection: any){
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
    console.log("class obj:",curClass);
  }
  this.addClassFeatOptions(this.lvlUpObject.class);
}
selectHPIncrease(selection: string){
  // console.log("the Selection:", selection);
  if (selection == "Select"){
    return;
  }
  this.hpKeyWord = selection;
}
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
calcHPIncrease(value: any){
let num = (isNaN(value))? value: Math.floor(parseInt(value));
let con = this.heroservice.getAbilityModifier()["Constitution"];
this.lvlUpObject.hp = ((num + con) >= 1)? num + con: 1;
// console.log("new hp", this.lvlUpObject.hp, num)
this.checkTimesLeveled();
this.showClassFeat = true;
}


}
