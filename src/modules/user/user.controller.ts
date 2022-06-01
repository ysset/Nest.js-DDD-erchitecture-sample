import { Get, Controller, Res, Body } from '@nestjs/common';
import { Response } from 'express';
import { UserService } from './user.service';

@Controller('api')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('balance')
  async balance(@Body() { user }, @Res() res: Response) {
    try {
      const { code, data } = await this.userService.balance({ user });
      res.status(code).send(data);
    } catch (e) {
      console.error(e);
      res.status(500).send({ message: e.message });
    }
  }
}
