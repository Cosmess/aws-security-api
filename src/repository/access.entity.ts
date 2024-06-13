import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class Access {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  ruleDescription: string;

  @Column()
  newIp: string;

  @Column()
  typeGroup: string;

  @Column()
  typeService: string;
  
  @CreateDateColumn()
  created: Date;

  @UpdateDateColumn()
  updated: Date;

}
