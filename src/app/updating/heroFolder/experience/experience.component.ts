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
@Input() levelUp: boolean = false;
heroClass: any;
currentfeatsArr: any;
currentTalentsArr: any;
importFeatsArr: any;
importTalentsArr: any;
levelPts: number = 0;
currentXp: number = 0;
nextXp: number = 0;
timesLeveled: number = 0;
levelUpModal: boolean = false;
hpKeyWord: string = '';
rolledHp: number = 0;
classSelection: string = '';
lvlUpObject = {
  "class" : "",
  "hp"  : 0,
}
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
    "class_Feats" : ["Acrobatic Strike","Cleave","Combat Reflexes","Dodge","Double Attack","Dreadful Rage","Dual Weapon Mastery I","Dual Weapon Mastery II","Dual Weapon Mastery III","Great Cleave","Improved Charge","Improved Disarm","Martial Arts I","Martial Arts II","Martial Arts III","Melee Defense","Mobility","Power Attack","Powerful","Charge","Quick Draw","Rapid Strike","Running Attack","Skill Focus","Skill Training","Strong in the Force","Triple Attack","Triple Crit","Weapon Finesse","Weapon Focus","Accelerated Strike","Critical Strike","Flurry","Force Readiness","Improved Rapid Strike","Tumble Defense","Withdrawal Strike","Savage Attack","Swarm","Burst of Speed","Close Combat Escape","Impetuous Move","Impulsive Flight","Lightning Draw","Opportunistic Retreat","Resurgence","Slippery Maneuver","Stay Up","Tactical Advantage","Wicked Strike","Unstoppable Force","Unwavering Resolve","Wary Defender","Attack Combo (Melee)","Brink of Death","Feat of Strength","Grapple Resistance","Assured Attack","Deft Charge","Fast Surge","Moving Target","Rapid Reaction","Recovering Surge","Battering Attack","Dive for Cover","Fight Through Pain","Force of Personality","Mission Specialist","Never Surrender","Officer Candidacy Training","Resilient Strength","Risk Taker","Staggering Attack","Brilliant Defense","Resolute Stance","Stand Tall","Unknown Regions","Elder's Knowledge","Instinctive Attack","Instinctive Defense"],
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
babArr = {
  "normal" : [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],
  "special" : [0,0,1,2,3,3,4,5,6,6,7,8,9,9,10,11,12,12,13,14,15],
}
/*
0,1,2,3,3,4,5,6,6,7,8,9,9,10,11,12,12,13,14,15
*/
  constructor(private heroservice : HeroService, private swapi : SwapiService, private level : LevelingService) { }

  ngOnInit(): void {
    this.swapi.getFeats().subscribe((feats)=> {
      this.importFeatsArr = feats;
    })
    this.swapi.getTalents().subscribe((talents) =>{
      this.importTalentsArr = talents
    })
    this.level.invokeGetXp.subscribe(() => {
      this.getXp();
    })
  }




// check hero level to see if it's every 3rd level and return the answer
checkTimesLeveled(){
  let obj = this.level.getHeroClassObj();
 let vals: Array<number> = Object.values(obj);
 this.timesLeveled = vals.reduce((prev:any, curr)=> Number(prev) + Number(curr),0);
  console.log("number of times", vals,this.timesLeveled)
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
  this.classSelection = selection;
  this.lvlUpObject.class = selection;
  this.rolledHp = 0;
}
selectHPIncrease(selection: string){
  console.log("the Selection:", selection);
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
 console.log("rolled", this.rolledHp, die);
 this.calcHPIncrease(this.rolledHp);
}
calcHPIncrease(value: any){
let num = (isNaN(value))? value: Math.floor(parseInt(value));
let con = this.heroservice.getAbilityModifier()["Constitution"];
this.lvlUpObject.hp = ((num + con) >= 1)? num + con: 1;
console.log("new hp", this.lvlUpObject.hp, num)
this.checkTimesLeveled();
}


}
