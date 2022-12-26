import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { HeroService } from "../../services/hero.service";

@Component({
    selector: 'languages',
    templateUrl: `./language.component.html`,
  styleUrls: [`./language.component.scss`]


})
export class LanguageComponent implements OnInit {
//   Variables
//  inputs and Outputs
@Input() knownLanguages:Array<string> = [];
@Input () totalLangs: number = 0;
@Output () savedLanguages : EventEmitter <any> = new EventEmitter <any> ();
//  Arrays
allLanguagesArr: Array<string> = ["Basic", "Binary", "Bocce", "Bothese", "Cerean", "Dosh", "Durese", "Ewokese", "Gamorrean", "Gunganese", "High Galactic", "Huttese", "Ithorese", "Jawa Trade Language", "Kel Dor", "Mon Calamarian","Quarrenese","Rodese","Ryl","Shyriiwook","Sullustese","Zabrak","Altirish","Anzat","Anarrese","Dromnyr","Chadra-Fan","Cheunh","Ebruchese","Killik","Kreva","Minnisiat (Trade Language)","Nikto","Rakata","Rammocate (Trade Language)","Shistavanen","Sluissese","Squibbian","Ssi-Ruuvi","Sy Bisti (Trade Language)","Tibranese","Tof","Vagaari","Verpine","Military Sign"];
langOptions: Array<string> = [];
selectionArr: Array<string> = [];
heroLanguages: Array<string> = [];
//  Booleans
showLangForm: boolean = false;
newLangForm: boolean = false;
//  Misc
currentLangs: number = 0;
    constructor(private heroservice : HeroService) { }
    ngOnInit(): void {
        this.currentLangs = this.knownLanguages.length;
        // this.getLangOptions();
        this.resetlanguages(this.knownLanguages);
        this.heroservice.invokeLanguages.subscribe((arr: Array<string>)=>{
            this.resetlanguages(arr);
        })
    }
resetlanguages(arr: Array<string>){
    this.heroLanguages = [...arr];
    this.currentLangs = this.heroLanguages.length;
    this.savedLanguages.emit(this.heroLanguages)
}
getLangOptions(){
    if (this.langOptions.length != 0){
        while (this.langOptions.length){
            this.langOptions.pop();
        }
    }
  for (let i = 0; i<this.allLanguagesArr.length;i++){
    if (this.heroLanguages.includes(this.allLanguagesArr[i]) == false){
        this.langOptions.push(this.allLanguagesArr[i]);
    }
  }
  for (let i = 0; i<this.knownLanguages.length;i++){
    if (this.heroLanguages.includes(this.knownLanguages[i]) == false){
        this.langOptions.push(this.knownLanguages[i]);
    }
  }
//   console.log(this.langOptions)
}
toggleAddLanguage(char: string){
    (char == "a")? this.getLangOptions(): "nothing";
    this.showLangForm = !this.showLangForm;
}
addToSelection(selection: any){
    if (selection == "Select a Language to add" || this.selectionArr.includes(selection) || selection == ''){
        return;
    }else if (selection == 'Add Language'){
        this.newLangForm = true;
        return;
    } else if ( (this.selectionArr.length + this.heroLanguages.length) >= this.totalLangs){
        return;
    }
    this.newLangForm = false;
    this.selectionArr.push(selection);
    console.log(this.selectionArr, this.heroLanguages, this.totalLangs);
    
}
removeLanguage(index: number){
    if (this.selectionArr.includes(this.heroLanguages[index])){
        let i = this.selectionArr.findIndex((el:any)=> el == this.heroLanguages[index]);
        (i == 0)? this.selectionArr.shift():this.selectionArr.splice(i,1);
    }
    (index == 0)? this.heroLanguages.shift():this.heroLanguages.splice(index,1);
    this.currentLangs = this.heroLanguages.length;
}
removeFromSelection(index: number){
    // console.log(index,"the index");
    (index == 0)? this.selectionArr.shift():this.selectionArr.splice(index,1);
    
}
addToKnown(){
    let temp = [...this.heroLanguages];
    for (let i=0; i<this.selectionArr.length; i++){
        if (temp.includes(this.selectionArr[i])){
            (i == 0)? this.selectionArr.shift():this.selectionArr.splice(i,1);
        }
    }
    this.heroLanguages = [...temp, ...this.selectionArr];  
    this.currentLangs = this.heroLanguages.length;
    // console.log(this.heroLanguages)
    this.toggleAddLanguage('b');
    this.savedLanguages.emit(this.heroLanguages);
    this.selectionArr = [];
}
cancel(){
    this.selectionArr = []
    this.toggleAddLanguage('b');
}

}