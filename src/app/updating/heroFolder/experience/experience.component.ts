import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'experience',
  templateUrl: './experience.component.html',
  styleUrls: ['./experience.component.scss']
})
export class ExperienceComponent implements OnInit {
heroClass: any;
startingClasses = [
  {
    "name" : "Jedi",
    "defenses" : {
      "reflex" : 1,
      "fortitude" : 1,
      "will"  : 1,
    },
    "feats" : ["Force Sensitivity", "Weapon Proficiency (Lightsabers)", "Weapon Proficiency (Simple Weapons)"],
    "BAB" : 1,
    "hp" : 10,
  },
 {
  "name" : "Noble", 
    "defenses" : {
      "reflex" : 1,
      "fortitude" : 0,
      "will"  : 2,
    },
    "feats" : ["Linguist","Weapon Proficiency (Pistols)","Weapon Proficiency (Simple Weapons)"],
    "BAB" : 0,
    "hp" : 6 
  }, 
   {
    "name"  : "Scoundrel",
    "defenses" : {
      "reflex" : 2,
      "fortitude" : 0,
      "will"  : 1,
    },
    "feats" : ["Point-Blank Shot","Weapon Proficiency (Pistols)","Weapon Proficiency (Simple Weapons)"],
    "BAB" : 0,
    "hp"  : 6,
  },
   {
    "name"  : "Scout",
    "defenses" : {
      "reflex" : 2,
      "fortitude" : 1,
      "will"  : 0,
    },
    "feats" : ["Shake It Off","Weapon Proficiency (Pistols)","Weapon Proficiency (Rifles)","Weapon Proficiency (Simple Weapons)"],
    "BAB" : 0,
    "hp"  : 8,
  },
   {
    "name"  : "Soldier",
    "defenses" : {
      "reflex" : 1,
      "fortitude" : 2,
      "will"  : 0,
    },
    "feats" : ["Armor Proficiency (Light)","Armor Proficiency (Medium)","Weapon Proficiency (Pistols)","Weapon Proficiency (Rifles)","Weapon Proficiency (Simple Weapons)"],
    "BAB" : 1,
    "hp"  : 10,
  }
]
  

  constructor() { }

  ngOnInit(): void {
  }



addClass(selection : string){
  
  for (let i = 0; i<this.startingClasses.length; i++){

  }

}




}
