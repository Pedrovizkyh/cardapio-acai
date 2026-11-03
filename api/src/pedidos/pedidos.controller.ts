import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CriarPedidoDto } from './dto/criar-pedido.dto.js';
import { PedidosService } from './pedidos.service.js';

@ApiTags('pedidos')
@Controller('pedidos')
export class PedidosController {
  constructor(private readonly pedidosService: PedidosService) {}

  @Post()
  criar(@Body() dto: CriarPedidoDto) {
    return this.pedidosService.criar(dto);
  }
}
