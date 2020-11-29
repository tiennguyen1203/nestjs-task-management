import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Task, TaskStatus } from './tasks.model';
import { v4 as uuidv4 } from 'uuid';
import { CreateTaskDto } from './dto/create-task.dto';
import * as _ from 'lodash';

@Injectable()
export class TasksService {
  private tasks: Array<Task> = [];

  getTasks(taskFilterDto: GetTasksFilterDto): Array<Task> {
    if (Object.keys(taskFilterDto)?.length) {
      const { status, search } = taskFilterDto;
      let tasks: Array<Task> = [...this.tasks];
      if (status) {
        tasks = tasks.filter((task) => task.status === status);
      }

      if (search) {
        tasks = tasks.filter((task) => task.title.includes(search) || task.description.includes(search));
      }

      return tasks;
    }
    return this.tasks;
  }

  getTaskById(id: string): Task {
    const task: Task = this.tasks.find((task) => task.id === id);
    if (!task) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }

    return task;
  }

  createTask(createTaskDto: CreateTaskDto): Task {
    const { title, description } = createTaskDto;
    const task: Task = {
      id: uuidv4(),
      title,
      description,
      status: TaskStatus.OPEN,
    }

    this.tasks.push(task);
    return task;
  }

  deleteTaskById(id: string): string {
    const task: Task = this.getTaskById(id);
    _.remove(this.tasks, (task: Task) => task.id === task.id);
    return task.id;
  }

  updateTaskStatus(id: string, status: TaskStatus): Task {
    const task: Task = this.getTaskById(id);
    if (!task) {
      throw new NotFoundException(`The Task with ID "${id}" not found`);
    }

    task.status = status;
    return task;
  }
}
