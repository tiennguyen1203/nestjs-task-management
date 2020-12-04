import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { NotFoundException } from '@nestjs/common';
import { DeleteResult, EntityRepository, Repository, SelectQueryBuilder } from "typeorm";
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskStatus } from './task-status.enum';
import { Task } from './task.entity';


@EntityRepository(Task)
export class TaskRepository extends Repository<Task> {
  createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    const newTask: Task = new Task();

    newTask.title = createTaskDto.title;
    newTask.description = createTaskDto.description;
    newTask.status = TaskStatus.OPEN;

    return newTask.save();
  }

  getTasks(): SelectQueryBuilder<Task> {
    return this.createQueryBuilder('task');
  }

  async getTask(id: number): Promise<Task> {
    const task: Task = await this.findOne(id);

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