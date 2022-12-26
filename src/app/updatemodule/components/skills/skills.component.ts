import { Component, OnInit, Input, Output } from '@angular/core';
import { faCheckSquare} from '@fortawesome/free-solid-svg-icons';
import { faSquare } from '@fortawesome/free-regular-svg-icons';
import { HeroService } from '../../services/hero.service';

@Component({
  selector: 'update-skills',
  templateUrl: './skills.component.html',
  styleUrls: ['./skills.component.scss']
})
export class UpdateSkillsComponent implements OnInit {

  constructor(private heroservice:HeroService) { }
// Inputs
@Input() chosenSkills: Array <any> = [];
// variables
heroLevel: number = 0;
heroCondition: number = 0;
heroSkills: Array <any> = [];
faChecked= faCheckSquare;
faUnchecked = faSquare;
abilityModifier: any;
modOptions: Array <string> = [];
stealthSizeMod:number = 0;

  ngOnInit(): void {
this.chosenSkills.forEach((el:any)=> {
  el["misc"] = 0;
})
this.heroSkills = this.chosenSkills;
// console.log(this.heroSkills);
this.performGetters();
this.heroservice.invokeConditions.subscribe(() => {   
  this.getHeroCondition();
});
this.heroservice.invokeSkills.subscribe(() => {
  this.heroSkills.forEach((el: any)=> {
    this.calcSkillValue(el.skill_name, el.default, el.misc, 0);
  })
});

  }
getHeroCondition(){
  this.heroCondition = this.heroservice.getCondition();
  this.heroSkills.forEach((el: any)=> {
    this.calcSkillValue(el.skill_name, el.default, el.misc, 0);
  })
}
performGetters(){
  this.modOptions = this.heroservice.getModOptions();
  this.stealthSizeMod = this.heroservice.getstealthSizeMod();
  this.heroSkills.forEach((el: any)=> {
    this.calcSkillValue(el.skill_name, el.default, el.misc, 0);
  })
}

/*
"Acrobatic"s,"Climb","Endurance","Initiative","Jump","Stealth","Swim"
*/
checkWorn(armor : any){
  let penalty = 0;
  let skillsAffected = ["Acrobatics","Climb","Endurance","Initiative","Jump","Stealth","Swim"]
  if(armor.worn == true && armor.proficient == false){
    switch (armor.armor_type) {
      case "Light Armor":
        penalty = -2
      break;
      case "Medium Armor":
        penalty = -5
      break;
      case "Heavy Armor":
      penalty = -10
      break;
    } 
  }
  this.heroSkills.forEach((el: any)=> {
    (skillsAffected.includes(el.skill_name)== true)?this.calcSkillValue(el.skill_name, el.default, el.misc, penalty): "nothing";
  })
}
collectSkillMod(index: any, selection: any){
  if (selection.target.value == "Select"){
    return;
  }
  // console.log("collecting skill", index, selection.target.value)
  let mod = selection.target.value
  this.heroSkills[index].default = selection.target.value;
  this.calcSkillValue(this.heroSkills[index].skill_name, mod, this.heroSkills[index].misc, 0);
}
collectMisc(index: any, misc:any){
  // console.log("collecting Misc", index, misc)

  this.heroSkills[index].misc = parseInt(misc);
  this.calcSkillValue(this.heroSkills[index].skill_name, this.heroSkills[index].default, parseInt(misc), 0)
}
updateAbilities(){
  this.abilityModifier = this.heroservice.getAbilityModifier();
  // console.log("ab mods", this.abilityModifier)
}
async calcSkillValue(skill: string, mod:string, misc:number, penalty: number){
  this.updateAbilities();
  this.heroLevel = this.heroservice.getHeroLevel();
  // console.log("what we got", skill, mod, misc, penalty);
  for (let i=0; i<this.heroSkills.length;i++){
    // console.log("the skill:", this.heroSkills[i].skill_name, skill)
    if (this.heroSkills[i].skill_name == skill){
    let t =0;
    let f= 0;
    if (this.heroSkills[i].trained_skill == true){
      t = 5
    }
    if (this.heroSkills[i].skill_focus == true){
      f = 5
    }
    this.heroSkills[i].skill_value = Math.floor(this.heroLevel/2) + this.abilityModifier[mod] + t + f + misc + this.heroCondition + penalty;
    if (skill == "Stealth"){
      this.heroSkills[i].skill_value += this.stealthSizeMod;
    }
  // console.log("the value computed:",this.heroSkills[i].skill_value, "herolevel", this.heroLevel,  this.abilityModifier[mod], t,f, misc)
    }

  }
}




}
