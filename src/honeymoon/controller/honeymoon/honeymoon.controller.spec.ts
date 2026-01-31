import { Test, TestingModule } from '@nestjs/testing';
import { HoneymoonController } from './honeymoon.controller';

describe('HoneymoonController', () => {
  let controller: HoneymoonController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HoneymoonController],
    }).compile();

    controller = module.get<HoneymoonController>(HoneymoonController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
