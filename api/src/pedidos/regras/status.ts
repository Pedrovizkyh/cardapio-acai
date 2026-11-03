import { StatusPedido, TipoEntrega } from '../../generated/prisma/enums.js';

const { EM_PREPARO, PRONTO, SAIU_PARA_ENTREGA, ENTREGUE, CANCELADO } =
  StatusPedido;

// Depois de PRONTO o caminho depende do tipo: retirada é entregue no balcão,
// entrega precisa sair com o motoboy. Cancelar só vale antes de sair.
const transicoes: Record<TipoEntrega, Record<StatusPedido, StatusPedido[]>> = {
  ENTREGA: {
    RECEBIDO: [EM_PREPARO, CANCELADO],
    EM_PREPARO: [PRONTO, CANCELADO],
    PRONTO: [SAIU_PARA_ENTREGA, CANCELADO],
    SAIU_PARA_ENTREGA: [ENTREGUE],
    ENTREGUE: [],
    CANCELADO: [],
  },
  RETIRADA: {
    RECEBIDO: [EM_PREPARO, CANCELADO],
    EM_PREPARO: [PRONTO, CANCELADO],
    PRONTO: [ENTREGUE, CANCELADO],
    SAIU_PARA_ENTREGA: [],
    ENTREGUE: [],
    CANCELADO: [],
  },
};

export function proximosStatus(
  atual: StatusPedido,
  tipo: TipoEntrega,
): StatusPedido[] {
  return transicoes[tipo][atual];
}

export function podeMudarStatus(
  atual: StatusPedido,
  novo: StatusPedido,
  tipo: TipoEntrega,
): boolean {
  return proximosStatus(atual, tipo).includes(novo);
}
