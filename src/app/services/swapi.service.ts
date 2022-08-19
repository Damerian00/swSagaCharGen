import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http'
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SwapiService {

swApitUrl: string = "https://swsagaapi.herokuapp.com/"

  constructor(private http: HttpClient) { }

  getSpecies(): Observable<any> {
    return this.http.get(this.swApitUrl + 'species');
  }

  getFeats(): Observable<any> {
    return this.http.get(this.swApitUrl + 'feats');
  }

  getTalents(): Observable<any> {
    return this.http.get(this.swApitUrl + 'talents');
  }

  getTalentTree(): Observable<any> {
    return this.http.get(this.swApitUrl + 'talenttree');
  }
  getArmors(): Observable<any> {
    return this.http.get(this.swApitUrl + 'armors');
  }
  getMelees(): Observable<any> {
    return this.http.get(this.swApitUrl + 'melees');
  }
  getRanged(): Observable<any> {
    return this.http.get(this.swApitUrl + 'ranger');
  }
  getEquip(): Observable<any> {
    return this.http.get(this.swApitUrl + 'equipment');
  }

}
