import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CardapioModule } from './cardapio/cardapio.module.js';
import { PrismaModule } from './prisma/prisma.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    CardapioModule,
  ],
})
export class AppModule {}
