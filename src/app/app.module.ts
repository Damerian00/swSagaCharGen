import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SpeciesComponent } from './character/species/species.component';
import { AbilitiesComponent } from './character/abilities/abilities.component';
import { ClassesComponent } from './character/classes/classes.component';
import { SkillsComponent } from './character/skills/skills.component';
import { FeatsComponent } from './character/feats/feats.component';
import { TalentsComponent } from './character/talents/talents.component';
import { CharSheetComponent } from './character/char-sheet/char-sheet.component';
import { MainComponent } from './main/main.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { LandingpageComponent } from './landingpage/landingpage.component';
import { UpdatemoduleModule } from './updatemodule/updatemodule.module';




@NgModule({
  declarations: [
    AppComponent,
    SpeciesComponent,
    AbilitiesComponent,
    ClassesComponent,
    SkillsComponent,
    FeatsComponent,
    TalentsComponent,
    CharSheetComponent,
    MainComponent,
    LandingpageComponent,
   
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    [FormsModule,
    ReactiveFormsModule],
    FontAwesomeModule,
    UpdatemoduleModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
  

 }
