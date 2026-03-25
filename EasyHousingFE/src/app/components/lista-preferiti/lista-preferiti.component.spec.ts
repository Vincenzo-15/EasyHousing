import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaPreferitiComponent } from './lista-preferiti.component';

describe('ListaPreferitiComponent', () => {
  let component: ListaPreferitiComponent;
  let fixture: ComponentFixture<ListaPreferitiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListaPreferitiComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListaPreferitiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
