import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ChoicesSenderService } from 'src/app/services/choices-sender.service';
import { SwapiService } from 'src/app/services/swapi.service';
import { SWPsuedoApi } from 'src/app/services/swpsuedoapi.service';

@Component({
  selector: 'talents',
  templateUrl: './talents.component.html',
  styleUrls: ['./talents.component.scss']
})
export class TalentsComponent implements OnInit {

  constructor(private swApiService: SwapiService, private choices: ChoicesSenderService, private pseudoApi : SWPsuedoApi) { }
talentsArray: any;
talentTreeArray: any;
availableTalents: Array<any> = [];
showTalents: boolean = false;
availableTalentTreeArray: Array <string> = [];
validated: boolean = false;
specifyTalent: string = "no";
specificsArray: any;
chosenSpecificTalent: string = "";
selectedTalentName: string = "";
selectedTalentDescription: string = "";
hideButton: string = "hide";
@Output () heroTalentSelected: EventEmitter<any> = new EventEmitter<any>();
@Output () heroTalentSpecified: EventEmitter<any> = new EventEmitter<any>();
  ngOnInit(): void {

    /**
     * 
    this.swApiService.getTalents().subscribe(payload => {
      this.talentsArray = payload;
      // console.log("talents: ", this.talentsArray);
    })
    
    this.swApiService.getTalentTree().subscribe(payload =>{
      this.talentTreeArray = payload;
      // console.log("talent tree: ", this.talentTreeArray);
    })
     * 
     */
    this.talentsArray = this.pseudoApi.getTalents();
    this.talentTreeArray = this.pseudoApi.getTalentTrees();
    this.choices.intiializeTalents.subscribe(() => {
      this.sortAvailable();
    })
  }
// sorts the talent and talent tree arrays to see what is permissable by class before running a check reqs function

sortAvailable(){
    if (this.availableTalentTreeArray.length != 0){
      while(this.availableTalentTreeArray.length){
        this.availableTalentTreeArray.pop()
      }
    }
    this.showTalents = true;
    let heroClass = this.choices.getClass();
    for (let i = 0; i < this.talentTreeArray.length; i++){
      if (this.talentTreeArray[i].classUsage.includes(heroClass)){
        this.availableTalentTreeArray.push(this.talentTreeArray[i].id);
      }
    }
    // console.log("available TT: ", this.availableTalentTreeArray);
    this.showAvailable();
  }

async showAvailable(){
  if (this.availableTalents.length != 0){
    while(this.availableTalents.length){
      this.availableTalents.pop();
    }
  }
  for(let i=0; i<this.talentsArray.length;i++){
    for(let j=0; j<this.availableTalentTreeArray.length; j++){
      if(this.talentsArray[i].TalentTreeId == this.availableTalentTreeArray[j]){   
    await this.checkRequirements(this.talentsArray[i]);
       if (this.validated == true){
         this.availableTalents.push(this.talentsArray[i]);
      }
    }
    }
  }
  this.choices.setAvailableTalents(this.availableTalents);
//  console.log("the talents: ",this.availableTalents)
}

//checks to see if each talent passsed in meets the requirements.
async checkRequirements(talent: any){
//  console.log("talent in check",talent)
    
   let preReqs = await talent.preReqs;
    let vals: any = Object.values(preReqs);
    let featsArray = await this.choices.getFeatsArray();
    for (let i=0; i < vals.length; i++){
      if(vals[i].includes("none")){
       this.validated = true;
       
      }else if (vals[i].includes("talent")){
        this.validated = false;
        i = vals.length;  
      }else if (vals[i].includes("feat")){
          if (vals[i].includes("or")){
            let orReq: Array<string> = [];
              for (let j=2; j<vals[i].length; j++){
                if(featsArray.includes(vals[i][j])) { 
                  orReq.push("yes")
                } else {
                  orReq.push("no");
                }            
              }
              if (orReq.includes("yes")) {
                this.validated = true;
              }else {             
                this.validated = false;
                i = vals.length;
                break;             
              }
          }else {
            if (featsArray.includes(vals[i][1])) {
              this.validated = true 
              }else{ 
                this.validated = false;
                i = vals.length;
                break;
               
            }
          }
      }
      
    }
//    console.log(talent.name, this.validated)
}


// uses the dropdown to display what he talent is and it's description
async selectedTalent(selection: any){  
  let talentSkills = ["Assured Skill","Exceptional Skill","Skill Boon","Skill Confidence","Skillful Recovery"]
  if  (this.hideButton == "hide"){
    this.hideButton= "show";
  }
  if (selection != "Select a Talent"){
    const index = await this.availableTalents.findIndex((el: any) => el.name == selection);
    // console.log("this is the selected id: ", this.featsArray.findIndex(index))
    //  
     this.setSelectedTalent(this.choices.getAvailableTalents()[index])
    //  console.log(index);
    if (talentSkills.includes(selection)){
     await this.addTalentSpecifics(selection);
      // console.log("temp add:",tempAdd)
    }else {
      if (this.specificsArray != undefined){
        while(this.specificsArray.length){
          this.specificsArray.pop();
      }
      }
    this.specifyTalent = "no";
  }
}else {
  this.selectedTalentName = selection;
  this.selectedTalentDescription = "";
  this.hideButton = "hide"
}
 

  
 }

 addTalentSpecifics(selection: any){
   this.specifyTalent = "yes";
   if (selection == "Assured Skill"){
     this.specificsArray = [...this.choices.getAllSkillsArray()];
    }else {
      this.specificsArray = [...this.choices.getTrainedSkills()];
    }
    console.log("loading specifics array", this.specificsArray, selection);
 }
 setSelectedTalent(selection: any){
  let splitter = selection.name.split(' ');
  if (splitter.length >= 3 && splitter[0] == "Exceptional" ){
        // console.log("saving splitter", splitter, selection.name)
      let tempArr = [...splitter[0], splitter[1]]
      this.selectedTalentName = tempArr.join(' ');
      this.selectedTalentDescription = selection.description;
      }else{
        // console.log("saving", selection)
      this.selectedTalentName = selection.name;
      this.selectedTalentDescription = selection.description;
      }    
   
 }
 getSelectedTalentName(){
  return this.selectedTalentName;
 }
 getSelectedTalentDesc(){
  return this.selectedTalentDescription;
 }
selectSpecificTalent(selection: any){
  if (selection != "Select a skill"){
    this.chosenSpecificTalent = selection;
  }else {
    this.chosenSpecificTalent = "nope";
  }
}
removeParanthesis(str : any){
  // console.log("newArr", str)
  if (str != undefined){
  const newArr = str.split('')
    let pump = [];
    if (newArr.includes('(')== false){
      return "no";
    }else{
      for (let i=0;i<newArr.length; i++){
        if (newArr[i] == "("){
            break;
          }
          pump.push(newArr[i]);
      }  
      pump.pop();
      let hiddenWord = pump.join('') ;
      // console.log(hiddenWord);
      return hiddenWord;
    }

    }
  return "no";
}
async submit(selection: any){
  let index;
  let talentSkills = ["Assured Skill","Exceptional Skill","Skill Boon","Skill Confidence","Skillful Recovery"]
  if (selection != "Select a Talent"){
    
    // console.log("the name without parenthesis",selection)
    if (talentSkills.includes(selection)){
      if (this.chosenSpecificTalent != "nope"){
        index = await this.choices.getAvailableTalents().findIndex((el: any) => el.name == selection);
        let tempArr = [this.getSelectedTalentName() + ` (${this.chosenSpecificTalent})`, this.choices.getAvailableTalents()[index], this.getSelectedTalentDesc(), this.chosenSpecificTalent];
        this.heroTalentSpecified.emit(tempArr)
        // console.log("sent this talent:",tempArr,this.choices.getAvailableTalents()[index])
      }
    } else{
      index = await this.choices.getAvailableTalents().findIndex((el: any) => el.name == selection);
      this.heroTalentSelected.emit(this.choices.getAvailableTalents()[index])
      // console.log("sent this talent:",this.choices.getAvailableTalents()[index])
      
    }
  }

}

}
