import { Component, OnInit } from '@angular/core';
import { ChoicesSenderService } from 'src/app/services/choices-sender.service';
import { SwapiService } from 'src/app/services/swapi.service';

@Component({
  selector: 'talents',
  templateUrl: './talents.component.html',
  styleUrls: ['./talents.component.scss']
})
export class TalentsComponent implements OnInit {

  constructor(private swApiService: SwapiService, private choices: ChoicesSenderService) { }
talentsArray: any;
talentTreeArray: any;
availableTalents: Array<any> = [];
showTalents: boolean = false;
availableTalentTreeArray: Array <string> = [];
validated: boolean = false;
  ngOnInit(): void {

    this.swApiService.getTalents().subscribe(payload => {
      this.talentsArray = payload;
      console.log("talents: ", this.talentsArray);
    })
    
    this.swApiService.getTalentTree().subscribe(payload =>{
      this.talentTreeArray = payload;
      console.log("talent tree: ", this.talentTreeArray);
    })
    this.choices.intiializeTalents.subscribe(() => {
      this.sortAvailable();
    })
  }

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
    console.log("available TT: ", this.availableTalentTreeArray);
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
 console.log("the talents: ",this.availableTalents)
}

async checkRequirements(talent: any){
  console.log("talent in check",talent)
    
   let preReqs = await talent.preReqs;
    let vals: any = Object.values(preReqs);
    let featsArray = await this.choices.getFeatsArray();
    for (let i=0; i < vals.length; i++){
      if(vals[i].includes("none")){
       this.validated = true;
       
      }else if (vals[i].includes("talent")){
        this.validated = false;
        i = vals.length;  
      }else if (vals[i].includes("currentArmor")){
        console.log("checkedArmor")
        this.validated = true;
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
    console.log(talent.name, this.validated)
}

selectedTalentName: string = "";
selectedTalentDescription: string = "";
async selectedTalent(selection: any){
  const index = await this.availableTalents.findIndex((el: any) => el.name == selection.value);
  // console.log("this is the selected id: ", this.featsArray.findIndex(index))
   this.selectedTalentName = await this.availableTalents[index].name;
   this.selectedTalentDescription =  await this.availableTalents[index].description;
   console.log(index);
 }




}
