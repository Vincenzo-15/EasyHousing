import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Recensione } from '../models/recensione.model';

@Injectable({
  providedIn: 'root'
})
export class RecensioneService {

  private apiUrl = 'http://localhost:8080/api/recensioni';

  constructor(private http: HttpClient) { }

  creaRecensione(recensione: Recensione): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/save`, recensione);
  }
}
