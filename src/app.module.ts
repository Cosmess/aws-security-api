import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Access } from './repository/access.entity';
import { AccessService } from './services/access.service';
import { AccessController } from './routes/access.controller';
import { AccessRepository } from './repository/access.repository';
import { Group } from './repository/group.entity';
import { Service } from './repository/service.entity';
import { User } from './repository/user.entity';
import { Permission } from './repository/permission.entity'
import * as dotenv from 'dotenv'
import { HealthController } from './routes/health.controller';
import { EmailModule } from './email/email.module';

dotenv.config();

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.SEQ_SQLDB_HOST,  
      port: parseInt(process.env.SEQ_SQLDB_PORT),
      username: process.env.SEQ_SQLDB_USER,
      password: process.env.SEQ_SQLDB_PASSWORD,
      database: process.env.SEQ_SQLDB_DATABASE_PH,
      entities: [Access, Group, Service, User, Permission],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([Access, Group, Service, User, Permission]),
    EmailModule,
  ],
  controllers: [AccessController,HealthController],
  providers: [AccessService],
})
export class AppModule {}
