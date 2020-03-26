import { Entity, Column, PrimaryColumn, OneToMany } from "typeorm";
import { Shows } from "./Show";

@Entity()
export class Artists {
  @PrimaryColumn()
  id: string;

  @Column()
  name: string;

  // @Column()
  // venue: string;

  // @Column("timestamp", { default: new Date() })
  // date: Date;

  @Column({ nullable: true })
  img: string;

  @OneToMany(
    type => Shows,
    shows => shows.artists
  )
  shows: Shows[];
}
