import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CharsheetComponent } from './components/charsheet/charsheet.component';
import { UpdateSkillsComponent } from './components/skills/skills.component';
import { DefensesComponent } from './components/defenses/defenses.component';
import { ArmorComponent } from './components/armor/armor.component';
import { AttacksComponent } from './components/attacks/attacks.component';
import { EquipmentComponent } from './components/equipment/equipment.component';
import { EncumbranceComponent } from './components/encumbrance/encumbrance.component';
import { LanguageComponent } from './components/languages/language.component';
import { ExperienceComponent } from './components/experience/experience.component';
import { CreditsComponent } from './components/credits/credits.component';
import { ForcepowersComponent } from './components/forcepowers/forcepowers.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    CharsheetComponent,
    UpdateSkillsComponent,
    DefensesComponent,
    ArmorComponent,
    AttacksComponent,
    EquipmentComponent,
    EncumbranceComponent,
    LanguageComponent,
    ExperienceComponent,
    CreditsComponent,
    ForcepowersComponent,
  ],
  imports: [
    CommonModule,
    FontAwesomeModule,
    [FormsModule,
      ReactiveFormsModule],
  ]
})  
export class UpdatemoduleModule {


 }
