import { PipeTransform, BadRequestException } from '@nestjs/common';
import { StudyType } from '../enums/study-type.enum';

export class StudyTypePipe implements PipeTransform {
  transform(value: any) {
    if (!value) throw new BadRequestException('type is required');

    const normalized = value.toLowerCase();
    if (!Object.values(StudyType).includes(normalized as StudyType)) {
      throw new BadRequestException(`Invalid type: ${value}`);
    }

    return normalized as StudyType;
  }
}
