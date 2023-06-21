import { UseInterceptors, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { plainToInstance } from 'class-transformer';
import { BaseDto } from 'src/users/dtos/base-dto';

interface ClassConstructor {
  new (...args: any[]): {};
}

export function Serialize(dto: ClassConstructor) {
  return UseInterceptors(new SerializeInterceptor(dto));
}

export class SerializeInterceptor implements NestInterceptor {
  constructor(private dto: any) {}

  intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
    // Run something before a request is handled by the request handler

    return next.handle().pipe(
      map((data: any) => {
        //Run something beforethe resonse is sent back
        return plainToInstance(this.dto, data, { excludeExtraneousValues: true });
      }),
    );
  }
}
