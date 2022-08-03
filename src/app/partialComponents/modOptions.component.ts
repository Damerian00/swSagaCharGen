import { Component, Input, Output, EventEmitter } from "@angular/core";

@Component({
    selector: 'modOptions',
    template: `<option *ngFor="let option of modArray">{{option}}</option>
               `,
    styles: [],
})


export class modOptionsComponent {
        @Input () modArray: Array<any> = [] ;
        










}