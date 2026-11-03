import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { FiltroPedidosDto, MudarStatusDto } from './dto/admin-pedidos.dto.js';
import { PedidosService } from './pedidos.service.js';

@ApiTags('admin — pedidos')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('admin/pedidos')
export class AdminPedidosController {
  constructor(private readonly pedidosService: PedidosService) {}

  @Get()
  listar(@Query() filtro: FiltroPedidosDto) {
    return this.pedidosService.listar(filtro.status);
  }

  @Patch(':id/status')
  mudarStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: MudarStatusDto,
  ) {
    return this.pedidosService.mudarStatus(id, dto.status);
  }
}
