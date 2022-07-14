import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ChoicesSenderService } from 'src/app/services/choices-sender.service';


@Component({
  selector: 'classes',
  templateUrl: './classes.component.html',
  styleUrls: ['./classes.component.scss']
})
export class ClassesComponent implements OnInit {
classesArray: any = [
  "Jedi", "Noble", "Scoundrel", "Scout", "Soldier"
];
heroicClass: any = "";
@Output () classSelected: EventEmitter<any> = new EventEmitter<any>()
  constructor(private choices: ChoicesSenderService) { }

selected(selection: any){
console.log('this is the selection', selection.value)
this.choices.selectedClass = selection.value;
this.heroicClass = selection.value
this.classSelected.emit(this.heroicClass)

}

  ngOnInit(): void {
  }

}
