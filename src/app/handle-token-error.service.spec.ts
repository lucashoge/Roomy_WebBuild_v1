import { TestBed } from '@angular/core/testing';

import { HandleTokenErrorService } from './handle-token-error.service';

describe('HandleTokenErrorService', () => {
  let service: HandleTokenErrorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HandleTokenErrorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
