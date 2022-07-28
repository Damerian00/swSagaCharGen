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
  // clear is a flag
  clear: string = 'ok';
  // array that will dynamically hold the skills that are permissable defaults with a message
  skillsArray: any = ["Please Select your abilities and class first!"];
  // holds the form group for the checkboxes
  form: FormGroup;
  // sets the number of points that are available for a character
  skillPoints: number = 0;
  
// sets the new variable equal to the variable in the choices service
  selectedSpecies: string = this.choices.speciesSelected;
 
  // sa flag to show button when abilities are available
  buttonIf: string = "hide";

  // utilizes event emitter to emit the skills selected
  @Output () skillsSelected: EventEmitter<any> = new EventEmitter<any>()

  // takes input from the form to to create an array for the items checked
  constructor(private choices: ChoicesSenderService, private fb: FormBuilder) {
    this.form = this.fb.group({selectedSkills: this.fb.array([])})
    
   }

  // recieves the selected class from the class component to be used later 
  @Input () chosenClass: string = this.choices.selectedClass;
  @Input () intModifier = 0;
  ngOnInit(): void {
    
  }

  @ViewChildren("checkboxes") checkboxes:QueryList<ElementRef> | undefined;
  // a function to uncheck the boxes checked
  uncheckAll(){
    this.checkboxes?.toArray().forEach((item)=> {
      item.nativeElement.checked = false;
      
    })
    
  }
  // calculates skill points that each class would have based on the int modifier
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
  /// shows the skills available based on previous choices
  showSkills(selection : string){
    //checks to see if abilities were selected and if button is still set to hide
   if (this.choices.abilities != undefined && this.buttonIf == "hide"){
      this.buttonIf = "show"
   }
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
    this.choices.classSkills = this.skillsArray;
    this.uncheckAll();
    
  }
  // connects with the service to intitate the starting feats 
submit(){
  this.choices.setStartFeats();
    console.log("button if",this.choices.abilities)
  if (this.choices.getSpecies() != "Human"){
    this.choices.startTalentComponent();
  }
  this.heroSkillsSelected.emit(this.form.value.selectedSkills)
  this.buttonIf = "hide";
}
@Output () heroSkillsSelected: EventEmitter<any> = new EventEmitter()
skillTrained(event: any){
  if (this.buttonIf == "hide"){
    this.buttonIf = "show"
  }
  let selectedSkills: FormArray = this.form.get('selectedSkills') as FormArray;
  
  /* 
  ======old code=====
  //if (this.skillPoints <= 0  ){
    // const index = selectedSkills.controls.findIndex(x => x.value === event.target.value);
      //   selectedSkills.removeAt(index);
     //  && this.skillPoints-lenth > 0
   //  event.target.checked = false;
   // }else {
  */
      if (this.clear == "clear"){
        selectedSkills.clear(); 
        this.clear = 'ok';    
      }
      // checks of the checkbox is checked
      if (event.target.checked){
        /*
         checks if the skill points remaining will go below 0 when checked if it does then it immediately gets unchecked so skill points never go below 0
        */
        if (this.skillPoints - 1 < 0  ){
          event.target.checked = false;
          // add a validation error here
        }else {
          /* 
          if it doesn't go below 0 then it will remove a skill point and push the item to the array
          */
          selectedSkills.push(new FormControl(event.target.value));
          this.skillPoints -= 1;
        }
      } else {

      /*
      when unchecking the box this will give back the skill point and remove the item from the array
      */
        const index = selectedSkills.controls.findIndex(x => x.value === event.target.value);
        selectedSkills.removeAt(index);
        
        this.skillPoints += 1;
      
  //  }
  }
  /* 
  sets the skill array in the choices service to the array created by the users choices in skills
  */
  this.choices.skills = this.form.value.selectedSkills;
  
}
}
