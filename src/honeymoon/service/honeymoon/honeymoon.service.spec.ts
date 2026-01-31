import { Test, TestingModule } from '@nestjs/testing';
import { HoneymoonService } from './honeymoon.service';

describe('HoneymoonService', () => {
  let service: HoneymoonService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HoneymoonService],
    }).compile();

    service = module.get<HoneymoonService>(HoneymoonService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
