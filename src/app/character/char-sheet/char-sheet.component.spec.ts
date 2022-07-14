import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CharSheetComponent } from './char-sheet.component';

describe('CharSheetComponent', () => {
  let component: CharSheetComponent;
  let fixture: ComponentFixture<CharSheetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CharSheetComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CharSheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
