import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { HeroService } from '../../services/hero.service';

@Component({
  selector: 'defenses',
  templateUrl: './defenses.component.html',
  styleUrls: ['./defenses.component.scss']
})
export class DefensesComponent implements OnInit {
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
  abModOptions = this.heroservice.abModOptions;
  heroDefenses: any = [{"name": "Reflex Defense", "total": 10, "default" : "Dexterity", "class": 0, "misc" : 0},{"name": "Fortitude Defense", "total": 10, "default" : "Constitution","class": 0, "misc" : 0},{"name": "Will Defense", "total": 10, "default" : "Wisdom", "class": 0, "misc" : 0}]
  constructor(private heroservice: HeroService) { }

  ngOnInit(): void {
    this.traits = this.heroservice.getSpeciesTraits();
    this.getValues();
    this.calculateDefenses( this.heroDefenses[0].name, this.heroDefenses[0].default);
    this.calculateDefenses(this.heroDefenses[1].name, this.heroDefenses[1].default);
    this.calculateDefenses(this.heroDefenses[2].name, this.heroDefenses[2].default);
    this.defenses.emit(this.heroDefenses);
    this.heroservice.invokeConditions.subscribe(() => {   
      this.getHeroCondition();
    });    
  }
getHeroCondition(){
  this.heroCondition = this.heroservice.getCondition();
  this.calculateDefenses( this.heroDefenses[0].name, this.heroDefenses[0].default);
  this.calculateDefenses(this.heroDefenses[1].name, this.heroDefenses[1].default);
  this.calculateDefenses(this.heroDefenses[2].name, this.heroDefenses[2].default);
}
getValues(){
  this.speciesFortDefenseMod = this.traits.Defenses["Fortitude Defense"];
  this.speciesReflexDefenseMod = this.traits.Defenses["Reflex Defense"];
  this.speciesWillDefenseMod = this.traits.Defenses["Will Defense"];
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
collectDefenseMod(index: any, selection: any){
  if (selection.target.value == "Select"){
    return;
  }
  let mod = selection.target.value
  this.heroDefenses[index].default = selection.target.value;
  this.calculateDefenses(this.heroDefenses[index].name, mod);
}
collectMisc(index: any, misc:any){
  // console.log("collecting Misc", index, misc);
  this.heroDefenses[index].misc = parseInt(misc);
  this.calculateDefenses(this.heroDefenses[index].name, this.heroDefenses[index].default)
}
  calculateDefenses(keyword: string, mod: string){
    let abMod = this.heroservice.getAbilityModifier();
    if (keyword == "Reflex Defense"){
      (mod == "Select")? this.heroDefenses[0].default = "Dexterity": this.heroDefenses[0].default = mod;  
      this.heroDefenses[0].total = 10 + this.heroLevel + abMod[this.heroDefenses[0].default] + this.reflexClassBonus + this.speciesReflexDefenseMod + this.improvedReflex + this.heroDefenses[0].misc + this.heroCondition;
      // console.log("defense vars:", this.heroLevel,this.reflexClassBonus,this.speciesReflexDefenseMod)
    }else if (keyword == "Fortitude Defense"){
      (mod == "Select")? this.heroDefenses[1].default = "Constitution": this.heroDefenses[1].default = mod;
      this.heroDefenses[1].total = 10 + this.heroLevel + abMod[this.heroDefenses[1].default] + this.fortClassBonus + this.speciesFortDefenseMod + this.improvedFort + this.heroDefenses[1].misc + this.heroCondition;
      // console.log("defense vars:", this.heroLevel,this.fortClassBonus,this.speciesFortDefenseMod)
    }else{
      (mod == "Select")? this.heroDefenses[2].default = "Wisdom": this.heroDefenses[2].default = mod;
      this.heroDefenses[2].total = 10 + this.heroLevel + abMod[this.heroDefenses[2].default] + this.willClassBonus + this.speciesWillDefenseMod + this.improvedWill + this.heroDefenses[2].misc + this.heroCondition;
      // console.log("defense vars:", this.heroLevel,this.willClassBonus,this.speciesWillDefenseMod)
    }
    this.defenses.emit(this.heroDefenses)
  }
}
