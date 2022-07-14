import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ChoicesSenderService } from 'src/app/services/choices-sender.service';


@Component({
  selector: 'abilities',
  templateUrl: './abilities.component.html',
  styleUrls: ['./abilities.component.scss']
})




export class AbilitiesComponent implements OnInit {

  
  maxPoints: number = 25;
  abModifierImport: any= {};
  keys = Object.keys;
  charAbilities: any= {
    Charisma: 8,
    Constitution: 8,
    Dexterity: 8,
    Intelligence: 8,
    Strength: 8,
    Wisdom: 8
  }

  finalAbilities: any= {
    Charisma: 8,
    Constitution: 8,
    Dexterity: 8,
    Intelligence: 8,
    Strength: 8,
    Wisdom: 8
  }
  // validate: boolean = true;
 
  points = 0;
  
  constructor(private choices: ChoicesSenderService) { }
  @Output () abilitiesSelected: EventEmitter<any> = new EventEmitter<any>()
  @Output () abilityModifiers: EventEmitter<any> = new EventEmitter<any>()
  ngOnInit(): void {
    this.choices.invokeAbilitiesFunction.subscribe(() => { 
        console.log('Hello')   
        this.saveAbilities();
      });    
          
  }
  startAbilities: boolean = false;
  resetAbilites(){
    this.finalAbilities = {
      Charisma: 8,
      Constitution: 8,
      Dexterity: 8,
      Intelligence: 8,
      Strength: 8,
      Wisdom: 8
    }
    this.charAbilities= {
      Charisma: 8,
      Constitution: 8,
      Dexterity: 8,
      Intelligence: 8,
      Strength: 8,
      Wisdom: 8
    }
    this.points = this.maxPoints;
  }
  update(){
  this.resetAbilites();
  this.abModifierImport = this.choices.speciesAbilityModifiers;
  console.log('the ability modifiers:',this.abModifierImport)
   let chaA = this.abModifierImport.Charisma;
   if (chaA != 0){
     this.finalAbilities.Charisma += chaA;
      }
   let conA =  this.abModifierImport.Constitution;
   if (conA != 0){
    this.finalAbilities.Constitution += conA;
  }
   
   let dexA =  this.abModifierImport.Dexterity;
   if (dexA != 0){
    this.finalAbilities.Dexterity += dexA;
  }
   
   let intA =  this.abModifierImport.Intelligence;
   if (intA != 0){
    this.finalAbilities.Intelligence += intA;
  }
  
   let strA =  this.abModifierImport.Strength;
   if (strA != 0){
    this.finalAbilities.Strength += strA;
  }
 
   let wisA =  this.abModifierImport.Wisdom;
   if (wisA != 0){
    this.finalAbilities.Wisdom += wisA;
  }

console.log('this is final:',this.finalAbilities)

 }

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

addAbility(clicked: any){
  this.abModifierImport = this.choices.speciesAbilityModifiers;
 if (this.points > 0){
  switch (clicked.key){
  case "Charisma":
    if (this.finalAbilities.Charisma < 20){
      this.checkPoints(clicked.key, "add")
      if (this.choices.validate == true){
        this.charAbilities.Charisma += 1;
        this.finalAbilities.Charisma +=1;
      }
    }
  break;
  case "Constitution":
    if (this.finalAbilities.Constitution < 20){
      this.checkPoints(clicked.key , "add");
      if (this.choices.validate == true){
        this.charAbilities.Constitution += 1;
        this.finalAbilities.Constitution +=1;
      }
    }
  break;
  case "Dexterity":
    if (this.finalAbilities.Dexterity < 20){
      this.checkPoints(clicked.key , "add");
      if (this.choices.validate == true){
        this.charAbilities.Dexterity += 1;
        this.finalAbilities.Dexterity +=1; 
      }
      }
  break;
  case "Intelligence":
    if (this.finalAbilities.Intelligence < 20){
      this.checkPoints(clicked.key , "add");
      if (this.choices.validate == true){
        this.charAbilities.Intelligence += 1;
        this.finalAbilities.Intelligence +=1;
      }
      }
  break;
  case "Strength":
    if (this.finalAbilities.Strength < 20){
      this.checkPoints(clicked.key , "add");
      if (this.choices.validate == true){
        this.charAbilities.Strength += 1;
        this.finalAbilities.Strength +=1;
      }
      }
  break;
  case "Wisdom":
    if (this.finalAbilities.Wisdom < 20){
      this.checkPoints(clicked.key , "add");
      if (this.choices.validate == true){
        this.charAbilities.Wisdom += 1;
        this.finalAbilities.Wisdom +=1;
      }
      }
  break;
  }
 this.calcModifier();
}

}
subAbility(clicked: any){
 
  if (this.points < this.maxPoints){
    switch (clicked.key){
    case "Charisma":
      this.checkPoints(clicked.key, "subtract")
      if (this.choices.validate == true && this.charAbilities.Charisma > 8){
        this.finalAbilities.Charisma -= 1;
        this.charAbilities.Charisma -= 1;
      }
      
    break;
    case "Constitution":
      this.checkPoints(clicked.key, "subtract")
      if (this.choices.validate == true && this.charAbilities.Constitution > 8){
        this.charAbilities.Constitution -= 1;
        this.finalAbilities.Constitution -= 1;

      }  
      
    break;
    case "Dexterity":
      this.checkPoints(clicked.key, "subtract")
      if (this.choices.validate == true && this.charAbilities.Dexterity > 8){
        this.charAbilities.Dexterity -= 1;
        this.finalAbilities.Dexterity -= 1;

      }   
      
    break;
    case "Intelligence":
      this.checkPoints(clicked.key, "subtract")
      if (this.choices.validate == true && this.charAbilities.Intelligence > 8){
        this.charAbilities.Intelligence -= 1;
        this.finalAbilities.Intelligence -= 1;

      }   
      
    break;
    case "Strength":
      this.checkPoints(clicked.key, "subtract")  
      if (this.choices.validate == true && this.charAbilities.Strength > 8){
        this.charAbilities.Strength -= 1;
        this.finalAbilities.Strength -= 1;

      } 
      
    break;
    case "Wisdom":
      this.checkPoints(clicked.key, "subtract")
      if (this.choices.validate == true && this.charAbilities.Wisdom > 8){
        this.charAbilities.Wisdom -= 1;
        this.finalAbilities.Wisdom -= 1;

      }   
      
    break;
  }
  this.calcModifier();

}

}

saveAbilities(){
  this.update();
  this.abilitiesSelected.emit(this.finalAbilities);
}
calcModifier(){
  this.abilityModifiers.emit(this.finalAbilities);
}
}
