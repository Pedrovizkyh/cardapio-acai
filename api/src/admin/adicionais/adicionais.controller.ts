import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard.js';
import { AdicionaisService } from './adicionais.service.js';
import {
  AtualizarAdicionalDto,
  CriarAdicionalDto,
} from './dto/adicional.dto.js';

@ApiTags('admin — adicionais')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('admin/adicionais')
export class AdicionaisController {
  constructor(private readonly adicionaisService: AdicionaisService) {}

  @Get()
  listar() {
    return this.adicionaisService.listar();
  }

  @Post()
  criar(@Body() dto: CriarAdicionalDto) {
    return this.adicionaisService.criar(dto);
  }

  @Patch(':id')
  atualizar(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: AtualizarAdicionalDto,
  ) {
    return this.adicionaisService.atualizar(id, dto);
  }

  @Delete(':id')
  @HttpCode(204)
  remover(@Param('id', ParseIntPipe) id: number) {
    return this.adicionaisService.remover(id);
  }
}
