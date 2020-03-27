import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn
} from "typeorm";
import { Artists } from "./Artist";

@Entity()
export class Shows {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  venue: string;

  @Column("timestamp with time zone", { default: new Date() })
  date: Date;

  @Column("timestamp with time zone", { default: new Date() })
  created_at: Date;

  @Column()
  price: string;

  @ManyToOne(type => Artists)
  @JoinColumn({ name: "artists_id" })
  artists: Artists;
}
