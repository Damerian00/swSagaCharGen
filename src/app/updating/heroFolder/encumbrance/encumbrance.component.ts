import { Component, OnInit } from '@angular/core';
import { HeroService } from '../../services/hero.service';

@Component({
  selector: 'encumbrance',
  template: `
  <h6>Encumbrance</h6>
  <section class = "encum">
  <div class="box">
      <p>{{currentCarry}}kg</p>
      <span>/</span>
      <p>{{maxCarry}}kg</p>
  </div>
  </section>`,
  styles: [`
  h6{margin-bottom:0;}
  .encum {
    display:flex;
    border: 1px solid black;
    padding: 0.5vh 0.5rem;
    width: 100%;
    border-top: none;
  }
  .box{
    display: flex;
    flex:1;   
    align-items: center;
    justify-content: center;
    }
    p{font-size:1.5rem;margin: .5rem;}
    `]
})
export class EncumbranceComponent implements OnInit {

 maxCarry: number = 0;
 currentCarry: number = 0; 

  constructor(private heroservice : HeroService) { }

  ngOnInit(): void {
    this.getMaxCarry();
  
    this.heroservice.invokeCarry.subscribe(()=> {
      this.getMaxCarry();
    });
    this.heroservice.invokeCarryCalcs.subscribe(()=> {
      this.calcCurrentCarry();
    })
    
  }

async getMaxCarry(){
  let strScore = await this.heroservice.getAbilities()["Strength"];
  let cl = await this.heroservice.getSpeciesTraits()["Carry Limit"];
  this.maxCarry = Math.pow(strScore, 2) * 0.5 * cl;
// console.log(strScore, cl)
}

calcCurrentCarry(){
let carry = this.heroservice.getCarryMod().toFixed(2);
this.currentCarry = Number(carry);

}


}
