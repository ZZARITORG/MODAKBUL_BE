import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { Observable, catchError, map, tap, throwError } from 'rxjs';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(
    private configService: ConfigService,
    private reflector: Reflector,
  ) {}
  intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
    const skipInterceptor = this.reflector.get<boolean>('skipInterceptor', context.getHandler());
    if (skipInterceptor) {
      return next.handle();
    }

    const ctx = context.switchToHttp();
    const request = ctx.getRequest();
    const response = ctx.getResponse();

    interface ILogger {
      SUCCESS: boolean;
      STATUS: number;
      USERID: string;
      AGENT: string;
      METHOD: string;
      PATH: string;
      ERROR?: string;
      ERROR_DATA?: any;
      ERROR_MESSAGE?: string;
      TIMESTAMP: string;
    }

    const logger: ILogger = {
      SUCCESS: true,
      STATUS: response.statusCode,
      USERID: request.user?.id,
      AGENT: request.headers['user-agent'],
      METHOD: request.method,
      PATH: request.url,
      TIMESTAMP: new Date().toISOString(),
    };

    return next.handle().pipe(
      tap(() => Logger.log(logger)),
      map((data) => {
        return {
          data,
          status: logger.STATUS,
          method: logger.METHOD,
          path: logger.PATH,
          timeStamp: logger.TIMESTAMP,
        };
      }),
      catchError((error) =>
        throwError(() => {
          logger.SUCCESS = false;
          logger.STATUS = error.status;
          logger.ERROR_MESSAGE = error.message;
          logger.ERROR_DATA = {
            body: request.body,
            query: request.query,
            params: request.params,
          };

          Logger.error(error);

          throw error;
        }),
      ),
    );
  }
}
