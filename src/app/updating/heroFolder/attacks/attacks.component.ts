import { Component, OnInit } from '@angular/core';
import { SwapiService } from 'src/app/services/swapi.service';
import { HeroService } from '../../services/hero.service';




@Component({
  selector: 'attacks',
  templateUrl: './attacks.component.html',
  styleUrls: ['./attacks.component.scss']
})
export class AttacksComponent implements OnInit {
meleeWeaponsArr: any;
rangedWeaponsArr: any;
createWepForm: boolean = false;
weaponOptionsArray: any;
currentSelectionNamesArray: Array<string> = [];
notCustom: boolean = false;
currentType: string = '';
weaponsArray: Array<any> = [];
customWepType: Array<string> = ["Advanced Melee Weapons", "Heavy Weapons","Lightsabers","Pistols","Rifles","Grenades","Simple Weapons (Melee)","Simple Weapons (Ranged)","Exotic Weapons (Melee)","Exotic Weapons (Ranged)"]

attackMods: Array<string> = ["default","STR","DEX","CHA"];
damageMods: Array<string> = ["None","STR","STRx2","DEX","DEXx2","CHA","CHAx2"];
dmgTimesTwo: boolean = false;
wepEdit: boolean = false;
wepEditIndex: number = 0;
  constructor(private swapi : SwapiService, private heroservice: HeroService) { }

  ngOnInit(): void {
    this.swapi.getMelees().subscribe(payload => {
      this.meleeWeaponsArr = payload;
      console.log("melee:", this.meleeWeaponsArr);
    
      this.meleeWeaponsArr.sort(this.sortNames("name"));
    })
    this.swapi.getRanged().subscribe(payload => {
      this.rangedWeaponsArr = payload;
      console.log("ranged:", this.rangedWeaponsArr);
    
      this.rangedWeaponsArr.sort(this.sortNames("name"));
    })


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

createNewWeapon(){
  this.createWepForm = true;
  this.notCustom = true;
}
selectWeaponType(selection: any){
  // console.log("Weapon Selection:",selection)
  if (selection == "Select Type"){
    this.notCustom = true;
    return;
  }else if (selection == "Melee"){
    this.addMeleeWep();
  }else if (selection == "Ranged"){
    this.addRangedWep();
  }else if (selection == "Custom"){
    this.createCustomWep();
  }
}
addMeleeWep(){
  this.notCustom = true;
  if (this.currentSelectionNamesArray.length != 0){
    this.clearArray(this.currentSelectionNamesArray)
  }
  this.meleeWeaponsArr.forEach((el: any) =>  {
    this.currentSelectionNamesArray.push(el.name);
  }); 
  this.currentType = "melee";
  console.log("Melee Chosen", this.currentSelectionNamesArray);
}
addRangedWep(){
  this.notCustom = true
  if (this.currentSelectionNamesArray.length != 0){
    this.clearArray(this.currentSelectionNamesArray)
  }
  this.rangedWeaponsArr.forEach((el: any) =>  {
    this.currentSelectionNamesArray.push(el.name);
  });
  this.currentType = "ranged";  
  console.log("Ranged Chosen", this.currentSelectionNamesArray);
}
createCustomWep(){
  this.notCustom = false;
  console.log("Custom Chosen")
}
saveCusWep(name: any, type: any, die:any, dmgType: any, attNotes:any, wepNotes: any){
  if (name == "" || die == "" || dmgType == ""){
    return;
  }
  let meleeArr = ["Advanced Melee Weapons","Lightsabers","Simple Weapons (Melee)","Exotic Weapons (Melee)"]
  let newWep;
  if (meleeArr.includes(type)){
    newWep = {
      name: name,
      wep_type: type,
      stun: "",
      stun_dmmg: die,
      die: die,
      attack_total: 0,
      attack_misc: 0,
      attack_mod: 'Strength',
      dmg_type: dmgType,
      damage_total: 0,
      damage_misc: 0,
      damage_mod: 'Strength',
      att_notes: attNotes,
      wep_notes: wepNotes,
    };
  }else{
    newWep = {
      name: name,
      wep_type: type,
      stun: "",
      stun_dmmg: die,
      die: die,
      attack_total: 0,
      attack_misc: 0,
      attack_mod: 'Dexterity',
      dmg_type: dmgType,
      damage_total: 0,
      damage_misc: 0,
      damage_mod: 'None',
      att_notes: attNotes,
      wep_notes: wepNotes,
    };
  }
  this.weaponsArray.push(newWep);
  console.log("cus to create", name,type,die,dmgType,attNotes,wepNotes);
  this.notCustom = true;
  this.runCalcs();
  this.createWepForm = false;
}
clearArray(arr: Array<string>){
  while(arr.length){
    arr.pop();
  }

}
createWeaponIndex(selection: any){
  // console.log("the selection", selection);
if (selection == "Select a Weapon"){
  return;
}
let arr;
let newWep;
  if (this.currentType == "melee"){
 arr = this.meleeWeaponsArr;
 let index = arr.findIndex((el: any) => el.name == selection)
  newWep = {
    name: selection,
    wep_type: arr[index].w_type,
    stun: arr[index].stun_setting[0].toLowerCase(),
    stun_dmmg: (arr[index].stun_setting.length == 1)? arr[index].damage : arr[index].stun_setting[1],
    die: (arr[index].name == "Shock Whip")? "1d6":arr[index].damage,
    attack_total: 0,
    attack_misc: 0,
    attack_mod: 'Strength',
    dmg_type: arr[index].d_type,
    damage_total: 0,
    damage_misc: 0,
    damage_mod: 'Strength',
    att_notes: `Stun: ${arr[index].stun_setting[0].toLowerCase()}`,
    wep_notes: '',
  };
}else{
  arr = this.rangedWeaponsArr;
  let index = arr.findIndex((el: any) => el.name == selection)
  newWep = {
    name: selection,
    wep_type: arr[index].w_type,
    stun: arr[index].stun_setting[0].toLowerCase(),
    stun_dmmg: (arr[index].stun_setting.length == 1)? arr[index].damage : arr[index].stun_setting[1],
    die: arr[index].damage,
    attack_total: 0,
    attack_misc: 0,
    attack_mod: 'Dexterity',
    dmg_type: arr[index].d_type,
    damage_total: 0,
    damage_misc: 0,
    damage_mod: 'None',
    att_notes: `Stun: ${arr[index].stun_setting[0].toLowerCase()}; ROF: (${arr[index].rof.join(', ')})`,
    wep_notes: '',
  };
} 
  this.weaponsArray.push(newWep);
  console.log(this.weaponsArray);
  this.runCalcs();
  this.createWepForm = false;
}
runCalcs(){
 for (let i=0; i<this.weaponsArray.length; i++){
  this.calcAttack(i);
  this.calcDamage(i);
  console.log(this.weaponsArray);
 }
}
collectAttackMod(index: number, mod: any ){
  let carryOverMod = mod.target.value;
  let actualMod = '';
  switch (carryOverMod){
    case "STR":
      actualMod = "Strength";
    break;
    case "DEX":
      actualMod = "Dexterity";
    break;
    case "CHA":
      actualMod = "Charisma";
    break;
    default:
      if (this.currentType == "melee"){
        actualMod = "Strength";
      }else{
        actualMod = "Dexterity";
      }
    break;
  }
  this.weaponsArray[index].attack_mod = actualMod;
  console.log("collect Att mod:", index, mod.target.value)
  this.runCalcs();
  //this.weaponsArray[index].attack_mod = mod;

}
collectDamageMod(index: number, mod: any){
  let ttArr =  ["STRx2","DEXx2","CHAx2"]
  let carryOverMod = mod.target.value;
  let actualMod = '';
  if (ttArr.includes(mod.target.value)){
    this.dmgTimesTwo = true;
    if (mod.target.value == "STRx2"){
      carryOverMod = "STR"
    }else if(mod.target.value == "DEXx2"){
      carryOverMod = "DEX";
    }else{
      carryOverMod = "CHA";
    }
  }
  switch (carryOverMod){
    case "STR":
      actualMod = "Strength";
    break;
    case "DEX":
      actualMod = "Dexterity";
    break;
    case "CHA":
      actualMod = "Charisma";
    break;
    default:
      actualMod = "None";
    break;
    
  }
  this.weaponsArray[index].damage_mod = actualMod;
  console.log("collect Dmg mod:", index, mod.target.value);
  this.runCalcs();
  //this.weaponsArray[index].damage_mod = mod
}
collectAttackmisc(index: number, misc: any){
  // console.log("collect Att misc:", index, misc)
  this.weaponsArray[index].attack_misc = parseInt(misc);
  this.runCalcs();
}
collectDamageMisc(index: number, misc:any){
  // console.log("collect Att misc:", index, misc)
  this.weaponsArray[index].damage_misc = parseInt(misc);
  this.runCalcs();
}
calcAttack(index: number){
  let halfLevel = Math.floor(this.heroservice.getHeroLevel()/2)
  let mod = this.heroservice.getAbilityModifier();
  this.weaponsArray[index].attack_total = this.weaponsArray[index].attack_misc + mod[this.weaponsArray[index].attack_mod] + halfLevel;
}
calcDamage(index: number){
  let halfLevel = Math.floor(this.heroservice.getHeroLevel()/2)
  let mod = this.heroservice.getAbilityModifier();
  if (this.dmgTimesTwo == true){
    this.weaponsArray[index].damage_total = this.weaponsArray[index].damage_misc + (mod[this.weaponsArray[index].damage_mod]* 2) + halfLevel;
  }else{
    this.weaponsArray[index].damage_total = this.weaponsArray[index].damage_misc + (this.weaponsArray[index].damage_mod == "None")? 0: mod[this.weaponsArray[index].damage_mod] + halfLevel;
  }
  this.dmgTimesTwo = false;
}
deleteWeapon(index: number){
  console.log("deleting:", this.weaponsArray[index])
  this.weaponsArray.splice(index,1);
}
editForm(index: number){
  if (index == -1000){
    this.wepEdit = false;
  }else{
    this.wepEdit = true;
    this.wepEditIndex = index;
    console.log("modify this wep", this.weaponsArray[index]);
  }

}
editWeapon(die: any, att: any, wep: any){
console.log("to edit" ,die,att,wep)
this.weaponsArray[this.wepEditIndex].die = die;
this.weaponsArray[this.wepEditIndex].att_notes = att;
this.weaponsArray[this.wepEditIndex].wep_notes = wep;
this.wepEdit = false;

}
}
