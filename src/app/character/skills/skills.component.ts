import { Component, OnInit, Output, EventEmitter, Input, ViewChildren, ElementRef, QueryList } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ChoicesSenderService } from 'src/app/services/choices-sender.service';

@Component({
  selector: 'skills',
  templateUrl: './skills.component.html',
  styleUrls: ['./skills.component.scss']
})

export class SkillsComponent implements OnInit {
  
  static showSkills() {
    throw new Error('Method not implemented.');
  }
  //object to hold each class and the skills that are permissable by them
  availableSkills: object = {
    "Jedi" : ["Acrobatics", "Endurance", "Initiative", "Jump", "Knowledge (Bureaucracy)", "Knowledge (Galactic Lore)", "Knowledge (Life Sciences)", "Knowledge (Physical Sciences)", "Knowledge (Social Sciences)", "Knowledge (Tactics)", "Knowledge (Technology)", "Mechanics", "Perception", "Pilot", "Use the Force"
  ],
    "Noble" : ["Deception", "Gather Information", "Initiative" , "Knowledge (Bureaucracy)", "Knowledge (Galactic Lore)", "Knowledge (Life Sciences)", "Knowledge (Physical Sciences)", "Knowledge (Social Sciences)", "Knowledge (Tactics)", "Knowledge (Technology)", "Perception", "Persuasion", "Pilot", "Ride", "Treat Injury", "Use Computer"
  ],
    "Scoundrel" : ["Acrobatics", "Deception", "Gather Information", "Initiative", "Knowledge (Bureaucracy)", "Knowledge (Galactic Lore)", "Knowledge (Life Sciences)", "Knowledge (Physical Sciences)", "Knowledge (Social Sciences)", "Knowledge (Tactics)", "Knowledge (Technology)", "Mechanics", "Perception", "Persuasion", "Pilot", "Stealth", "Use Computer"
  ],
    "Scout" : ["Climb", "Endurance", "Initiative", "Jump", "Knowledge (Bureaucracy)", "Knowledge (Galactic Lore)", "Knowledge (Life Sciences)", "Knowledge (Physical Sciences)", "Knowledge (Social Sciences)", "Knowledge (Tactics)", "Knowledge (Technology)", "Mechanics", "Perception", "Pilot", "Ride", "Stealth", "Survival", "Swim",
  ],
    "Soldier" : ["Climb", "Endurance", "Initiative", "Jump", "Knowledge (Tactics)", "Mechanics", "Perception", "Pilot", "Swim", "Treat Injury", "Use Computer"
  ],
  }
  // cleae is a flag
  clear: string = 'ok';
  // array that will dynamically hold the skills that are permissable defaults with a message
  skillsArray: any = ["Please Select a class first!"];
  // holds the form group for the checkboxes
  form: FormGroup;
  // sets the number of points that are available for a character
  skillPoints: number = 0;

  //holds the temporary value of the selected class
  zClass: string = '';

  selectedSpecies: string = this.choices.speciesSelected;
 
  @Output () skillsSelected: EventEmitter<any> = new EventEmitter<any>()
  constructor(private choices: ChoicesSenderService, private fb: FormBuilder) {
    this.form = this.fb.group({selectedSkills: this.fb.array([])})
    
   }
  @Input () chosenClass: string = this.choices.selectedClass;
  @Input () intModifier = 0;
  ngOnInit(): void {
  }
  @ViewChildren("checkboxes") checkboxes:QueryList<ElementRef> | undefined;
  uncheckAll(){
    this.checkboxes?.toArray().forEach((item)=> {
      item.nativeElement.checked = false;
      
    })
    
  }
  calcModifier(selection : string){
    console.log("the species is, ", this.choices.speciesSelected )
console.log("this is the class selected:" , selection);
    switch (selection) {
      case "Jedi":
          this.skillPoints = 2 + this.intModifier;
        break;
        case "Noble":
          this.skillPoints = 6 + this.intModifier;
        break;
        case "Scoundrel":
          this.skillPoints = 4 + this.intModifier;
        break;
        case "Scout":
          this.skillPoints = 5 + this.intModifier;
        break;
        case "Soldier":
          this.skillPoints = 3 + this.intModifier;
        break;
      default:
        break;
    }
    // accounts for humans getting 1 additional skill
    if (this.choices.speciesSelected === "Human"){
      this.skillPoints += 1;
    }
    
  }
  showSkills(selection : string){
    this.zClass = selection;
   this.calcModifier(selection);
    while (this.skillsArray.length) { 
      this.skillsArray.pop(); 
  }
    for (const [key, value] of Object.entries(this.availableSkills)){
      if (key == selection){
        value.forEach((val: any) => {
          this.skillsArray.push(val);
        })      
      }
      this.clear = "clear";
    }
    
    console.log('skills:',this.skillsArray)
    this.uncheckAll();
  //  this.skillsObj = this.skills.reduce((accum: any, value: any)=> {
  //   return [accum] = value;
  //    ;
  //  }, {})
    
    
  }
   
submit(){
  console.log("the chosen class",this.chosenClass);
 
    
  console.log(this.form.value.selectedSkills)
}

skillTrained(event: any){
  let selectedSkills: FormArray = this.form.get('selectedSkills') as FormArray;
  
  //if (this.skillPoints <= 0  ){
    // const index = selectedSkills.controls.findIndex(x => x.value === event.target.value);
      //   selectedSkills.removeAt(index);
     //  && this.skillPoints-lenth > 0
   //  event.target.checked = false;
   // }else {
      
      if (this.clear == "clear"){
        selectedSkills.clear(); 
        this.clear = 'ok';
        
      }
      if (event.target.checked){
        if (this.skillPoints - 1 < 0  ){
          event.target.checked = false;
          // add a validation error here
        }else {
          selectedSkills.push(new FormControl(event.target.value));
          this.skillPoints -= 1;
        }
      } else {
        const index = selectedSkills.controls.findIndex(x => x.value === event.target.value);
        selectedSkills.removeAt(index);
        
        this.skillPoints += 1;
      
  //  }
  }
  this.choices.skills = this.form.value.selectedSkills;
  console.log('skills:',this.choices.skills)
}
}
