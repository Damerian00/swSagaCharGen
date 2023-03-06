import { Component, OnInit, Output, EventEmitter, Input, ViewChildren, ElementRef, QueryList } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ChoicesSenderService } from 'src/app/services/choices-sender.service';
import {classSkills} from '../../db/heroSkills';

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
  availableSkills: object = classSkills;
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
  skValidator: boolean = false;
  skValidatorMessage: string = '';
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
//     console.log("the species is, ", this.choices.speciesSelected )
// console.log("this is the class selected:" , selection);
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
  let abSkills = [
    ["Acrobatics","(Dex)"],["Climb","(Str)"],["Deception","(Cha)"],["Endurance","(Con)"],["Gather Information","(Cha)"],["Initiative","(Dex)"],["Jump","(Str)"],["Knowledge (Bureaucracy)","(Int)"], ["Knowledge (Galactic Lore)","(Int)"],["Knowledge (Life Sciences)","(Int)"] ,["Knowledge (Physical Sciences)","(Int)"],["Knowledge (Social Sciences)","(Int)"],["Knowledge (Tactics)","(Int)"],["Knowledge (Technology)","(Int)"],["Mechanics","(Int)"],["Perception","(Wis)"],["Persuasion","(Cha)"],["Pilot","(Dex)"],["Ride","(Dex)"],["Stealth","(Dex)"],["Survival","(Wis)"],["Swim","(Str)"],["Treat Injury","(Wis)"],["Use Computer","(Int)"],["Use the Force","(Cha)"]
]
  if (Object.keys(this.choices.speciesSelectedObject.traits).includes("Class Skill")){
    for (let i=0; i<this.choices.speciesSelectedObject.traits["Class Skill"].length; i++){
      let index = abSkills.findIndex((el:any)=> el[0] == this.choices.speciesSelectedObject.traits["Class Skill"][i]);
      this.skillsArray.push({"name" : this.choices.speciesSelectedObject.traits["Class Skill"][i], "ability" : abSkills[index][1]});
    }
  }
    for (const [key, value] of Object.entries(this.availableSkills)){
      if (key == selection){
        value.forEach((val: any) => {
          if (this.skillsArray.includes(val) == false){
            this.skillsArray.push(val);
          }
        })      
      }
      this.clear = "clear";
    }
    
    // console.log('skills:',this.skillsArray)
    this.choices.classSkills = this.skillsArray;
    this.uncheckAll();
    
  }
  // connects with the service to intitate the starting feats 
submit(){
  this.choices.setStartFeats();
  this.heroSkillsSelected.emit(this.form.value.selectedSkills)
  this.choices.setTrainedSkills(this.form.value.selectedSkills);
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
      this.skValidator = false;
      // checks of the checkbox is checked
      if (event.target.checked){
        /*
         checks if the skill points remaining will go below 0 when checked if it does then it immediately gets unchecked so skill points never go below 0
        */
        if (this.skillPoints - 1 < 0  ){
          this.skValidator = true;
          this.skValidatorMessage = `No more skill points available to choose ${event.target.value}.`
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
