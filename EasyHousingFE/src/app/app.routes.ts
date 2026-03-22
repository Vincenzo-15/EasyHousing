import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { ImmobileDetailComponent } from './components/immobile-detail/immobile-detail.component';
import { InserisciAnnuncioComponent } from './components/inserisci-annuncio/inserisci-annuncio.component';
import { DashboardVenditoreComponent } from './components/dashboard-venditore/dashboard-venditore.component';
import { DashboardAdminComponent } from './components/dashboard-admin/dashboard-admin.component';
import {ProfiloComponent} from "./components/profilo/profilo.component";
import {ListaPreferitiComponent} from './components/lista-preferiti/lista-preferiti.component';
import {RisultatiRicercaComponent} from './components/risultati-ricerca/risultati-ricerca.component';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' }, // Se non c'è path, vai a home
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'dettaglio/:id', component: ImmobileDetailComponent }, // :id è un parametro dinamico!
  { path: 'inserisci-annuncio', component: InserisciAnnuncioComponent },
  { path: 'dashboard-venditore', component: DashboardVenditoreComponent },
  { path: 'dashboard-admin', component: DashboardAdminComponent },
  {path: 'profilo', component: ProfiloComponent},
  {path: 'lista-preferiti', component: ListaPreferitiComponent},
  { path: 'risultati-ricerca', component: RisultatiRicercaComponent },
  { path: '**', redirectTo: 'home' }
];
