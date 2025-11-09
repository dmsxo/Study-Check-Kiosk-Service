import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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
    file?: Express.Multer.File,
  ): Promise<User> {
    const student = await this.get_user(student_id);
    if (file) {
      const filename = student.profileImageFilename;
      const newFilename = await this.imageService.uploadImage(file, filename);
      student.profileImageFilename = newFilename;
    }
    Object.assign(student, updateUserDto);
    return this.userRepo.save(student);
  }

  async delete_user(student_id: number): Promise<User> {
    const student = await this.get_user(student_id);
    const profile = student.profileImageFilename;
    if (profile) await this.imageService.deleteImage(profile);
    return this.userRepo.remove(student);
  }
}
