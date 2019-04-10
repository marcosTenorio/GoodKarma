import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from "typeorm";
import { User } from "./user";
import { Reply } from "./reply";

@Entity()
export class Comment {

    @PrimaryGeneratedColumn()
    public id!: number;

    @Column()
    public userId!: number;

    @Column()
    public replyId!: number;

    @Column()
    public text!: string;

    @Column({nullable: true})
    public date: string;
   
    // a user can have many comments, but a comment only belongs to a user
    @ManyToOne(type => User, user => user.comments)
    public user!: User;

    // a comment can have many replies, but a reply only belongs to a comment
    @ManyToOne(type => Reply, reply => reply.comments)
    public reply!: Reply[];
}