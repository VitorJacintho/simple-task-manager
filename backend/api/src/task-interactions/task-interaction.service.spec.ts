import { Test, TestingModule } from '@nestjs/testing';
import { TaskInteractionService } from './task-interaction.service';

describe('TaskService', () => {
  let service: TaskInteractionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TaskInteractionService],
    }).compile();

    service = module.get<TaskInteractionService>(TaskInteractionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
