import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImmobileDetailComponent } from './immobile-detail.component';

describe('ImmobileDetailComponent', () => {
  let component: ImmobileDetailComponent;
  let fixture: ComponentFixture<ImmobileDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImmobileDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImmobileDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
