import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { SwapiService } from 'src/app/services/swapi.service';
import { HeroService } from '../../services/hero.service';

@Component({
  selector: 'equipment',
  templateUrl: './equipment.component.html',
  styleUrls: ['./equipment.component.scss']
})
export class EquipmentComponent implements OnInit {
// -----variables-----
@Output () inventory : EventEmitter<any> = new EventEmitter<any> ();

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
//  subscribes to the services and the EventEmitter
  ngOnInit(): void {
    this.swapi.getMelees().subscribe(payload => {
      this.meleeWeaponsArr = payload;
      // console.log("melee:", this.meleeWeaponsArr);
    
      this.meleeWeaponsArr.sort(this.sortNames("name"));
    })
    this.swapi.getRanged().subscribe(payload => {
      this.rangedWeaponsArr = payload;
      // console.log("ranged:", this.rangedWeaponsArr);
    
      this.rangedWeaponsArr.sort(this.sortNames("name"));
    })
    this.swapi.getEquip().subscribe(payload => {
      this.equipmentArr = payload;
      // console.log("equipment:", this.equipmentArr);
    
      this.equipmentArr.sort(this.sortNames("name"));
    })
    this.swapi.getArmors().subscribe(payload => {
      this.armorsArr = payload;
      // console.log("Armors:", this.armorsArr);
    
      this.armorsArr.sort(this.sortNames("name"));
     
    })
    this.heroservice.packBags.subscribe((bag : any)=> {
      this.importHeroInventory(bag);
    })

  }
  //  sorts alphabetically
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
// sets the inventory arr to what is imported from the saved hero object
importHeroInventory(arr: any){
 (arr == undefined)?"nothing":this.inventoryArr = [...arr];
}
//  changes the qty on the items's object
adjustQty(index: number, qty: any){
  // console.log("the qty",index,qty)
  if (qty <= 0){
    return
  }
  this.inventoryArr[index].qty = parseInt(qty);
  this.calcTotals();
}
//  calls the function to calculate the totalts of cost and weight for each item then emits those new values out
calcTotals(){
  for (let i = 0; i<this.inventoryArr.length;i++){
    this.calcCost(i);
    this.calcWeight(i);
    this.inventory.emit(this.inventoryArr);
  }
}
//  calculates the total weight
calcWeight(index: number){
  if (this.inventoryArr[index].weight == "" || this.inventoryArr[index].weight == "-"){
    this.inventoryArr[index].total_weight = "-"
    return;
  }
  if (this.inventoryArr[index].name == "Universal Energy Cage"){
    this.inventoryArr[index].total_weight = `${3*this.inventoryArr[index].qty} Tons`
    return;
  }
  let split = this.inventoryArr[index].weight.split('')
  let stop = split.findIndex((el:any)=> el == "k" || el == "t");
  let weight = parseFloat(this.inventoryArr[index].weight.substring(0, stop));
  // console.log("calc weight", this.inventoryArr[index].weight, weight, stop, split )
  this.inventoryArr[index].total_weight = `${(weight * this.inventoryArr[index].qty).toFixed(2)}kg`
}
//  calculate total cost
calcCost(index: number){
  this.inventoryArr[index].total_cost = this.inventoryArr[index].cost * this.inventoryArr[index].qty;
}
//  show/hide equipment table 
toggleEquipTable(){
  this.showEqTable = !this.showEqTable;
}
//  function to empty an array
clearArray(arr: Array<any>){
  // console.log("clear this", arr)
  while(arr.length){
    arr.pop();
  }
}
//  checks if carry checkbox is selected and uses that weight value to add or subtract from encumbrance
modCarry(index: number){
  (this.inventoryArr[index].carry == true)?this.inventoryArr[index].carry = false: this.inventoryArr[index].carry = true; 
  let split = this.inventoryArr[index].total_weight.split('')
  let stop = split.findIndex((el:any)=> el == "k" || el == "t");
  let num = parseFloat(this.inventoryArr[index].total_weight.substring(0, stop))
  if (this.inventoryArr[index].carry == true){
    this.heroservice.updateCarry(num);
  }else{
    this.heroservice.updateCarry((num * -1));
  }
  // console.log('carry', this.inventoryArr[index].carry)
}
//  adds to the subcategory array based on choice of item type selected by user
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
  //  console.log(this.selectedType);
}
//  creates the filtered list based on user selection to show the items that match the selection
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
//  function to create a custom item
createCustomItem(name: string, qty: string, type: string, weight: any, cost: string){
  if(name == "" || type == "Select which Type" || parseInt(qty) <= 0){
    this.toggleEquipTable();
    return;
  }
  // console.log("create Cust", name,qty,type,weight,cost);
  let preps = ["a","of", "an", "by", "to", "or"]
  let arr = name.split(" ")
for (var i = 0; i < arr.length; i++) {
  if (preps.includes(arr[i]) == false){
    arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].slice(1);
  }
}
let newQty = Number(qty)
let newName = arr.join(" ")
let newWeight = `${weight}kg`
let parseWeight: any = parseFloat(weight).toFixed(2);
let totalWeight = `${parseWeight * newQty}kg`;
let newCost = Number(cost);
let totalCost = newCost * newQty;
console.log(newQty, newName, newWeight, totalWeight, newCost, totalCost);
let equipObj = {
  name: newName,
  cost: newCost,
  weight: newWeight,
  type: type,
  qty: newQty,
  total_weight : totalWeight,
  total_cost: totalCost,
  show: false,
  itemNotes: '',
  showNotes: false,
  notesDisplay: 'show',
} 
this.inventoryArr.push(equipObj);
this.toggleEquipTable();
}
//  sets the tableObj to the equipObj Object to be used later
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
    cost: (isNaN(this.filteredEquipArr[index].cost))? 0: this.filteredEquipArr[index].cost,
    weight: (this.filteredEquipArr[index].weight == "Varies")? "": this.filteredEquipArr[index].weight,
    type: this.filteredEquipArr[index].a_type,
    armor: {
      armBonus : this.filteredEquipArr[index].armorBonus,
      dexBonus : this.filteredEquipArr[index].dexBonus,
      fortBonus : this.filteredEquipArr[index].epuipBonus,
    },
    avail: this.filteredEquipArr[index].availability,
    attr: this.filteredEquipArr[index].attributes,
    desc: '',
    qty: 0,
    total_weight : (this.filteredEquipArr[index].weight == "Varies")? "": this.filteredEquipArr[index].weight,
    total_cost: this.filteredEquipArr[index].cost,
    show: false,
    itemNotes: '',
    showNotes: false,
    notesDisplay: 'show',
  } 
  break;
  case "Melee":
    this.tableType = "melee";
    equipObj = {
      name: this.filteredEquipArr[index].name,
      cost: (isNaN(this.filteredEquipArr[index].cost))? 0: this.filteredEquipArr[index].cost,
      weight: (this.filteredEquipArr[index].weight == "Varies")? "": this.filteredEquipArr[index].weight,
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
      qty: 0,
      total_weight : (this.filteredEquipArr[index].weight == "Varies")? "": this.filteredEquipArr[index].weight,
      total_cost: this.filteredEquipArr[index].cost,
      show: false,
      itemNotes: '',
      showNotes: false,
      notesDisplay: 'show',
    } 
  break;
  case "Ranged":
    this.tableType = "ranged";
    equipObj = {
      name: this.filteredEquipArr[index].name,
      cost: (isNaN(this.filteredEquipArr[index].cost))? 0: this.filteredEquipArr[index].cost,
      weight: (this.filteredEquipArr[index].weight == "Varies")? "": this.filteredEquipArr[index].weight,
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
      qty : 0,
      total_weight : (this.filteredEquipArr[index].weight == "Varies")? "": this.filteredEquipArr[index].weight,
      total_cost: this.filteredEquipArr[index].cost,
      show: false,
      itemNotes: '',
      showNotes: false,
      notesDisplay: 'show',
    } 
  break;
  case "Equipment":
    this.tableType = "equipment";
    equipObj = {
      name: this.filteredEquipArr[index].name,
      cost: (isNaN(this.filteredEquipArr[index].cost))? 0: this.filteredEquipArr[index].cost,
      weight: (this.filteredEquipArr[index].weight == "Varies")? "": this.filteredEquipArr[index].weight,
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
      qty: 0,
      total_weight : (this.filteredEquipArr[index].weight == "Varies")? "": this.filteredEquipArr[index].weight,
      total_cost: this.filteredEquipArr[index].cost,
      show: false,
      itemNotes: '',
      showNotes: false,
      notesDisplay: 'show',
    }
  break;
}

this.tableObj = equipObj;
}
//  adds the previously made tableObj to the array if it isn't already there if it is it just adds to the qty
addItem(){
  if (this.tableObj.name == "" || this.tableObj.name == undefined){
    return;
  }
  // console.log(this.tableObj , this.inventoryArr)
  if (this.inventoryArr.length != 0){
    for (let i=0; i<this.inventoryArr.length; i++){
      if (this.tableObj.name == this.inventoryArr[i].name){
        this.inventoryArr[i].qty += 1;
        this.toggleEquipTable();
        this.calcTotals();
        return;
      }
  } 
}
    this.tableObj.carry = false;
    this.tableObj.qty = 1;
    this.inventoryArr.push(this.tableObj);
    // console.log('i pushed it');
  this.toggleEquipTable();
  this.calcTotals();
  // console.log("the inventorypArray",this.inventoryArr)
}
//  deletes the item from the inventory array
deleteItem(index: number){
(this.inventoryArr[index].carry == true)?this.modCarry(index): "nothing";
  if (index == 0){
    this.inventoryArr.shift();
  }
  this.inventoryArr.splice(1, index);
  // console.log("delete item", index, this.inventoryArr);
}
//  show/hidse Notes for the item
toggleNotes(index: number){
  (this.inventoryArr[index].notesDisplay == "show")? this.inventoryArr[index].notesDisplay = 'hide': this.inventoryArr[index].notesDisplay = 'show';
  this.inventoryArr[index].showNotes = !this.inventoryArr[index].showNotes;
}
//  hide/show item to edit it
toggleItemShow(index: number){
  this.inventoryArr[index].show = !this.inventoryArr[index].show;
}
//  allows you to patch an item's base weight, name, anr/or base cost
async editItem(index:number, name: string, weight: any, cost: any, notes: string){
  // console.log("edit this", index,name,weight,cost,notes)
  let newWeight
  if (parseFloat(weight) >= 0){
    newWeight = `${weight}kg`
    let parseWeight: any = parseFloat(weight).toFixed(2);
    this.inventoryArr[index].weight = newWeight;
    this.inventoryArr[index].total_weight = `${(parseWeight * this.inventoryArr[index].qty)}kg`
  }
  let preps = ["a","of", "an", "by", "to", "or"];
  let arr:any = name.split(" ");
for (var i = 0; i < arr.length; i++) {
  if (preps.includes(arr[i]) == false){
    arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].slice(1);
  }

}
let newName: string =  await arr.join(" ") 
await (newName != "")?this.inventoryArr[index].name = newName: "nothing";
(parseInt(cost) >= 0)?this.inventoryArr[index].cost = parseInt(cost): "nothing";
(notes == "")? "nothing": this.inventoryArr[index].itemNotes = notes;
// console.log(this.inventoryArr[index]);
this.toggleItemShow(index);
this.calcTotals();
}




}
