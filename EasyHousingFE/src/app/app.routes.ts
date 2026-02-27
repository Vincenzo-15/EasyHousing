import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { ImmobileDetailComponent } from './components/immobile-detail/immobile-detail.component';
import { InserisciAnnuncioComponent } from './components/inserisci-annuncio/inserisci-annuncio.component';
import { AboutComponent } from './components/about/about.component';
import { PropertyComponent } from './components/property/property.component';
import { BlogComponent } from './components/blog/blog.component';
import { ContactComponent } from './components/contact/contact.component';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' }, // Se non c'è path, vai a home
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'dettaglio/:id', component: ImmobileDetailComponent }, // :id è un parametro dinamico!
  { path: 'inserisci-annuncio', component: InserisciAnnuncioComponent },
  { path: 'about', component: AboutComponent },
  { path: 'property', component: PropertyComponent },
  { path: 'blog', component: BlogComponent },
  { path: 'contact', component: ContactComponent },
  { path: '**', redirectTo: 'home' } // Se scrivi un URL a caso, torna alla home
];
