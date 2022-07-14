import { TestBed } from '@angular/core/testing';

import { ChoicesSenderService } from './choices-sender.service';

describe('ChoicesSenderService', () => {
  let service: ChoicesSenderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChoicesSenderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
