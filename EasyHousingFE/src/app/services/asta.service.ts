import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AstaModel } from '../models/asta.model';

@Injectable({
  providedIn: 'root'
})
export class AstaService {

  private apiUrl = 'http://localhost:8080/api/asta';

  constructor(private http: HttpClient) { }

  creaAsta(asta: AstaModel): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/save`, asta);
  }

  getAstaByImmobile(idImmobile: number): Observable<AstaModel> {
    return this.http.get<AstaModel>(`${this.apiUrl}/findByIdImmobile/${idImmobile}`);
  }

  aggiornaAsta(asta: AstaModel): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/update`, asta);
  }
}
