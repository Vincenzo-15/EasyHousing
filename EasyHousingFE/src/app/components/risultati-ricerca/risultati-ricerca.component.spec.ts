import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RisultatiRicercaComponent } from './risultati-ricerca.component';

describe('RisultatiRicercaComponent', () => {
  let component: RisultatiRicercaComponent;
  let fixture: ComponentFixture<RisultatiRicercaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RisultatiRicercaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RisultatiRicercaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
