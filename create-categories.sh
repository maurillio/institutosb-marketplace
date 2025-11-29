#!/bin/bash
# Script para criar categorias padrão no banco de dados

echo "🏷️  Criando categorias padrão..."

# Executar script Node.js para criar categorias
node << 'EOF'
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const categories = [
  // Categorias principais de produtos de beleza
  { name: 'Maquiagem', slug: 'maquiagem', description: 'Produtos de maquiagem profissional e pessoal' },
  { name: 'Cabelos', slug: 'cabelos', description: 'Produtos para tratamento e cuidados capilares' },
  { name: 'Pele', slug: 'pele', description: 'Skincare e cuidados com a pele' },
  { name: 'Unhas', slug: 'unhas', description: 'Produtos para manicure e pedicure' },
  { name: 'Perfumaria', slug: 'perfumaria', description: 'Perfumes e fragrâncias' },
  { name: 'Equipamentos', slug: 'equipamentos', description: 'Equipamentos e ferramentas profissionais' },
  { name: 'Acessórios', slug: 'acessorios', description: 'Acessórios para profissionais de beleza' },
];

async function createCategories() {
  try {
    console.log('Conectando ao banco de dados...');
    
    for (const category of categories) {
      // Verificar se já existe
      const existing = await prisma.category.findUnique({
        where: { slug: category.slug }
      });
      
      if (existing) {
        console.log(`✅ Categoria "${category.name}" já existe`);
        continue;
      }
      
      // Criar categoria
      await prisma.category.create({
        data: category
      });
      console.log(`✅ Categoria "${category.name}" criada`);
    }
    
    console.log('\n🎉 Categorias criadas com sucesso!');
  } catch (error) {
    console.error('❌ Erro ao criar categorias:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

createCategories();
EOF

echo ""
echo "✅ Script concluído!"
