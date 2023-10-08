import { TestBed } from '@angular/core/testing';

import { ShareCodeServiceService } from './share-code-service.service';

describe('ShareCodeServiceService', () => {
  let service: ShareCodeServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ShareCodeServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
