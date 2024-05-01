import { User } from "src/users/user.entity";
import { BeforeInsert, Column, Entity, ManyToOne,  PrimaryGeneratedColumn } from "typeorm";
import { v4 as uuidv4 } from 'uuid';

@Entity()
export class Comment {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  description: string;

  @Column()
  authorId: number;

  @ManyToOne(() => User, user => user.comments)
  author: User;

  @BeforeInsert()
  generateId() {
    this.id = uuidv4();
  }

}
