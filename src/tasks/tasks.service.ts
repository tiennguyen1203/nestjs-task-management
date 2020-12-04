import { UserRepository } from './../auth/user.repository';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskStatus } from './task-status.enum';
import { Task } from './task.entity';
import { TaskRepository } from './task.repository';
import { SelectQueryBuilder } from 'typeorm';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TaskRepository)
    private taskRepository: TaskRepository
  ) { }

  getTasks(taskFilterDto: GetTasksFilterDto): Promise<Array<Task>> {
    const query: SelectQueryBuilder<Task> = this.taskRepository.getTasks();
    const { status, search } = taskFilterDto;
    if (status) {
      query.andWhere('task.status = :status', { status });
    }
    if (search) {
      query.andWhere('(task.title ILIKE :search OR task.description ILIKE :search)', { search: `%${search}%` });
    }

    return query.getMany();
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

  async updateTaskStatus(id: number, status: TaskStatus): Promise<Task> {
    const task = await this.taskRepository.getTask(id);
    if (!task) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }

    task.status = status;
    await task.save();

    return task;
  }
}
