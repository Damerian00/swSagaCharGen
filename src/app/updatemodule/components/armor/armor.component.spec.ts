import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArmorComponent } from './armor.component';

describe('ArmorComponent', () => {
  let component: ArmorComponent;
  let fixture: ComponentFixture<ArmorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ArmorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ArmorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
