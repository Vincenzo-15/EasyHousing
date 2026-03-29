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

  step: number = 1;

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
  descrizioneLibera: string = '';

  dettagliExtra = {
    locali: 2,
    bagni: 1,
    piano: 'Terra',
    condizioni: 'Buono / Abitabile',
    ascensore: 'No',
    classeEnergetica: 'G'
  };

  durataAstaGg: number = 30; // Valore di default per le aste
  isSubmitting = false;

  constructor(
    private immobileService: ImmobileService,
    private immagineService: ImmagineService,
    private authService: AuthService,
    private router: Router,
    private astaService: AstaService
  ) {}

  avanti() {
    if (this.step === 1) {
      if (!this.nuovoImmobile.nome || !this.nuovoImmobile.indirizzo) {
        alert("Inserisci Titolo e Indirizzo per continuare.");
        return;
      }
    } else if (this.step === 2) {
      if (this.nuovoImmobile.prezzoOrig <= 0 || this.nuovoImmobile.metriQuadri <= 0) {
        alert("Prezzo e Metratura devono essere maggiori di 0.");
        return;
      }
    }
    window.scrollTo(0,0);
    this.step++;
  }

  indietro() {
    window.scrollTo(0,0);
    this.step--;
  }

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

    this.isSubmitting = true;

    const extraJson = JSON.stringify(this.dettagliExtra);
    this.nuovoImmobile.descrizione = this.descrizioneLibera + '|||' + extraJson;
    this.nuovoImmobile.proprietario = utenteCorrente.email;
    this.nuovoImmobile.prezzoAttuale = this.nuovoImmobile.prezzoOrig;

    this.immobileService.createImmobile(this.nuovoImmobile).subscribe({
      next: () => {
        setTimeout(() => {
          this.recuperaIdEUploadFoto(utenteCorrente.email);
        }, 1000);
      },
      error: (err: any) => {
        this.isSubmitting = false;
        alert('Errore salvataggio immobile');
      }
    });
  }

  recuperaIdEUploadFoto(proprietario: string) {
    this.immobileService.getAllImmobili().subscribe({
      next: (immobili: Immobile[]) => {
        const mieiImmobili = immobili.filter(i => i.proprietario === proprietario);

        if (mieiImmobili.length > 0) {
          mieiImmobili.sort((a, b) => b.idImmobile - a.idImmobile);
          const nuovoId = mieiImmobili[0].idImmobile;

          if (this.nuovoImmobile.tipoAnnuncio === 'ASTA') {
            const millisecondi = this.durataAstaGg * 24 * 60 * 60 * 1000;
            const nuovaAsta: any = {
              idAsta: 0, idImmobile: nuovoId, acquirente: null,
              prezzoOrig: Number(this.nuovoImmobile.prezzoOrig),
              prezzoAttuale: Number(this.nuovoImmobile.prezzoOrig),
              fine: new Date().getTime() + millisecondi
            };
            this.astaService.creaAsta(nuovaAsta).subscribe({
              next: () => this.uploadFiles(nuovoId),
              error: () => this.uploadFiles(nuovoId)
            });
          } else {
            this.uploadFiles(nuovoId);
          }
        } else {
          this.router.navigate(['/home']);
        }
      },
      error: () => {
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
        error: () => {
          tentativiCompletati++; errori++;
          this.checkChiusuraPagina(tentativiCompletati, errori);
        }
      });
    });
  }

  checkChiusuraPagina(fatti: number, errori: number) {
    if (fatti === this.filesSelezionati.length) {
      this.isSubmitting = false;
      alert('Annuncio pubblicato con successo! 🚀');
      this.router.navigate(['/home']);
    }
  }
}
