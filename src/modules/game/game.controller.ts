import { Post, Get, Controller, Req, Res } from '@nestjs/common';
import { GameService } from './game.service';
import { Request, Response } from 'express';

@Controller('api')
export class GameController {
  constructor(private gameStateService: GameService) {}

  @Get('game/state')
  async state(@Req() req: Request, @Res() res: Response) {
    await this.gameStateService.state({ req, res });
  }

  @Post('game')
  async buy(@Req() req: Request, @Res() res: Response) {
    await this.gameStateService.buy({ req, res });
  }

  @Post('game/cell')
  async cell(@Req() req: Request, @Res() res: Response) {
    await this.gameStateService.cell({ req, res });
  }

  @Get('game/start')
  async createCard(@Req() req: Request, @Res() res: Response) {
    await this.gameStateService.createCard({ req, res });
  }

  @Post('game/end')
  async completeGame(@Req() req: Request, @Res() res: Response) {
    await this.gameStateService.completeGame({ req, res });
  }
}
