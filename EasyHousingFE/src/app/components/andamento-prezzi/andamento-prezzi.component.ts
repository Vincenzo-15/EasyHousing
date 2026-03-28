import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import Chart from 'chart.js/auto';
import * as L from 'leaflet';

@Component({
  selector: 'app-andamento-prezzi',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './andamento-prezzi.component.html',
  styleUrls: ['./andamento-prezzi.component.css']
})
export class AndamentoPrezziComponent implements AfterViewInit {
  @ViewChild('trendChart') trendChart!: ElementRef;
  @ViewChild('rentChart') rentChart!: ElementRef;

  public chartVendita: any;
  public chartAffitto: any;
  private map: any;

  // I nostri dati statistici (Nomi puliti senza trattini o doppie lingue)
  datiPrezzi: { [regione: string]: { vendita: number, affitto: number } } = {
    'Abruzzo': { vendita: 1381, affitto: 8.14 },
    'Basilicata': { vendita: 1308, affitto: 7.32 },
    'Calabria': { vendita: 960, affitto: 8.46 },
    'Campania': { vendita: 1850, affitto: 9.20 },
    'Emilia Romagna': { vendita: 2100, affitto: 12.50 },
    'Friuli Venezia Giulia': { vendita: 1800, affitto: 9.50 },
    'Lazio': { vendita: 2800, affitto: 14.10 },
    'Liguria': { vendita: 2400, affitto: 10.50 },
    'Lombardia': { vendita: 3200, affitto: 18.50 },
    'Marche': { vendita: 2500, affitto: 13.00 },
    'Molise': { vendita: 1050, affitto: 7.07 },
    'Piemonte': { vendita: 1650, affitto: 9.80 },
    'Puglia': { vendita: 1100, affitto: 7.50 },
    'Sardegna': { vendita: 1250, affitto: 8.90 },
    'Sicilia': { vendita: 1150, affitto: 7.80 },
    'Toscana': { vendita: 2600, affitto: 13.40 },
    'Trentino Alto Adige': { vendita: 3704, affitto: 15.20 },
    'Umbria': { vendita: 1550, affitto: 8.50 },
    'Valle d\'Aosta': { vendita: 3100, affitto: 21.88 },
    'Veneto': { vendita: 2300, affitto: 11.50 }
  };

  ngAfterViewInit() {
    this.initMap();
    this.creaGrafici();
  }

  // --- NUOVA FUNZIONE: Pulisce i nomi del GeoJSON ---
  pulisciNomeRegione(nomeGeoJson: string): string {
    if (nomeGeoJson.includes('Trentino')) return 'Trentino Alto Adige';
    if (nomeGeoJson.includes("Valle d'Aosta")) return "Valle d'Aosta";
    if (nomeGeoJson === 'Friuli-Venezia Giulia') return 'Friuli Venezia Giulia';
    if (nomeGeoJson === 'Emilia-Romagna') return 'Emilia Romagna';
    return nomeGeoJson; // Per le altre (come Veneto o Lazio) restituisce il nome normale
  }

  // --- MAPPA COROPLETICA ---
  async initMap() {
    this.map = L.map('italyMap').setView([41.8719, 12.5674], 5);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 10,
      minZoom: 5
    }).addTo(this.map);

    try {
      const response = await fetch('https://raw.githubusercontent.com/openpolis/geojson-italy/master/geojson/limits_IT_regions.geojson');
      const geojsonData = await response.json();

      L.geoJSON(geojsonData, {
        style: (feature) => this.styleRegione(feature),
        onEachFeature: (feature, layer) => this.onEachRegione(feature, layer)
      }).addTo(this.map);

    } catch (error) {
      console.error("Errore caricamento GeoJSON Regioni", error);
    }
  }

  getColor(prezzo: number) {
    return prezzo > 3000 ? '#d73027' :
      prezzo > 2500 ? '#fc8d59' :
        prezzo > 1800 ? '#fee08b' :
          prezzo > 1300 ? '#d9ef8b' :
            '#91cf60';
  }

  styleRegione(feature: any) {
    // Usiamo il nome pulito per cercare i dati nel nostro dizionario
    const nomePulito = this.pulisciNomeRegione(feature.properties.reg_name);
    const dati = this.datiPrezzi[nomePulito];
    const prezzo = dati ? dati.vendita : 0;

    return {
      fillColor: this.getColor(prezzo),
      weight: 1,
      opacity: 1,
      color: 'white',
      fillOpacity: 0.7
    };
  }

  onEachRegione(feature: any, layer: any) {
    // Pulisce il nome prima di mostrarlo nel fumetto!
    const nomePulito = this.pulisciNomeRegione(feature.properties.reg_name);
    const dati = this.datiPrezzi[nomePulito];

    if (dati) {
      layer.bindTooltip(`
        <div style="text-align: center;">
          <strong>${nomePulito}</strong><br>
          Vendita: € ${dati.vendita}/m²<br>
          Affitto: € ${dati.affitto}/m²
        </div>
      `, { sticky: true, className: 'custom-tooltip' });

      layer.on({
        mouseover: (e: any) => {
          const l = e.target;
          l.setStyle({ weight: 3, color: '#666', fillOpacity: 0.9 });
          l.bringToFront();
        },
        mouseout: (e: any) => {
          e.target.setStyle(this.styleRegione(feature));
        },
        click: (e: any) => {
          this.map.fitBounds(e.target.getBounds());
        }
      });
    }
  }

  // --- GRAFICI CHART.JS ---
  creaGrafici() {
    const mesi = ['Ott 24', 'Nov 24', 'Dic 24', 'Gen 25', 'Feb 25', 'Mar 25', 'Apr 25', 'Mag 25', 'Giu 25', 'Lug 25', 'Ago 25', 'Set 25', 'Ott 25', 'Nov 25', 'Dic 25', 'Gen 26', 'Feb 26'];

    const prezziVendita = [1870, 1880, 1910, 1940, 1925, 1915, 1935, 1940, 1970, 1975, 2010, 2030, 2050, 2070, 2100, 2120, 2167];
    const prezziAffitto = [10.5, 10.6, 10.8, 10.7, 10.9, 11.0, 11.1, 11.0, 11.2, 11.4, 11.3, 11.5, 11.6, 11.8, 12.0, 12.1, 12.4];

    // 1. Grafico VENDITA (Blu)
    this.chartVendita = new Chart(this.trendChart.nativeElement, {
      type: 'line',
      data: {
        labels: mesi,
        datasets: [{
          label: 'Prezzo medio vendita (€/m²)',
          data: prezziVendita,
          borderColor: '#0d6efd',
          backgroundColor: 'rgba(13, 110, 253, 0.1)',
          borderWidth: 3,
          pointBackgroundColor: '#0d6efd',
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
          pointRadius: 3,
          pointHoverRadius: 6,
          fill: true,
          tension: 0.3
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          y: { min: 1850, ticks: { callback: function(value) { return value + ' €'; }, font: { family: 'Inter' } } },
          x: { grid: { display: false }, ticks: { font: { family: 'Inter' } } }
        }
      }
    });

    // 2. Grafico AFFITTO (Verde)
    this.chartAffitto = new Chart(this.rentChart.nativeElement, {
      type: 'line',
      data: {
        labels: mesi,
        datasets: [{
          label: 'Prezzo medio affitto (€/m²)',
          data: prezziAffitto,
          borderColor: '#198754',
          backgroundColor: 'rgba(25, 135, 84, 0.1)',
          borderWidth: 3,
          pointBackgroundColor: '#198754',
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
          pointRadius: 3,
          pointHoverRadius: 6,
          fill: true,
          tension: 0.3
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          y: { min: 10, ticks: { callback: function(value) { return value + ' €'; }, font: { family: 'Inter' } } },
          x: { grid: { display: false }, ticks: { font: { family: 'Inter' } } }
        }
      }
    });
  }
}
