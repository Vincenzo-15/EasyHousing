import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Immagine {
  idImmagine?: number;
  idImmobile: number;
  immagine: string;
}

@Injectable({
  providedIn: 'root'
})
export class ImmagineService {

  private apiUrl = 'http://localhost:8080/api/immagini';

  constructor(private http: HttpClient) { }

  // Metodo per caricare file fisici (FormData)
  uploadImmagine(idImmobile: number, file: File): Observable<void> {
    const formData = new FormData();
    formData.append('idImmobile', idImmobile.toString());
    formData.append('file', file);
    return this.http.post<void>(`${this.apiUrl}/upload`, formData);
  }

  // Metodo per recuperare le immagini (URL)
  getImmaginiByIdImmobile(idImmobile: number): Observable<Immagine[]> {
    return this.http.get<Immagine[]>(`${this.apiUrl}/findByIdImmobile/${idImmobile}`);
  }

  // Metodo per cancellare
  deleteImmagine(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete/${id}`);
  }
}
