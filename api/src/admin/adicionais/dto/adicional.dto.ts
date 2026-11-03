import { PartialType } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

export class CriarAdicionalDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(60)
  nome: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  preco: number;

  @IsOptional()
  @IsBoolean()
  ativo?: boolean;
}

export class AtualizarAdicionalDto extends PartialType(CriarAdicionalDto) {}
