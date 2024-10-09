import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';

@Catch(HttpException, Error)
export class CustomExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException | Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest();
    const response = ctx.getResponse();

    let status: HttpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string = exception.message;

    if (exception instanceof HttpException) {
      status = exception.getStatus();

      const exceptionResponse = exception.getResponse().valueOf();

      if (exceptionResponse.hasOwnProperty('message') && typeof exceptionResponse === 'object') {
        message = exceptionResponse['message'];
      }
    }

    const httpError = {
      message,
      status,
      path: request.url,
      timestamp: new Date().toISOString(),
    };

    return response.status(httpError.status).json(httpError);
  }
}
