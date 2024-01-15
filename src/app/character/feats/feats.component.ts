import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ChoicesSenderService } from 'src/app/services/choices-sender.service';
import { SwapiService } from 'src/app/services/swapi.service';
import { SWPsuedoApi } from 'src/app/services/swpsuedoapi.service';
import forcePowers from '../../db/fpowers.json';
import saberPowers from '../../db/spowers.json';


@Component({
  selector: 'feats',
  templateUrl: './feats.component.html',
  styleUrls: ['./feats.component.scss']
})
export class FeatsComponent implements OnInit {
  constructor(private swApiService: SwapiService, private choices: ChoicesSenderService, private pseudoApi : SWPsuedoApi) { }
//  ---Variables---
  @Output () heroFeatsSelected: EventEmitter<any> = new EventEmitter<any>()
  @Output () heroSkillTrained: EventEmitter<any> = new EventEmitter<any>()
  @Output () heroForcePowers: EventEmitter<any> = new EventEmitter<any>()
  //  arrays
  startingFeats: Array<string> = [];
  selectedFeats: Array<string> = [];
  selectableFeats: Array<string> = [];
  selectedFeat: Array<any> = ["", ""];
  additionalFeatsArray: Array<string> = [];
  specialFeatOptions: Array<string> = [];
  extraSpecialFeatOptions: Array<string> = [];
  specialOptionSelected: Array<any> = ["",""];
  conditionalArray: Array<string> = [];
  extraSelectableFeats: Array<string> = []
  savedSkills: Array <string> = ["",""];
  submittedValues: Array<string> = ["", ""]
  speciesFeatsArray: Array <any> = [];
  heroForceSuite: Array <any> = [];
  exoticMelee: Array<any> = [];
  exoticRange: Array<any> = [];
  forcePowersArr: Array<any> = forcePowers;
  saberFormPowers: Array<any> = saberPowers;
  
  //  booleans
  validated: boolean = true;
  additionalFeatsTrigger: boolean = false;
  notTof: boolean = true;
  showForcePowers: boolean = false;
  // forceTraining: boolean = false;
  zabrakResil: boolean = false;
  //  misc
  maxPowers: number = 0;
  forceName: string = "";
  forceDesc: string = "";
  numPowers: number =  0;
  additionalFeat: string = "";
  selectedFeatName: string = "";
  selectedFeatDescription: string = "";
  extraFeatName: string = "";
  extraFeatDescription: string = "";
  featsArray: any;
  selectedHeroicClass = this.choices.selectedClass;
  heroicClass: string = '';
  extraFeat: string = 'no';
  extraSelectedFeat: string = "";
  specifyFeat: string = "no"
  extraSpecifyFeat: string = "no"
  specifyFeatButtonName = "default"
  extraFeatShow: string = "no";
  tempDef: any = {
    "reflex" : 0,
    "fort" : 0,
    "will" : 0
  }
  spec: any;
/*

*/

  ngOnInit(): void {
  /**
   * old code to work with backend
   * 
  this.swApiService.getFeats().subscribe(payload =>{
    this.featsArray = payload;
    // console.log("feats: ", this.featsArray);
  })
   this.swApiService.getMelees().subscribe(payload=> {
      payload.forEach((el:any)=> {
        if (el.w_type == "Exotic Weapons (Melee)"){
          this.exoticMelee.push(el.name);
        }
      })
    })
    this.swApiService.getRanged().subscribe(payload=> {
      payload.forEach((el:any)=> {
        if (el.w_type == "Exotic Weapons (Ranged)"){
          this.exoticRange.push(el.name);
        }
      })
    })
   * 
   */
  this.featsArray = this.pseudoApi.getFeats();
    this.choices.setStartingFeats.subscribe(() => {   
      this.acquireFeats();
    });    
   let meleeArray = this.pseudoApi.getMelees();
    meleeArray.forEach((el:any)=> {
      if (el.w_type == "Exotic Weapons (Melee)"){
      this.exoticMelee.push(el.name);
      }
  })
  let rangedArray = this.pseudoApi.getRanged();
    rangedArray.forEach((el:any)=> {
      if (el.w_type == "Exotic Weapons (Ranged)"){
        this.exoticRange.push(el.name);
      }
    })
  }

 
// getter for class
setClass(heroicClass: string){
  this.heroicClass = heroicClass;
}


// checks requirements and class to display starting feats
async acquireFeats(){
  this.submittedValues = ["",""];
  this.notTof == true;
// sets traits to the species selected traits
let traits = this.choices.acquireSpeciesTraits();
let bonusFeat = "";
if (Object.keys(traits).includes("Bonus Feat")){
 if (traits["Bonus Feat"] != "1 additional") {
  bonusFeat = traits["Bonus Feat"];
}
}
let primitive = "no"
if (Object.keys(traits).includes("Primitive")){
primitive = "yes"
}
let tempString = '';
let heroClass = this.heroicClass;
let skillArray = await this.choices.acquireSkillsArray();
// console.log("here's the feats skill array: ",skillArray)
let int = await this.choices.acquireInt();
let con = await this.choices.acquireCon();

// this switch holds the hard coded data for what feats each class gets starting out and based on the user choice will assign them to the user's character.
  switch (heroClass) {
    case "Jedi":   
      tempString = "Force Sensitivity,Weapon Proficiency (Lightsabers),Weapon Proficiency (Simple Weapons)";
      break;
    case "Noble":
      if (int >= 13){ 
        tempString = "Linguist,Weapon Proficiency (Pistols),Weapon Proficiency (Simple Weapons)";
      }else if (primitive == "yes") {
        tempString = "Weapon Proficiency (Simple Weapons)";
      }else{  
        tempString = "Weapon Proficiency (Pistols),Weapon Proficiency (Simple Weapons)";
      }
      break;
      case "Scoundrel":
        if (primitive == "yes") {
          tempString = "Point-Blank Shot,Weapon Proficiency (Simple Weapons)";
        }else{
          tempString = "Point-Blank Shot,Weapon Proficiency (Pistols),Weapon Proficiency (Simple Weapons)";
        }
      break;
      case "Scout":
      if (con >= 13 && skillArray.includes("Endurance")){
        if (primitive == "yes") {
          tempString = "Shake It Off,Weapon,Weapon Proficiency (Simple Weapons)";
        }else{
          tempString = "Shake It Off,Weapon Proficiency (Pistols),Weapon Proficiency (Rifles),Weapon Proficiency (Simple Weapons)";
          }
      } else {
        if (primitive == "yes") {
          tempString = "Weapon Proficiency (Simple Weapons)";
        }else{
          tempString = "Weapon Proficiency (Pistols),Weapon Proficiency (Rifles),Weapon Proficiency (Simple Weapons)";
        }
      }
      break;
      case "Soldier":
        if (primitive == "yes") {
          tempString = "Armor Proficiency (Light),Armor Proficiency (Medium),Weapon Proficiency (Simple Weapons)";
        }else{
          tempString = "Armor Proficiency (Light),Armor Proficiency (Medium),Weapon Proficiency (Pistols),Weapon Proficiency (Rifles),Weapon Proficiency (Simple Weapons)";
        }
      break;
    default:
      break;
  }
  //  console.log("temp string",tempString.split(","))
    this.startingFeats = tempString.split(",");
    this.choices.setStartFeatsLength(tempString.split(",").length);
    // console.log('starting feats', this.startingFeats, bab)
    if (this.choices.getSpecies() != "Tof"){this.startingFeats.push(bonusFeat)};
    // check if the selected species has a conditional bonus feat trait
   await this.checkConditionals();
   await this.showAvailable();
    let tempArr = tempString.split(",")
    if (this.additionalFeatsArray.length > 0){
      tempArr.forEach((el)=> {tempArr.push(el)})
      this.choices.setFeatsArray(tempArr);
      this.heroFeatsSelected.emit(this.choices.getFeatsArray())
    }
}
// checks for conditional feats anbd adds them if conditions are met
async checkConditionals(){
  const species = this.choices.getSpecies();
  // clear array if needed
  this.clearArray(this.conditionalArray);
  // gets the traits from the selected species
   const selectedSpeciesTraits = await this.choices.acquireSpeciesTraits();
 // resets additional feats array.
   if (this.additionalFeatsArray.length > 0) {
     this.clearArray(this.additionalFeatsArray);   
    };
    // if the traits includes conditional bonus feat 
  if (Object.keys(selectedSpeciesTraits).includes("Conditional Bonus Feat")){
    // creates empty array to be used later
    let neMoArr = [];
// checks the length of the array for this property
    for (let i =0 ; i < selectedSpeciesTraits["Conditional Bonus Feat"].length; i++){
      let conditionalFeat = await Object.keys(selectedSpeciesTraits["Conditional Bonus Feat"][i]);
      let value;
      let keyword;
      if (conditionalFeat[0] == "bonus feat"){
        // console.log("checking before chk",selectedSpeciesTraits["Conditional Bonus Feat"][i][conditionalFeat[1]], conditionalFeat[1])
        value = selectedSpeciesTraits["Conditional Bonus Feat"][i][conditionalFeat[1]];
        keyword = conditionalFeat[1];
      }else{
        value = selectedSpeciesTraits["Conditional Bonus Feat"][i][conditionalFeat[0]];
        keyword = conditionalFeat[0];
        // console.log("checking before chk",selectedSpeciesTraits["Conditional Bonus Feat"][i][conditionalFeat[0]], conditionalFeat[0])
      }
      if (keyword == "trained skill"){
        keyword = "trained"
      }
        // console.log("after checks before check", value, keyword )
        // use check requirements function that triggers validated to be true or false
        await this.chkReqs(value, keyword);
        // if validated is true
          if (this.validated == true) {
            //check if the species includes these 2 since they have special circumstances
            if (species == "Arkanian Offshoot (str)" || species == "Arkanian Offshoot (dex)"){

            // pushes 
              this.additionalFeatsArray.push(selectedSpeciesTraits["Conditional Bonus Feat"][i]["bonus feat"]);
              // console.log("the additional feats:",this.additionalFeatsArray)
            }else{
              if (species== "Neimoidian"){
                neMoArr.push(selectedSpeciesTraits["Conditional Bonus Feat"][i]["bonus feat"])
              }else{
                this.conditionalArray.push(selectedSpeciesTraits["Conditional Bonus Feat"][i]["bonus feat"]);
              }
            }
          }     
    }
    if (species == "Neimoidian"){
     this.conditionalArray = [...neMoArr];
    }
  } 
}
async showAvailable(){
  //checks if the array is empty
  if (this.selectableFeats.length != 0){
  // if it isn't empty we use pop method to empty it out
    this.clearArray(this.selectableFeats);
  } 
  if (this.extraSelectableFeats.length != 0){
    this.clearArray(this.extraSelectableFeats);
  }
  // holds the keywords for further down
const species = await this.choices.getSpecies();
// pulls in the values
let BAB = await this.choices.acquireBab();
// look through the imported feats array
 for (let i=0; i< this.featsArray.length; i++){
  // indicates each req and it's values from the feats array at the given index
   let vals: any = Object.values(this.featsArray[i].prereqs);
  // checks is there are no requirements for the first requirement then adds it to the new array of feats available for selection
   if (this.featsArray[i].prereqs.req1.includes("none")){
    if (this.choices.getClass() == "Soldier" && this.featsArray[i].name == "Armor Proficiency (Light)"){
      // do nothing to prevent adding Armor Proficiency (Light) to soldier
    }else{
      (this.additionalFeatsTrigger)? this.extraSelectableFeats.push(this.featsArray[i].name) : this.selectableFeats.push(this.featsArray[i].name);
    }
      // adds the feat with that name to the array if the size requirement matches
   } else if(this.featsArray[i].name == "Powerful Charge" && this.featsArray[i].prereqs.req1[1] <= BAB && this.choices.acquireSpeciesTraits().size != "Small"){
    (this.additionalFeatsTrigger)? this.extraSelectableFeats.push(this.featsArray[i].name) : this.selectableFeats.push(this.featsArray[i].name);
   } else if (this.featsArray[i].name == "Staggering Attack" || this.featsArray[i].name =="Hobbling Strike"){ 
    let apiValue = this.submittedValues[0];
    // console.log("the apivalue:", apiValue);
      if (apiValue == "Rapid Shot" || apiValue == "Rapid Strike"  || species == "Tof"){
        this.selectableFeats.push(this.featsArray[i].name);
         this.notTof == false;
      }
  }else if (this.featsArray[i].name == "Elder's Knowledge"){
    let choice = `${this.submittedValues[0]} (${this.specialOptionSelected[0]})`;
    if (choice == "Skill Focus (Knowledge (Social Sciences))" || choice == "Skill Focus (Knowledge (Galactic Lore))"){
      this.selectableFeats.push(this.featsArray[i].name);
    }
  }else{
/*
    - first for loop will go through each of the different requirements 1-4
    - second loop will to check if any of the keywords are present in the requirements
    - uses a forEach to break down the multiarray's values "vals" into each index to be checked for the keyword's value to see if the 
    player meets the minimum reqs then it is marked as validated
*/ 
    const reqsArray = ["BAB", "feat", "trained", "talent","trait", "Strength", "Dexterity", "Constitution", "Intelligence", "Wisdom", "Charisma" ]
    for (let v = 0; v < vals.length; v++){    
      // j is requirements array
        for (let j=0; j < reqsArray.length; j++){    
          //if there is an or in the requirment array  
          if (vals[v][0] == reqsArray[j]){
            if (vals[v].includes("or")){
              for (let c=2; c<vals[v].length; c++){
                this.chkReqs(vals[v][c], vals[v][0]);
                if (this.validated == true){
                 break; 
                }
              }
            }else{

              let check = vals[v][1];
              switch (reqsArray[j]){
                case "BAB":
                  await this.chkReqs(check, "BAB");
                  j = reqsArray.length;
                 // check >= BAB ? this.validated=true : this.validated = false;
                break;
                case "feat":
                  await this.chkReqs(check, "feat");
                     j = reqsArray.length;              
               //  this.startingFeats.includes(check) ? this.validated=true : this.validated = false;
                break;
                case "trained":
                 await this.chkReqs(check,  "trained");
                  j = reqsArray.length;
              //    skills.includes(check) ? this.validated=true : this.validated = false;
                break;
                case "trait":
                // humans don't have this
                await this.chkReqs(check,  "trait");
                  j = reqsArray.length;
              //    check >= str ? this.validated=true : this.validated = false; 
                break;
                case "Strength":
                await  this.chkReqs(check,  "Strength");
                  j = reqsArray.length;
              //    check >= str ? this.validated=true : this.validated = false; 
                break;
                case "Dexterity":
                await  this.chkReqs(check,  "Dexterity");
                  j = reqsArray.length;
              //    check >= dex ? this.validated=true : this.validated = false;      
                break;
                case "Constitution":
                await  this.chkReqs(check,  "Constitution");
                  j = reqsArray.length;
               //   check >= con ? this.validated=true : this.validated = false;
                break;
                case "Intelligence":
                await  this.chkReqs(check,  "Intelligence");
                  j = reqsArray.length;
               //   check >= int ? this.validated=true : this.validated = false   
                break;
                case "Wisdom":
                 await this.chkReqs(check,  "Wisdom");
                  j = reqsArray.length;
                //  check >= wis ? this.validated=true : this.validated = false;         
                break;
                case "Charisma":
                 await this.chkReqs(check,  "Charisma");
                  j = reqsArray.length;
                //  check >= chr ? this.validated=true : this.validated = false;         
                break;    
              }        
            } 
            } 
      }
      // if any requirements doesn't meet the minimums it returns nothing and breaks out of the loop and the check
      if (this.validated == false) break;
      }
  if(this.validated == true && this.startingFeats.includes(this.featsArray[i].name) == false){ 
    // console.log('pushed',this.featsArray[i].name);
    (this.additionalFeatsTrigger)? this.extraSelectableFeats.push(this.featsArray[i].name) : this.selectableFeats.push(this.featsArray[i].name);
  }
}
 }
 
 // if the species matches "Tof" then they have 2 options when it comes to feats that it can have
 if (this.choices.getSpecies() == "Tof"){
  this.clearArray(this.extraSelectableFeats);
  this.extraSelectableFeats.push("Rapid Shot");
  this.extraSelectableFeats.push("Rapid Strike")
  
}
// get species traits
const traits = this.choices.acquireSpeciesTraits();
let keys = Object.keys(traits);
 // create a new object at each loop to hold the the correct values for the feats array;

//if species has species feats got through and pull each one out
if (keys.includes("Species Feats")){
  for (let j=0; j < Object.keys(traits["Species Feats"]).length; j++){
    let name = Object.keys(traits["Species Feats"])[j];
    let description ="";  
      // if the feat contains an array use the first index of the array to describe the feat
      if(Array.isArray(traits["Species Feats"][name])){
        description = traits["Species Feats"][name][0];
      }else{
        description = traits["Species Feats"][name];
      }
     let obj = {
      name: name,
      description: description,
    };
      this.selectableFeats.push(name);
      this.speciesFeatsArray.push(obj);
      // console.log("added speciesFeat", this.speciesFeatsArray);
  }
}
this.choices.setFeatsArray(this.startingFeats);
// console.log("what's available: ",this.selectableFeats)
}
// function that takes input from the dropdown for feats
async selected(selection: any, indexNum: number){
  if (indexNum == 0){
    this.extraFeatShow = "no";
  }
if (selection != "Select a Feat"){
  (indexNum == 0) ? this.selectedFeat[0] = selection: this.selectedFeat[1] = selection;
  let mod;
  if (this.selectedFeat[0] == "Force Training" && this.selectedFeat[1] == "Force Training"){
    mod = 2;
  }else if (this.selectedFeat[0] == "Force Training" || this.selectedFeat[1] == "Force Training"){
    mod = 1;
  }
  if (this.choices.getSpecies() == "Zabrak"){
    if (selection == "Inborn Resilience"){
      this.zabrakResil = true
     }else{ 
      this.zabrakResil = false;
      if (this.tempDef.reflex > 1 || this.tempDef.fort > 1 || this.tempDef.will > 1){
        // console.log("tempDef", this.tempDef)
        let traits = this.choices.acquireSpeciesTraits();
        traits.Defenses["Fortitude Defense"] =  1;
        traits.Defenses["Reflex Defense"] =  1;
        traits.Defenses["Will Defense"] = 1;
        this.choices.setSpeciesTraits(traits);
        this.tempDef.reflex = 0;
        this.tempDef.fort = 0;
        this.tempDef.will = 0;
      }
     }
  }else{
    this.tempDef.reflex = 0;
    this.tempDef.fort = 0;
    this.tempDef.will = 0;
  }
  this.maxPowers = (this.choices.getAbilityMods()["Wisdom"] + mod)
  // console.log(this.maxPowers);
  // this conditional when met gives user additional options
  let opts = ["Skill Focus", "Skill Training", "Weapon Proficiency", "Exotic Weapon Proficiency"]
  if (opts.includes(selection)){
    this.specifyFeat = "yes";
    if (indexNum == 1){
      this.extraSpecifyFeat = "yes";
    }
    this.submitSpecialFeat(selection, indexNum);
  }else{
    this.specifyFeat = "no";
    if (indexNum == 1){
      this.extraSpecifyFeat = "no";
    }
    this.selectedFeats.push(selection);
  }
  // finds the  index within the feat array that matches the selection based on the feat name
 
  if (this.speciesFeatsArray.length != 0){
    for (let i=0; i< this.speciesFeatsArray.length; i++){
      if (this.speciesFeatsArray[i].name == selection){
        this.selectedFeatName = this.speciesFeatsArray[i].name;
      this.selectedFeatDescription =  this.speciesFeatsArray[i].description; 
      }
    }
    // console.log("speciesFeats:",this.speciesFeatsArray);
  }
    const index =  await this.featsArray.findIndex((el: any) => el.name == selection);
    if (indexNum == 0 && index != -1) {
      this.selectedFeatName = await this.featsArray[index].name;
      this.selectedFeatDescription =  await this.featsArray[index].description;
    }else if (index != -1){
     this.extraFeatName = await this.featsArray[index].name;
     this.extraFeatDescription =  await this.featsArray[index].description;
    }
    if (indexNum == 0){
      if (selection == "Force Training" && this.extraFeatShow == "no"){
        this.showForcePowers = true;
        if (this.heroForceSuite.length > this.maxPowers){
          this.heroForceSuite.pop();
        }
        this.numPowers = (this.maxPowers - this.heroForceSuite.length);
      }else if (selection == "Force Training" && this.extraFeatShow == "yes" && this.heroForceSuite.length != 0){
        while (this.heroForceSuite.length > this.maxPowers){
          this.heroForceSuite.pop();
      }
      this.numPowers = this.maxPowers - this.heroForceSuite.length;
        this.showForcePowers = true;
      }else{
        this.showForcePowers = false;
        this.clearPowers();
        // console.log("no more powers")
      }
    }else{
      if (selection == "Force Training"){
        if (this.selectedFeat[0] == "Force Training"){
          if(this.heroForceSuite.length <= this.maxPowers){
            this.numPowers +=1 
            // console.log("Why?",this.selectedFeat[0]);
          }else{
            while (this.heroForceSuite.length > this.maxPowers){
                this.heroForceSuite.pop();
            }
            this.numPowers = this.maxPowers - this.heroForceSuite.length; 
          }
        }
        this.showForcePowers = true;
      }else{
        if (this.selectedFeat[0] == "Force Training"){
          while (this.heroForceSuite.length > this.maxPowers){
            this.heroForceSuite.pop();
        }
        this.numPowers = this.maxPowers - this.heroForceSuite.length; 
          this.showForcePowers = true;
        }else{
          // console.log("no more powers")
          this.showForcePowers = false;
          this.clearPowers();
        }
      }
    }  

// if no feat is or if user selects Select a feat it removes the feat name anbd description
}else {
  if (indexNum == 0) {
    this.selectedFeatName = "";
    this.selectedFeatDescription = "Select a Feat";
    this.showForcePowers = false;
    this.clearPowers();
    // console.log("no more powers")
  }else{
   this.extraFeatName = ""
   this.extraFeatDescription =  "Select a Feat";
   if (this.selectedFeat[0] != "Force Training"){
      this.showForcePowers = false;
      this.clearPowers(); 
    // console.log("no more powers")
   }
  }
}
}
// Jedi Force Training Functions
// tempObject to hold a current selection since the value comes from 2 different arrays and needs saved before passing onto the next function
forcePower: any;
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
  // console.log("the suite: ", this.heroForceSuite)
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
  // console.log("cleared arr:",  this.heroForceSuite)
}
// End of Jefi Force Powers
// function to check the requirements based on parameters and updates validated variable based on values matching
async chkReqs (apiValue: any, keyword: string){
let BAB = await this.choices.acquireBab();
let int = await this.choices.acquireInt();
let con = await this.choices.acquireCon();
let str = await this.choices.abilities.Strength;
let dex = await this.choices.abilities.Dexterity;
let wis = await this.choices.abilities.Wisdom;
let chr = await this.choices.abilities.Charisma;
let skills = await this.choices.acquireSkillsArray();
let trait = await this.choices.acquireSpeciesTraits();
// console.log("check these values: ", apiValue, keyword)
  switch (keyword){
    case "BAB":
      apiValue <= BAB ? this.validated=true : this.validated = false;
      break;
      case "feat":
        let choice;
      if (this.submittedValues[0] == ""){
        choice = ""
      }else if (this.submittedValues[1] == ""){
        choice = this.submittedValues[0];
      } else {
        choice = `${this.submittedValues[0]} (${this.specialOptionSelected[0]})`;
      } 
      (this.startingFeats.includes(apiValue) || choice == apiValue) ? this.validated = true : this.validated = false;
      // console.log(this.startingFeats.includes(apiValue),this.startingFeats, this.validated);
    break;
    case "trained":
      skills.includes(apiValue) ? this.validated=true : this.validated = false;
    break;
    case "Strength":
      apiValue <= str ? this.validated=true : this.validated = false; 
    break;
    case "Dexterity":
      apiValue <= dex ? this.validated=true : this.validated = false;      
    break;
    case "Constitution":
      apiValue <= con ? this.validated=true : this.validated = false;
    break;
    case "Intelligence":
      apiValue <= int ? this.validated=true : this.validated = false   
    break;
    case "Wisdom":
      apiValue <= wis ? this.validated=true : this.validated = false;         
    break;
    case "Charisma":
      apiValue <= chr ? this.validated=true : this.validated = false;         
    break;
    case "trait":
      let keys = Object.keys(trait);
      keys.includes(apiValue) ? this.validated=true : this.validated = false;
    break;
    default:
      this.validated = false;
    break;
  }
}
// sets the variable to whatever the drop down has been changed to
setFeatOption(selected: string, index: number){ 
  this.specialOptionSelected.splice(index,1,selected);
}

clearArray(arr : Array<any>){
  if (arr.length == 0){
    return;
  }else{
    while(arr.length){
      arr.pop()
    }
  }
}

// function for the additional options of certain feats
async submitSpecialFeat(feat: string, indexNum: number) {
  // console.log("the feat: " , feat)
  // console.log("submitSpecialty: ",feat,indexNum)
  if (this.specialFeatOptions.length != 0){
    // console.log("clear out loop");
   this.clearArray(this.specialFeatOptions);
  }
  if (this.extraSpecialFeatOptions.length !=0){
    this.clearArray(this.extraSpecialFeatOptions);
  }
    let skillArray = await this.choices.acquireSkillsArray();
    //  console.log("the skillsArray", skillArray)
  switch (feat){
    case "Skill Focus":
      this.specifyFeatButtonName = "Select Skill"
      for(let i=0; i<skillArray.length; i++){
        this.specialFeatOptions.push(skillArray[i]);
      }
     if (this.additionalFeatsArray.length != 0){
      const index = this.specialFeatOptions.findIndex((el: any) => el == this.focusedSkill)
        this.specialFeatOptions.splice(index, 1);
     }
    break;
    case "Skill Training":
      this.specifyFeatButtonName = "Select Skill"
      let finalArr: Array<string> = [];
      // console.log("trained skills:",this.choices.getTrainedSkills())
      for (let i =0; i<this.choices.classSkills.length; i++){
        if (skillArray.includes(this.choices.classSkills[i].name) == false ){
          finalArr.push(this.choices.classSkills[i].name);
        }
      }
      if (this.submittedValues[0] == "Skill Training" && indexNum == 1){ 
     const index = finalArr.findIndex((el: any) => el == this.specialOptionSelected[0])
      finalArr.splice(index,1);
      // console.log("removing an option: ", this.specialOptionSelected[0])
    }
      // console.log("feats finalArr: ", finalArr)  
        this.specialFeatOptions = [...finalArr];
      
    break;
    case "Weapon Proficiency":
      this.specifyFeatButtonName = "Select Weapon Group";
      let weaponOptions = ["Simple Weapons", "Pistols", "Rifles", "Lightsabers", "Heavy Weapons", "Advanced Melee Weapons"]
      let feats = await this.choices.getFeatsArray();
      // console.log("feats", feats)
       for (let i =0; i<weaponOptions.length;i++){
        const word = `Weapon Proficiency (${weaponOptions[i]})`
        if (feats.includes(word)== false){
          this.specialFeatOptions.push(weaponOptions[i]);
        }
      } 
    break;
    case "Exotic Weapon Proficiency":
      let exclusiveSpecies = ["Gamorrean","Gungan","Wookiee","Kissai","Massassi","Felucians","Squib","Verpine"];
      let excludeArr: any = [];
      const species = this.choices.getSpecies();
      let exoticOpts: Array<any> = [...this.exoticMelee, ...this.exoticRange];
      if (exclusiveSpecies.includes(species)){
        switch (species){
          case "Gamorrean":
            excludeArr = ["Arg'garok"];
          break;
          case "Gungan":
            excludeArr = ["Atlatl","Cesta"];
          break;
          case "Wookiee":
            excludeArr = ["Bowcaster","Ryyk Blade"];
          break;
          case "Kissai":
            excludeArr = ["Massassi Lanvarok"];
          break;
          case "Massassi":
            excludeArr = ["Massassi Lanvarok"];
            break;
          case "Felucians":
            excludeArr = ["Felucian Skullblade"];
          break;
          case "Squib":
            excludeArr = ["Squib Tensor Rifle"];
          break;
          case "Verpine":
            excludeArr = ["Verpine Shattergun"];
        }
      }
        exoticOpts.forEach((el: any)=> {
          if (excludeArr.length == 0){
            this.specialFeatOptions.push(el);
          }else if (excludeArr.includes(el) == false){
            this.specialFeatOptions.push(el);
          }
        })
    break;
  }
  /*
    if (feat == "Skill Focus"){
    this.specifyFeatButtonName = "Select Skill"
    for(let i=0; i<skillArray.length; i++){
      this.specialFeatOptions.push(skillArray[i]);
    }
   if (this.additionalFeatsArray.length != 0){
    const index = this.specialFeatOptions.findIndex((el: any) => el == this.focusedSkill)
      this.specialFeatOptions.splice(index, 1);
   }
  }else if (feat == "Skill Training"){
      this.specifyFeatButtonName = "Select Skill"
      let finalArr: Array<string> = [];
      // console.log("trained skills:",this.choices.getTrainedSkills())
      for (let i =0; i<this.choices.classSkills.length; i++){
        if (skillArray.includes(this.choices.classSkills[i].name) == false ){
          finalArr.push(this.choices.classSkills[i].name);
        }
      }
      if (this.submittedValues[0] == "Skill Training" && indexNum == 1){ 
     const index = finalArr.findIndex((el: any) => el == this.specialOptionSelected[0])
      finalArr.splice(index,1);
      // console.log("removing an option: ", this.specialOptionSelected[0])
    }
      // console.log("feats finalArr: ", finalArr)  
        this.specialFeatOptions = [...finalArr];
      
    }else if (feat == "Weapon Proficiency"){
      this.specifyFeatButtonName = "Select Weapon Group"
      let weaponOptions = ["Simple Weapons", "Pistols", "Rifles", "Lightsabers", "Heavy Weapons", "Advanced Melee Weapons"]
      let feats = await this.choices.getFeatsArray();
      // console.log("feats", feats)
       for (let i =0; i<weaponOptions.length;i++){
        const word = `Weapon Proficiency (${weaponOptions[i]})`
        if (feats.includes(word)== false){
          this.specialFeatOptions.push(weaponOptions[i]);
        }

      } 
      // console.log("the weaponsArray", weaponOptions)
    } */
    this.specialFeatOptions.unshift("Select One")
   if (feat == "Skill Focus" && this.submittedValues[0] == "Skill Training" && indexNum == 1){
    this.extraSpecialFeatOptions = await [...this.specialFeatOptions, this.specialOptionSelected[0]]  
    // console.log("time to push", this.extraSpecialFeatOptions)
  }else{
    this.extraSpecialFeatOptions = await [...this.specialFeatOptions]
  }
    // console.log("after add:", this.extraSpecialFeatOptions);
    if (this.submittedValues[0] == "Weapon Proficiency" && indexNum == 1){
      const index = this.extraSpecialFeatOptions.findIndex((el: any) => el == this.specialOptionSelected[0])
      this.extraSpecialFeatOptions.splice(index,1);
    }
  // console.log("the specials array", this.specialFeatOptions)
}
focusedSkill: string = "";
setAdditionalFeat(selection: any){
  this.additionalFeat = selection;
  let skill = selection.split(' ').slice(2).join(' ');
  let len = skill.length -1;
  this.focusedSkill = skill.substring(1, len);
// console.log("the skill is", this.focusedSkill);
}

submit(selection: any, index: number){
let finArr: Array <string> = [];
let specArr = ["Skill Focus","Skill Training","Weapon Proficiency","Exotic Weapon Proficiency"]
let choice = selection;
this.submittedValues.splice(index, 1, selection)
if (selection == "Inborn Resilience"){
  this.swapDefenses('nothing', 'final')
}
let species = this.choices.getSpecies();
// (species == "Tof") ? this.notTof == false : this.notTof == true;
  if (species === "Human" || species == "Nyriaanan" || species == "Anarrian" || species == "Tof"){
  this.extraFeatShow = 'yes'
  if (index == 1){
    for (let i = 0; i<this.submittedValues.length; i++){
      if (specArr.includes(this.submittedValues[i])){
        choice = `${this.submittedValues[i]} (${this.specialOptionSelected[i]})`
      }else if (this.submittedValues[i] != ""){
        choice = this.submittedValues[i]
      }
      finArr.push(choice);
      // console.log("the choice:", choice, finArr);
    }
      if (this.additionalFeatsArray.length != 0){   
        finArr = [...this.additionalFeat, choice];
      }else{
        this.setAdditionalFeat("");
        this.focusedSkill = "";
        let tempArr = finArr
        if (this.conditionalArray.length != 0){
          finArr = [...this.conditionalArray, ...tempArr]
        }else{
          
        }
      } 
      this.submitFinal(finArr);
  }else{
    this.showAvailable();
  }
  }else{
    this.extraFeatShow = 'no'
    if (specArr.includes(selection)){
      choice = `${selection} (${this.specialOptionSelected[0]})`
    }
    if (this.additionalFeatsArray.length != 0){
      (species != "Neimoidian")? finArr = [this.additionalFeat, choice] : finArr = [...this.additionalFeat, choice];
          this.submitFinal(finArr);
    }else{
      this.setAdditionalFeat("");
      this.focusedSkill = "";
      if (this.conditionalArray.length != 0){
        finArr = [...this.conditionalArray, choice]
        this.submitFinal(finArr);
      }else{
        this.submitFinal(choice);
      }
    }
  }
  
  // console.log("the submitted:", this.submittedValues, index, this.specialOptionSelected, this.additionalFeat, this.conditionalArray);
  
}
async swapDefenses(swap: string, sequence: any){
  let ref, will, fort;
  this.spec = Object.assign(this.choices.acquireSpeciesTraits())
  if (sequence == "initial"){
    switch (swap){
      case "rw":
        ref = 0;
        will = 2;
        fort = 1;
      break;
      case "rf":
        ref = 0;
        will = 1;
        fort = 2;
      break;
      case "wr":
        ref = 2;
        will = 0;
        fort = 1;
      break;
      case "wf":
        ref = 1;
        will = 0;
        fort = 2;
      break;
      case "fr":
        ref = 2;
        will = 1;
        fort = 0;
      break;
      case "fw":
        ref = 1;
        will = 2;
        fort = 0;
      break;
          
    }
    this.tempDef = {
      "reflex" : ref,
      "fort" : fort,
      "will": will,
    };
    console.log(swap, this.tempDef);
  }else{   
    let r,w,f;
    console.log(swap, this.spec.Defenses, "/",this.spec, this.tempDef);
    this.spec.Defenses["Fortitude Defense"] = this.tempDef.fort;
    this.spec.Defenses["Reflex Defense"] = this.tempDef.reflex;
    this.spec.Defenses["Will Defense"] = this.tempDef.will;
    this.choices.setSpeciesTraits(this.spec)
    f = this.spec.Defenses["Fortitude Defense"];
    r = this.spec.Defenses["Reflex Defense"];
    w = this.spec.Defenses["Will Defense"];
    this.tempDef.fort = f;
    this.tempDef.reflex = r;
    this.tempDef.will = w;
  }
}
submitFinal(selection: any){
  let featsArr: Array<string> = []
  if (Array.isArray(selection)){
    featsArr = [...this.startingFeats, ...selection]
  }else{
    featsArr = [...this.startingFeats, selection]
  }
// console.log("final thoughts:",selection, featsArr)
this.heroFeatsSelected.emit(featsArr);
this.choices.startTalentComponent();
this.heroForcePowers.emit(this.heroForceSuite);
}

}
