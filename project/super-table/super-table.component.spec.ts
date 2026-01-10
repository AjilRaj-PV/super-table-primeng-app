import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuperTableComponent } from './super-table.component';

describe('SuperTableComponent', () => {
  let component: SuperTableComponent;
  let fixture: ComponentFixture<SuperTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SuperTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SuperTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
