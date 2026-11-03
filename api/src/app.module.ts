import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AdminModule } from './admin/admin.module.js';
import { AuthModule } from './auth/auth.module.js';
import { CardapioModule } from './cardapio/cardapio.module.js';
import { PedidosModule } from './pedidos/pedidos.module.js';
import { PrismaModule } from './prisma/prisma.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    CardapioModule,
    AuthModule,
    AdminModule,
    PedidosModule,
  ],
})
export class AppModule {}
