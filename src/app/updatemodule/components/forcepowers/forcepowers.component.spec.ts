import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ForcepowersComponent } from './forcepowers.component';

describe('ForcepowersComponent', () => {
  let component: ForcepowersComponent;
  let fixture: ComponentFixture<ForcepowersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ForcepowersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ForcepowersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
