import { Injectable } from '@nestjs/common';
import { Task, TaskStatus } from './tasks.model';
import { v4 as uuidv4 } from 'uuid';
import { CreateTaskDto } from './dto/create-task.dto';
import * as _ from 'lodash';

@Injectable()
export class TasksService {
  private tasks: Array<Task> = [];

  getAllTasks(): Array<Task> {
    return this.tasks;
  }

  getTaskById(id: string): Task {
    return this.tasks.find((task) => task.id === id);
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
    _.remove(this.tasks, (task: Task) => task.id === id);
    return id;
  }

  updateStatusOfTaskById(id: string, status: TaskStatus) {
    let result: Task;
    this.tasks = this.tasks.map((task: Task) => {
      if (task.id === id) {
        result = {
          ...task,
          status
        };
        return result;
      }
      return task;
    })

    return result;
  }
}
