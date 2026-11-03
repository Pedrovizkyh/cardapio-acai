import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module.js';
import { AdminPedidosController } from './admin-pedidos.controller.js';
import { PedidosController } from './pedidos.controller.js';
import { PedidosService } from './pedidos.service.js';

@Module({
  imports: [AuthModule],
  controllers: [PedidosController, AdminPedidosController],
  providers: [PedidosService],
})
export class PedidosModule {}
