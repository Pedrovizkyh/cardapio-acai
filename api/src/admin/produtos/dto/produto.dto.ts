import { OmitType, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsInt,
  IsNumber,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';

// Fica neste arquivo de propósito: o plugin do Swagger gera um import quebrado
// para DTOs aninhados vindos de outro arquivo quando o caminho do projeto tem acento.
export class CriarTamanhoDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(30)
  nome: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  preco: number;
}

export class AtualizarTamanhoDto extends PartialType(CriarTamanhoDto) {}

export class CriarProdutoDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(80)
  nome: string;

  @IsString()
  @MaxLength(300)
  descricao: string;

  @IsOptional()
  @IsUrl()
  imagem?: string;

  @IsInt()
  categoriaId: number;

  @IsOptional()
  @IsBoolean()
  ativo?: boolean;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CriarTamanhoDto)
  tamanhos: CriarTamanhoDto[];
}

export class AtualizarProdutoDto extends PartialType(
  OmitType(CriarProdutoDto, ['tamanhos'] as const),
) {}
