import { NotFoundException } from '@nestjs/common';
import { DeleteResult, EntityRepository, FindManyOptions, Repository, SelectQueryBuilder } from "typeorm";
import { User } from './../auth/user.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskStatus } from './task-status.enum';
import { Task } from './task.entity';


export interface IFindManyTasksOptions<T = Task> extends FindManyOptions<T> {
  status?: TaskStatus;
  userId: number;
}

@EntityRepository(Task)
export class TaskRepository extends Repository<Task> {
  createTask(
    createTaskDto: CreateTaskDto,
    user: User
  ): Promise<Task> {
    const newTask: Task = new Task();

    newTask.title = createTaskDto.title;
    newTask.description = createTaskDto.description;
    newTask.status = TaskStatus.OPEN;
    newTask.user = user;

    return newTask.save();
  }

  getTasks(userId: number): SelectQueryBuilder<Task> {
    return this.createQueryBuilder('task').where({ userId });
  }

  async getTask(id: number, user: User): Promise<Task> {
    const task: Task = await this.findOne({ id, userId: user.id });

    if (!task) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }

    return task;
  }

  async deleteTask(id: number): Promise<number> {
    const deletedTask: DeleteResult = await this.delete(id);
    if (!deletedTask.affected) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }

    return id;
  }
}