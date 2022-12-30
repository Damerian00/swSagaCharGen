import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { LandingpageComponent } from "../dashboard/landingpage/landingpage.component";
import { CharsheetComponent } from "../updatemodule/components/charsheet/charsheet.component";
import { MainComponent } from "./main/main.component";


const routes: Routes = [
    {path: '', component: LandingpageComponent},
    {path: 'new-hero', component: MainComponent},
    {path: 'update-hero', component: CharsheetComponent},

];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class ChargenRoutingModule {}