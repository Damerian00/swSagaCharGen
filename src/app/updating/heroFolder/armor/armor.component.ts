import { Component, OnInit, Output, EventEmitter} from '@angular/core';
import { SwapiService } from 'src/app/services/swapi.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HeroService } from '../../services/hero.service';

@Component({
  selector: 'armor',
  templateUrl: './armor.component.html',
  styleUrls: ['./armor.component.scss']
})
export class ArmorComponent implements OnInit {

  constructor(private swapi : SwapiService, private fb : FormBuilder, private heroservice : HeroService) { }
  // variables
@Output () savedArmor: EventEmitter <any> = new EventEmitter <any> ();
currentSet: boolean = false;
// Templates
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
customFormArmor : FormGroup = this.fb.group({
  name: '',
  reflex: 0,
  fort: 0,
  dex: 0,
  type: '',

});
// arrays
armorTypes: string[] = ["Light Armor", "Medium Armor", "Heavy Armor"] 
// etc..
currentArmor: any;
armorArray: any;
addNotes: boolean = false;
createCustom: boolean = false;

// recievs data from api and sets it to the arrmor array
ngOnInit(): void {
  this.swapi.getArmors().subscribe(payload => {
  this.armorArray = payload;
  // console.log("Armors:", this.armorArray);

  this.armorArray.sort(this.sortNames("name"));
  this.removeShields();
})
    this.currentArmor = Object.assign(this.armorObj);    
this.heroservice.displayArmor.subscribe((armor :any)=> {
  this.displaySavedArmor(armor);
  this.saveArmor();
})
  }

displaySavedArmor(armor: any){
  (armor == undefined)?this.currentArmor = Object.assign(this.armorObj):this.currentArmor = Object.assign(armor);
  console.log("assigned", this.currentArmor)
}
// removes shields from the array
  removeShields(){
   let shields = ["Energy Shields, Light","Energy Shields, Heavy","Energy Shields, Medium"]
   for (let i =0; i<this.armorArray.length; i++){
      if (shields.includes(this.armorArray[i].name)){
        this.armorArray.splice(i,1);
      }
   } 
   let index = this.armorArray.findIndex((el: any)=> el.id == 6);
   this.armorArray.splice(index,1);
  }
// sorts names alphabetically
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
// checks user selection to run functions based on them
getName(name: string){
  if(name == "Select an Armor to Add"){
    return;
  }else if (name == "Custom Armor"){
    this.toggleCustForm();
    return;
  }else{
    const index = this.armorArray.findIndex((el:any) => el.name == name);
    this.assignSelectedArmor(this.armorArray[index]);
    return;
  }
}
// a toggle
toggleCustForm(){
  this.createCustom = !this.createCustom;
}
// saves user choices as the current armor
saveCustArmor(){
// console.log("the custom aromor",this.customFormArmor.value);
this.toggleCustForm();
this.currentArmor.armor_name = this.customFormArmor.value.name;
this.currentArmor.ref_def_bonus = this.customFormArmor.value.reflex;
this.currentArmor.fort_def_bonus = this.customFormArmor.value.fort;
this.currentArmor.max_def_bonus = this.customFormArmor.value.dex;
this.currentArmor.armor_type = this.customFormArmor.value.type;
this.currentArmor.worn = false;
this.currentArmor.def = false;
this.currentArmor.proficient = false;
this.currentArmor.improved_def = false;
this.toggleCurrent();
this.saveArmor();
}
// patch to change the type chosen for the armor
selectType(event :any){
  let val = event.target.value.split(':');
  let newVal = val[1].substring(1);
  // console.log("the type",event.target.value, val, newVal)
  this.customFormArmor.patchValue({
    type: newVal
  });
}

// 
assignSelectedArmor(armor : any){
  // console.log("armor:" , armor);
  this.currentArmor.armor_name = armor.name,
  this.currentArmor.ref_def_bonus = this.removeSymbol(armor.armorBonus)
  this.currentArmor.fort_def_bonus = this.removeSymbol(armor.epuipBonus)
  this.currentArmor.max_def_bonus = this.removeSymbol(armor.dexBonus)
  this.currentArmor.armor_type = armor.a_type
  this.currentArmor.worn = false;
  this.currentArmor.def = false;
  this.currentArmor.proficient = false;
  this.currentArmor.improved_def = false;
  this.toggleCurrent();
  // this.currentSet = true;
  this.saveArmor();
}

toggleCurrent(){
  this.currentSet = !this.currentSet;
}
// removes any added symbols like +
removeSymbol(str: string){
  // console.log(str);
  if (str == "-"){
    return 0
  }else{
    return parseInt(str.substring(1)); 
  }
  
}
// allows user to change notes or add neww notes to the armor
updateNotes(text : string){
  this.currentArmor.notes = text;
  this.addNotes = !this.addNotes;
  this.saveArmor();
}
//toggle
editNotes(){
  this.addNotes = !this.addNotes;
}
// edits value in current Armor
changeHelmetPackage(value: string){
  this.currentArmor.helmet = value;
  this.saveArmor();
}
// checks which checkboxes were selected
checkTheBoxes(event: any){
  // console.log("the event", event.target);
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
  this.saveArmor();
  
  // console.log(this.currentArmor)

}
//saves user information for this hero and emits it using an emitter
saveArmor(){
  // console.log("armor sved",this.currentArmor);

    this.savedArmor.emit(this.currentArmor);

}

}
