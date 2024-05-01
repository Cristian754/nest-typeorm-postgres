import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn, OneToMany, BeforeInsert } from "typeorm";
import { Profile } from "./profile.entity";
import { Post } from "../posts/post.entity";
import { v4 as uuidv4 } from 'uuid';
import { Comment } from "../comments/entities/comment.entity";

@Entity({ name: "users" })
export class User {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP"})
  createdAt: Date;

  @Column({ nullable: true})
  authStrategy: string;

  @BeforeInsert()
  generateId() {
    this.id = uuidv4();
  }

  @OneToOne(() => Profile)
  @JoinColumn()
  profile: Profile;

  @OneToMany(() => Post, post => post.author)
  posts: Post[];

  @OneToMany(() => Comment, comment => comment.author)
  comments: Comment[];

}
