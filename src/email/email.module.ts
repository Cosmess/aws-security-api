import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { VerificationService } from './verification.service';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [ScheduleModule.forRoot()],
  providers: [EmailService, VerificationService],
  exports: [EmailService, VerificationService],
})
export class EmailModule {}
