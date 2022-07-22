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
availableTalents: any;
showTalents: boolean = false;
  ngOnInit(): void {
    this.swApiService.getTalents().subscribe(payload => {
      this.talentsArray = payload;
      console.log("talents: ", this.talentsArray);
    })
    this.choices.intiializeTalents.subscribe(() => {
      this.sortAvailable();
    })
  }

  sortAvailable(){
     this.showAvailable();
    this.showTalents = true;

  }

showAvailable(){
  console.log("Here I am!");
}

selectedTalent(selection: any){

}

}
