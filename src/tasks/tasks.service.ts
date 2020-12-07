import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, SelectQueryBuilder } from 'typeorm';
import { User } from './../auth/user.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TaskStatus } from './task-status.enum';
import { Task } from './task.entity';
import { TaskRepository } from './task.repository';

export type TUpdateTaskStatus = {
  id: number
  user: User
  status: TaskStatus
}

export type TGetManyTasks = {
  taskFilterDto: GetTasksFilterDto
  userId: number
}

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TaskRepository)
    private taskRepository: TaskRepository
  ) { }

  getTasks(taskFilterDto: GetTasksFilterDto, user: User): Promise<Task[]> {
    const { status, search } = taskFilterDto;
    const taskQueryBuilder: SelectQueryBuilder<Task> = this.taskRepository.getTasks(user.id);

    if (status) {
      taskQueryBuilder.andWhere(`task.status = :status`, { status });
    }

    if (search) {
      taskQueryBuilder.andWhere(new Brackets(qb => {
        qb.where(`task.title LIKE :search OR task.description LIKE :search`, { search: `%${search}%` })
      }))
    }

    return taskQueryBuilder.leftJoinAndSelect('task.user', 'user').getMany();
  }

  getTask(id: number, user: User): Promise<Task> {
    return this.taskRepository.getTask(id, user);
  }

  createTask(
    createTaskDto: CreateTaskDto,
    user: User
  ): Promise<Task> {
    return this.taskRepository.createTask(createTaskDto, user);
  }

  deleteTask(id: number, user: User): Promise<number> {
    return this.taskRepository.deleteTask(id, user);
  }

  async updateTaskStatus(
    { id, user, status }: TUpdateTaskStatus
  ): Promise<Task> {
    const task: Task = await this.taskRepository.getTask(id, user);
    if (!task) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }

    task.status = status;
    await task.save();

    return task;
  }
}
