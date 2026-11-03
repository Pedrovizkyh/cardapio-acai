import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  ArrayUnique,
  IsArray,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  Max,
  MaxLength,
  Min,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { FormaPagamento, TipoEntrega } from '../../generated/prisma/enums.js';

// Fica no mesmo arquivo do CriarPedidoDto pelo mesmo bug do plugin do Swagger
// com caminhos acentuados (ver dto de produto).
export class ItemPedidoDto {
  @IsInt()
  produtoId: number;

  @IsInt()
  tamanhoId: number;

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(20)
  @ArrayUnique()
  @IsInt({ each: true })
  adicionais: number[] = [];

  @IsInt()
  @Min(1)
  @Max(20)
  quantidade: number;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  observacao?: string;
}

export class CriarPedidoDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(80)
  cliente: string;

  @Matches(/^\d{10,11}$/, {
    message: 'telefone deve ter DDD e só dígitos (10 ou 11 números)',
  })
  telefone: string;

  @ApiProperty({ enum: TipoEntrega })
  @IsEnum(TipoEntrega)
  tipo: TipoEntrega;

  @ValidateIf((pedido: CriarPedidoDto) => pedido.tipo === TipoEntrega.ENTREGA)
  @IsString()
  @IsNotEmpty({ message: 'endereco é obrigatório na entrega' })
  @MaxLength(200)
  endereco?: string;

  @ApiProperty({ enum: FormaPagamento })
  @IsEnum(FormaPagamento)
  pagamento: FormaPagamento;

  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(30)
  @ValidateNested({ each: true })
  @Type(() => ItemPedidoDto)
  itens: ItemPedidoDto[];
}
