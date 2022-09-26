import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { HeroService } from '../../services/hero.service';

@Component({
  selector: 'defenses',
  templateUrl: './defenses.component.html',
  styleUrls: ['./defenses.component.scss']
})
export class DefensesComponent implements OnInit {
  //  ---Variables ---
  @Input() heroLevel = 0;
  @Output() defenses: EventEmitter<Object> = new EventEmitter<Object>()
  heroCondition = 0;
  reflexDefense = 10;
  reflexClassBonus = 0;
  speciesReflexDefenseMod = 0;
  improvedReflex: number = 0;
  fortitudeDefense = 10
  speciesFortDefenseMod = 0;
  fortClassBonus= 0;
  improvedFort:number = 0;
  speciesWillDefenseMod = 0;
  willDefense = 0;
  willClassBonus = 0;
  improvedWill:number = 0;
  traits: any;
  currentArmor: any;
  heroDefenses: any = [{"name": "Reflex Defense", "total": 10, "default" : "Dexterity", "class": 0, "misc" : 0, "level" : 0},{"name": "Fortitude Defense", "total": 10, "default" : "Constitution","class": 0, "misc" : 0, "level" : 0},{"name": "Will Defense", "total": 10, "default" : "Wisdom", "class": 0, "misc" : 0, "level" : 0}]
  abModOptions: any = this.heroservice.abModOptions;
 // -- end of Variables

  constructor(private heroservice: HeroService) { }
//  starts the calculations for the variables and supscribes to the services
  ngOnInit(): void {
    
    
    this.getValues();
    this.resetDefenses();
    // this.calculateDefenses( this.heroDefenses[0].name, this.heroDefenses[0].default);
    // this.calculateDefenses(this.heroDefenses[1].name, this.heroDefenses[1].default);
    // this.calculateDefenses(this.heroDefenses[2].name, this.heroDefenses[2].default);
    this.defenses.emit(this.heroDefenses);
    this.heroservice.invokeConditions.subscribe(() => {   
      this.getHeroCondition();
    }); 
    
  }
// updates the defenses when the condition changes
getHeroCondition(){
  this.heroCondition = this.heroservice.getCondition();
  this.calculateDefenses( this.heroDefenses[0].name, this.heroDefenses[0].default);
  this.calculateDefenses(this.heroDefenses[1].name, this.heroDefenses[1].default);
  this.calculateDefenses(this.heroDefenses[2].name, this.heroDefenses[2].default);
}
//  updates defenses based on checkboxes beign selected on the armor
async updateArmor(armor: any){
  // console.log("recieved armor", armor);
  (armor == "nothing")? "nothing" : this.currentArmor = await armor;
  if (this.currentArmor.worn == true){
    if (this.currentArmor.worn == true && this.currentArmor.proficient == true && this.currentArmor.def == true && this.currentArmor.improved_def == true){
      this.heroDefenses[0].level = ((this.heroLevel + Math.floor(this.currentArmor.ref_def_bonus/2)) < armor.ref_def_bonus)? this.currentArmor.ref_def_bonus: (this.heroLevel + Math.floor(this.currentArmor.ref_def_bonus/2)); 
      // console.log("the calc",this.heroLevel, "+",Math.floor(this.currentArmor.ref_def_bonus/2),"=",(this.heroLevel + Math.floor(this.currentArmor.ref_def_bonus/2))) 
  }
     else if (this.currentArmor.worn == true && this.currentArmor.proficient == true && this.currentArmor.def == true){
      (this.heroLevel <= this.currentArmor.ref_def_bonus)?this.heroDefenses[0].level = this.currentArmor.ref_def_bonus: this.heroDefenses[0].level = this.heroLevel;
    }else{
    this.heroDefenses[0].level = (this.currentArmor.ref_def_bonus != 0)? this.currentArmor.ref_def_bonus: this.heroLevel;
  }
  this.heroDefenses[1].level = (this.currentArmor.proficient == true)? this.heroLevel + this.currentArmor.fort_def_bonus: this.heroLevel;
 }else{
    this.resetDefenses();
  } 
  this.calculateDefenses(this.heroDefenses[0].name, this.heroDefenses[0].default);
  this.calculateDefenses(this.heroDefenses[1].name, this.heroDefenses[1].default);
  this.calculateDefenses(this.heroDefenses[2].name, this.heroDefenses[2].default);
  this.defenses.emit(this.heroDefenses);
}
//  sets defenses armor/ Hero Level to hero's level
resetDefenses(){
  this.heroDefenses[0].level = this.heroLevel;
  this.heroDefenses[1].level = this.heroLevel;
  this.heroDefenses[2].level = this.heroLevel;
}
//  gets all the values and sets them
getValues(){
  this.traits = this.heroservice.getSpeciesTraits();
  // console.log(this.traits)
  if (this.traits != undefined){
    this.speciesFortDefenseMod = this.traits.Defenses["Fortitude Defense"];
    this.speciesReflexDefenseMod = this.traits.Defenses["Reflex Defense"];
    this.speciesWillDefenseMod = this.traits.Defenses["Will Defense"];
  }
  this.reflexClassBonus = this.heroservice.getReflexClassBonus();
  this.fortClassBonus = this.heroservice.getFortClassBonus();
  this.willClassBonus = this.heroservice.getWillClassBonus();
  this.improvedReflex = this.heroservice.improvedReflex;
  this.improvedFort = this.heroservice.improvedFort;
  this.improvedWill = this.heroservice.improvedWill;
  this.heroDefenses[0].class = this.heroservice.getReflexClassBonus();
  this.heroDefenses[1].class = this.heroservice.getFortClassBonus();
  this.heroDefenses[2].class = this.heroservice.getWillClassBonus();
}
//  saves the value selected by the dropdown to the object's default
collectDefenseMod(index: any, selection: any){
  if (selection.target.value == "Select"){
    return;
  }
  let mod = selection.target.value
  this.heroDefenses[index].default = selection.target.value;
  this.calculateDefenses(this.heroDefenses[index].name, mod);
}
//  saves the malue from the input to the misc of that object
collectMisc(index: any, misc:any){
  // console.log("collecting Misc", index, misc);
  this.heroDefenses[index].misc = parseInt(misc);
  this.calculateDefenses(this.heroDefenses[index].name, this.heroDefenses[index].default)
}
//  calculates each defense based on rules
  calculateDefenses(keyword: string, mod: string){
    let abMod = this.heroservice.getAbilityModifier();
    if (keyword == "Reflex Defense"){
      (mod == "Select")? this.heroDefenses[0].default = "Dexterity": this.heroDefenses[0].default = mod;  
      this.heroDefenses[0].total = 10 + this.heroDefenses[0].level + abMod[this.heroDefenses[0].default] + this.reflexClassBonus + this.speciesReflexDefenseMod + this.improvedReflex + this.heroDefenses[0].misc + this.heroCondition;
      // console.log("defense vars:", this.heroLevel,this.reflexClassBonus,this.speciesReflexDefenseMod)
    }else if (keyword == "Fortitude Defense"){
      (mod == "Select")? this.heroDefenses[1].default = "Constitution": this.heroDefenses[1].default = mod;
      this.heroDefenses[1].total = 10 + this.heroDefenses[1].level + abMod[this.heroDefenses[1].default] + this.fortClassBonus + this.speciesFortDefenseMod + this.improvedFort + this.heroDefenses[1].misc + this.heroCondition;
      // console.log("defense vars:", this.heroLevel,this.fortClassBonus,this.speciesFortDefenseMod)
    }else{
      (mod == "Select")? this.heroDefenses[2].default = "Wisdom": this.heroDefenses[2].default = mod;
      this.heroDefenses[2].total = 10 + this.heroDefenses[2].level + abMod[this.heroDefenses[2].default] + this.willClassBonus + this.speciesWillDefenseMod + this.improvedWill + this.heroDefenses[2].misc + this.heroCondition;
      // console.log("defense vars:", this.heroLevel,this.willClassBonus,this.speciesWillDefenseMod)
    }
    this.defenses.emit(this.heroDefenses)
  }
}
