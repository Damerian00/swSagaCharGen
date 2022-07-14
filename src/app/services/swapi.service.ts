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

}
