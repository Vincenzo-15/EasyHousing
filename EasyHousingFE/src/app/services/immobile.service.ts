import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Immobile } from '../models/immobile.model';

@Injectable({
  providedIn: 'root'
}) // <--- RIMOSSO IL PUNTO E VIRGOLA QUI
export class ImmobileService {

  // URL del tuo backend Spring Boot
  private apiUrl = 'http://localhost:8080/api/immobili';

  constructor(private http: HttpClient) { }

  // 1. Ottieni tutti gli immobili
  getAllImmobili(): Observable<Immobile[]> {
    return this.http.get<Immobile[]>(`${this.apiUrl}/findByAllImmobili`);
  }

  // 2. Ottieni per ID
  getImmobileById(id: number): Observable<Immobile> {
    return this.http.get<Immobile>(`${this.apiUrl}/findByIdImmobile/${id}`);
  }

  // 3. Salva immobile
  createImmobile(immobile: Immobile): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/save`, immobile);
  }

  // immobile.service.ts

  getImmobiliByProprietario(email: string): Observable<Immobile[]> {
    // Corretto l'URL: deve contenere "findByProprietario" come nel Controller
    return this.http.get<Immobile[]>(`${this.apiUrl}/findByProprietario/${email}`);
  }

  deleteImmobile(id: number): Observable<void> {
    // Corretto l'URL: il Controller si aspetta /delete/{id}
    // Passiamo direttamente l'id invece dell'oggetto intero
    return this.http.delete<void>(`${this.apiUrl}/delete/${id}`);
  }

  // Aggiungi questo in immobile.service.ts
  updateImmobile(immobile: Immobile): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/update`, immobile);
  }
}
