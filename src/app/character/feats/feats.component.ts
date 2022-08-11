import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ChoicesSenderService } from 'src/app/services/choices-sender.service';
import { SwapiService } from 'src/app/services/swapi.service';


@Component({
  selector: 'feats',
  templateUrl: './feats.component.html',
  styleUrls: ['./feats.component.scss']
})
export class FeatsComponent implements OnInit {

  constructor(private swApiService: SwapiService, private choices: ChoicesSenderService) { }
featsArray: any;
startingFeats: Array<string> = [];
selectedFeats: Array<string> = [];
selectedHeroicClass = this.choices.selectedClass;
heroicClass: string = '';
extraFeat: string = 'no';
selectableFeats: Array<string> = [];
selectedFeat: Array<any> = ["", ""];
extraSelectedFeat: string = "";
additionalFeatsArray: Array<string> = [];
specifyFeat: string = "no"
extraSpecifyFeat: string = "no"
specifyFeatButtonName = "default"
specialFeatOptions: Array<string> = [];
extraSpecialFeatOptions: Array<string> = [];
specialOptionSelected: Array<any> = ["",""];
extraFeatShow: string = "no";
validated: boolean = true;
selectedFeatName: string = "";
selectedFeatDescription: string = "";
extraFeatName: string = "";
extraFeatDescription: string = "";
conditionalArray: Array<string> = [];
extraSelectableFeats: Array<string> = []
additionalFeatsTrigger: boolean = false;
additionalFeat: string = "";
savedSkills: Array <string> = ["",""];
submittedValues: Array<string> = ["", ""]
notTof: boolean = true;

@Output () heroFeatsSelected: EventEmitter<any> = new EventEmitter<any>()
@Output () heroSkillTrained: EventEmitter<any> = new EventEmitter<any>()

  ngOnInit(): void {
    this.swApiService.getFeats().subscribe(payload =>{
      this.featsArray = payload;
      // console.log("feats: ", this.featsArray);
    })
    this.choices.setStartingFeats.subscribe(() => {   
      this.acquireFeats();
    });    
    
  }

 
// getter for class
setClass(heroicClass: string){
  this.heroicClass = heroicClass;
}


// checks requirements and class to display starting feats
async acquireFeats(){
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
        // use check requirments function that triggers validated to be true or false
        await this.chkReqs(value, keyword);
        // if validated is true
          if (this.validated == true) {
            //check if the species includes these 2 since they have special circumstances
            if (species == "Arkanian Offshoot (str)" || species == "Arkanian Offshoot (dex)"){

            // pushes 
              this.additionalFeatsArray.push(selectedSpeciesTraits["Conditional Bonus Feat"][i]["bonus feat"]);
              console.log("the additional feats:",this.additionalFeatsArray)
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

// pulls in the values
let BAB = await this.choices.acquireBab();
// look through the imported feats array
 for (let i=0; i< this.featsArray.length; i++){
  // indicates each req and it's values from the feats array at the given index
   let vals: any = Object.values(this.featsArray[i].prereqs);
  // checks is there are no requirements for the first requirement then adds it to the new array of feats available for selection
   if (this.featsArray[i].prereqs.req1.includes("none")){
    (this.additionalFeatsTrigger)? this.extraSelectableFeats.push(this.featsArray[i].name) : this.selectableFeats.push(this.featsArray[i].name);
      // adds the feat with that name to the array since a human matches the size requirement automatically
   } else if(this.featsArray[i].name == "Powerful Charge" && this.featsArray[i].prereqs.req1[1] <= BAB && this.choices.acquireSpeciesTraits().size != "Small"){
    (this.additionalFeatsTrigger)? this.extraSelectableFeats.push(this.featsArray[i].name) : this.selectableFeats.push(this.featsArray[i].name);
    
  }else if (this.featsArray[i].prereqs.req1.includes("species")) {
// not being used for this

  }
  else{
/*
    - first for loop will go through each of the different requirements 1-4
    - second loop will to check if any of the keywords are present in the requirements
    - uses a forEach to break down the multiarray's values "vals" into each index to be checked for the keyword's value to see if the 
    player meets the minimum reqs then it is marked as validated
*/ 
    const reqsArray = ["BAB", "feat", "trained", "talent","trait", "Strength", "Dexterity", "Constitution", "Intelligence", "Wisdom", "Charisma" ]
    for (let v = 0; v < vals.length; v++){    
      
        for (let j=0; j < reqsArray.length; j++){
          
        if (vals[v].includes("or")){
          for(let c=2; c< vals.length; c++ ){
            this.chkReqs(vals[v][c], vals[v][0])
            if (this.validated == false) break;  
          }
        } else if (vals[v][0] == reqsArray[j]){
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
            this.validated = false;
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
  // this conditional when met gives user additional options
  if (selection == "Skill Focus" || selection == "Skill Training" || selection == "Weapon Proficiency"){
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
   const index =  await this.featsArray.findIndex((el: any) => el.name == selection);
   if (indexNum == 0) {
     this.selectedFeatName = await this.featsArray[index].name;
     this.selectedFeatDescription =  await this.featsArray[index].description;
   }else{
    this.extraFeatName = await this.featsArray[index].name;
    this.extraFeatDescription =  await this.featsArray[index].description;
   }
   
// if no feat is or if user selects Select a feat it removes the feat name anbd description
}else {
  if (indexNum == 0) {
    this.selectedFeatName = "";
    this.selectedFeatDescription = "Select a Feat";
  }else{
   this.extraFeatName = ""
   this.extraFeatDescription =  "Select a Feat";
  }
}
}

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
// console.log("check these values: ", apiValue, keyword)
  switch (keyword){
    case "BAB":
      apiValue <= BAB ? this.validated=true : this.validated = false;
    break;
    case "feat":
      this.startingFeats.includes(apiValue) ? this.validated=true : this.validated = false;
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
    // console.log("the skillsArray", skillArray)
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
      console.log("trained skills:",this.choices.getTrainedSkills())
      for (let i =0; i<this.choices.classSkills.length; i++){
        if (skillArray.includes(this.choices.classSkills[i]) == false ){
          finalArr.push(this.choices.classSkills[i]);
        }
      }
      if (this.submittedValues[0] == "Skill Training" && indexNum == 1){ 
     const index = finalArr.findIndex((el: any) => el == this.specialOptionSelected[0])
      finalArr.splice(index,1);
      console.log("removing an option: ", this.specialOptionSelected[0])
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
    }
    this.specialFeatOptions.unshift("Select One")
   if (feat == "Skill Focus" && this.submittedValues[0] == "Skill Training" && indexNum == 1){
    this.extraSpecialFeatOptions = await [...this.specialFeatOptions, this.specialOptionSelected[0]]  
    console.log("time to push", this.extraSpecialFeatOptions)
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
let specArr = ["Skill Focus","Skill Training","Weapon Proficiency"]
let choice = selection;
  this.submittedValues.splice(index, 1, selection)

let species = this.choices.getSpecies();
(species == "Tof") ? this.notTof == false : this.notTof == true;
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
  }
  }else{
    this.extraFeatShow = 'no'
    if (specArr.includes(selection)){
      choice = `${selection} (${this.specialOptionSelected[0]})`
    }
    if (this.additionalFeatsArray.length != 0){
      finArr = [...this.additionalFeat, choice];
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
submitFinal(selection: any){
  let featsArr: Array<string> = []
  if (Array.isArray(selection)){
    featsArr = [...this.startingFeats, ...selection]
  }else{
    featsArr = [...this.startingFeats, selection]
  }
console.log("final thoughts:",selection, featsArr)
this.heroFeatsSelected.emit(featsArr);
this.choices.startTalentComponent();
}

}
