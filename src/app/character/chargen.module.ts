import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SpeciesComponent } from './species/species.component';
import { AbilitiesComponent } from './abilities/abilities.component';
import { ClassesComponent } from './classes/classes.component';
import { SkillsComponent } from './skills/skills.component';
import { FeatsComponent } from './feats/feats.component';
import { TalentsComponent } from './talents/talents.component';
import { CharSheetComponent } from './char-sheet/char-sheet.component';

@NgModule({
  declarations: [
    SpeciesComponent,
    AbilitiesComponent,
    ClassesComponent,
    SkillsComponent,
    FeatsComponent,
    TalentsComponent,
    CharSheetComponent,
  ],
  imports: [
    CommonModule,
    FontAwesomeModule,
    [FormsModule,
      ReactiveFormsModule],

  ]
})
export class ChargenModule { }
