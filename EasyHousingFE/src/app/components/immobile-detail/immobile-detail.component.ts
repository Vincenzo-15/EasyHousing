import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { ImmobileService } from '../../services/immobile.service';
import { Immobile } from '../../models/immobile.model';
import { Immagine, ImmagineService } from '../../services/immagine.service';
import { UtenteService } from '../../services/utente.service';
import { RecensioneService } from '../../services/recensione.service';
import { AuthService } from '../../services/auth.service';
import { AstaService } from '../../services/asta.service';
import { AstaModel } from '../../models/asta.model';
import { PreferitiService } from '../../services/preferiti.service';
import { Recensione } from '../../models/recensione.model';

@Component({
  selector: 'app-immobile-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './immobile-detail.component.html',
  styleUrls: ['./immobile-detail.component.css']
})
export class ImmobileDetailComponent implements OnInit, OnDestroy {

  immobile: Immobile | undefined;
  immagini: Immagine[] = [];
  mappaUrlSicuro: SafeResourceUrl | undefined;

  messaggioTesto: string = '';
  nomeVenditore: string = '';

  descrizionePulita: string = '';
  dettagliExtra: any = null;

  recensioni: Recensione[] = [];
  valutazioneMedia: number = 0;
  nomiRecensori: { [id: number]: string } = {};

  nuovaRecensione: Partial<Recensione> = { titolo: '', testo: '', valutazione: 5 };
  mostraFormRecensione: boolean = false;
  haGiaRecensito: boolean = false;

  astaCorrente: AstaModel | null = null;
  nuovaOfferta: number = 0;
  rilancioMinimo: number = 1000;

  tempoRimanenteStr: string = '';
  astaConclusa: boolean = false;
  seiInVantaggio: boolean = false;
  private timerInterval: any;

  constructor(
    private route: ActivatedRoute,
    private immobileService: ImmobileService,
    private immagineService: ImmagineService,
    private utenteService: UtenteService,
    private recensioneService: RecensioneService,
    public authService: AuthService,
    private sanitizer: DomSanitizer,
    private astaService: AstaService,
    public preferitiService: PreferitiService,
    private location: Location
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');
      if (idParam) {
        this.caricaDettagli(+idParam);
      }
    });
  }

  ngOnDestroy(): void {
    if (this.timerInterval) clearInterval(this.timerInterval);
  }

  tornaIndietro() {
    this.location.back();
  }

  caricaDettagli(id: number) {
    this.immobileService.getImmobileById(id).subscribe({
      next: (data: Immobile) => {
        this.immobile = data;
        const dettagliDiDefault = { locali: 'N/D', bagni: 'N/D', piano: 'Da verificare', condizioni: 'Non specificato', ascensore: 'N/D', classeEnergetica: 'N/D' };

        if (this.immobile.descrizione && this.immobile.descrizione.includes('|||')) {
          const parti = this.immobile.descrizione.split('|||');
          this.descrizionePulita = parti[0];
          try {
            this.dettagliExtra = JSON.parse(parti[1]);
          } catch (e) { this.dettagliExtra = dettagliDiDefault; }
        } else {
          this.descrizionePulita = this.immobile.descrizione;
          this.dettagliExtra = dettagliDiDefault;
        }

        if (this.immobile.tipoAnnuncio === 'ASTA') {
          this.astaService.getAstaByImmobile(this.immobile.idImmobile).subscribe({
            next: (astaDati) => {
              this.astaCorrente = astaDati;
              this.nuovaOfferta = this.astaCorrente.prezzoAttuale + this.rilancioMinimo;
              const userEmail = this.authService.getUser()?.email;
              this.seiInVantaggio = (this.astaCorrente.acquirente === userEmail);
              this.avviaTimerAsta();
            }
          });
        }
        this.caricaAltreInfo();
      },
      error: (err) => console.error("Errore caricamento immobile:", err)
    });
  }

  avviaTimerAsta() {
    this.aggiornaTimer();
    this.timerInterval = setInterval(() => { this.aggiornaTimer(); }, 1000);
  }

  aggiornaTimer() {
    if (!this.astaCorrente) return;

    const oraAttuale = new Date().getTime();

    const dataScadenza = new Date(this.astaCorrente.fine);
    const scadenzaMillisecondi = dataScadenza.getTime();

    const differenza = scadenzaMillisecondi - oraAttuale;

    // Aggiungiamo isNaN per sicurezza, se il database invia valori corrotti chiude l'asta
    if (differenza <= 0 || isNaN(differenza)) {
      this.astaConclusa = true;
      this.tempoRimanenteStr = 'ASTA CONCLUSA';
      if (this.timerInterval) clearInterval(this.timerInterval);
    } else {
      const giorni = Math.floor(differenza / (1000 * 60 * 60 * 24));
      const ore = Math.floor((differenza % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minuti = Math.floor((differenza % (1000 * 60 * 60)) / (1000 * 60));
      const secondi = Math.floor((differenza % (1000 * 60)) / 1000);

      this.tempoRimanenteStr = giorni + "g " + ore + "h " + minuti + "m " + secondi + "s";
    }
  }

  inviaOfferta() {
    const utenteCorrente = this.authService.getUser();
    if (!utenteCorrente || !this.astaCorrente || !this.immobile) {
      alert("Devi effettuare l'accesso per fare un'offerta."); return;
    }
    if (this.astaConclusa) {
      alert("Questa asta è chiusa! Non sono accettate ulteriori offerte."); return;
    }
    if (utenteCorrente.email === this.immobile.proprietario) {
      alert("Operazione non valida: non puoi fare offerte sul tuo stesso immobile."); return;
    }

    const offertaMinimaConsentita = this.astaCorrente.prezzoAttuale + this.rilancioMinimo;
    if (this.nuovaOfferta < offertaMinimaConsentita) {
      alert("Il rilancio minimo è di € " + this.rilancioMinimo.toLocaleString('it-IT') + "!"); return;
    }

    this.astaCorrente.prezzoAttuale = this.nuovaOfferta;
    this.astaCorrente.acquirente = utenteCorrente.email;

    this.astaService.aggiornaAsta(this.astaCorrente).subscribe({
      next: () => {
        this.immobile!.prezzoAttuale = this.nuovaOfferta;
        this.seiInVantaggio = true;
        alert("Offerta registrata con successo! Attualmente sei il miglior offerente.");
      },
      error: (err) => alert("Si è verificato un errore di rete durante l'offerta.")
    });
  }

  inviaMessaggio() {
    if (!this.immobile) return;
    const utenteCorrente = this.authService.getUser();
    if (utenteCorrente && utenteCorrente.email === this.immobile.proprietario) {
      alert("Operazione non valida: non puoi inviare un messaggio a te stesso."); return;
    }
    this.messaggioTesto = '';
    alert("Messaggio inviato con successo a " + (this.nomeVenditore || this.immobile.proprietario) + "!");
  }

  caricaAltreInfo() {
    this.immagineService.getImmaginiByIdImmobile(this.immobile!.idImmobile).subscribe({
      next: (data) => this.immagini = data
    });

    this.utenteService.getUtenteByEmail(this.immobile!.proprietario).subscribe({
      next: (venditore) => this.nomeVenditore = venditore.nome + ' ' + venditore.cognome
    });

    const queryUrl = 'https://maps.google.com/maps?q=' + encodeURIComponent(this.immobile!.indirizzo) + '&t=&z=15&ie=UTF8&iwloc=&output=embed';
    this.mappaUrlSicuro = this.sanitizer.bypassSecurityTrustResourceUrl(queryUrl);
    this.caricaRecensioni();
  }

  caricaRecensioni() {
    this.recensioneService.getRecensioniByImmobile(this.immobile!.idImmobile).subscribe({
      next: (data: Recensione[]) => {
        this.recensioni = data;

        this.calcolaMediaRecensioni();
        this.controllaSeHaGiaRecensito();

        this.recensioni.forEach(rec => {
          if (!this.nomiRecensori[rec.idUtente]) {
            this.nomiRecensori[rec.idUtente] = 'Caricamento...';
            this.utenteService.getUtenteById(rec.idUtente).subscribe({
              next: (utente) => {
                this.nomiRecensori[rec.idUtente] = utente.nome + ' ' + utente.cognome;
              },
              error: () => {
                this.nomiRecensori[rec.idUtente] = 'Utente Sconosciuto';
              }
            });
          }
        });
      },
      error: (err) => console.error("Errore di rete durante il caricamento delle recensioni:", err)
    });
  }

  calcolaMediaRecensioni() {
    if (this.recensioni.length === 0) {
      this.valutazioneMedia = 0; return;
    }
    const somma = this.recensioni.reduce((acc, rec) => acc + rec.valutazione, 0);
    this.valutazioneMedia = somma / this.recensioni.length;
  }

  controllaSeHaGiaRecensito() {
    const utenteCorrente = this.authService.getUser();
    if (utenteCorrente) {
      this.haGiaRecensito = this.recensioni.some(r => r.idUtente === utenteCorrente.idUtente);
    }
  }

  inviaRecensione() {
    const utenteCorrente = this.authService.getUser();
    if (!utenteCorrente) {
      alert("Devi essere loggato per lasciare una recensione."); return;
    }
    this.nuovaRecensione.idUtente = utenteCorrente.idUtente!;
    this.nuovaRecensione.idImmobile = this.immobile!.idImmobile;

    this.recensioneService.creaRecensione(this.nuovaRecensione as Recensione).subscribe({
      next: () => {
        alert("Recensione inviata con successo!");
        this.caricaRecensioni();
        this.mostraFormRecensione = false;
        this.nuovaRecensione = { titolo: '', testo: '', valutazione: 5 };
      },
      error: (err) => alert("Si è verificato un errore.")
    });
  }

  // --- NUOVO METODO: ADMIN ELIMINA RECENSIONE ---
  eliminaRecensioneAdmin(idRecensione: number) {
    if (confirm("Sei sicuro di voler eliminare questa recensione come Amministratore? L'azione è irreversibile.")) {
      this.recensioneService.deleteRecensione(idRecensione).subscribe({
        next: () => {
          alert("Recensione rimossa con successo.");
          // Aggiorna l'interfaccia rimuovendo la recensione
          this.recensioni = this.recensioni.filter(r => r.idRecensione !== idRecensione);
          this.calcolaMediaRecensioni();
          this.controllaSeHaGiaRecensito();
        },
        error: (err) => alert("Errore durante l'eliminazione della recensione.")
      });
    }
  }

  togglePreferito() {
    if (this.immobile) this.preferitiService.togglePreferito(this.immobile);
  }

  isPreferito(): boolean {
    return this.immobile ? this.preferitiService.isPreferito(this.immobile.idImmobile) : false;
  }
}
