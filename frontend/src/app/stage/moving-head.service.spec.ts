import { TestBed } from '@angular/core/testing';

import { MovingHeadService } from './moving-head.service';

describe('MovingHeadsService', () => {
  let service: MovingHeadService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MovingHeadService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
