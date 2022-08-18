import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CharsheetComponent } from './charsheet.component';

describe('CharsheetComponent', () => {
  let component: CharsheetComponent;
  let fixture: ComponentFixture<CharsheetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CharsheetComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CharsheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
