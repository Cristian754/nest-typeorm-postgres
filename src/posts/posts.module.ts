import { Module } from '@nestjs/common';
import { UsersModule } from 'src/users/users.module';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './post.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Post]), 
    UsersModule
  ],
  controllers: [PostsController],
  providers: [PostsService]
})
export class PostsModule {}
