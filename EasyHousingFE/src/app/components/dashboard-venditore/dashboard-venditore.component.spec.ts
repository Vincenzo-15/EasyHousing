import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardVenditoreComponent } from './dashboard-venditore.component';

describe('DashboardVenditoreComponent', () => {
  let component: DashboardVenditoreComponent;
  let fixture: ComponentFixture<DashboardVenditoreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardVenditoreComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardVenditoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
