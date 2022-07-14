import { Component, OnInit } from '@angular/core';
import { ChoicesSenderService } from 'src/app/services/choices-sender.service';
import { SwapiService } from 'src/app/services/swapi.service';

@Component({
  selector: 'feats',
  templateUrl: './feats.component.html',
  styleUrls: ['./feats.component.scss']
})
export class FeatsComponent implements OnInit {

  constructor(private swApiService: SwapiService, private choices: ChoicesSenderService) { }
featsArray: any;
startingFeats: Array<string> = [];
selectedFeats: Array<string> = [];
selectedHeroicClass = this.choices.selectedClass;


  ngOnInit(): void {
    this.swApiService.getFeats().subscribe(payload =>{
      this.featsArray = payload;
      console.log("feats: ", this.featsArray);
    })
    
  }

  // Acquires the Starting Feats for the chosen class
acquireFeats(heroicClass: string){
let tempString = '';
let bab;
let int = 13;
let  con = 13;
let skillArray = this.choices.skills;
  switch (heroicClass) {
    case "Jedi":
      bab = 1;
      tempString = "Force Sensitivity, Weapon Proficiency (Lightsabers), Weapon Proficiency (Simple Weapons)";
      break;
    case "Noble":
      if (int >= 13){
        bab = 0;
        tempString = "Linguist, Weapon Proficiency (Pistols), Weapon Proficiency (Simple Weapons)";
      }else {
        tempString = "Weapon Proficiency (Pistols), Weapon Proficiency (Simple Weapons)";
      }
      break;
      case "Scoundrel":
        bab = 0;
        tempString = "Point-Blank Shot, Weapon Proficiency (Pistols), Weapon Proficiency (Simple Weapons)";
      break;
      case "Scout":
        bab = 0;
      if (con >= 13 && skillArray.includes("Endurance")){
        tempString = "Shake It Off, Weapon Proficiency (Pistols), Weapon Proficiency (Rifles), Weapon Proficiency (Simple Weapons)";

      } else {
        tempString = "Weapon Proficiency (Pistols), Weapon Proficiency (Rifles), Weapon Proficiency (Simple Weapons)";
      }
      break;
      case "Soldier":
        bab = 1;
        tempString = "Armor Proficiency (Light), Armor Proficiency (Medium), Weapon Proficiency (Pistols), Weapon Proficiency (Rifles), Weapon Proficiency (Simple Weapons)";
      break;
    default:
      tempString = ",";
      break;
  }
    this.choices.bab = bab;
    this.startingFeats = tempString.split(",");
    console.log('starting feats', this.startingFeats, this.choices.bab)
  
}

}
