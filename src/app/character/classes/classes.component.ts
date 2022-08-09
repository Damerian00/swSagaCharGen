import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ChoicesSenderService } from 'src/app/services/choices-sender.service';


@Component({
  selector: 'classes',
  templateUrl: './classes.component.html',
  styleUrls: ['./classes.component.scss']
})
export class ClassesComponent implements OnInit {
// holds the possible values for a class
classesArray: any = [
  "Jedi", "Noble", "Scoundrel", "Scout", "Soldier"
];
// holds the selected value
heroicClass: any = "";
@Output () classSelected: EventEmitter<any> = new EventEmitter<any>()
  constructor(private choices: ChoicesSenderService) { }

// checks for user input then passes the selection to choices service
selected(selection: any){
// console.log('this is the selection', selection.value)
this.choices.selectedClass = selection.value;
this.heroicClass = selection.value
this.classSelected.emit(this.heroicClass)
if (selection.value === "Jedi" || selection.value === "Soldier"){
  this.choices.bab = 1;
} else {
  this.choices.bab = 0;
}

}

  ngOnInit(): void {
  }

}
