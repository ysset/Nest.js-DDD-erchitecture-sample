import { Post, Controller, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  signUp(@Req() req: Request, @Res() res: Response) {
    this.authService.signUp({ body: req.body, res });
  }

  @Post('signin')
  async signIn(@Req() req: Request, @Res() res: Response) {
    await this.authService.signIn({ body: req.body, res });
  }
}
