import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-valuta-casa',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './valuta-casa.component.html',
  styleUrls: ['./valuta-casa.component.css']
})
export class ValutaCasaComponent {
  step: number = 1;

  // Modello Dati
  indirizzo: string = '';
  tipologia: string = 'Appartamento';
  superficie: number | null = null;
  piano: string = '1';
  locali: number = 2;
  bagni: number = 1;

  // Risultato
  isCalculating: boolean = false;
  stimaFinale: number | null = null;

  // Controlli per i pulsanti +/-
  cambiaValore(campo: 'locali' | 'bagni', operazione: 1 | -1) {
    if (campo === 'locali') {
      if (operazione === 1) this.locali++;
      else if (this.locali > 1) this.locali--;
    } else {
      if (operazione === 1) this.bagni++;
      else if (this.bagni > 1) this.bagni--;
    }
  }

  selezionaTipologia(tipo: string) {
    this.tipologia = tipo;
  }

  avanti() {
    if (this.step === 1 && this.indirizzo.trim().length > 2) {
      this.step = 2;
    } else if (this.step === 2 && this.superficie) {
      this.calcolaStima();
    }
  }

  indietro() {
    if (this.step > 1) this.step--;
  }

  calcolaStima() {
    this.isCalculating = true;
    this.step = 3;

    setTimeout(() => {
      // Algoritmo di base
      let prezzoMq = 2200; // default
      const indLow = this.indirizzo.toLowerCase();

      if (indLow.includes('milano')) prezzoMq = 4500;
      else if (indLow.includes('roma')) prezzoMq = 3600;
      else if (indLow.includes('napoli')) prezzoMq = 2800;

      let base = this.superficie! * prezzoMq;

      if (this.tipologia === 'Attico' || this.tipologia === 'Villa') base += base * 0.20;
      if (this.bagni > 1) base += base * 0.08;

      this.stimaFinale = Math.round(base);
      this.isCalculating = false;
    }, 2000);
  }
}
