import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { SwapiService } from 'src/app/services/swapi.service';

@Component({
  selector: 'armor',
  templateUrl: './armor.component.html',
  styleUrls: ['./armor.component.scss']
})
export class ArmorComponent implements OnInit {

  constructor(private swapi : SwapiService) { }
@Output () savedArmor: EventEmitter <any> = new EventEmitter <any> ();
currentSet: boolean = false;
armorObj: object = {
  armor_name : "None",
  worn : false,
  proficient : false,
  def : false,
  improved_def : false,
  ref_def_bonus : 0,
  fort_def_bonus : 0,
  max_def_bonus : 0,
  speed : 0,
  armor_type : "None",
  helmet : "None",
  notes : "None",
};
currentArmor: any;
armorArray: any;
addNotes: boolean = false;




  ngOnInit(): void {
this.swapi.getArmors().subscribe(payload => {
  this.armorArray = payload;
  console.log("Armors:", this.armorArray);

  this.armorArray.sort(this.sortNames("name"));
  this.removeShields();
})
    this.currentArmor = Object.assign(this.armorObj);    

  



  }
  removeShields(){
   let shields = ["Energy Shields, Light","Energy Shields, Heavy","Energy Shields, Medium"]
   for (let i =0; i<this.armorArray.length; i++){
      if (shields.includes(this.armorArray[i].name)){
        this.armorArray.splice(i,1);
        console.log("removed:",i)
      }
   } 
   let index = this.armorArray.findIndex((el: any)=> el.id == 6);
   this.armorArray.splice(index,1);
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
getName(name: string){
  if(name == "Select an Armor to Add"){
    return;
  }else if (name == "Custom Armor"){
    this.addCustomArmor();
    return;
  }else{
    const index = this.armorArray.findIndex((el:any) => el.name == name);
    this.assignSelectedArmor(this.armorArray[index]);
    return;
  }
}
addCustomArmor(){
  console.log("lets make some armor");
}
assignSelectedArmor(armor : any){
  console.log("I got dis:" , armor);
  this.currentArmor.armor_name = armor.name,
  this.currentArmor.ref_def_bonus = this.removeSymbol(armor.armorBonus)
  this.currentArmor.fort_def_bonus = this.removeSymbol(armor.epuipBonus)
  this.currentArmor.max_def_bonus = this.removeSymbol(armor.dexBonus)
  this.currentArmor.armor_type = armor.a_type
  // this.currentSet = true;
}

toggleCurrent(){
  this.currentSet = !this.currentSet;
}
removeSymbol(str: string){
  // console.log(str);
  if (str == "-"){
    return 0
  }else{
    return parseInt(str.substring(1)); 
  }
  
}
updateNotes(text : string){
  this.currentArmor.notes = text;
  this.addNotes = !this.addNotes;
}
editNotes(){
  this.addNotes = !this.addNotes;
}
changeHelmetPackage(value: string){
  this.currentArmor.helmet = value;
}
checkTheBoxes(event: any){
  console.log("the event", event.target);
  let check = event.target.checked
  switch (event.target.value) {
    case "aromorWorn":
      this.currentArmor.worn = check;
      break;
    case "proficiency":
     this.currentArmor.proficient = check;
     break;
     case "armorDef":
      this.currentArmor.def = check;     
      if (check == false){
        this.currentArmor.improved_def = false;
      }
    break;
    case "improveArmorDef":
      if (this.currentArmor.def == true){
        this.currentArmor.improved_def = check;
      }else{
        event.target.checked = false;
      }
    break;
  }
  
  console.log(this.currentArmor)

}
saveArmor(){
  console.log(this.currentArmor);

    this.savedArmor.emit(this.currentArmor);

}

}
