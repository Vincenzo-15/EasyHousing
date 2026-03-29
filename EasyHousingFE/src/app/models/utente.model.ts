export interface Utente {
  idUtente?: number;
  nome: string;
  cognome: string;
  email: string;
  password?: string;
  telefono: string;
  ruolo: string;
  bannato?: boolean;
}
