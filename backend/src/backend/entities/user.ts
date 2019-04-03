import { Entity, Column, PrimaryGeneratedColumn, OneToMany, JoinTable } from "typeorm";
import { Link } from "./link";
import { Comment } from "./comment";
import { Karma } from "./karma";
import { Reply } from "./reply";

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    public id!: number;

    @Column()
    public name!: string;

    @Column()
    public email!: string;

    @Column()
    public password!: string;

    // an user can have many links, but a link only belong to an user
    @OneToMany(type => Link, link => link.user)
    public links!: Link[];

    // an user can have many replies, but a reply ony belongs to an user
    @OneToMany(type => Reply, reply => reply.user)
    public replies!: Reply[];

    // an user can have many comments but a comment only belongs to an user
    @OneToMany(type => Comment, comment => comment.user)
    public comments!: Comment[];

    // an user can give many karma points but a karma point only belongs to an user
    @OneToMany(type => Karma, karma => karma.user)
    public karmaPoints!: Karma[];
}
