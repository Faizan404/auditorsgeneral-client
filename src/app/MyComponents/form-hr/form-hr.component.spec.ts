import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormHRComponent } from './form-hr.component';

describe('FormHRComponent', () => {
  let component: FormHRComponent;
  let fixture: ComponentFixture<FormHRComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormHRComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormHRComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
