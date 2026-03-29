import { ApplicationConfig } from '@angular/core';
import { provideRouter, withInMemoryScrolling} from '@angular/router';
import { routes } from './app.routes'; // Assicurati che questo import sia corretto
import { provideHttpClient } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withInMemoryScrolling({scrollPositionRestoration: 'enabled'})), // <--- FONDAMENTALE: Attiva il routing
    provideHttpClient()    // <--- FONDAMENTALE: Attiva le chiamate al Backend
  ]
};
