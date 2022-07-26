
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
  speciesNames: Array<string> = [];
  ab_modifiers: object = {};
  charSheetComponent = new CharSheetComponent(this.choices);
  selectedSpecies: string = 'Human';
  @Output () speciesSelected: EventEmitter<string> = new EventEmitter<string>()
  ngOnInit(): void {
// utilizes swapi service to retriueve the data from the species endpoint
    this.swApiService.getSpecies().subscribe(payload =>{
  this.speciesArray = payload;
  console.log("Species: ", this.speciesArray);  
// sorts the array by species name
  this.speciesArray.sort(this.sortNames("species_name"));
})

  }
  // a sorting function to arrange an array of objects by prop parameter
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
// function to handle the dropdown and watch for changes
 selected(selection: any){
   for (let i=0; i<this.speciesArray.length; i++){
    /*
     compares the value selected with the imported array created from the api endpoint
    */
     if (selection.value == this.speciesArray[i].species_name){
       this.ab_modifiers = this.speciesArray[i].traits['Ability Modifiers'];
       this.speciesName = selection.value;
      }

    }
  // passes off the values to the choices service corresponding variable
   this.choices.speciesAbilityModifiers = this.ab_modifiers;
   this.choices.speciesSelected = selection.value;
   console.log("here's your species",this.choices.speciesSelected)
  
  /*
   uses  an event emmiter to emit the species name which is required for another component
  */
  this.speciesSelected.emit(this.speciesName);

  // this uses another event emitter to call a sibling function
  this.choices.onSelection();
  
  // creates the speciesObject on the choices service
  this.createSpeciesObject(selection);
}

async createSpeciesObject(selection: any){

  const index =  await this.speciesArray.findIndex((el: any) => el.species_name == selection.value);
  // console.log("this is the selected id: ", this.speciesArray.findIndex(index))
  await this.choices.setSpecies(this.speciesArray[index]);
 console.log("here's the stored species:", index, this.choices.speciesSelectedObject)

} 

  
}
