import { Test, TestingModule } from '@nestjs/testing';
import { TaskInteractionController } from './task-interaction.controller';
import { TaskInteractionService } from './task-interaction.service';


describe('TaskInteractionController', () => {
  let controller: TaskInteractionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TaskInteractionController],
      providers: [TaskInteractionService],
    }).compile();

    controller = module.get<TaskInteractionController>(TaskInteractionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
