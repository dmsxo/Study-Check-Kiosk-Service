import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from '../entitys/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  async create_user(student: User): Promise<User> {
    const newStudent = await this.userRepo.create(student);
    const savedStudent = await this.userRepo.save(newStudent);
    return savedStudent;
  }

  async get_everyone(): Promise<User[]> {
    const students = await this.userRepo.find();
    if (students.length === 0) {
      throw new NotFoundException('No users found');
    }
    return students;
  }

  async get_user(student_id: number): Promise<User> {
    const student = await this.userRepo.findOneBy({
      student_id: student_id,
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
    updateData: Partial<User>,
  ): Promise<User> {
    const student = await this.get_user(student_id);
    const updatedStudent = Object.assign(student, updateData);
    return await this.userRepo.save(updatedStudent);
  }

  async delete_user(student_id: number): Promise<User> {
    const student = await this.get_user(student_id);
    const result = await this.userRepo.remove(student);
    return result;
  }
}
