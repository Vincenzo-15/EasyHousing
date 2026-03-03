export interface Utente {
  idUtente?: number; // Opzionale perché nel form di registrazione non ce l'hai ancora
  nome: string;
  cognome: string;
  email: string;
  password?: string; // Opzionale nel ritorno dati per sicurezza
  telefono: string;
  ruolo: string;
  bannato?: boolean; // Opzionale, usato solo per la gestione admin
}
