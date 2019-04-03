import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, JoinColumn} from "typeorm";
import { User } from "./user";
import { Reply } from "./reply";

@Entity()
export class Link {
    
    @PrimaryGeneratedColumn()
    public id!: number;

    @Column()
    public userId!: number;

    @Column()
    public question!: string;

    @Column()
    public title!: string;

    @Column()
    public field!: string; //Business or IT

    // an user can have many links, but a link only belongs to an user
    @ManyToOne(type => User, user => user.links)
    public user!: User;

    // a link can have many replies, but a reply only belongs to a link
    @OneToMany(type => Reply, reply => reply.link)
    reply: Reply[];
}
// edited tsconfig.json
//strictPropertyInitialization": false