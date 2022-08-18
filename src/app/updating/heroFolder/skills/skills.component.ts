import { Component, OnInit, Input, Output } from '@angular/core';
import { faCheckSquare, faSquare} from '@fortawesome/free-solid-svg-icons';
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
@Input() heroLevel: number = 0;
// variables
heroCondition: number = 0;
heroSkills: Array <any> = [];
faUncheck = faSquare;
faChecked= faCheckSquare;
abilityModifier: any;
modOptions: Array <string> = [];
stealthSizeMod:number = 0;


  ngOnInit(): void {
this.chosenSkills.forEach((el:any)=> {
  el["misc"] = 0;
})
this.heroSkills = this.chosenSkills;
console.log(this.heroSkills);
this.performGetters();
this.heroservice.invokeConditions.subscribe(() => {   
  this.getHeroCondition();
});
  }
getHeroCondition(){
  this.heroCondition = this.heroservice.getCondition();
  this.heroSkills.forEach((el: any)=> {
    this.calcSkillValue(el.skill_name, el.default, el.misc);
  })
}
performGetters(){
  this.modOptions = this.heroservice.getModOptions();
  this.stealthSizeMod = this.heroservice.getstealthSizeMod();
  this.heroSkills.forEach((el: any)=> {
    this.calcSkillValue(el.skill_name, el.default, el.misc);
  })
}
collectSkillMod(index: any, selection: any){
  if (selection.target.value == "Select"){
    return;
  }
  console.log("collecting skill", index, selection.target.value)
  let mod = selection.target.value
  this.heroSkills[index].default = selection.target.value;
  this.calcSkillValue(this.heroSkills[index].skill_name, mod, this.heroSkills[index].misc);
}
collectMisc(index: any, misc:any){
  console.log("collecting Misc", index, misc)

  this.heroSkills[index].misc = parseInt(misc);
  this.calcSkillValue(this.heroSkills[index].skill_name, this.heroSkills[index].default, parseInt(misc))
}
updateAbilities(){
  this.abilityModifier = this.heroservice.getAbilityModifier();
  // console.log("ab mods", this.abilityModifier)
}
calcSkillValue(skill: string, mod:string, misc:number){
  this.updateAbilities();
  // console.log("what we got", skill, mod, misc);
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
    this.heroSkills[i].skill_value = (Math.floor(this.heroLevel/2)) + this.abilityModifier[mod] + t + f + misc + this.heroCondition;
    if (skill == "Stealth"){
      this.heroSkills[i].skill_value =+ this.stealthSizeMod 
    }
  // console.log("the value computed:",  this.abilityModifier[mod], t,f, misc)
    }

  }
}




}
