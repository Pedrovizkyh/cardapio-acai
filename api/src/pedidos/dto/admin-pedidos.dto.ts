import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { StatusPedido } from '../../generated/prisma/enums.js';

export class FiltroPedidosDto {
  @ApiPropertyOptional({ enum: StatusPedido })
  @IsOptional()
  @IsEnum(StatusPedido)
  status?: StatusPedido;
}

export class MudarStatusDto {
  @ApiProperty({ enum: StatusPedido })
  @IsEnum(StatusPedido)
  status: StatusPedido;
}
