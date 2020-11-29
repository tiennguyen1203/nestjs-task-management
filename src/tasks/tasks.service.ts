import { Task } from './task.entity';
import { TaskRepository } from './task.repository';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import * as _ from 'lodash';
import { InjectRepository } from '@nestjs/typeorm';
import { TaskStatus } from './task-status.enum';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TaskRepository)
    private taskRepository: TaskRepository
  ) { }
  // getTasks(taskFilterDto: GetTasksFilterDto): Array<Task> {
  //   if (Object.keys(taskFilterDto)?.length) {
  //     const { status, search } = taskFilterDto;
  //     let tasks: Array<Task> = [...this.tasks];
  //     if (status) {
  //       tasks = tasks.filter((task) => task.status === status);
  //     }

  //     if (search) {
  //       tasks = tasks.filter((task) => task.title.includes(search) || task.description.includes(search));
  //     }

  //     return tasks;
  //   }
  //   return this.tasks;
  // }

  getTask(id: number): Promise<Task> {
    return this.taskRepository.getTask(id);
  }

  createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    return this.taskRepository.createTask(createTaskDto);
  }

  deleteTask(id: number): Promise<number> {
    return this.taskRepository.deleteTask(id);
  }

  // updateTaskStatus(id: string, status: TaskStatus): Task {
  //   const task: Task = this.getTaskById(id);
  //   if (!task) {
  //     throw new NotFoundException(`The Task with ID "${id}" not found`);
  //   }

  //   task.status = status;
  //   return task;
  // }
}
