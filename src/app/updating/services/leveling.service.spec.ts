import { TestBed } from '@angular/core/testing';

import { LevelingService } from './leveling.service';

describe('LevelingService', () => {
  let service: LevelingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LevelingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
