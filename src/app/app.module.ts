import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainComponent } from './main/main.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { LandingpageComponent } from './landingpage/landingpage.component';
import { UpdatemoduleModule } from './updatemodule/updatemodule.module';




@NgModule({
  declarations: [
    AppComponent,
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
