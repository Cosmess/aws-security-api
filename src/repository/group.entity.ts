import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Permission } from './permission.entity';

@Entity()
export class Group {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  securityGroupId: string;

  @Column()
  typeGroup: string;

  @OneToMany(() => Permission, permission => permission.group)
  permissions: Permission[];
}
