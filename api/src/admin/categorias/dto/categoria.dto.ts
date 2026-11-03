import { PartialType } from '@nestjs/swagger';
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

export class CriarCategoriaDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(60)
  nome: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  ordem?: number;
}

export class AtualizarCategoriaDto extends PartialType(CriarCategoriaDto) {}
