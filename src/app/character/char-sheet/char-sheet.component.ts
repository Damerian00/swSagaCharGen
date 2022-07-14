import { Component, OnInit} from '@angular/core';
import { ChoicesSenderService } from 'src/app/services/choices-sender.service';


@Component({
  selector: 'char-sheet',
  templateUrl: './char-sheet.component.html',
  styleUrls: ['./char-sheet.component.scss']
})
export class CharSheetComponent implements OnInit {
species: string = "";
abilities: object = {};

  constructor(private choices: ChoicesSenderService) { }

  ngOnInit(): void {
    
  }
  updateSheet(){
    this.species = this.choices.speciesSelected;
    console.log('I updated', this.species)

  }
  
}
