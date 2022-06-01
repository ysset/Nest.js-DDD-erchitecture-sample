import { Post, Get, Controller, Req, Res, Body } from '@nestjs/common';
import { GameService } from './game.service';
import { Response } from 'express';

@Controller('api')
export class GameController {
  constructor(private gameStateService: GameService) {}

  @Get('game/state')
  async state(@Body() { user }, @Res() res: Response) {
    try {
      const { code, data } = await this.gameStateService.state({ user });
      res.status(code).send(data);
    } catch (e) {
      console.error(e);
      res.status(500).send(e.message);
    }
  }

  @Post('game')
  async buy(@Body() { user, count }, @Res() res: Response) {
    try {
      const { code, data } = await this.gameStateService.buy({ user, count });
      res.status(code).send(data);
    } catch (e) {
      console.error(e);
      res.status(500).send(e.message);
    }
  }

  @Post('game/cell')
  async cell(@Body() { id, cell: { str, coll }, user }, @Res() res: Response) {
    try {
      const { code, data } = await this.gameStateService.cell({
        id,
        cell: { str, coll },
        user,
      });
      res.status(code).send(data);
    } catch (e) {
      console.error(e);
      res.status(500).send({ message: e.message });
    }
  }

  @Get('game/start')
  async createCard(@Body() { user }, @Res() res: Response) {
    try {
      const { code, data } = await this.gameStateService.createCard({ user });
      res.status(code).send(data);
    } catch (e) {
      console.error(e);
      res.status(500).send(e.message);
    }
  }

  @Post('game/end')
  async completeGame(@Body() { id, user }, @Res() res: Response) {
    try {
      const { code, data } = await this.gameStateService.completeGame({
        id,
        user,
      });
      res.status(code).send(data);
    } catch (e) {
      console.error(e);
      res.status(500).send(e.message);
    }
  }
}
