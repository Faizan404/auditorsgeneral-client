import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TextareaFieldsComponent } from './textarea-fields.component';

describe('TextareaFieldsComponent', () => {
  let component: TextareaFieldsComponent;
  let fixture: ComponentFixture<TextareaFieldsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TextareaFieldsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TextareaFieldsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
