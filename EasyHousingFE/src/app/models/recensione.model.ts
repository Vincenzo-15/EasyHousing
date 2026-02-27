export interface Recensione {
  idRecensione: number;
  titolo: string;
  valutazione: number;
  autore: string; // Stringa perché nel backend restituiamo il nome/id come stringa o l'oggetto mappato
  idImmobile: number;
}
