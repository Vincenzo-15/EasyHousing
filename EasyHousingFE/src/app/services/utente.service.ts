import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Utente } from '../models/utente.model';

@Injectable({
  providedIn: 'root'
})
export class UtenteService {

  private apiUrl = 'http://localhost:8080/api/utenti';

  constructor(private http: HttpClient) { }

  getAllUtenti(): Observable<Utente[]> {
    return this.http.get<Utente[]>(`${this.apiUrl}/findByAllUtenti`);
  }

  toggleBan(id: number): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/ban/${id}`, {});
  }

  promuoviAdmin(id: number): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/promuovi/${id}`, {});
  }

  deleteUtente(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete/${id}`);
  }
}
