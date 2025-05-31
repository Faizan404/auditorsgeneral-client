import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterFieldsComponent } from './filter-fields.component';

describe('FilterFieldsComponent', () => {
  let component: FilterFieldsComponent;
  let fixture: ComponentFixture<FilterFieldsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FilterFieldsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FilterFieldsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
