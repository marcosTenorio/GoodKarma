import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from "typeorm";
import { User } from "./user";
import { Reply } from "./reply";

@Entity()
export class Karma {

    @PrimaryGeneratedColumn()
    public id!: number;

    @Column()
    public userId!: number;

    @Column()
    public replyId!: number;

    // an user can have many karma points, but a karma point only belongs to an user
    @ManyToOne(type => User, user => user.karmaPoints)
    public user!: User;

    // a reply can have many karma points, but a karma point only belongs to a reply
    @ManyToOne(type => Reply, reply => reply.karma)
    public reply!: Reply[];
}
