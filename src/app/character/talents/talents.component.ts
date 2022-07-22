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

showAvailable(){
  if (this.availableTalents.length != 0){
    while(this.availableTalents.length){
      this.availableTalents.pop();
    }
  }
  for(let i=0; i<this.talentsArray.length;i++){
    for(let j=0; j<this.availableTalentTreeArray.length; j++){
      if(this.talentsArray[i].TalentTreeId == this.availableTalentTreeArray[j]){
        this.availableTalents.push(this.talentsArray[i]);
      }

    }
  }
  console.log("Here I am!");
}

selectedTalent(selection: any){

}

}
