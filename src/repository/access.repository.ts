import { EntityRepository, Repository } from 'typeorm';
import { Access } from './access.entity';

@EntityRepository(Access)
export class AccessRepository extends Repository<Access> {}
