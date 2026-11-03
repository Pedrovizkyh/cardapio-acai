import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import bcrypt from 'bcrypt';
import { PrismaClient } from '../src/generated/prisma/client.js';

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});

type ProdutoSeed = {
  nome: string;
  descricao: string;
  tamanhos: [string, string][];
};

const cardapio: { nome: string; produtos: ProdutoSeed[] }[] = [
  {
    nome: 'Açaí',
    produtos: [
      {
        nome: 'Açaí Tradicional',
        descricao: 'Açaí puro batido na hora, cremoso e geladinho.',
        tamanhos: [
          ['300 ml', '14.90'],
          ['500 ml', '19.90'],
          ['700 ml', '25.90'],
        ],
      },
      {
        nome: 'Açaí com Banana',
        descricao: 'Açaí batido com banana, mais doce e encorpado.',
        tamanhos: [
          ['300 ml', '15.90'],
          ['500 ml', '21.90'],
          ['700 ml', '27.90'],
        ],
      },
      {
        nome: 'Açaí Zero',
        descricao: 'Açaí sem açúcar adicionado, adoçado com stevia.',
        tamanhos: [
          ['300 ml', '16.90'],
          ['500 ml', '22.90'],
        ],
      },
    ],
  },
  {
    nome: 'Cremes',
    produtos: [
      {
        nome: 'Creme de Cupuaçu',
        descricao: 'Creme gelado de cupuaçu, azedinho na medida.',
        tamanhos: [
          ['300 ml', '16.90'],
          ['500 ml', '22.90'],
        ],
      },
      {
        nome: 'Creme de Maracujá',
        descricao: 'Creme gelado de maracujá com calda da fruta.',
        tamanhos: [
          ['300 ml', '15.90'],
          ['500 ml', '21.90'],
        ],
      },
    ],
  },
  {
    nome: 'Bebidas',
    produtos: [
      {
        nome: 'Vitamina de Açaí',
        descricao: 'Açaí batido com leite e banana.',
        tamanhos: [
          ['400 ml', '13.90'],
          ['600 ml', '17.90'],
        ],
      },
      {
        nome: 'Suco de Acerola',
        descricao: 'Suco natural feito na hora.',
        tamanhos: [['400 ml', '8.90']],
      },
      {
        nome: 'Água de Coco',
        descricao: 'Água de coco gelada, direto da fruta.',
        tamanhos: [['500 ml', '7.90']],
      },
    ],
  },
];

const adicionais: [string, string][] = [
  ['Granola', '2.00'],
  ['Leite Ninho', '3.00'],
  ['Leite condensado', '2.50'],
  ['Banana', '2.00'],
  ['Morango', '3.50'],
  ['Paçoca', '2.50'],
  ['Mel', '2.00'],
  ['Creme de avelã', '5.00'],
];

async function main() {
  // Apaga na ordem inversa das dependências para o seed poder rodar várias vezes.
  await prisma.itemAdicional.deleteMany();
  await prisma.itemPedido.deleteMany();
  await prisma.pedido.deleteMany();
  await prisma.tamanho.deleteMany();
  await prisma.produto.deleteMany();
  await prisma.categoria.deleteMany();
  await prisma.adicional.deleteMany();

  for (const [ordem, categoria] of cardapio.entries()) {
    await prisma.categoria.create({
      data: {
        nome: categoria.nome,
        ordem,
        produtos: {
          create: categoria.produtos.map((produto) => ({
            nome: produto.nome,
            descricao: produto.descricao,
            tamanhos: {
              create: produto.tamanhos.map(([nome, preco]) => ({ nome, preco })),
            },
          })),
        },
      },
    });
  }

  await prisma.adicional.createMany({
    data: adicionais.map(([nome, preco]) => ({ nome, preco })),
  });

  const email = process.env.ADMIN_EMAIL ?? 'admin@acaidaorla.com';
  const senha = process.env.ADMIN_SENHA ?? 'admin123';
  const hash = await bcrypt.hash(senha, 10);
  await prisma.usuario.upsert({
    where: { email },
    update: { senha: hash },
    create: { email, senha: hash },
  });

  console.log(`Seed concluído. Admin: ${email}`);
}

main()
  .catch((erro) => {
    console.error(erro);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
