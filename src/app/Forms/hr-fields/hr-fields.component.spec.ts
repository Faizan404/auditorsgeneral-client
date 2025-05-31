import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HrFieldsComponent } from './hr-fields.component';

describe('HrFieldsComponent', () => {
  let component: HrFieldsComponent;
  let fixture: ComponentFixture<HrFieldsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HrFieldsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HrFieldsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
