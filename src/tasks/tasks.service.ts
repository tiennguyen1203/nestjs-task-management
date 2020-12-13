import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult } from 'typeorm';
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
    return this.taskRepository.getTasks(taskFilterDto, user.id);
  }

  async getTask(id: number, user: User): Promise<Task> {
    const task = await this.taskRepository.findOne({ id, user });
    if (!task) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }

    return task;
  }

  createTask(
    createTaskDto: CreateTaskDto,
    user: User
  ): Promise<Task> {
    return this.taskRepository.createTask(createTaskDto, user);
  }

  async deleteTask(id: number, user: User): Promise<number> {
    const deletedTask: DeleteResult = await this.taskRepository.delete({ id, user });
    if (deletedTask.affected === 0) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }

    return id;
  }

  async updateTaskStatus(
    { id, user, status }: TUpdateTaskStatus
  ): Promise<Task> {
    const task: Task = await this.getTask(id, user);
    task.status = status;
    await task.save();

    return task;
  }
}
