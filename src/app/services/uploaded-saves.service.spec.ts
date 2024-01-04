import { TestBed } from '@angular/core/testing';

import { UploadedSavesService } from './uploaded-saves.service';

describe('UploadedSavesService', () => {
  let service: UploadedSavesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UploadedSavesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
