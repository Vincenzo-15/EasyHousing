import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Utente } from '../models/utente.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:8080/api/login'; // L'endpoint del tuo Controller

  // BehaviorSubject: Mantiene lo stato dell'utente anche se cambi pagina
  private userSubject = new BehaviorSubject<Utente | null>(this.getUserFromStorage());
  public user$ = this.userSubject.asObservable();

  constructor(private http: HttpClient) { }

  // 1. LOGIN REALE
  login(email: string, password: string): Observable<Utente> {
    // Inviamo email e password. Il backend si aspetta un oggetto Utente JSON.
    return this.http.post<Utente>(this.apiUrl, { email, password }).pipe(
      tap(utenteDalBackend => {
        // Se il backend risponde con l'utente (e non null)
        if (utenteDalBackend) {
          this.saveUserToStorage(utenteDalBackend);
          this.userSubject.next(utenteDalBackend);
        }
      })
    );
  }

  register(utente: Utente): Observable<Utente> {
    return this.http.post<Utente>('http://localhost:8080/api/utenti/save', utente);
  }

  // 2. LOGOUT
  logout() {
    localStorage.removeItem('utente_sessione');
    this.userSubject.next(null);
  }

  updateCurrentUser(user: Utente) {
    this.saveUserToStorage(user); // Salva col nome corretto
    this.userSubject.next(user);  // Avvisa la Navbar di aggiornarsi
  }

  // 3. RECUPERA UTENTE (al refresh F5)
  private getUserFromStorage(): Utente | null {
    const userJson = localStorage.getItem('utente_sessione');
    return userJson ? JSON.parse(userJson) : null;
  }

  private saveUserToStorage(user: Utente) {
    localStorage.setItem('utente_sessione', JSON.stringify(user));
  }

  // === METODI UTILI PER LA NAVBAR ===

  // Ritorna true se l'utente è loggato
  isLoggedIn(): boolean {
    return !!this.userSubject.value;
  }

  // Ritorna il nome per il "Benvenuto Mario"
  getUserName(): string {
    return this.userSubject.value?.nome || '';
  }

  // Gestione Ruoli
  isAdmin(): boolean {
    return this.userSubject.value?.ruolo === 'ADMIN';
  }

  isVenditore(): boolean {
    return this.userSubject.value?.ruolo === 'VENDITORE';
  }

  getUser(): Utente | null {
    return this.userSubject.value;
  }
}
