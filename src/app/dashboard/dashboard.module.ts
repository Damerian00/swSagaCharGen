import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LandingpageComponent } from './landingpage/landingpage.component';
import { ChargenRoutingModule } from '../character/chargen-routing.module';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    LandingpageComponent,

  ],
  imports: [
    CommonModule,
    ChargenRoutingModule,
    FormsModule
  ]
})
export class DashboardModule { }
