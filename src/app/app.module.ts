import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { UpdatemoduleModule } from './updatemodule/updatemodule.module';
import { ChargenModule } from './character/chargen.module';
import { DashboardModule } from './dashboard/dashboard.module';





@NgModule({
  declarations: [
    AppComponent,
    
    
   
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    UpdatemoduleModule,
    ChargenModule,
    DashboardModule,
    HttpClientModule,
    [FormsModule,
    ReactiveFormsModule],
    FontAwesomeModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
  

 }
