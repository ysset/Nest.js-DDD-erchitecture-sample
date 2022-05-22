import { Post, Get, Controller, Req, Res } from '@nestjs/common';
import { GameService } from './game.service';
import { Request, Response } from 'express';

@Controller('api/game')
export class GameController {
  constructor(private gameStateService: GameService) {}

  @Get('state')
  async state(@Req() req: Request, @Res() res: Response) {
    await this.gameStateService.state({ req, res });
  }

  @Get('balance')
  async balance(@Req() req: Request, @Res() res: Response) {
    await this.gameStateService.balance({ req, res });
  }

  @Post('buy')
  async buy(@Req() req: Request, @Res() res: Response) {
    await this.gameStateService.buy({ req, res });
  }

  @Post('open')
  async open() {
    return;
  }

  @Post('start')
  async createCard(@Req() req: Request, @Res() res: Response) {
    await this.gameStateService.createCard({ req, res });
  }
}
