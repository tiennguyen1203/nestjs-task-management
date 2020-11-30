import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskStatus } from './task-status.enum';
import { Task } from './task.entity';
import { TaskRepository } from './task.repository';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TaskRepository)
    private taskRepository: TaskRepository
  ) { }

  getTasks(taskFilterDto: GetTasksFilterDto): Promise<Array<Task>> {
    return this.taskRepository.getTasks(taskFilterDto);
  }

  getTask(id: number): Promise<Task> {
    return this.taskRepository.getTask(id);
  }

  createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    return this.taskRepository.createTask(createTaskDto);
  }

  deleteTask(id: number): Promise<number> {
    return this.taskRepository.deleteTask(id);
  }

  updateTaskStatus(id: number, status: TaskStatus): Promise<Task> {
    return this.taskRepository.updateTaskStatus(id, status);
  }
}
