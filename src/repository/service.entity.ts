import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Permission } from './permission.entity';

@Entity()
export class Service {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  typeService: string;

  @Column()
  port: number;

  @OneToMany(() => Permission, permission => permission.service)
  permissions: Permission[];
}
