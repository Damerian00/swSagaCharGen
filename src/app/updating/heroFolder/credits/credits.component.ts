import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { HeroService } from '../../services/hero.service';
import { LevelingService } from '../../services/leveling.service';

@Component({
  selector: 'credits',
  templateUrl: './credits.component.html',
  styleUrls: ['./credits.component.scss']
})
export class CreditsComponent implements OnInit {

credits : number = 0;
notvalid: boolean = false;
showCalc = {"boolean" : false, "text" : "Show Calculator"};


  constructor(private level: LevelingService, private hero: HeroService) { }

  ngOnInit(): void {

    this.hero.invokeCalculator.subscribe((arr)=>{
      this.calculateCredits(arr[0], arr[1]);
    })


  }
toggleCalc(){
  this.showCalc.boolean = !this.showCalc.boolean;
  this.showCalc.text = (this.showCalc.text == "Show Calculator")? "Hide Calculator": "Show Calculator";
}
calculateCredits(num : any, operand: string){
  if (num == ""){
    this.toggleCalc();
    this.notvalid = false; 
    return
  }
  this.notvalid = false;
  let realNum = Math.floor(parseInt(num));
  let cred;
  if (operand == "+"){
    cred = this.credits + realNum;
  }else{
    cred = this.credits - realNum;
  }
  if (cred < 0){
    this.notvalid = true;
    this.hero.updateCredits('not valid');
    return;
  }
  this.credits = cred;
  this.showCalc.boolean = false;
  this.showCalc.text = "Show Calculator";
  this.hero.updateCredits(this.credits);
}


}
