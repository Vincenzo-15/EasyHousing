import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AndamentoPrezziComponent } from './andamento-prezzi.component';

describe('AndamentoPrezziComponent', () => {
  let component: AndamentoPrezziComponent;
  let fixture: ComponentFixture<AndamentoPrezziComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AndamentoPrezziComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AndamentoPrezziComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
