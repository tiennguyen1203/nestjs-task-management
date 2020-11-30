import { NotFoundException } from '@nestjs/common';
import { DeleteResult, EntityRepository, Repository } from "typeorm";
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

  async getTask(id: number): Promise<Task> {
    const task = await this.findOne(id);
    if (!task) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }

    return task;
  }

  async deleteTask(id: number): Promise<number> {
    const result: DeleteResult = await this.delete(id);
    if (!result.affected) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }

    return id;
  }

  async updateTaskStatus(id: number, status: TaskStatus): Promise<Task> {
    const task = await this.getTask(id);
    if (!task) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }

    task.status = status;
    await task.save();

    return task;
  }
}