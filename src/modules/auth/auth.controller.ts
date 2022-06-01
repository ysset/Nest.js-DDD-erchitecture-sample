import { Post, Get, Controller, Req, Res, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';

@Controller('api')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  async signUp(@Body() { login, password }, @Res() res: Response) {
    try {
      const { code, data } = await this.authService.signUp({ login, password });
      res.status(code).send(data);
    } catch (e) {
      console.log(e);
      res.status(500).send(e.message);
    }
  }

  @Post('signin')
  async signIn(@Body() { login, password }, @Res() res: Response) {
    try {
      const { code, data } = await this.authService.signIn({ login, password });
      res.status(code).send(data);
    } catch (e) {
      console.log(e);
      res.status(500).send(e.message);
    }
  }

  @Get('check')
  async authCheck(@Body() { user }, @Res() res: Response) {
    const { data, code } = await this.authService.checkLogin({ user });
    return res.status(code).send(data);
  }
}
