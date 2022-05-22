import { Post, Get, Controller, Req, Res } from '@nestjs/common';
import { GameStateService } from './gameState.service';
import { Request, Response } from 'express';

@Controller('game')
export class GameStateController {
  constructor(private gameStateService: GameStateService) {}

  @Get('state')
  async state(@Req() req: Request, @Res() res: Response) {
    await this.gameStateService.state({ req, res });
  }
}
