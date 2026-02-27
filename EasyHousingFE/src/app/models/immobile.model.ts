
import { Recensione } from "./recensione.model";

export interface Immobile {
  idImmobile: number;
  nome: string;
  tipoImmobile: string;
  prezzoOrig: number;
  prezzoAttuale: number;
  descrizione: string;
  metriQuadri: number;
  indirizzo: string;
  proprietario: string;
  tipoAnnuncio: string;
  recensioni?: Recensione[];
}
