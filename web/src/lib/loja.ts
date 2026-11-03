// Dados fixos da loja mostrados no cardápio. A API ainda não guarda horário nem prazos.
export const loja = {
  nome: 'Açaí da Orla',
  abreAs: 14,
  fechaAs: 22,
  minutosEntrega: 40,
  minutosRetirada: 15,
}

export function situacaoDaLoja(agora = new Date()) {
  const hora = agora.getHours()
  const aberta = hora >= loja.abreAs && hora < loja.fechaAs
  return {
    aberta,
    texto: aberta ? `Aberto · até ${loja.fechaAs}h` : `Fechado · abre às ${loja.abreAs}h`,
  }
}

export function numeroDoPedido(id: number): string {
  return String(id).padStart(4, '0')
}
