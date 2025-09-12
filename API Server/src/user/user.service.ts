import { Injectable } from '@nestjs/common';
import { User } from '../entitys/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepo: Repository<User>,
    ){}

    create_user() {}

    get_everyone() : Partial<Repository<User>>{
        return this.userRepo;
    }

    get_user(id: number) {
    }

    update_user() {}

    delete_user() {}
}
