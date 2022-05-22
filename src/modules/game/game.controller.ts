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

  @Post('buy')
  async buy(@Req() req: Request, @Res() res: Response) {
    await this.gameStateService.buy({ req, res });
  }

  @Post('cell')
  async cell(@Req() req: Request, @Res() res: Response) {
    await this.gameStateService.cell({ req, res });
  }

  @Get('start')
  async createCard(@Req() req: Request, @Res() res: Response) {
    await this.gameStateService.createCard({ req, res });
  }

  @Post('end')
  async completeGame(@Req() req: Request, @Res() res: Response) {
    await this.gameStateService.completeGame({ req, res });
  }
}
