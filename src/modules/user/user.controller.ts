import { Get, Controller, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { UserService } from './user.service';

@Controller('api')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('balance')
  async balance(@Req() req: Request, @Res() res: Response) {
    await this.userService.balance({ req, res });
  }
}
