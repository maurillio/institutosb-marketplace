import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Criar categorias
  const categorias = await Promise.all([
    prisma.category.create({
      data: {
        name: 'Cabelo',
        slug: 'cabelo',
        description: 'Produtos e tratamentos para cabelo',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Maquiagem',
        slug: 'maquiagem',
        description: 'Maquiagens e cosméticos',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Skincare',
        slug: 'skincare',
        description: 'Cuidados com a pele',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Unhas',
        slug: 'unhas',
        description: 'Produtos para manicure e pedicure',
      },
    }),
  ]);

  console.log('✅ Categorias criadas');

  // Criar usuário admin
  const hashedPassword = await bcrypt.hash('admin123', 10);

  const admin = await prisma.user.create({
    data: {
      email: 'admin@thebeautypro.com',
      name: 'Admin',
      password: hashedPassword,
      emailVerified: new Date(),
      roles: ['ADMIN', 'SELLER', 'INSTRUCTOR'],
      status: 'ACTIVE',
    },
  });

  console.log('✅ Usuário admin criado');

  // Criar usuário vendedor de exemplo
  const vendedor = await prisma.user.create({
    data: {
      email: 'vendedor@example.com',
      name: 'Maria Silva',
      password: hashedPassword,
      emailVerified: new Date(),
      roles: ['CUSTOMER', 'SELLER'],
      status: 'ACTIVE',
      sellerProfile: {
        create: {
          storeName: 'Beleza da Maria',
          storeSlug: 'beleza-da-maria',
          description: 'Produtos de qualidade para sua beleza',
          plan: 'PRO',
        },
      },
    },
  });

  console.log('✅ Vendedor criado');

  // Criar instrutor de exemplo
  const instrutor = await prisma.user.create({
    data: {
      email: 'instrutor@example.com',
      name: 'João Santos',
      password: hashedPassword,
      emailVerified: new Date(),
      roles: ['CUSTOMER', 'INSTRUCTOR'],
      status: 'ACTIVE',
      instructorProfile: {
        create: {
          bio: 'Especialista em maquiagem profissional com 10 anos de experiência',
          expertise: ['Maquiagem', 'Técnicas profissionais'],
        },
      },
    },
  });

  console.log('✅ Instrutor criado');

  // Criar produtos de exemplo
  await prisma.product.create({
    data: {
      name: 'Shampoo Profissional 500ml',
      slug: 'shampoo-profissional-500ml',
      description: 'Shampoo profissional para todos os tipos de cabelo',
      categoryId: categorias[0].id,
      sellerId: vendedor.id,
      price: 49.90,
      stock: 100,
      condition: 'NEW',
      status: 'ACTIVE',
      images: ['https://via.placeholder.com/500'],
      publishedAt: new Date(),
    },
  });

  console.log('✅ Produto criado');

  // Criar curso de exemplo
  await prisma.course.create({
    data: {
      title: 'Curso Completo de Maquiagem Profissional',
      slug: 'curso-completo-maquiagem-profissional',
      description: 'Aprenda técnicas profissionais de maquiagem do básico ao avançado',
      shortDescription: 'Curso completo de maquiagem',
      instructorId: instrutor.id,
      type: 'ONLINE',
      level: 'BEGINNER',
      price: 299.00,
      status: 'PUBLISHED',
      thumbnail: 'https://via.placeholder.com/800x450',
      duration: 1200, // 20 horas
      publishedAt: new Date(),
      modules: {
        create: [
          {
            title: 'Introdução à Maquiagem',
            description: 'Conceitos básicos e ferramentas',
            order: 1,
            lessons: {
              create: [
                {
                  title: 'Bem-vindo ao curso',
                  description: 'Apresentação do curso',
                  order: 1,
                  duration: 10,
                  isFree: true,
                },
                {
                  title: 'Ferramentas essenciais',
                  description: 'Conheça as ferramentas básicas',
                  order: 2,
                  duration: 30,
                },
              ],
            },
          },
        ],
      },
    },
  });

  console.log('✅ Curso criado');

  console.log('✨ Seed completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
