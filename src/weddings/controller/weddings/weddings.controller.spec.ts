import { Test, TestingModule } from '@nestjs/testing';
import { WeddingsController } from './weddings.controller';

describe('WeddingsController', () => {
  let controller: WeddingsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WeddingsController],
    }).compile();

    controller = module.get<WeddingsController>(WeddingsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
