import { TestBed } from '@angular/core/testing';

import { AuditformService } from './auditform.service';

describe('AuditformService', () => {
  let service: AuditformService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuditformService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
