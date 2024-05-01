import { Controller, Post, Body, Get, Param, Delete, Patch } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';
import { CreateProfileDto } from './dto/create-profile.dto';
import { User } from './user.entity';
import { ApiTags } from '@nestjs/swagger';

@Controller('users')
@ApiTags('users')
export class UsersController {

  constructor(private readonly userService: UsersService) {}

  @Post()
  createUser(@Body() newUser: CreateUserDto) {
    return this.userService.createUser(newUser);
  }

  @Get()
  getUsers(): Promise<User[]>{
    return this.userService.getUsers();
  }

  @Get(':id')
  getUserById(@Param("id") id: string){
    return this.userService.getUserById(id);
  }

  @Delete(':id')
  deleteUser(@Param("id") id: string) {
    return this.userService.deleteUser(id);
  }

  @Patch(':id')
  updateUser(@Param("id") id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.updateUser(id, updateUserDto);
  }

  @Post(':id/profile')
  createProfile(@Param("id") id: string, @Body() profile: CreateProfileDto) {
    return this.userService.createProfile(id, profile);
  }

}
