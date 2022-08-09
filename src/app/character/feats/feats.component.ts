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
selectedFeat: string = "";
additionalFeatsArray: Array<string> = [];
specifyFeat: string = "no"
specifyFeatButtonName = "default"
specialFeatOptions: Array<string> = [];
specialOptionSelected: string = "";


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
let bab = await this.choices.acquireBab();
let int = await this.choices.acquireInt();
let con = await this.choices.acquireCon();
let species = await this.choices.getSpecies();

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
    this.clearConditionals();
    if (species === "Human" || species == "Nyriaanan" || species == "Anarrian" || species == "Tof"){
      this.showAvailable();
      this.extraFeat = "yes";
      
    }else{
      this.extraFeat = "no";
      if (this.choices.featsArray.length !=0){
        // if it isn't empty we use pop method to empty it out
          while(this.choices.featsArray.length){
            this.choices.featsArray.pop()
          }
        }
        let tempArr = tempString.split(",")
        if (this.additionalFeatsArray.length > 0){
          tempArr.forEach((el)=> {tempArr.push(el)})
        }
      this.choices.setFeatsArray(tempArr);
      this.heroFeatsSelected.emit(this.choices.getFeatsArray())
    }
}

async showAvailable(){
  //checks if the array is empty
  if (this.selectableFeats.length != 0){
  // if it isn't empty we use pop method to empty it out
    while(this.selectableFeats.length){
      this.selectableFeats.pop()
    }
  }
  // holds the keywords for further down

// pulls in the values
let BAB = await this.choices.acquireBab();
// for loop to look through the imported array fro the api
 for (let i=0; i< this.featsArray.length; i++){
  
  // indicates each req and it's values from the feats array at the given index
 
  let vals: any = Object.values(this.featsArray[i].prereqs);
  // checks is there are no requirements for the first requirement then adds it to the new array of feats available for selection
   if (this.featsArray[i].prereqs.req1.includes("none")){
     this.selectableFeats.push(this.featsArray[i].name)
    
  // adds the feat with that name to the array since a human matches the size requirement automatically
   } else if(this.featsArray[i].name == "Powerful Charge" && this.featsArray[i].prereqs.req1[1] <= BAB){
    this.selectableFeats.push(this.featsArray[i].name)
    
  }else if (this.featsArray[i].prereqs.req1.includes("species")) {
// not being used for this

  }
  else{
/*
    - first for loop will go through each of the different requirements 1-4
    - second loop will to check if any of the keywords are present in the requirements
    - uses a forEach to break down the multiarray's values "vals" into each index to be checked for the keyword's value to see if the player meets the minimum reqs then it is marked as validated
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
  if(this.validated == true && this.startingFeats.includes(this.featsArray[i].name)== false){ 
    // console.log('pushed',this.featsArray[i].name);
    this.selectableFeats.push(this.featsArray[i].name);}
}
 }
 // if the species matches "Tof" then they have 2 options when it comes to feats that it can have
 if (this.choices.getSpecies() == "Tof"){
  while (this.selectableFeats.length){
    this.selectableFeats.pop();
  }
  this.selectableFeats.push("Rapid Shot");
  this.selectableFeats.push("Rapid Strike")
}
this.choices.setFeatsArray(this.startingFeats);
// console.log("what's available: ",this.selectableFeats)

}

validated: boolean = true;

selectedFeatName: string = ""
selectedFeatDescription: string = ""
// function that takes input from the dropdown for feats
async selected(selection: any){
  this.specialOptionSelected = ""
if (selection != "Select a Feat"){
  this.selectedFeat = selection;
  // this conditional when met gives user additional options
  if (selection == "Skill Focus" || selection == "Skill Training" || selection == "Weapon Proficiency"){
    this.specifyFeat = "yes";
    this.submitSpecialFeat(selection);
  }else{
    this.specifyFeat = "no";
    this.selectedFeats.push(selection);
  }
  // finds the  index within the feat array that matches the selection based on the feat name
   const index =  await this.featsArray.findIndex((el: any) => el.name == selection);

     this.selectedFeatName = await this.featsArray[index].name;
     this.selectedFeatDescription =  await this.featsArray[index].description;
   
  
// if no feat is or if user selects Select a feat it removes the feat name anbd description
}else {
  this.selectedFeatName = "";
  this.selectedFeatDescription = "Select a Feat";
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
// clears out the additionalFeats Array
async clearConditionals(){
  if (this.additionalFeatsArray.length > 0) {
    while (this.additionalFeatsArray.length){
      this.additionalFeatsArray.pop();
   };
};
  const selectedSpeciesTraits = await this.choices.acquireSpeciesTraits();
  if (Object.keys(selectedSpeciesTraits).includes("Conditional Bonus Feat")){
    let neMoArr = [];
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
        await this.chkReqs(value, keyword);
          if (this.validated == true) {
            if (this.choices.getSpecies() == "Arkanian Offshoot (str)" || this.choices.getSpecies() == "Arkanian Offshoot (dex)"){
              this.additionalFeatsArray.push(selectedSpeciesTraits["Conditional Bonus Feat"][i]["bonus feat"]);
            }else{
              if (this.choices.getSpecies()== "Neimoidian"){
                neMoArr.push(selectedSpeciesTraits["Conditional Bonus Feat"][i]["bonus feat"])
              }
              this.submit(selectedSpeciesTraits["Conditional Bonus Feat"][i]["bonus feat"]);
            }
          }
          
    }
    if (this.choices.getSpecies()== "Neimoidian"){
     this.submit(neMoArr)
    }
  } 
}
// sets the variable to whatever the drop down has been changed to
setFeatOption(selected: string){
  this.specialOptionSelected = selected;
}

// function for the additional options of certain feats
async submitSpecialFeat(feat: string) {
  // console.log("the feat: " , feat)
  if (this.specialFeatOptions.length != 0){
    // console.log("clear out loop");
    while(this.specialFeatOptions.length){
      this.specialFeatOptions.pop();
    }
  }
    let skillArray = await this.choices.acquireSkillsArray();
    // console.log("the skillsArray", skillArray)
  if (feat == "Skill Focus"){
    this.specifyFeatButtonName = "Select Skill"
    for(let i=0; i<skillArray.length; i++){
      this.specialFeatOptions.push(skillArray[i]);
    }
  }else if (feat == "Skill Training"){
      this.specifyFeatButtonName = "Select Skill"
      let finalArr: Array<string> = [];
      for (let i =0; i<this.choices.classSkills.length; i++){
        if (skillArray.includes(this.choices.classSkills[i])== false ){
          finalArr.push(this.choices.classSkills[i]);
        }
      }  
      // console.log("feats finalArr: ", finalArr)
         for(let i=0; i<finalArr.length; i++){
        this.specialFeatOptions.push(finalArr[i]);
      }
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
    if (feat == "Weapon Proficiency"){
      // console.log("weap spec opts", this.specialFeatOptions)
    }
    this.specialFeatOptions.unshift("Select One")
  // console.log("the specials array", this.specialFeatOptions)

}
// removes paranthese from a word with paranthese in it and returns the word within the paranthesis
/*
removeParanthesis(str : any){
  console.log("newArr", str)
  if (str != undefined){
  const newArr = str.split('')
    let index;
    if (newArr[0] == "A"){
      return "no";
    }else{
      for (let i=0;i<newArr.length; i++){
        if (newArr[i] == "("){
            index = i + 1
             break;
          }
      }  
      let hiddenWord = newArr.slice(index, -1).join('');
      console.log(hiddenWord);
      return hiddenWord;
    }

    }
  return "no";
}
*/
// function that handles when the select feat is pushed to update the character sheet and the choices service
async submit(selection: any){
  if (this.choices.featsArray.length != 0){
    while (this.choices.featsArray.length){
      this.choices.featsArray.pop();
    }
  }
  // console.log("the length" , this.choices.getStartFeatsLength())
  this.selectedFeats.pop();
  const length = this.choices.getStartFeatsLength()
  

  // if condtition is met then it modifies the feat to include the feat with the options in paranthesis.
  if (length < this.startingFeats.length){
    await this.startingFeats.pop();
    this.choices.setFeatsArray(this.startingFeats);
  }
let choice = selection;
// checks the selection to include specific words for the special cases
if (selection == "Skill Focus" || selection == "Skill Training" || selection == "Weapon Proficiency"){
  // makes sure that the selection is not blank or on Select One as an option
  if (this.specialOptionSelected != "" && this.specialOptionSelected != "Select One"){
    // emits skill that is chosen so that it can update the character sheet and skills array
    if (selection == "Skill Training"){
      this.heroSkillTrained.emit(this.specialOptionSelected);
    }
    // adds paranthesis and the secondary option to the selection
    choice = `${selection} (${this.specialOptionSelected})` 
    this.specialOptionSelected = "";
    const tempArr: any =  [...this.startingFeats,choice]
    // console.log("this is tempArr", tempArr, this.selectedFeats, this.startingFeats)
      this.choices.setFeatsArray(tempArr);
    }else{
      // if it was blank or select one then it doesn't change the feats array
      const tempArr: any =  [...this.startingFeats]
      // console.log("this is tempArr", tempArr, this.selectedFeats, this.startingFeats)
      this.choices.setFeatsArray(tempArr);
    }
    this.heroSkillTrained.emit("");
  }else{
    // Array.isArray checks to see if selection is an array of feats if it is then it will add each one to the array in a for loop then add to the feats array
    if (Array.isArray(selection) ){
      this.heroSkillTrained.emit("");
      let tempArr: any = [...this.startingFeats]     
      for (let i=0; i<selection.length; i++){
        tempArr.push(selection[i]);
        
      }
      this.choices.setFeatsArray(tempArr);
    }else {
      
      // if this isn't one of the special feats or doesn't have more then one feat to add then it adds it normally
       this.heroSkillTrained.emit("");   
       const tempArr: any =  [...this.startingFeats,choice]
      //  console.log("this is tempArr", tempArr, this.selectedFeats, this.startingFeats)
       this.choices.setFeatsArray(tempArr);
     }
  }
  
  this.heroFeatsSelected.emit(this.choices.getFeatsArray());
  this.choices.startTalentComponent();
  
}

}
