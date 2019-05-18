import { Catch, ExceptionFilter, HttpException, ArgumentsHost, Logger } from '@nestjs/common'

@Catch()
export class HttpErrorFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp()
        const requset = ctx.getRequest()
        const response = ctx.getResponse()
        const status = exception.getStatus()

        const errResponse = {
            code: status,
            timestamp: new Date().toLocaleDateString(),
            path: requset.url,
            method: requset.method,
            message: exception.message.error || exception.message || null,
            
        }

        Logger.error(
        `${requset.method} ${requset.url}`,
        JSON.stringify(errResponse) ,
         `ExceptionFilter`,
         )

        response.status(status).json({ found: errResponse })
    }
}