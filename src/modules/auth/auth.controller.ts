import {Post, Controller, Req, Res} from '@nestjs/common'

@Controller('auth')
export class AuthController {
    @Post('signup')
    signUp(@Req() req: Request, @Res() res: Response): string {
        let userData = {};
        return JSON.stringify(userData);
    }
    @Post('signin')
    signIn(): string {
        return ''
    }
}