import { Brackets, EntityRepository, FindManyOptions, Repository, SelectQueryBuilder } from "typeorm";
import { User } from './../auth/user.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
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

  getTasks(taskFilterDto: GetTasksFilterDto, userId: number): Promise<Task[]> {
    const taskQueryBuilder: SelectQueryBuilder<Task> = this.createQueryBuilder('task').where({ userId });

    const { status, search } = taskFilterDto;
    if (status) {
      taskQueryBuilder.andWhere(`task.status = :status`, { status });
    }

    if (search) {
      taskQueryBuilder.andWhere(new Brackets(qb => {
        qb.where(`task.title LIKE :search OR task.description LIKE :search`, { search: `%${search}%` })
      }))
    }

    return taskQueryBuilder.getMany();
  }
}