import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CardapioService } from './cardapio.service.js';

@ApiTags('cardápio')
@Controller()
export class CardapioController {
  constructor(private readonly cardapioService: CardapioService) {}

  @Get('cardapio')
  listar() {
    return this.cardapioService.listar();
  }

  @Get('produtos/:id')
  detalharProduto(@Param('id', ParseIntPipe) id: number) {
    return this.cardapioService.detalharProduto(id);
  }
}
