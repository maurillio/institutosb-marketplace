import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { categoriesData } from './seeds/categories';
import { productsData } from './seeds/products';
import { coursesData } from './seeds/courses';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // Limpar dados existentes (cuidado em produção!)
  console.log('🗑️  Limpando dados existentes...');
  await prisma.courseLesson.deleteMany();
  await prisma.courseModule.deleteMany();
  await prisma.product.deleteMany();
  await prisma.course.deleteMany();
  await prisma.category.deleteMany();
  await prisma.instructorProfile.deleteMany();
  await prisma.sellerProfile.deleteMany();
  await prisma.user.deleteMany();

  // Criar senha hash
  const hashedPassword = await bcrypt.hash('senha123', 10);

  // 1. Criar usuários
  console.log('👤 Criando usuários...');

  const admin = await prisma.user.create({
    data: {
      email: 'admin@thebeautypro.com',
      name: 'Admin The Beauty Pro',
      password: hashedPassword,
      emailVerified: new Date(),
      roles: ['ADMIN', 'SELLER', 'INSTRUCTOR'],
      status: 'ACTIVE',
    },
  });

  const vendedores = [];
  const instrutores = [];

  // Criar 10 vendedores
  for (let i = 1; i <= 10; i++) {
    const vendedor = await prisma.user.create({
      data: {
        email: `vendedor${i}@thebeautypro.com`,
        name: `${
          [
            'Maria Silva',
            'João Santos',
            'Ana Costa',
            'Pedro Oliveira',
            'Juliana Souza',
            'Carlos Ferreira',
            'Fernanda Lima',
            'Ricardo Alves',
            'Patrícia Rocha',
            'Lucas Martins',
          ][i - 1]
        }`,
        password: hashedPassword,
        emailVerified: new Date(),
        roles: ['CUSTOMER', 'SELLER'],
        status: 'ACTIVE',
        avatar: `/images/avatars/seller-${i}.jpg`,
        sellerProfile: {
          create: {
            storeName: `${
              [
                'Beleza Premium',
                'Professional Beauty',
                'Studio Glamour',
                'Beauty Express',
                'Espaço Beleza',
                'Elegance Beauty',
                'Charme & Estilo',
                'Beauty Market',
                'Glamour Store',
                'Pro Beauty Shop',
              ][i - 1]
            }`,
            storeSlug: `loja-${i}`,
            description: 'Produtos profissionais de qualidade para salões e profissionais da beleza',
            plan: i <= 5 ? 'PRO' : 'BASIC',
            rating: Number((4.0 + Math.random()).toFixed(1)),
          },
        },
      },
    });
    vendedores.push(vendedor);
  }

  // Criar 6 instrutores
  for (let i = 1; i <= 6; i++) {
    const instrutor = await prisma.user.create({
      data: {
        email: `instrutor${i}@thebeautypro.com`,
        name: `${
          [
            'Carla Mendes',
            'Roberto Silva',
            'Juliana Santos',
            'Fernando Costa',
            'Amanda Oliveira',
            'Paulo Ribeiro',
          ][i - 1]
        }`,
        password: hashedPassword,
        emailVerified: new Date(),
        roles: ['CUSTOMER', 'INSTRUCTOR'],
        status: 'ACTIVE',
        avatar: `/images/avatars/instructor-${i}.jpg`,
        instructorProfile: {
          create: {
            bio: `Especialista em beleza profissional com mais de ${
              5 + i * 2
            } anos de experiência. Já capacitou mais de ${
              100 * i
            } profissionais.`,
            expertise: [
              'Maquiagem Profissional',
              'Técnicas Avançadas',
              'Educação Continuada',
            ],
            rating: Number((4.3 + Math.random() * 0.6).toFixed(1)),
          },
        },
      },
    });
    instrutores.push(instrutor);
  }

  console.log(
    `✅ Usuários criados: 1 admin, ${vendedores.length} vendedores, ${instrutores.length} instrutores`
  );

  // 2. Criar categorias com hierarquia
  console.log('📁 Criando categorias...');

  const categoriesMap = new Map<string, string>();

  for (const categoryData of categoriesData) {
    // Criar categoria pai
    const parentCategory = await prisma.category.create({
      data: {
        name: categoryData.name,
        slug: categoryData.slug,
        description: categoryData.description,
        icon: categoryData.icon,
        imageUrl: categoryData.imageUrl,
      },
    });

    categoriesMap.set(categoryData.slug, parentCategory.id);

    // Criar subcategorias
    if (categoryData.children) {
      for (const child of categoryData.children) {
        const childCategory = await prisma.category.create({
          data: {
            name: child.name,
            slug: child.slug,
            description: child.description,
            parentId: parentCategory.id,
          },
        });
        categoriesMap.set(child.slug, childCategory.id);
      }
    }
  }

  console.log(`✅ Categorias criadas: ${categoriesMap.size} categorias`);

  // 3. Criar produtos
  console.log('🛍️  Criando produtos...');

  let productCount = 0;
  for (const productData of productsData) {
    const categoryId = categoriesMap.get(productData.categorySlug);
    if (!categoryId) {
      console.warn(
        `⚠️  Categoria não encontrada para produto: ${productData.name} (${productData.categorySlug})`
      );
      continue;
    }

    // Distribuir produtos entre vendedores
    const seller = vendedores[productCount % vendedores.length];

    await prisma.product.create({
      data: {
        name: productData.name,
        slug: productData.slug,
        description: productData.description,
        brand: productData.brand,
        categoryId: categoryId,
        sellerId: seller.id,
        price: productData.price,
        compareAtPrice: productData.compareAtPrice,
        stock: productData.stock,
        condition: productData.condition,
        status: 'ACTIVE',
        images: productData.images,
        tags: productData.tags || [],
        skinTypes: productData.skinTypes || [],
        concerns: productData.concerns || [],
        ingredients: productData.ingredients || [],
        publishedAt: new Date(),
        rating: Number((4.0 + Math.random() * 0.9).toFixed(1)),
        totalReviews: Math.floor(Math.random() * 50) + 5,
        sales: Math.floor(Math.random() * 200) + 10,
      },
    });

    productCount++;
  }

  console.log(`✅ Produtos criados: ${productCount} produtos`);

  // 4. Criar cursos com módulos e aulas
  console.log('🎓 Criando cursos...');

  let courseCount = 0;
  for (const courseData of coursesData) {
    // Distribuir cursos entre instrutores
    const instructor = instrutores[courseCount % instrutores.length];

    const course = await prisma.course.create({
      data: {
        title: courseData.title,
        slug: courseData.slug,
        description: courseData.description,
        shortDescription: courseData.shortDescription,
        instructorId: instructor.id,
        type: courseData.type,
        level: courseData.level,
        price: courseData.price,
        compareAtPrice: courseData.compareAtPrice,
        thumbnail: courseData.thumbnail,
        duration: courseData.duration,
        status: 'PUBLISHED',
        publishedAt: new Date(),
        rating: Number((4.2 + Math.random() * 0.7).toFixed(1)),
        totalReviews: Math.floor(Math.random() * 100) + 10,
        totalEnrollments: Math.floor(Math.random() * 500) + 50,
      },
    });

    // Criar módulos e aulas do curso
    for (const moduleData of courseData.modules) {
      const courseModule = await prisma.courseModule.create({
        data: {
          courseId: course.id,
          title: moduleData.title,
          description: moduleData.description,
          order: moduleData.order,
        },
      });

      // Criar aulas do módulo
      for (const lessonData of moduleData.lessons) {
        await prisma.courseLesson.create({
          data: {
            moduleId: courseModule.id,
            title: lessonData.title,
            description: lessonData.description,
            order: lessonData.order,
            duration: lessonData.duration,
            isFree: lessonData.isFree || false,
            videoUrl: null, // Será adicionado posteriormente
          },
        });
      }
    }

    courseCount++;
    console.log(
      `  ✓ Curso criado: ${courseData.title} (${courseData.modules.length} módulos)`
    );
  }

  console.log(`✅ Cursos criados: ${courseCount} cursos completos`);

  // Estatísticas finais
  const stats = {
    users: await prisma.user.count(),
    sellers: await prisma.sellerProfile.count(),
    instructors: await prisma.instructorProfile.count(),
    categories: await prisma.category.count(),
    products: await prisma.product.count(),
    courses: await prisma.course.count(),
    modules: await prisma.courseModule.count(),
    lessons: await prisma.courseLesson.count(),
  };

  console.log('\\n📊 Estatísticas finais:');
  console.log(`   👥 Usuários: ${stats.users}`);
  console.log(`   🏪 Vendedores: ${stats.sellers}`);
  console.log(`   🎓 Instrutores: ${stats.instructors}`);
  console.log(`   📁 Categorias: ${stats.categories}`);
  console.log(`   🛍️  Produtos: ${stats.products}`);
  console.log(`   📚 Cursos: ${stats.courses}`);
  console.log(`   📖 Módulos: ${stats.modules}`);
  console.log(`   ▶️  Aulas: ${stats.lessons}`);

  console.log('\\n✨ Seed completed successfully!');
  console.log('\\n🔐 Credenciais de acesso:');
  console.log('   Admin: admin@thebeautypro.com / senha123');
  console.log('   Vendedor: vendedor1@thebeautypro.com / senha123');
  console.log('   Instrutor: instrutor1@thebeautypro.com / senha123');
}

main()
  .catch((e) => {
    console.error('❌ Erro ao executar seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
