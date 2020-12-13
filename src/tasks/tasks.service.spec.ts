import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { User } from './../auth/user.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TaskStatus } from './task-status.enum';
import { Task } from './task.entity';
import { TaskRepository } from './task.repository';
import { TasksService } from './tasks.service';

const mockUser = new User();
mockUser.username = 'test user';

const createTaskDtoMock: CreateTaskDto = {
  title: 'Test title',
  description: null
}

const mockTask = {
  ...createTaskDtoMock,
  id: 1,
  status: TaskStatus.IN_PROGRESS
}



const mockTaskRepository = () => ({
  getTasks: jest.fn(),
  findOne: jest.fn(),
  createTask: jest.fn(),
  delete: jest.fn(),
  updateTask: jest.fn()
});

describe('TasksService', () => {
  let tasksService: TasksService;
  let taskRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        { provide: TaskRepository, useFactory: mockTaskRepository }
      ]
    }).compile();

    tasksService = module.get<TasksService>(TasksService);
    taskRepository = module.get<TaskRepository>(TaskRepository);
  })

  describe('getTasks', () => {
    it('<200> return tasks', async () => {
      expect(taskRepository.getTasks).not.toHaveBeenCalled();

      taskRepository.getTasks.mockResolvedValue(['some tasks'])
      const filter: GetTasksFilterDto = {};
      const result: Task[] = await tasksService.getTasks(filter, mockUser);
      expect(taskRepository.getTasks).toHaveBeenCalledTimes(1);
      expect(result).toEqual(['some tasks']);
    })
  })

  describe('getTask', () => {
    it('<200> return task', async () => {
      expect(taskRepository.findOne).not.toHaveBeenCalled();

      taskRepository.findOne.mockResolvedValue('a certain task');
      const result: Task = await tasksService.getTask(1, mockUser);
      expect(taskRepository.findOne).toHaveBeenCalledWith({
        id: 1,
        user: mockUser
      });
      expect(result).toEqual('a certain task');
    })

    it('<404> Throw error when task not found', async () => {
      expect(taskRepository.findOne).not.toHaveBeenCalled()
      taskRepository.findOne.mockResolvedValue(null);
      expect(tasksService.getTask(1, mockUser)).rejects.toThrowError(NotFoundException);
    })
  })

  describe('CreateTask', () => {
    it('<200> Return created task', async () => {
      taskRepository.createTask.mockResolvedValue(mockTask);
      const result: Task = await tasksService.createTask(createTaskDtoMock, mockUser);
      expect(taskRepository.createTask).toHaveBeenCalledWith(createTaskDtoMock, mockUser);
      expect(result).toEqual(mockTask);
    })
  });

  describe('Delete task', () => {
    it('<200> Return deletedTaskId', async () => {
      taskRepository.delete.mockResolvedValue({
        affected: 1
      })
      const id: number = await tasksService.deleteTask(1, mockUser);
      expect(taskRepository.delete).toHaveBeenCalledWith({
        id: 1,
        user: mockUser
      });
      expect(id).toEqual(1);
    })

    it('<404>When task with id not found. Should throw error', async () => {
      taskRepository.delete.mockResolvedValue({ affected: 0 })
      expect(tasksService.deleteTask(1, mockUser)).rejects.toThrowError(NotFoundException)
    })
  });

  describe('Update task', () => {
    it('<200> Return updated task', async () => {
      const save = jest.fn().mockResolvedValue(true);
      tasksService.getTask = jest.fn().mockResolvedValue({
        ...mockTask,
        save
      });

      expect(save).not.toHaveBeenCalled();
      const updatedTask: Task = await tasksService.updateTaskStatus({
        id: 1,
        user: mockUser,
        status: TaskStatus.DONE
      })

      expect(tasksService.getTask).toHaveBeenCalled()
      expect(save).toHaveBeenCalled();
      expect(updatedTask.status).toEqual(TaskStatus.DONE);
    })
  });
});
