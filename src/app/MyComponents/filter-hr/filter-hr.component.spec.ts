import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterHrComponent } from './filter-hr.component';

describe('FilterHrComponent', () => {
  let component: FilterHrComponent;
  let fixture: ComponentFixture<FilterHrComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FilterHrComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FilterHrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
