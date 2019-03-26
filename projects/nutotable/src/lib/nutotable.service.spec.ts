import { TestBed } from '@angular/core/testing';

import { NutotableService } from './nutotable.service';

describe('NutotableService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NutotableService = TestBed.get(NutotableService);
    expect(service).toBeTruthy();
  });
});
