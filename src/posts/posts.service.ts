import { HttpException, Injectable, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from 'src/users/users.service';
import { Post } from './post.entity';
import { Repository } from 'typeorm';
import { CreatePostDto } from './dto/create-post.dto';

@Injectable()
export class PostsService {

  constructor(
    @InjectRepository(Post) private readonly postsRepository: Repository<Post>,
    private readonly usersService: UsersService
    ) {}

  async createPost(post: CreatePostDto): Promise<Post | HttpException>{
    const userFound = await this.usersService.getUserById(post.authorId.toString());
    if (!userFound) {
      return new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    const newPost = this.postsRepository.create(post);
    return this.postsRepository.save(newPost);
  }

  async getPosts(): Promise<Post[]> {
    const postFound = await this.postsRepository.find({ relations: ['author'] });
    if (postFound.length === 0) {
      throw new HttpException('There is not posts in the database', HttpStatus.NOT_FOUND);
    }
    return postFound;
  }

  async getPostById(id: string): Promise<Post | HttpException>{
    const postFound = await this.postsRepository.findOne({ where: { id } });
    if (!postFound) {
      return new HttpException('Post not found', HttpStatus.NOT_FOUND);
    }
    return postFound;
  }

  async deletePost(id: string): Promise<HttpException> {
    const postFound = await this.postsRepository.findOne({ where: { id } });
    if (!postFound) {
      return new HttpException('Post not found', HttpStatus.NOT_FOUND);
    }
    const deleteResult = await this.postsRepository.delete(id);
    if (deleteResult.affected === 1) {
      return new HttpException('Post deleted successfully', HttpStatus.OK);
    } else {
      throw new HttpException('Failed to delete post', HttpStatus.NOT_FOUND);
    }
  }

  async updatePost(id: string, post: CreatePostDto): Promise<Post | HttpException>{
    const postFound = await this.postsRepository.findOne({ where: { id } });
    if (!postFound) {
      return new HttpException('Post not found', HttpStatus.NOT_FOUND);
    }
    const updateResult = Object.assign(postFound, post);
    return this.postsRepository.save(updateResult);
  }
}
