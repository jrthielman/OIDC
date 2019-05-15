import {Entity, Column, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class User{

    @PrimaryGeneratedColumn({name : 'userid'})
    id: number;

    @Column({name : 'username', type: 'character varying', length: 100, nullable: false})
    username: string;

    @Column({name : 'password', type: 'character varying', length: 100, nullable: false})
    password: string;

    @Column({name : 'firstname', type: 'character varying', length: 100, nullable: false})
    firstname: string;

    @Column({name : 'lastname', type: 'character varying', length: 100, nullable: false})
    lastname: string;

}