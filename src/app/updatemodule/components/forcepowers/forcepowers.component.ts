import { Component, OnInit, Input } from '@angular/core';
import  forcePowersArr from '../../../db/fpowers.json';
import saberPowersArr from '../../../db/spowers.json';
import { HeroService } from '../../services/hero.service';
import { LevelingService } from '../../services/leveling.service';

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
  selector: 'forcepowers',
  templateUrl: './forcepowers.component.html',
  styleUrls: ['./forcepowers.component.scss']
})
export class ForcepowersComponent implements OnInit {
  //  variables used
  //  Inputs
  @Input() incomingFeat = false;
  //  Arrays
  heroForceSuite: Array <any> = []
  forcePowersArr: forcePowers[] = forcePowersArr;
  saberFormPowers: saberPowers[] = saberPowersArr;
  powerSaver: Array <any> = [];
  //  Object
  forcePower: any;
  //  Strings
  forceName: string = "";
  forceDesc: string = "";
  //  Numbers
  maxPowers: number = 0;
  numPowers: number =  0;
  constructor(private hero: HeroService, private level: LevelingService) { }

  ngOnInit(): void {
    this.calcNums();
    this.hero.checkForcePowerReset.subscribe(()=>{
      this.calcNums();
    })
  }

  calcNums(){
    const feats = this.level.getHeroFeats();
    const abs = this.hero.getAbilityModifier();
    let wisdom = abs.Wisdom;
        let currentPowers = this.hero.getForcePowers().length;
        let ft = 0;
       if (this.incomingFeat == true){
        (ft = (feats.includes("Jedi Heritage"))? 3:1)
      }else{
        ft = 0;
        if (this.powerSaver.length != 0){
        this.hero.removeForcePowers(this.powerSaver);
        this.powerSaver = [];
        }
      }

        if (feats.includes("Force Training") || this.incomingFeat == true){
          feats.forEach((el: any)=>{
            if (el == "Force Training"){
              if (feats.includes("Jedi Heritage")){
                ft += 3;
              }else{
                ft += 1;
              }
            }  
          })
          
        }
        // console.log("they have: ",currentPowers, this.hero.getForcePowers());
        this.numPowers = (wisdom + ft) - currentPowers;
        this.maxPowers = (wisdom + ft) - currentPowers;
  }
  selectedPower(power: any){
    if (power == "Select a Power" || power == undefined){
      this.forceName = "";
      this.forceDesc = "";
      return;
    }
    // console.log("Chosen Power:" ,power);
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
  savePowers(){
    this.hero.addForcePowers(this.heroForceSuite)
    this.powerSaver = [...this.heroForceSuite];
    this.heroForceSuite = [];
  }
  
  
}
