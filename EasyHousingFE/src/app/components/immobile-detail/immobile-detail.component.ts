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

  // NUOVA VARIABILE: Dizionario per mappare gli ID utente ai Nomi Reali
  nomiRecensori: { [id: number]: string } = {};

  nuovaRecensione: Recensione = {
    idRecensione: 0, // Aggiunto per evitare errori TS se non reso opzionale nel model
    titolo: '',
    valutazione: 5,
    idUtente: 0,
    idImmobile: 0
  };

  constructor(
    private route: ActivatedRoute,
    private immobileService: ImmobileService,
    private immagineService: ImmagineService,
    private utenteService: UtenteService,
    private sanitizer: DomSanitizer,
    private recensioneService: RecensioneService,
    public authService: AuthService
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

          // NOVITÀ: Richiamiamo il caricamento dei nomi delle recensioni
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

  // NUOVO METODO: Carica i nomi per ogni recensione in modo asincrono
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

        // NUOVA RIGA: Mettiamo subito il nome dell'utente corrente nel dizionario per non mostrare "Caricamento"
        this.nomiRecensori[utenteCorrente.idUtente!] = `${utenteCorrente.nome} ${utenteCorrente.cognome}`;

        // Resetta il form
        this.nuovaRecensione.titolo = '';
        this.nuovaRecensione.valutazione = 5;
      },
      error: (err) => alert("Errore durante l'invio della recensione.")
    });
  }
}
