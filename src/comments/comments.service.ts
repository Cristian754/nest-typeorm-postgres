import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersService } from 'src/users/users.service';
import { Comment } from './entities/comment.entity';

@Injectable()
export class CommentsService {

  constructor(
    @InjectRepository(Comment) private readonly commentRepository: Repository<Comment>,
    private readonly usersService: UsersService,
  ) {}

  async createComment(comment: CreateCommentDto):  Promise<Comment[] | HttpException>{
    const commentFound = await this.usersService.getUserById(comment.authorId.toString());
    if (!commentFound) {
      return new HttpException('Comment not found', HttpStatus.NOT_FOUND);
    }
    const newComment = this.commentRepository.create([comment]);
    return this.commentRepository.save(newComment);
  }

  async getComments(): Promise<Comment[]>{
    const commentFound = await this.commentRepository.find({ relations: ['author'] });
    if (commentFound.length === 0) {
      throw new HttpException('There is not comments in the database', HttpStatus.NOT_FOUND);
    }
    return commentFound;
  }

  async getCommentById(id: string): Promise<Comment | HttpException>{
    const commentFound = await this.commentRepository.findOne({ where: { id } });
    if (!commentFound) {
      return new HttpException('Comment not found', HttpStatus.NOT_FOUND);
    }
    return commentFound;
  }

  async updateComment(id: string, updateCommentDto: UpdateCommentDto): Promise<Comment | HttpException>{
    const commentFound = this.commentRepository.findOne({ where: { id } });
    if (!commentFound) {
      return new HttpException('Comment not found', HttpStatus.NOT_FOUND);
    }
    const updateResult = Object.assign(commentFound, updateCommentDto);
    return this.commentRepository.save(updateResult);
  }

  async deleteComment(id: string): Promise<HttpException> {
    const commentFound = await this.commentRepository.findOne({ where: { id } });
    if (!commentFound) {
      return new HttpException('Comment not found', HttpStatus.NOT_FOUND);
    }
    const deleteResult = await this.commentRepository.delete(id);
    if (deleteResult.affected === 1) {
      return new HttpException('Comment deleted successfully', HttpStatus.OK);
    } else {
      throw new HttpException('Failed to delete comment', HttpStatus.NOT_FOUND);
    }
  }
}
