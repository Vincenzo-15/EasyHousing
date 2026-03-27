import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValutaCasaComponent } from './valuta-casa.component';

describe('ValutaCasaComponent', () => {
  let component: ValutaCasaComponent;
  let fixture: ComponentFixture<ValutaCasaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ValutaCasaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ValutaCasaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
