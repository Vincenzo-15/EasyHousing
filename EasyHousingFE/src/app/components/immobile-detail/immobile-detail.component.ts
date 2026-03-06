import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { ImmobileService } from '../../services/immobile.service';
import { Immobile } from '../../models/immobile.model';
import { Immagine, ImmagineService } from '../../services/immagine.service';
import { UtenteService } from '../../services/utente.service';
import { RecensioneService } from '../../services/recensione.service';
import { AuthService } from '../../services/auth.service';
import { Recensione } from '../../models/recensione.model';
import { AstaService } from '../../services/asta.service';
import { AstaModel } from '../../models/asta.model';

@Component({
  selector: 'app-immobile-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './immobile-detail.component.html',
  styleUrls: ['./immobile-detail.component.css']
})
export class ImmobileDetailComponent implements OnInit {

  immobile: Immobile | undefined;
  immagini: Immagine[] = [];
  mappaUrlSicuro: SafeResourceUrl | undefined;

  messaggioTesto: string = '';
  nomeVenditore: string = '';

  // Dizionario per mappare gli ID utente ai Nomi Reali
  nomiRecensori: { [id: number]: string } = {};

  nuovaRecensione: Recensione = {
    idRecensione: 0,
    titolo: '',
    valutazione: 5,
    idUtente: 0,
    idImmobile: 0
  };

  astaCorrente: AstaModel | null = null;
  nuovaOfferta: number = 0;

  constructor(
    private route: ActivatedRoute,
    private immobileService: ImmobileService,
    private immagineService: ImmagineService,
    private utenteService: UtenteService,
    private sanitizer: DomSanitizer,
    private recensioneService: RecensioneService,
    public authService: AuthService,
    private astaService: AstaService
  ) {}

  ngOnInit(): void {
    this.caricaDettagli();
  }

  caricaDettagli() {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (id) {
      // 1. Carica info immobile
      this.immobileService.getImmobileById(id).subscribe({
        next: (data: Immobile) => {
          this.immobile = data;

          // RECUPERO DATI ASTA (Se l'annuncio è un'asta)
          if (this.immobile.tipoAnnuncio === 'ASTA') {
            this.astaService.getAstaByImmobile(this.immobile.idImmobile).subscribe({
              next: (asta) => {
                this.astaCorrente = asta;
                // Imposta nel form il prezzo minimo accettabile (prezzo attuale + 50€)
                this.nuovaOfferta = asta.prezzoAttuale + 50;
              },
              error: () => console.error("Nessuna asta trovata per questo immobile")
            });
          }

          // Caricamento dei nomi delle recensioni
          if (this.immobile.recensioni && this.immobile.recensioni.length > 0) {
            this.caricaNomiRecensori(this.immobile.recensioni);
          }

          // Recupera il NOME REALE del venditore usando la sua email
          this.utenteService.getUtenteByEmail(this.immobile.proprietario).subscribe({
            next: (utente) => {
              this.nomeVenditore = `${utente.nome} ${utente.cognome}`;
            },
            error: () => this.nomeVenditore = this.immobile!.proprietario // Fallback all'email
          });

          // 2. GENERAZIONE URL GOOGLE MAPS
          const indirizzoCodificato = encodeURIComponent(this.immobile.indirizzo);
          const urlGoogleMaps = `https://maps.google.com/maps?q=${indirizzoCodificato}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
          this.mappaUrlSicuro = this.sanitizer.bypassSecurityTrustResourceUrl(urlGoogleMaps);
        },
        error: (err: any) => console.error('Errore immobile:', err)
      });

      // 3. Carica le immagini
      this.immagineService.getImmaginiByIdImmobile(id).subscribe({
        next: (imgs: Immagine[]) => {
          this.immagini = imgs;
        },
        error: (err: any) => console.error('Errore immagini:', err)
      });
    }
  }

  // Carica i nomi per ogni recensione in modo asincrono
  caricaNomiRecensori(recensioni: Recensione[]) {
    recensioni.forEach(rec => {
      if (!this.nomiRecensori[rec.idUtente]) {
        this.utenteService.getUtenteById(rec.idUtente).subscribe({
          next: (utente) => {
            this.nomiRecensori[rec.idUtente] = `${utente.nome} ${utente.cognome}`;
          },
          error: () => this.nomiRecensori[rec.idUtente] = 'Utente Sconosciuto'
        });
      }
    });
  }

  // MODALE EMAIL
  inviaMessaggio() {
    if (!this.immobile) return;

    const oggetto = `Rif. ${this.immobile.idImmobile} - ${this.immobile.nome}`;

    console.log("--- SIMULAZIONE INVIO EMAIL ---");
    console.log("A: ", this.immobile.proprietario);
    console.log("Oggetto: ", oggetto);
    console.log("Messaggio: ", this.messaggioTesto);

    this.messaggioTesto = ''; // Svuota il campo
    alert(`Messaggio inviato con successo a ${this.nomeVenditore || this.immobile.proprietario}!`);
  }

  // INVIO RECENSIONE DB
  inviaRecensione() {
    const utenteCorrente = this.authService.getUser();

    // Controlli di sicurezza
    if (!utenteCorrente || !utenteCorrente.idUtente || !this.immobile) {
      alert("Devi essere loggato per lasciare una recensione!");
      return;
    }

    // Popola i dati mancanti
    this.nuovaRecensione.idUtente = utenteCorrente.idUtente;
    this.nuovaRecensione.idImmobile = this.immobile.idImmobile;

    // Invia al backend
    this.recensioneService.creaRecensione(this.nuovaRecensione).subscribe({
      next: () => {
        alert("Recensione pubblicata con successo!");

        // Aggiunge la recensione istantaneamente all'interfaccia
        if (!this.immobile!.recensioni) this.immobile!.recensioni = [];
        this.immobile!.recensioni.push({ ...this.nuovaRecensione });

        // Mettiamo subito il nome dell'utente corrente nel dizionario per non mostrare "Caricamento"
        this.nomiRecensori[utenteCorrente.idUtente!] = `${utenteCorrente.nome} ${utenteCorrente.cognome}`;

        // Resetta il form
        this.nuovaRecensione.titolo = '';
        this.nuovaRecensione.valutazione = 5;
      },
      error: (err) => alert("Errore durante l'invio della recensione.")
    });
  }

  // INVIO OFFERTA ASTA DB
  inviaOfferta() {
    const utenteCorrente = this.authService.getUser();

    // 1. Controlli di validazione
    if (!utenteCorrente || !this.astaCorrente || !this.immobile) {
      alert("Devi effettuare il login per fare un'offerta.");
      return;
    }

    if (utenteCorrente.email === this.immobile.proprietario) {
      alert("Non puoi fare un'offerta sul tuo stesso annuncio!");
      return;
    }

    if (this.nuovaOfferta <= this.astaCorrente.prezzoAttuale) {
      alert("La tua offerta deve essere strettamente SUPERIORE al prezzo attuale!");
      return;
    }

    // 2. Aggiorna i dati dell'Asta
    this.astaCorrente.prezzoAttuale = this.nuovaOfferta;
    this.astaCorrente.acquirente = utenteCorrente.email; // Il nuovo miglior offerente

    // 3. Invia l'aggiornamento al backend
    this.astaService.aggiornaAsta(this.astaCorrente).subscribe({
      next: () => {
        // Notifica simulata al venditore
        console.log("--- SIMULAZIONE EMAIL DI SISTEMA ---");
        console.log(`A: ${this.immobile?.proprietario}`);
        console.log(`Oggetto: Nuova offerta ricevuta per ${this.immobile?.nome}`);
        console.log(`Messaggio: L'utente ${utenteCorrente.email} ha appena fatto un'offerta di €${this.nuovaOfferta}.`);

        alert("Offerta inviata con successo! Attualmente sei il miglior offerente.");

        // Aggiorna visivamente il prezzo dell'immobile nella pagina
        if (this.immobile) this.immobile.prezzoAttuale = this.nuovaOfferta;
      },
      error: (err) => {
        console.error(err);
        alert("Si è verificato un errore durante l'invio dell'offerta.");
      }
    });
  }
}
