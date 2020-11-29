import { BadRequestException, ModuleMetadata, PipeTransform } from "@nestjs/common";
import { TaskStatus } from "../tasks.model";

export class TaskStatusValidationPipe implements PipeTransform {
  readonly validStatuses: Array<string> = [
    ...Object.values(TaskStatus)
  ]

  private isStatusValid(status: string): boolean {
    const index: number = this.validStatuses.indexOf(status);
    return index !== -1;
  }

  transform(status: string): string {
    if (!this.isStatusValid(status)) {
      throw new BadRequestException(`Status "${status}" not in "[${this.validStatuses}]"`);
    }

    return status;
  }
}