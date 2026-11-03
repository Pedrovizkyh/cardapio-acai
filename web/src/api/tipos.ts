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
