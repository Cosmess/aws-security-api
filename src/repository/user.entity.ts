import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Permission } from './permission.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  password: string;

  @OneToMany(() => Permission, permission => permission.user)
  permissions: Permission[];
}
