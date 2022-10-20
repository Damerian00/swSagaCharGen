import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http'
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SwapiService {

// swApitUrl: string = "https://swsagaapi.herokuapp.com/" postgres db
swApiUrl: string = "https://swsagabe01.herokuapp.com/";

  constructor(private http: HttpClient) { }

  getSpecies(): Observable<any> {
    return this.http.get(this.swApiUrl + 'species');
  }

  getFeats(): Observable<any> {
    return this.http.get(this.swApiUrl + 'feats');
  }

  getTalents(): Observable<any> {
    return this.http.get(this.swApiUrl + 'talents');
  }

  getTalentTree(): Observable<any> {
    return this.http.get(this.swApiUrl + 'talenttree');
  }
  getArmors(): Observable<any> {
    return this.http.get(this.swApiUrl + 'armors');
  }
  getMelees(): Observable<any> {
    return this.http.get(this.swApiUrl + 'melees');
  }
  getRanged(): Observable<any> {
    return this.http.get(this.swApiUrl + 'ranger');
  }
  getEquip(): Observable<any> {
    return this.http.get(this.swApiUrl + 'equipment');
  }

}
