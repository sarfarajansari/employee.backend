import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity()
export class Employee {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 120 })
  name!: string;

  @Column({ length: 150, unique: true })
  email!: string;

  @Column({ type: "text" })
  department!: string;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;
}
