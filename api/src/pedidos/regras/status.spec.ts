import { StatusPedido, TipoEntrega } from '../../generated/prisma/enums.js';
import { podeMudarStatus, proximosStatus } from './status.js';

const { RECEBIDO, EM_PREPARO, PRONTO, SAIU_PARA_ENTREGA, ENTREGUE, CANCELADO } =
  StatusPedido;
const { ENTREGA, RETIRADA } = TipoEntrega;
const todos = Object.values(StatusPedido);

function permitidas(tipo: TipoEntrega) {
  return todos.flatMap((de) =>
    todos
      .filter((para) => podeMudarStatus(de, para, tipo))
      .map((para) => `${de}→${para}`),
  );
}

describe('transições de status', () => {
  it('entrega: segue Recebido → Em preparo → Pronto → Saiu → Entregue', () => {
    expect(permitidas(ENTREGA).sort()).toEqual(
      [
        `${RECEBIDO}→${EM_PREPARO}`,
        `${RECEBIDO}→${CANCELADO}`,
        `${EM_PREPARO}→${PRONTO}`,
        `${EM_PREPARO}→${CANCELADO}`,
        `${PRONTO}→${SAIU_PARA_ENTREGA}`,
        `${PRONTO}→${CANCELADO}`,
        `${SAIU_PARA_ENTREGA}→${ENTREGUE}`,
      ].sort(),
    );
  });

  it('retirada: segue Recebido → Em preparo → Pronto → Entregue', () => {
    expect(permitidas(RETIRADA).sort()).toEqual(
      [
        `${RECEBIDO}→${EM_PREPARO}`,
        `${RECEBIDO}→${CANCELADO}`,
        `${EM_PREPARO}→${PRONTO}`,
        `${EM_PREPARO}→${CANCELADO}`,
        `${PRONTO}→${ENTREGUE}`,
        `${PRONTO}→${CANCELADO}`,
      ].sort(),
    );
  });

  it('não cancela depois que o pedido saiu para entrega', () => {
    expect(podeMudarStatus(SAIU_PARA_ENTREGA, CANCELADO, ENTREGA)).toBe(false);
  });

  it('retirada nunca passa por "saiu para entrega"', () => {
    expect(podeMudarStatus(PRONTO, SAIU_PARA_ENTREGA, RETIRADA)).toBe(false);
  });

  it('entrega não pula de pronto direto para entregue', () => {
    expect(podeMudarStatus(PRONTO, ENTREGUE, ENTREGA)).toBe(false);
  });

  it('não pula etapas nem volta para trás', () => {
    expect(podeMudarStatus(RECEBIDO, PRONTO, ENTREGA)).toBe(false);
    expect(podeMudarStatus(PRONTO, EM_PREPARO, ENTREGA)).toBe(false);
  });

  it.each([ENTREGUE, CANCELADO])('%s é final para os dois tipos', (status) => {
    expect(proximosStatus(status, ENTREGA)).toEqual([]);
    expect(proximosStatus(status, RETIRADA)).toEqual([]);
  });

  it('não aceita mudar para o mesmo status', () => {
    for (const status of todos) {
      expect(podeMudarStatus(status, status, ENTREGA)).toBe(false);
      expect(podeMudarStatus(status, status, RETIRADA)).toBe(false);
    }
  });
});
