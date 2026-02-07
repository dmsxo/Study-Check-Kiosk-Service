// import { Process, Processor } from '@nestjs/bull';
// import type { Job } from 'bull';
// import { StudentService } from './student.service';

// @Processor('auto-checkout')
// export class AutoCheckoutProcessor {
//   constructor(private readonly studentService: StudentService) {}
//   @Process()
//   async handleCheckout(job: Job<number>) {
//     const studentId = job.data;
//     await this.studentService.checkOut(studentId, {});
//   }
// }
