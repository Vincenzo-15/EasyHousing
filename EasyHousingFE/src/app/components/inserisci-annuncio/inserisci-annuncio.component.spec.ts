import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InserisciAnnuncioComponent } from './inserisci-annuncio.component';

describe('InserisciAnnuncioComponent', () => {
  let component: InserisciAnnuncioComponent;
  let fixture: ComponentFixture<InserisciAnnuncioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InserisciAnnuncioComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InserisciAnnuncioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
