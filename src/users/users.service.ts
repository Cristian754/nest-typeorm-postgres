import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { Profile } from './profile.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateProfileDto } from './dto/create-profile.dto';

@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
    @InjectRepository(Profile) private readonly profilesRepository: Repository<Profile>
    ) {}

  async createUser(createUserDto: CreateUserDto): Promise<User | HttpException>{
    const userFound = await this.usersRepository.findOne({ where : { username: createUserDto.username } });
    if (userFound) {
      return new HttpException('User already exists', HttpStatus.CONFLICT);
    }
    const newUser = this.usersRepository.create(createUserDto);
    return this.usersRepository.save(newUser);
  }

  async getUsers(): Promise<User[]> {
    const usersFounds = await this.usersRepository.find({ relations: ['profile', 'posts', 'comments'] });
    if (usersFounds.length === 0) {
      throw new HttpException('There is not users in the database', HttpStatus.NOT_FOUND);
    }
    return usersFounds;
  }

  async getUserById(id: string): Promise<User | HttpException>{
    const userFound = await this.usersRepository.findOne({
      where: { id },
      relations: ['posts']
    });
    if (!userFound) {
      return new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return userFound;
  }

  async deleteUser(id: string): Promise<HttpException> {
    const userFound = await this.usersRepository.findOne({ where: { id } });
    if (!userFound) {
      return new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    const deleteResult = await this.usersRepository.delete(id);
    if (deleteResult.affected === 1) {
      return new HttpException('User deleted successfully', HttpStatus.OK);
    } else {
      throw new HttpException('Failed to delete user', HttpStatus.NOT_FOUND);
    }
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto): Promise<User | HttpException>{
    const userFound = await this.usersRepository.findOne({ where: { id } });
    if (!userFound) {
      return new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    const updateUser = Object.assign(userFound, updateUserDto);
    return await this.usersRepository.save(updateUser);
  }

  async createProfile(id: string, profile: CreateProfileDto): Promise<User | HttpException>{
    const userFound = await this.usersRepository.findOne({ where: { id } });
    if (!userFound) {
      return new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    const newProfile = this.profilesRepository.create(profile);
    const profileSaved = await this.profilesRepository.save(newProfile);
    userFound.profile = profileSaved;
    return this.usersRepository.save(userFound);
  }

}
