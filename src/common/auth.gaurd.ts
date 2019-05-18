import { Injectable, CanActivate, ExecutionContext, HttpException, HttpStatus } from '@nestjs/common';
import * as jwt from 'jsonwebtoken'

@Injectable()
export class AuthGuard implements CanActivate {
    async canActivate(
        context: ExecutionContext,
    ): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        if (!request.headers.authorization) {
            throw new HttpException(
                'Un authorized',
                HttpStatus.UNAUTHORIZED
            )
        }

        request.user =  await this.validateToken(request.headers.authorization)
        
        return true
    }

    async validateToken(auth: string) {
        // if (auth.split('')[0] !== 'Bearer') { // bar
        //     throw new HttpException('Invalid token', HttpStatus.FORBIDDEN)
        // }
        // const token = auth.split('')[1]
        // console.log('split token : *********** =>> : "'+token+'"')
        // console.log('unsplit token: **********> "'+auth+'"')
        // console.log('secret ********** => ', process.env.SECRET)
        try {
            const decode = await jwt.verify(auth, process.env.SECRET)
            return decode
        } catch (err) {
            const message = 'TokenError: ' + (err.message || err.name)
            throw new HttpException(
                message,
                HttpStatus.UNAUTHORIZED
            )
        }
    }

}