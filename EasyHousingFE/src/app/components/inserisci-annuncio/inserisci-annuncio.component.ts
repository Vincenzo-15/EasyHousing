import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ImmobileService } from '../../services/immobile.service';
import { AuthService } from '../../services/auth.service';
import { Immobile } from '../../models/immobile.model';
import { ImmagineService } from '../../services/immagine.service';
import { AstaService } from '../../services/asta.service';

@Component({
  selector: 'app-inserisci-annuncio',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './inserisci-annuncio.component.html',
  styleUrls: ['./inserisci-annuncio.component.css']
})
export class InserisciAnnuncioComponent {

  nuovoImmobile: Immobile = {
    idImmobile: 0,
    nome: '',
    descrizione: '',
    indirizzo: '',
    metriQuadri: 0,
    prezzoOrig: 0,
    prezzoAttuale: 0,
    tipoImmobile: 'Appartamento',
    tipoAnnuncio: 'VENDITA',
    proprietario: '',
    recensioni: []
  };

  filesSelezionati: File[] = [];

  constructor(
    private immobileService: ImmobileService,
    private immagineService: ImmagineService,
    private authService: AuthService,
    private router: Router,
    private astaService: AstaService
  ) {}

  onFileSelected(event: any) {
    if (event.target.files && event.target.files.length > 0) {
      for (let i = 0; i < event.target.files.length; i++) {
        this.filesSelezionati.push(event.target.files[i]);
      }
    }
  }

  rimuoviFile(index: number) {
    this.filesSelezionati.splice(index, 1);
  }

  onSubmit() {
    const utenteCorrente = this.authService.getUser();

    if (!utenteCorrente) {
      alert('Devi effettuare il login per pubblicare.');
      this.router.navigate(['/login']);
      return;
    }

    this.nuovoImmobile.proprietario = utenteCorrente.email;
    this.nuovoImmobile.prezzoAttuale = this.nuovoImmobile.prezzoOrig;

    console.log('1. Richiesta salvataggio Immobile inviata...');

    this.immobileService.createImmobile(this.nuovoImmobile).subscribe({
      next: () => {
        console.log('2. Immobile salvato. Attendo 1 secondo per far aggiornare il DB...');

        setTimeout(() => {
          this.recuperaIdEUploadFoto(utenteCorrente.email);
        }, 1000); // <-- Aumentato a 1 secondo
      },
      error: (err: any) => {
        console.error('Errore salvataggio immobile', err);
        alert('Errore salvataggio immobile');
      }
    });
  }

  recuperaIdEUploadFoto(proprietario: string) {
    console.log('-> Avvio richiesta recupero ID...');

    // Aggiunta la gestione { next:, error: } per catturare eventuali errori silenziosi
    this.immobileService.getAllImmobili().subscribe({
      next: (immobili: Immobile[]) => {
        const mieiImmobili = immobili.filter(i => i.proprietario === proprietario);

        if (mieiImmobili.length > 0) {
          mieiImmobili.sort((a, b) => b.idImmobile - a.idImmobile);
          const nuovoId = mieiImmobili[0].idImmobile;

          console.log('3. VERO ID Trovato:', nuovoId);

          if (this.nuovoImmobile.tipoAnnuncio === 'ASTA') {

            // Creiamo l'asta usando i millisecondi (il formato più sicuro per Java Timestamp)
            const nuovaAsta: any = {
              idAsta: 0,
              idImmobile: nuovoId,
              acquirente: null,
              prezzoOrig: Number(this.nuovoImmobile.prezzoOrig),
              prezzoAttuale: Number(this.nuovoImmobile.prezzoOrig),
              fine: new Date().getTime() + 2592000000 // Scadenza +30 giorni
            };

            console.log('Tentativo salvataggio asta con payload:', nuovaAsta);

            this.astaService.creaAsta(nuovaAsta).subscribe({
              next: () => {
                console.log('4. Asta inizializzata e collegata con successo!');
                this.uploadFiles(nuovoId);
              },
              error: (err) => {
                console.error("ERRORE BACKEND ASTA:", err);
                this.uploadFiles(nuovoId); // Procediamo comunque per non bloccare l'utente
              }
            });
          } else {
            console.log('Annuncio non è un\'asta, procedo alle foto.');
            this.uploadFiles(nuovoId);
          }

        } else {
          console.error("Nessun immobile trovato nel DB per l'utente corrente.");
          this.router.navigate(['/home']);
        }
      },
      error: (err) => {
        // Se si ferma al passaggio 2, ora vedremo questo errore!
        console.error("Errore FATALE in getAllImmobili:", err);
        this.router.navigate(['/home']);
      }
    });
  }

  uploadFiles(idImmobile: number) {
    if (this.filesSelezionati.length === 0) {
      alert('Annuncio pubblicato (senza foto).');
      this.router.navigate(['/home']);
      return;
    }

    let tentativiCompletati = 0;
    let errori = 0;

    this.filesSelezionati.forEach(file => {
      this.immagineService.uploadImmagine(idImmobile, file).subscribe({
        next: () => {
          tentativiCompletati++;
          this.checkChiusuraPagina(tentativiCompletati, errori);
        },
        error: (err: any) => {
          console.error('Errore upload file:', file.name, err);
          tentativiCompletati++;
          errori++;
          this.checkChiusuraPagina(tentativiCompletati, errori);
        }
      });
    });
  }

  checkChiusuraPagina(fatti: number, errori: number) {
    if (fatti === this.filesSelezionati.length) {
      if (errori === 0) {
        alert('Annuncio e Foto pubblicati con successo! 🚀');
      } else if (errori < this.filesSelezionati.length) {
        alert(`Annuncio pubblicato, ma ${errori} foto non sono state caricate. Controlla la console.`);
      } else {
        alert('Annuncio pubblicato, ma il caricamento delle foto è fallito.');
      }
      this.router.navigate(['/home']);
    }
  }
}
