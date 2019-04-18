import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, JoinColumn } from "typeorm";
import { User } from "./user";
import { Link } from "./link";
import { Karma } from "./karma";
import { Comment } from "./comment";

@Entity()
export class Reply {

    @PrimaryGeneratedColumn()
    public id!: number;

    @Column()
    public userId!: number;

    @Column()
    public linkId!: number;

    @Column()
    public text!: string;

    @Column({nullable: true})
    public date: Date;

    // an user can have many replies, but a reply only belongs to an user
    @ManyToOne(type => User, user => user.replies)
    public user!: User;

    // a link can have many replies, but a reply only belongs to a link
    @ManyToOne(type => Link, link => link.reply)
    public link!: Link[];

    // a reply can have many karma points, but a karma point only belongs to a reply
    @OneToMany(type => Karma, karma => karma.reply)
    public karma: Karma[];

    // a reply can have many comments, but a comment only belong to a reply
    @OneToMany(type => Comment, comment => comment.reply)
    public comments: Comment[];
}