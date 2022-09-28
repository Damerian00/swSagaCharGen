import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ChoicesSenderService } from 'src/app/services/choices-sender.service';


@Component({
  selector: 'abilities',
  templateUrl: './abilities.component.html',
  styleUrls: ['./abilities.component.scss']
})




export class AbilitiesComponent implements OnInit {
  // tells it not to sort 
  unsorted = (a:any, b:any) => {
    return a;
  }
  // variables used in this component
  /*
   max amount of points available for abilities which is adjustable
  */
  maxPoints: number = 0;
  abModifierImport: any= {};
/* 
holds the abilities and their values for starting
 */
  charAbilities: any= {
    Strength: 8,
    Dexterity: 8,
    Constitution: 8,
    Intelligence: 8,
    Wisdom: 8,
    Charisma: 8,
  }
// holds the abilities and their values after being selected including species modifiers
  finalAbilities: any= {
    Strength: 8,
    Dexterity: 8,
    Constitution: 8,
    Intelligence: 8,
    Wisdom: 8,
    Charisma: 8,
  }
  // validate: boolean = true;
 
  // creates and intializes points setting them to 0
  points = 0;
  toggleButton: boolean = false;
  toggleBtnText = "Open Points Editor"
  abValidator: boolean = false;
  abValidatorMessage: string = '';
  constructor(private choices: ChoicesSenderService) { }
  @Output () abilitiesSelected: EventEmitter<any> = new EventEmitter<any>()
  @Output () abilityModifiers: EventEmitter<any> = new EventEmitter<any>()
  ngOnInit(): void {
    this.choices.invokeAbilitiesFunction.subscribe(() => {   
        this.saveAbilities();
      });    
          
      this.choices.initializeAbilityPoints.subscribe((pts)=>{
        this.setMaxPoints(pts);
        this.togglePtsBtn();
      })
  }
  // flag
  startAbilities: boolean = false;
togglePtsBtn(){
  (this.toggleBtnText == "Open Points Editor") ? this.toggleBtnText = "Cancel" : this.toggleBtnText = "Open Points Editor";
  this.toggleButton = !this.toggleButton;
}
  //sets max points 
  setMaxPoints(mxpts: any){
    this.update();
    if (mxpts <= 50 && mxpts >= 25){
      // console.log("setting max:", mxpts);
      this.choices.maxPoints = mxpts;
      this.points = mxpts;
      this.maxPoints = mxpts;
      // console.log("changed max:",this.choices.maxPoints);
    }
    this.togglePtsBtn();
  }

  /*
  resets the abilites both starting and final to their orignal stats as well as resets points to maxpoints
  */
  resetAbilites(){
    this.finalAbilities = {
      Strength: 8,
      Dexterity: 8,
      Constitution: 8,
      Intelligence: 8,
      Wisdom: 8,
      Charisma: 8,
    }
    this.charAbilities= {
      Strength: 8,
      Dexterity: 8,
      Constitution: 8,
      Intelligence: 8,
      Wisdom: 8,
      Charisma: 8,
    }
    this.points = this.maxPoints;
  }

  /*
  updates the ability values when adding or subtracting points
  */
  update(){
  if (this.abModifierImport.Strength == undefined){
    return;
  }
  this.resetAbilites();
  this.abModifierImport = this.choices.speciesAbilityModifiers;
  // console.log('the ability modifiers:',this.abModifierImport)
  let strA =  this.abModifierImport.Strength;
  if (strA != 0){
    this.finalAbilities.Strength += strA;
  }
  let dexA =  this.abModifierImport.Dexterity;
  if (dexA != 0){
    this.finalAbilities.Dexterity += dexA;
  }
  let conA =  this.abModifierImport.Constitution;
  if (conA != 0){
    this.finalAbilities.Constitution += conA;
  } 
  let intA =  this.abModifierImport.Intelligence;
  if (intA != 0){
    this.finalAbilities.Intelligence += intA;
  }
  let wisA =  this.abModifierImport.Wisdom;
  if (wisA != 0){
    this.finalAbilities.Wisdom += wisA;
  }
  let chaA = this.abModifierImport.Charisma;
    if (chaA != 0){
      this.finalAbilities.Charisma += chaA;
       }

// console.log('this is final:',this.finalAbilities) // for testing
 
 }

 /*
 performs the adjusting of the points and uses a validator function from the choices service to calculate points and see if there are enough points or not and will display if you don't have enough points takes in to parameters one is the ability type and the otehr the operand being used
  */
 /*
 == old code ==
 checkPoints(ability: string, operand: string){
   console.log('check points',ability, this.finalAbilities, this.charAbilities.Charisma);
   let pointAdjust = 0;
   if (operand == 'add'){
    switch (ability) {
      case "Charisma":
        if (this.charAbilities.Charisma <= 13){
          pointAdjust = this.charAbilities.Charisma - 7
        } else if (this.charAbilities.Charisma == 14){
          pointAdjust = 8;
        } else if (this.charAbilities.Charisma == 15){
          pointAdjust = 10
        } else if (this.charAbilities.Charisma == 16){
          pointAdjust = 13
        }else if (this.charAbilities.Charisma == 17){
          pointAdjust = 16
        }
       this.choices.validator(this.points, pointAdjust, operand, 'abilities');
       console.log('adjustment', pointAdjust)
       if (this.choices.validate == true){
         this.points -= pointAdjust;
         console.log('the points', this.points)
          }
     break;
     case "Constitution":
      if (this.charAbilities.Constitution <= 13){
        pointAdjust = this.charAbilities.Constitution - 7
      } else if (this.charAbilities.Constitution == 14){
        pointAdjust = 8;
      } else if (this.charAbilities.Constitution == 15){
        pointAdjust = 10
      } else if (this.charAbilities.Constitution == 16){
        pointAdjust = 13
      }else if (this.charAbilities.Constitution == 17){
        pointAdjust = 16
      }
     this.choices.validator(this.points, pointAdjust, operand, 'abilities');
     console.log('adjustment', pointAdjust)
     if (this.choices.validate == true){
       this.points -= pointAdjust;
       console.log('the points', this.points)
        }
     break;
     case "Dexterity":
      if (this.charAbilities.Dexterity <= 13){
        pointAdjust = this.charAbilities.Dexterity - 7
      } else if (this.charAbilities.Dexterity == 14){
        pointAdjust = 8;
      } else if (this.charAbilities.Dexterity == 15){
        pointAdjust = 10
      } else if (this.charAbilities.Dexterity == 16){
        pointAdjust = 13
      }else if (this.charAbilities.Dexterity == 17){
        pointAdjust = 16
      }
      this.choices.validator(this.points, pointAdjust, operand, 'abilities');
     console.log('adjustment', pointAdjust)
     if (this.choices.validate == true){
       this.points -= pointAdjust;
       console.log('the points', this.points)
        }
     break;
     case "Intelligence":
      if (this.charAbilities.Intelligence <= 13){
        pointAdjust = this.charAbilities.Intelligence - 7
      } else if (this.charAbilities.Intelligence == 14){
        pointAdjust = 8;
      } else if (this.charAbilities.Intelligence == 15){
        pointAdjust = 10
      } else if (this.charAbilities.Intelligence == 16){
        pointAdjust = 13
      }else if (this.charAbilities.Intelligence == 17){
        pointAdjust = 16
      }
      this.choices.validator(this.points, pointAdjust, operand, 'abilities');
     console.log('adjustment', pointAdjust)
     if (this.choices.validate == true){
       this.points -= pointAdjust;
       console.log('the points', this.points)
        }
     break;
     case "Strength":
      if (this.charAbilities.Strength <= 13){
        pointAdjust = this.charAbilities.Strength - 7
      } else if (this.charAbilities.Strength == 14){
        pointAdjust = 8;
      } else if (this.charAbilities.Strength == 15){
        pointAdjust = 10
      } else if (this.charAbilities.Strength == 16){
        pointAdjust = 13
      }else if (this.charAbilities.Strength == 17){
        pointAdjust = 16
      }
      this.choices.validator(this.points, pointAdjust, operand, 'abilities');
     console.log('adjustment', pointAdjust)
     if (this.choices.validate == true){
       this.points -= pointAdjust;
       console.log('the points', this.points)
        }
     break;
     case "Wisdom":
      if (this.charAbilities.Wisdom <= 13){
        pointAdjust = this.charAbilities.Wisdom - 7
      } else if (this.charAbilities.Wisdom == 14){
        pointAdjust = 8;
      } else if (this.charAbilities.Wisdom == 15){
        pointAdjust = 10
      } else if (this.charAbilities.Wisdom == 16){
        pointAdjust = 13
      }else if (this.charAbilities.Wisdom == 17){
        pointAdjust = 16
      }
      this.choices.validator(this.points, pointAdjust, operand, 'abilities');
     console.log('adjustment', pointAdjust)
     if (this.choices.validate == true){
       this.points -= pointAdjust;
       console.log('the points', this.points)
        }
     break;
   }
   }else{
    switch (ability) {
      case "Charisma":
        if (this.charAbilities.Charisma <= 14){
          pointAdjust = this.charAbilities.Charisma - 8
          console.log('points adjusted',pointAdjust, '14 or less')
        } else if (this.charAbilities.Charisma == 15){
          console.log('why u here')
          pointAdjust = 8;
        } else if (this.charAbilities.Charisma == 16){
          pointAdjust = 10
        } else if (this.charAbilities.Charisma == 17){
          pointAdjust = 13
        }else if (this.charAbilities.Charisma == 18){
          pointAdjust = 16
        }
        console.log('points adjusted',pointAdjust)
        console.log('the points', this.points)
        this.choices.validator(this.points, pointAdjust, operand, 'abilities');
       console.log('adjustment', pointAdjust)
       if (this.choices.validate == true){
         this.points += pointAdjust;
          }
     break;
     case "Constitution":
      if (this.charAbilities.Constitution <= 14){
        pointAdjust = this.charAbilities.Constitution - 8
        console.log('points adjusted',pointAdjust, '14 or less')
      } else if (this.charAbilities.Constitution == 15){
        console.log('why u here')
        pointAdjust = 8;
      } else if (this.charAbilities.Constitution == 16){
        pointAdjust = 10
      } else if (this.charAbilities.Constitution == 17){
        pointAdjust = 13
      }else if (this.charAbilities.Constitution == 18){
        pointAdjust = 16
      }
      console.log('points adjusted',pointAdjust)
      console.log('the points', this.points)
      this.choices.validator(this.points, pointAdjust, operand, 'abilities');
     console.log('adjustment', pointAdjust)
     if (this.choices.validate == true){
       this.points += pointAdjust;
        }
     break;
     case "Dexterity":
      if (this.charAbilities.Dexterity <= 14){
        pointAdjust = this.charAbilities.Dexterity - 8
        console.log('points adjusted',pointAdjust, '14 or less')
      } else if (this.charAbilities.Dexterity == 15){
        console.log('why u here')
        pointAdjust = 8;
      } else if (this.charAbilities.Dexterity == 16){
        pointAdjust = 10
      } else if (this.charAbilities.Dexterity == 17){
        pointAdjust = 13
      }else if (this.charAbilities.Dexterity == 18){
        pointAdjust = 16
      }
      console.log('points adjusted',pointAdjust)
      console.log('the points', this.points)
      this.choices.validator(this.points, pointAdjust, operand, 'abilities');
     console.log('adjustment', pointAdjust)
     if (this.choices.validate == true){
       this.points += pointAdjust;
        }
     break;
     case "Intelligence":
      if (this.charAbilities.Intelligence <= 14){
        pointAdjust = this.charAbilities.Intelligence - 8
        console.log('points adjusted',pointAdjust, '14 or less')
      } else if (this.charAbilities.Intelligence == 15){
        console.log('why u here')
        pointAdjust = 8;
      } else if (this.charAbilities.Intelligence == 16){
        pointAdjust = 10
      } else if (this.charAbilities.Intelligence == 17){
        pointAdjust = 13
      }else if (this.charAbilities.Intelligence == 18){
        pointAdjust = 16
      }
      console.log('points adjusted',pointAdjust)
      console.log('the points', this.points)
      this.choices.validator(this.points, pointAdjust, operand, 'abilities');
     console.log('adjustment', pointAdjust)
     if (this.choices.validate == true){
       this.points += pointAdjust;
        }
     break;
     case "Strength":
      if (this.charAbilities.Strength <= 14){
        pointAdjust = this.charAbilities.Strength - 8
        console.log('points adjusted',pointAdjust, '14 or less')
      } else if (this.charAbilities.Strength == 15){
        console.log('why u here')
        pointAdjust = 8;
      } else if (this.charAbilities.Strength == 16){
        pointAdjust = 10
      } else if (this.charAbilities.Strength == 17){
        pointAdjust = 13
      }else if (this.charAbilities.Strength == 18){
        pointAdjust = 16
      }
      console.log('points adjusted',pointAdjust)
      console.log('the points', this.points)
      this.choices.validator(this.points, pointAdjust, operand, 'abilities');
     console.log('adjustment', pointAdjust)
     if (this.choices.validate == true){
       this.points += pointAdjust;
        }
     break;
     case "Wisdom":
      if (this.charAbilities.Wisdom <= 14){
        pointAdjust = this.charAbilities.Wisdom - 8
        console.log('points adjusted',pointAdjust, '14 or less')
      } else if (this.charAbilities.Wisdom == 15){
        console.log('why u here')
        pointAdjust = 8;
      } else if (this.charAbilities.Wisdom == 16){
        pointAdjust = 10
      } else if (this.charAbilities.Wisdom == 17){
        pointAdjust = 13
      }else if (this.charAbilities.Wisdom == 18){
        pointAdjust = 16
      }
      console.log('points adjusted',pointAdjust)
      console.log('the points', this.points)
      this.choices.validator(this.points, pointAdjust, operand, 'abilities');
     console.log('adjustment', pointAdjust)
     if (this.choices.validate == true){
       this.points += pointAdjust;
        }
     break;
   }
   }
  
 }
 */
/* 
adds ability point if it successfully clears the checkpoints function with no errros then emits the changes to main component to be displayed
*/
addAbility(clicked: any){
  this.abValidator = false
  this.choices.validate = false;
  this.abModifierImport = this.choices.speciesAbilityModifiers;
 if (this.points > 0){
  switch (clicked.key){
    case "Strength":
      if (this.finalAbilities.Strength < 50){
        //this.checkPoints(clicked.key , "add");
        this.pointChecker(clicked.key , "add");
        if (this.choices.validate == true){
          this.charAbilities.Strength += 1;
          this.finalAbilities.Strength +=1;
        }
        }
    break;
    case "Dexterity":
      if (this.finalAbilities.Dexterity < 50){
        //this.checkPoints(clicked.key , "add");
        this.pointChecker(clicked.key , "add");
        if (this.choices.validate == true){
          this.charAbilities.Dexterity += 1;
          this.finalAbilities.Dexterity +=1; 
        }
        }
    break;
    case "Constitution":
      if (this.finalAbilities.Constitution < 50){
        //this.checkPoints(clicked.key , "add");
        this.pointChecker(clicked.key , "add");
        if (this.choices.validate == true){
          this.charAbilities.Constitution += 1;
          this.finalAbilities.Constitution +=1;
        }
      }
    break;
    case "Intelligence":
      if (this.finalAbilities.Intelligence < 50){
        //this.checkPoints(clicked.key , "add");
      this.pointChecker(clicked.key , "add");
      if (this.choices.validate == true){
        this.charAbilities.Intelligence += 1;
        this.finalAbilities.Intelligence +=1;
      }
      }
      break;
      case "Wisdom":
        if (this.finalAbilities.Wisdom < 50){
          //this.checkPoints(clicked.key , "add");
          this.pointChecker(clicked.key , "add");
      if (this.choices.validate == true){
        this.charAbilities.Wisdom += 1;
        this.finalAbilities.Wisdom +=1;
      }
    }
    break;
    case "Charisma":
      if (this.finalAbilities.Charisma < 50){
        //this.checkPoints(clicked.key, "add")
        this.pointChecker(clicked.key , "add");
        if (this.choices.validate == true){
          this.charAbilities.Charisma += 1;
          this.finalAbilities.Charisma += 1;
        }
      }
    break;
  }
  if (this.choices.validate == false){
    this.abValidator = true;
    this.abValidatorMessage = `Not enough points available to add to ${clicked.key}.`    
  }
 this.calcModifier();
}else{
  this.abValidator = true;
    this.abValidatorMessage = `Not enough points available to add to ${clicked.key}.`    
}

}
/* 
subtracts ability point if it successfully clears the checkpoints function with no errros then emits the changes to main component to be displayed
*/
subAbility(clicked: any){
  this.abValidator = false;
  this.choices.validate = false;
  if (this.points < this.maxPoints){
    switch (clicked.key){
      case "Strength":
        //this.checkPoints(clicked.key, "subtract")
        this.pointChecker(clicked.key, "subtract")  
        if (this.choices.validate == true && this.charAbilities.Strength > 8){
          this.charAbilities.Strength -= 1;
          this.finalAbilities.Strength -= 1;
  
        }else{
          this.choices.validate = false;
        }
        
      break;
      case "Dexterity":
        // this.checkPoints(clicked.key, "subtract")
        this.pointChecker(clicked.key, "subtract")
        if (this.choices.validate == true && this.charAbilities.Dexterity > 8){
          this.charAbilities.Dexterity -= 1;
          this.finalAbilities.Dexterity -= 1;
          
        }else{
          this.choices.validate = false;
        }   
        
        break;
        case "Constitution":
         // this.checkPoints(clicked.key, "subtract")
          this.pointChecker(clicked.key, "subtract")
          if (this.choices.validate == true && this.charAbilities.Constitution > 8){
            this.charAbilities.Constitution -= 1;
            this.finalAbilities.Constitution -= 1;
    
          }else{
          this.choices.validate = false;
        }  
          
        break;
    case "Intelligence":
     // this.checkPoints(clicked.key, "subtract")
      this.pointChecker(clicked.key, "subtract")
      if (this.choices.validate == true && this.charAbilities.Intelligence > 8){
        this.charAbilities.Intelligence -= 1;
        this.finalAbilities.Intelligence -= 1;

      }else{
          this.choices.validate = false;
        }   
      
    break;
   
    case "Wisdom":
      //this.checkPoints(clicked.key, "subtract")
      this.pointChecker(clicked.key, "subtract")
      if (this.choices.validate == true && this.charAbilities.Wisdom > 8){
        this.charAbilities.Wisdom -= 1;
        this.finalAbilities.Wisdom -= 1;

      }else{
          this.choices.validate = false;
        }   
      
    break;
    case "Charisma":
    //  this.checkPoints(clicked.key, "subtract")
      this.pointChecker(clicked.key, "subtract")
      if (this.choices.validate == true && this.charAbilities.Charisma > 8){
        this.finalAbilities.Charisma -= 1;
        this.charAbilities.Charisma -= 1;
      }else{
          this.choices.validate = false;
        }
      
    break;
  }
  if (this.choices.validate == false){
      this.abValidator = true;
      this.abValidatorMessage = `Can't subtract any more from ${clicked.key}.`
    }
  
  this.calcModifier();

}else{
  this.abValidator = true;
  this.abValidatorMessage = `Can't subtract any more from ${clicked.key}.`
}

}
// calls the update function then emits the finalabilities to the main component for evaluation
saveAbilities(){
  this.update();
  // removing this ensures that at least one ability point is added before intializing classes
  // this.abilitiesSelected.emit(this.finalAbilities);
  
}
// same as saveAbilities minus the update function
calcModifier(){
  this.abilitiesSelected.emit(this.finalAbilities);
  // this.abilityModifiers.emit(this.finalAbilities);
  this.choices.abilities = this.finalAbilities;
  // console.log('the abilities :', this.choices.abilities);
  this.choices.selectedAbilities = this.charAbilities;
}

pointChecker(selection: string, operand: string){
  let pointBuy = [-1,-1,-1,-1,-1,-1,-1,0,1,1,1,1,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10];
  let value =  operand === "add" ? 0:-1;
  switch (selection) {
  case "Strength":
    value += this.charAbilities.Strength; 
  break;
  case "Dexterity":
    value += this.charAbilities.Dexterity
  break;
  case "Constitution":
    value += this.charAbilities.Constitution;
  break;
  case "Intelligence":
    value += this.charAbilities.Intelligence;
  break;
  case "Wisdom":
    value += this.charAbilities.Wisdom;
  break;
  case "Charisma":
    value += this.charAbilities.Charisma;
  break;
  default:
  break;
}
this.choices.validator(this.points, pointBuy[value], operand, 'abilities');
if (this.choices.validate == true){
  this.abValidator = false;
  operand == "add"?  this.points -= pointBuy[value] : this.points += pointBuy[value]
    //  console.log('the points', this.points)
      }    
}


}
