import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LandingpageComponent } from './landingpage/landingpage.component';
import { ChargenRoutingModule } from '../character/chargen-routing.module';



@NgModule({
  declarations: [
    LandingpageComponent,

  ],
  imports: [
    CommonModule,
    ChargenRoutingModule,
  ]
})
export class DashboardModule { }
