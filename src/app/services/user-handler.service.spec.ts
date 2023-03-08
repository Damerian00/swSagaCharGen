import { TestBed } from '@angular/core/testing';

import { UserHandlerService } from './user-handler.service';

describe('UserHandlerService', () => {
  let service: UserHandlerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserHandlerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
