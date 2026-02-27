import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes'; // Assicurati che questo import sia corretto
import { provideHttpClient } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes), // <--- FONDAMENTALE: Attiva il routing
    provideHttpClient()    // <--- FONDAMENTALE: Attiva le chiamate al Backend
  ]
};
