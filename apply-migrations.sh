#!/bin/bash
# Script para aplicar migrations no banco Neon
# Execute: bash apply-migrations.sh

echo "🗄️ Aplicando migrations no banco Neon..."

cd packages/database

export DATABASE_URL="postgresql://neondb_owner:npg_H8BWMk4aEgdD@ep-little-king-ahhg8snu-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"

echo "📦 Gerando Prisma Client..."
npx prisma generate

echo "🚀 Aplicando schema no banco..."
npx prisma db push

echo "✅ Migrations aplicadas com sucesso!"
echo ""
echo "🌱 Deseja popular o banco com dados de exemplo? (y/n)"
read -r response

if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
    echo "🌱 Populando banco de dados..."
    npm run db:seed
    echo "✅ Banco populado com sucesso!"
    echo ""
    echo "📝 Credenciais de teste:"
    echo "   Admin: admin@thebeautypro.com / admin123"
    echo "   Vendedor: vendedor@example.com / admin123"
    echo "   Instrutor: instrutor@example.com / admin123"
fi

echo ""
echo "🎉 Pronto! Acesse: https://thebeautypro.vercel.app/"
