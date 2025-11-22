import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ImagesService } from '../images/images.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
    private imageService: ImagesService,
  ) {}

  async create_user(
    createUserDto: CreateUserDto,
    file: Express.Multer.File,
  ): Promise<User> {
    const newStudent = this.userRepo.create({ ...createUserDto });
    if (file) {
      const filename = await this.imageService.uploadImage(file);
      newStudent.profileImageFilename = filename;
    }
    return this.userRepo.save(newStudent);
  }

  async get_everyone(): Promise<User[]> {
    const students = await this.userRepo.find({ relations: ['attendances'] });
    if (students.length === 0) {
      throw new NotFoundException('No users found');
    }
    return students;
  }

  async get_user(studentId: number): Promise<User> {
    const student = await this.userRepo.findOne({
      where: { studentId },
    });
    if (!student) {
      throw new NotFoundException(`User with studentId ${studentId} not found`);
    }
    return student;
  }

  async update_user(
    studentId: number,
    updateUserDto: UpdateUserDto,
    file: Express.Multer.File,
  ): Promise<User> {
    console.log(updateUserDto);
    const student = await this.get_user(studentId);
    const filename = student.profileImageFilename;
    if (file) {
      const newFilename = await this.imageService.uploadImage(file, filename);
      student.profileImageFilename = newFilename;
    } else if (updateUserDto.profileImageFilename == 'null') {
      if (filename) {
        await this.imageService.deleteImage(filename);
      }
      student.profileImageFilename = undefined;
    }
    Object.assign(student, updateUserDto);
    return this.userRepo.save(student);
  }

  async delete_user(studentId: number): Promise<User> {
    const student = await this.get_user(studentId);
    const profile = student.profileImageFilename;
    if (profile) await this.imageService.deleteImage(profile);
    return this.userRepo.remove(student);
  }

  async getStudentIdByGrade(grade: number): Promise<number> {
    const user_count = await this.userRepo
      .createQueryBuilder('users')
      .where('CAST(users.studentId AS TEXT) LIKE :id_like', {
        id_like: `${grade}%`,
      })
      .getCount();

    const MAX = 40;
    const class_id = Math.floor(user_count / MAX) + 1;
    const student_number = (user_count % MAX) + 1;

    return grade * 10000 + class_id * 100 + student_number;
  }
}
