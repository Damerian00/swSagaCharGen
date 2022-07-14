
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ChoicesSenderService } from 'src/app/services/choices-sender.service';
import { SwapiService } from 'src/app/services/swapi.service';
import { CharSheetComponent } from '../char-sheet/char-sheet.component';


@Component({
  selector: 'species',
  templateUrl: './species.component.html',
  styleUrls: ['./species.component.scss']
})
export class SpeciesComponent implements OnInit {
  constructor(private swApiService: SwapiService, private choices: ChoicesSenderService) { }
  speciesArray: any;
  speciesName: string = "";
  ab_modifiers: object = {};
  charSheetComponent = new CharSheetComponent(this.choices);
  selectedSpecies: string = 'Human';
  @Output () speciesSelected: EventEmitter<string> = new EventEmitter<string>()
  ngOnInit(): void {
this.swApiService.getSpecies().subscribe(payload =>{
  this.speciesArray = payload;
  console.log("Species: ", this.speciesArray);  
})

  }
  
 selected(selection: any){
   for (let i=0; i<this.speciesArray.length; i++){
     if (selection.value == this.speciesArray[i].species_name){
       this.ab_modifiers = this.speciesArray[i].traits['Ability Modifiers'];
       this.speciesName = selection.value;
      }

    }
   this.choices.speciesAbilityModifiers = this.ab_modifiers;
   this.choices.speciesSelected = selection.value;
   console.log("here's your species",this.choices.speciesSelected)
  this.speciesSelected.emit(this.speciesName);
  this.choices.onSelection();
  
}
abilityResetAbilities(){
  console.log('hit me')

}
 

  
}
