import { Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from './user.entity';
import { Group } from './group.entity';
import { Service } from './service.entity';

@Entity()
export class Permission {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, user => user.permissions)
  user: User;

  @ManyToOne(() => Group, group => group.permissions)
  group: Group;

  @ManyToOne(() => Service, service => service.permissions)
  service: Service;
}
