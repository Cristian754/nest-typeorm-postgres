import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, BeforeInsert } from "typeorm";
import { User } from "../users/user.entity";
import { v4 as uuidv4 } from 'uuid';

@Entity()
export class Post {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  content: string;

  @Column()
  authorId: number;

  @ManyToOne(() => User, user => user.posts)
  author: User;

  @BeforeInsert()
  generateId() {
    this.id = uuidv4();
  }

}