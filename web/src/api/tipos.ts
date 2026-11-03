// Preços chegam como texto porque a API usa Decimal; nunca somar como número de ponto flutuante.
export type Preco = string

export type Tamanho = {
  id: number
  nome: string
  preco: Preco
  produtoId: number
}

export type Produto = {
  id: number
  nome: string
  descricao: string
  imagem: string | null
  ativo: boolean
  categoriaId: number
  tamanhos: Tamanho[]
}

export type Categoria = {
  id: number
  nome: string
  ordem: number
  aceitaAdicionais: boolean
  produtos: Produto[]
}

export type Adicional = {
  id: number
  nome: string
  preco: Preco
  ativo: boolean
}

export type ProdutoDetalhe = Produto & {
  aceitaAdicionais: boolean
  adicionais: Adicional[]
}

export type TipoEntrega = 'ENTREGA' | 'RETIRADA'
export type FormaPagamento = 'DINHEIRO' | 'CARTAO' | 'PIX'
export type StatusPedido =
  | 'RECEBIDO'
  | 'EM_PREPARO'
  | 'PRONTO'
  | 'SAIU_PARA_ENTREGA'
  | 'ENTREGUE'
  | 'CANCELADO'

export type ItemDoPedido = {
  id: number
  quantidade: number
  observacao: string | null
  precoUnitario: Preco
  produto: { id: number; nome: string }
  tamanho: { id: number; nome: string }
  adicionais: { id: number; preco: Preco; adicional: { id: number; nome: string } }[]
}

export type Pedido = {
  id: number
  cliente: string
  telefone: string
  endereco: string | null
  tipo: TipoEntrega
  pagamento: FormaPagamento
  status: StatusPedido
  total: Preco
  criadoEm: string
  itens: ItemDoPedido[]
}

export type NovoPedido = {
  cliente: string
  telefone: string
  tipo: TipoEntrega
  endereco?: string
  pagamento: FormaPagamento
  itens: {
    produtoId: number
    tamanhoId: number
    adicionais: number[]
    quantidade: number
    observacao?: string
  }[]
}
