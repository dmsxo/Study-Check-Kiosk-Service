import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  async create_user(createUserDto: CreateUserDto): Promise<User> {
    const newStudent = this.userRepo.create({ ...createUserDto });
    return this.userRepo.save(newStudent);
  }

  async get_everyone(): Promise<User[]> {
    const students = await this.userRepo.find({ relations: ['attendances'] });
    if (students.length === 0) {
      throw new NotFoundException('No users found');
    }
    return students;
  }

  async get_user(student_id: number): Promise<User> {
    const student = await this.userRepo.findOne({
      where: { student_id },
      relations: ['attendances'],
    });
    if (!student) {
      throw new NotFoundException(
        `User with student_id ${student_id} not found`,
      );
    }
    return student;
  }

  async update_user(
    student_id: number,
    updateUserDto: UpdateUserDto,
  ): Promise<User> {
    const student = await this.get_user(student_id);
    Object.assign(student, updateUserDto);
    return this.userRepo.save(student);
  }

  async delete_user(student_id: number): Promise<User> {
    const student = await this.get_user(student_id);
    return this.userRepo.remove(student);
  }
}
