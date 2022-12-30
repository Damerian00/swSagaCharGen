import { Injectable } from '@angular/core';
import species from '../db/species.json';
import feats from '../db/feats.json';
import talents from '../db/talents.json';
import talenttrees from '../db/talenttree.json';
import armors from '../db/armor.json';
import melees from '../db/melee.json';
import ranged from '../db/range.json';
import equipments from '../db/equipment.json';

interface species {
    species_name: String,
    age_group: any,
    traits : any
}
 interface feats {
    name : String,
    prereqs: any,
    ope : Boolean, 
    description : String
 }
 interface talents {
    name: String,
    preReqs: any,
    effect: any,
    addOption: String[],
    TalentTreeId: String,
    ope: Boolean,
    description: String
 }
 interface talenttrees {
    id: String,
    name: String,
    classUsage: String[],
    description: String,
    Talents: any
 }
 interface armors {
    name: String,
    a_type: String,
    cost: String,
    armorBonus: String,
    equipBonus: String,
    dexBonus: String,
    weight: String,
    availability: String[],
    attributes: String[]
 }
 interface melees {
    name : String,
    w_type : String,
    size : String,
    cost : String,
    damage : String,
    stun_setting : String[],
    weight : String,
    d_type : String[],
    availability : String[]
 }
interface ranged {
    name : String,
    w_type : String,
    size : String,
    cost : String,
    damage : String,
    stun_setting : String[],
    rof : String[],
    weight : String,
    d_type : String[],
    availability : String[],
    attributes: String[]
}
interface equipments {
    name : String,
    cost : String,
    weight : String,
    equip_type : any,
    description: String,
    attributes: String[]
}

@Injectable({
    providedIn: 'root'
})


export class SWPsuedoApi {
    constructor() {}
speciesArray : species[] = species;
featsArray: feats[] = feats;
talentsArray: talents[] = talents;
talenttreeArray: talenttrees[] = talenttrees;
armorsArray: armors[] = armors;
meleesArray: melees[] = melees;
rangedArray: ranged[] = ranged;
equipmentsArray: equipments[] = equipments;

getSpecies(){
    return this.speciesArray;
}
getFeats(){
    return this.featsArray;
}
getTalents(){
    return this.talentsArray;
}

getTalentTrees(){
    if (this.talenttreeArray[0].Talents.length == 0){
        this.assignTrees(this.talentsArray);
    }
    return this.talenttreeArray;
}
getArmors(){
    return this.armorsArray;
}
getMelees(){
    return this.meleesArray;
}
getRanged(){
    return this.rangedArray;
}
getEquip(){
    return this.equipmentsArray;
}

assignTrees(talents : any){
    for (let i=0; i< talents.length;i++){
        for (let j=0; j<talenttrees.length;j++){
            if (talents[i].TalentTreeId == this.talenttreeArray[j].id){
                this.talenttreeArray[j].Talents.push(this.talentsArray[i])
            }

        }
    }
}

}