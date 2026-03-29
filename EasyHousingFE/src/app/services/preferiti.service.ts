import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Immobile } from '../models/immobile.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class PreferitiService {

  // Inizialmente la lista è vuota
  private preferitiSubject = new BehaviorSubject<Immobile[]>([]);
  preferiti$ = this.preferitiSubject.asObservable();

  constructor(private authService: AuthService) {
    this.caricaPreferitiUtenteCorrente();
  }

  // Genera una chiave UNICA per ogni utente in base alla sua email
  private getStorageKey(): string | null {
    const utente = this.authService.getUser();
    return utente ? `easyhousing_preferiti_${utente.email}` : null;
  }

  // Carica i dati specifici dell'utente appena loggato (o svuota la lista se fa logout)
  caricaPreferitiUtenteCorrente() {
    const key = this.getStorageKey();
    if (key) {
      const salvati = localStorage.getItem(key);
      this.preferitiSubject.next(salvati ? JSON.parse(salvati) : []);
    } else {
      this.preferitiSubject.next([]); // Nessun utente loggato = lista vuota
    }
  }

  // Salva i preferiti nel cassetto personale dell'utente
  private salvaNelStorage(preferiti: Immobile[]) {
    const key = this.getStorageKey();
    if (key) {
      localStorage.setItem(key, JSON.stringify(preferiti));
      this.preferitiSubject.next(preferiti);
    }
  }

  // Aggiunge o Rimuove un immobile dai preferiti
  togglePreferito(immobile: Immobile) {
    if (!this.authService.isLoggedIn()) {
      alert("Devi effettuare il login per aggiungere gli annunci ai preferiti!");
      return;
    }

    let preferitiCorrenti = this.preferitiSubject.getValue();
    const index = preferitiCorrenti.findIndex(p => p.idImmobile === immobile.idImmobile);

    if (index === -1) {
      preferitiCorrenti.push(immobile);
    } else {
      preferitiCorrenti.splice(index, 1);
    }

    this.salvaNelStorage(preferitiCorrenti);
  }

  // Controlla se è tra i preferiti per colorare il cuore
  isPreferito(idImmobile: number): boolean {
    if (!this.authService.isLoggedIn()) return false;

    const preferitiCorrenti = this.preferitiSubject.getValue();
    return preferitiCorrenti.some(p => p.idImmobile === idImmobile);
  }
}
