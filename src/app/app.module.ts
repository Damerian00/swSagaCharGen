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
import { CharsheetComponent } from './updating/heroFolder/charsheet/charsheet.component';
import { LandingpageComponent } from './landingpage/landingpage.component';
import { UpdateSkillsComponent } from './updating/heroFolder/skills/skills.component';
import { DefensesComponent } from './updating/heroFolder/defenses/defenses.component';
import { ArmorComponent } from './updating/heroFolder/armor/armor.component';
import { AttacksComponent } from './updating/heroFolder/attacks/attacks.component';
import { EquipmentComponent } from './updating/heroFolder/equipment/equipment.component';
import { EncumbranceComponent } from './updating/heroFolder/encumbrance/encumbrance.component';
import { LanguageComponent } from './updating/heroFolder/languages/language.component';
import { ExperienceComponent } from './updating/heroFolder/experience/experience.component';




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
    CharsheetComponent,
    LandingpageComponent,
    UpdateSkillsComponent,
    DefensesComponent,
    ArmorComponent,
    AttacksComponent,
    EquipmentComponent,
    EncumbranceComponent,
    LanguageComponent,
    ExperienceComponent,
   
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    [FormsModule,
    ReactiveFormsModule],
    FontAwesomeModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
