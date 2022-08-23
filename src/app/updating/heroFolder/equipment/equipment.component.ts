import { Component, OnInit } from '@angular/core';
import { SwapiService } from 'src/app/services/swapi.service';
import { HeroService } from '../../services/hero.service';

@Component({
  selector: 'equipment',
  templateUrl: './equipment.component.html',
  styleUrls: ['./equipment.component.scss']
})
export class EquipmentComponent implements OnInit {
// -----variables-----
// Arrays
meleeWeaponsArr: any;
rangedWeaponsArr: any;
armorsArr: any;
equipmentArr: any;
filteredEquipArr: Array<any> = [];
inventoryArr: Array<any> = [];
eqTypeArr: Array <string> = ["Armor", "Melee", "Ranged", "Equipment"];
equipSubCats: Array <string> = [];
// strings
selectedType: string = "";
// booleans
showEqTable: boolean = false;
tableType: string = "";
tableObj: any = {};

  constructor(private swapi : SwapiService, private heroservice : HeroService) { }
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
    this.swapi.getEquip().subscribe(payload => {
      this.equipmentArr = payload;
      console.log("equipment:", this.equipmentArr);
    
      this.equipmentArr.sort(this.sortNames("name"));
    })
    this.swapi.getArmors().subscribe(payload => {
      this.armorsArr = payload;
      console.log("Armors:", this.armorsArr);
    
      this.armorsArr.sort(this.sortNames("name"));
     
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


adjustQty(qty: any){
  console.log("the qty",qty)
}

toggleEquipTable(){
  this.showEqTable = !this.showEqTable;
}

clearArray(arr: Array<any>){
  console.log("clear this", arr)
  while(arr.length){
    arr.pop();
  }

}
//"Armor","Melee", "Ranged", "Equipment"
createSubCatArr(selection: any){
  if (selection == "Select which Type"){
    return;
  }
  this.clearArray(this.equipSubCats);
  switch (selection) {
    case "Armor":
        this.armorsArr.forEach((el:any)=> {
          if (this.equipSubCats.includes(el.a_type) == false){
            this.equipSubCats.push(el.a_type)
          }
        })
      break;
      case "Melee":
        this.meleeWeaponsArr.forEach((el:any)=> {
          if (this.equipSubCats.includes(el.w_type) == false){
            this.equipSubCats.push(el.w_type)
          }
        })
      break;
      case "Ranged":
        this.rangedWeaponsArr.forEach((el:any)=> {
          if (this.equipSubCats.includes(el.w_type) == false){
            this.equipSubCats.push(el.w_type)
          }
        })
      break;
      case "Equipment":
        this.equipmentArr.forEach((el:any)=> {
          if (this.equipSubCats.includes(el.equip_type.type) == false){
            this.equipSubCats.push(el.equip_type.type)
          }
        })
      break;
  }
   this.selectedType = selection;
}


loadFilteredList(selection: any){
  console.log ("load filter",selection);
  this.clearArray(this.filteredEquipArr);
  switch (this.selectedType) {
    case "Armor":
      this.armorsArr.forEach((el:any)=> {
        if (el.a_type == selection){
          this.filteredEquipArr.push(el);
        }
      })
    break;
    case "Melee":
      this.meleeWeaponsArr.forEach((el:any)=> {
        if (el.w_type == selection){
          this.filteredEquipArr.push(el);
        }
      })
    break;
    case "Ranged":
      this.rangedWeaponsArr.forEach((el:any)=> {
        if (el.w_type == selection){
          this.filteredEquipArr.push(el);
        }
      })
    break;
    case "Equipment":
      this.equipmentArr.forEach((el:any)=> {
        if (el.equip_type.type == selection){
          this.filteredEquipArr.push(el);
        }
      })
    break;
  } 
  
  
}

loadEquipTable(selection : any){ 
  if (selection == "Select an item"){
    return;
  }
  let equipObj;
 let index = this.filteredEquipArr.findIndex((el:any) => el.name == selection);
switch (this.selectedType) {
  case "Armor":
   this.tableType = "armor";
   equipObj = {
    name: this.filteredEquipArr[index].name,
    cost: this.filteredEquipArr[index].cost,
    weight: this.filteredEquipArr[index].weight,
    type: this.filteredEquipArr[index].a_type,
    armor: {
      armBonus : this.filteredEquipArr[index].armorBonus,
      dexBonus : this.filteredEquipArr[index].dexBonus,
      fortBonus : this.filteredEquipArr[index].epuipBonus,
    },
    avail: this.filteredEquipArr[index].availability,
    attr: this.filteredEquipArr[index].attributes,
    desc: '',
  } 
  break;
  case "Melee":
    this.tableType = "melee";
    equipObj = {
      name: this.filteredEquipArr[index].name,
      cost: this.filteredEquipArr[index].cost,
      weight: this.filteredEquipArr[index].weight,
      type: this.filteredEquipArr[index].w_type,
      melee: {
        damage: this.filteredEquipArr[index].damage,
        damage_type: this.filteredEquipArr[index].d_type,
        size: this.filteredEquipArr[index].size,
        stun: this.filteredEquipArr[index].stun_setting[0].toLowerCase(),
      },
      avail: this.filteredEquipArr[index].availability,
      attr: [],
      desc: '',
    } 
  break;
  case "Ranged":
    this.tableType = "ranged";
    equipObj = {
      name: this.filteredEquipArr[index].name,
      cost: this.filteredEquipArr[index].cost,
      weight: this.filteredEquipArr[index].weight,
      type: this.filteredEquipArr[index].w_type,
      ranged: {
        damage: this.filteredEquipArr[index].damage,
        damage_type: this.filteredEquipArr[index].d_type,
        size: this.filteredEquipArr[index].size,
        stun: this.filteredEquipArr[index].stun_setting[0].toLowerCase(),
        rof: this.filteredEquipArr[index].rof,
      },
      avail: this.filteredEquipArr[index].availability,
      attr: this.filteredEquipArr[index].attributes,
      desc: '',
    } 
  break;
  case "Equipment":
    this.tableType = "equipment";
    equipObj = {
      name: this.filteredEquipArr[index].name,
      cost: this.filteredEquipArr[index].cost,
      weight: this.filteredEquipArr[index].weight,
      type: this.filteredEquipArr[index].equip_type.type,
      equipment: {
        size : (this.filteredEquipArr[index].equip_type.size == undefined)? '': this.filteredEquipArr[index].equip_type.size,
        damage : (this.filteredEquipArr[index].equip_type.damage == undefined)? '': this.filteredEquipArr[index].equip_type.damage,
        explosive_type : (this.filteredEquipArr[index].equip_type.explosive_type == undefined)? '': this.filteredEquipArr[index].equip_type.explosive_type,
        upgrade_type : (this.filteredEquipArr[index].equip_type.upgrade_type == undefined)? '': this.filteredEquipArr[index].equip_type.upgrade_type,
        surgery_cost : (this.filteredEquipArr[index].equip_type.surgeryCost == undefined)? '': this.filteredEquipArr[index].equip_type.surgeryCost,
      },
      avail: (this.filteredEquipArr[index].equip_type.availability == undefined)? [] : [this.filteredEquipArr[index].equip_type.availability],
      attr: this.filteredEquipArr[index].attributes,
      desc: this.filteredEquipArr[index].description,
    }
  break;
}

this.tableObj = equipObj;
}

addItem(){
  this.inventoryArr.push(this.tableObj);
  this.toggleEquipTable();
  console.log("the inventorypArray",this.inventoryArr)
}




}